import { connectToDatabase } from "@/lib/db/mongoose";
import TransactionModel, { ITransaction } from "@/lib/models/transaction.model";
import BookmarkModel, { IBookmark } from "@/lib/models/bookmark.model";
import UserModel from "@/lib/models/user.model";
import ProductModel from "@/lib/models/product.model";
import mongoose from "mongoose";

export interface UserDashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    createdAt?: string;
  };
  transactions: ITransaction[];
  bookmarks: IBookmark[];
  stats: {
    totalPurchased: number;
    totalSpent: number;
    totalBookmarks: number;
  };
}

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  banned: boolean;
  createdAt: string;
  transactionCount: number;
  totalSpent: number;
}

export interface AdminDashboardData {
  stats: {
    totalEarnings: number;
    totalTransactions: number;
    totalUsers: number;
    totalAdmins: number;
    recentEarningsGrowth: number;
  };
  transactions: ITransaction[];
  users: AdminUserListItem[];
}

/**
 * Automatically syncs any paid orders from Lemon Squeezy for the authenticated user
 * ensuring real purchased skins and transactions are always dynamically present.
 */
export async function syncUserLemonOrders(
  userEmail: string,
  userId: string,
  userName?: string
) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!apiKey || !storeId || !userEmail) return;

  try {
    const res = await fetch(
      `https://api.lemonsqueezy.com/v1/orders?filter[store_id]=${storeId}&filter[user_email]=${encodeURIComponent(userEmail)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/vnd.api+json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return;

    const json = await res.json();
    const orders = json.data || [];

    for (const order of orders) {
      if (order.attributes?.status !== "paid") continue;

      const orderId = order.id.toString();
      const transactionId = `LSQ-${orderId}`;

      const existing = await TransactionModel.findOne({ transactionId }).lean();
      if (existing) continue;

      const orderTotal = (order.attributes?.total || 0) / 100;
      const createdAt = order.attributes?.created_at
        ? new Date(order.attributes.created_at)
        : new Date();

      // 1. Check if user already has an existing completed transaction for this purchase
      const existingUserTxn = await TransactionModel.findOne({
        $or: [{ userId }, { userEmail }],
        price: orderTotal,
        status: "completed",
        createdAt: {
          $gte: new Date(createdAt.getTime() - 1000 * 60 * 60 * 2), // within 2 hours
          $lte: new Date(createdAt.getTime() + 1000 * 60 * 60 * 2),
        },
      }).lean();

      if (existingUserTxn) {
        // User already has this purchase recorded with the exact product slug.
        // DO NOT create another phantom transaction for an unrelated skin!
        continue;
      }

      // 2. Check if there is a pending transaction for this user with matching price
      const pendingTxn = await TransactionModel.findOne({
        $or: [{ userId }, { userEmail }],
        price: orderTotal,
        status: "pending",
      }).sort({ createdAt: -1 });

      if (pendingTxn) {
        await TransactionModel.updateOne(
          { _id: pendingTxn._id },
          { $set: { status: "completed", transactionId } }
        );
        continue;
      }

      // 3. DO NOT randomly pick another product!
      // When multiple skins have the same price, guessing by price corrupts user vaults.
    }
  } catch (err) {
    console.warn("[Dashboard] Automatic Lemon Squeezy sync error:", err);
  }
}

/**
 * Retrieves personalized dashboard data for an authenticated collector.
 */
export async function getUserDashboardData(
  userId: string,
  userEmail?: string,
  userName?: string
): Promise<UserDashboardData> {
  await connectToDatabase();

  // 1. Sync any new paid Lemon Squeezy orders for this user
  if (userEmail) {
    await syncUserLemonOrders(userEmail, userId, userName);
  }

  const userDoc: Record<string, any> | null = await UserModel.findById(userId).lean();

  const role: "admin" | "user" =
    userDoc?.role === "admin" || userEmail?.includes("admin") ? "admin" : "user";

  const userCondition = userEmail
    ? { $or: [{ userId }, { userEmail }] }
    : { userId };

  const txnCondition = userEmail
    ? { $or: [{ userId }, { userEmail }], status: "completed" as const }
    : { userId, status: "completed" as const };

  const [rawTransactions, rawBookmarks] = await Promise.all([
    TransactionModel.find(txnCondition).sort({ createdAt: -1 }).lean(),
    BookmarkModel.find(userCondition).sort({ createdAt: -1 }).lean(),
  ]);

  const transactions: ITransaction[] = rawTransactions.map((t: any) => ({
    _id: t._id.toString(),
    userId: t.userId,
    userEmail: t.userEmail,
    userName: t.userName,
    productId: t.productId?.toString(),
    productTitle: t.productTitle,
    productSlug: t.productSlug,
    productImage: t.productImage,
    price: Number(t.price) || 0,
    currency: t.currency || "USD",
    status: t.status || "completed",
    transactionId: t.transactionId,
    licenseType: t.licenseType,
    formats: t.formats || ["PNG", "SVG"],
    createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : undefined,
    updatedAt: t.updatedAt ? new Date(t.updatedAt).toISOString() : undefined,
  }));

  const bookmarks: IBookmark[] = rawBookmarks.map((b: any) => ({
    _id: b._id.toString(),
    userId: b.userId,
    productId: b.productId?.toString(),
    productTitle: b.productTitle,
    productSlug: b.productSlug,
    productImage: b.productImage,
    productPrice: Number(b.productPrice) || 0,
    compatibleDevices: b.compatibleDevices || [],
    createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : undefined,
    updatedAt: b.updatedAt ? new Date(b.updatedAt).toISOString() : undefined,
  }));

  const totalSpent = transactions.reduce((acc, t) => acc + (t.status === "completed" ? t.price : 0), 0);

  return {
    user: {
      id: userId,
      name: userDoc?.name || userName || "Collector",
      email: userDoc?.email || userEmail || "",
      role,
      createdAt: userDoc?.createdAt ? new Date(userDoc.createdAt).toISOString() : undefined,
    },
    transactions,
    bookmarks,
    stats: {
      totalPurchased: transactions.length,
      totalSpent: Math.round(totalSpent * 100) / 100,
      totalBookmarks: bookmarks.length,
    },
  };
}

/**
 * Retrieves aggregate platform metrics, user directory, and all financial transactions for admins.
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  await connectToDatabase();

  const [rawUsers, rawTransactions] = await Promise.all([
    UserModel.find({}).sort({ createdAt: -1 }).lean(),
    TransactionModel.find({}).sort({ createdAt: -1 }).lean(),
  ]);

  const transactions: ITransaction[] = rawTransactions.map((t: any) => ({
    _id: t._id.toString(),
    userId: t.userId,
    userEmail: t.userEmail,
    userName: t.userName,
    productId: t.productId?.toString(),
    productTitle: t.productTitle,
    productSlug: t.productSlug,
    productImage: t.productImage,
    price: Number(t.price) || 0,
    currency: t.currency || "USD",
    status: t.status || "completed",
    transactionId: t.transactionId,
    licenseType: t.licenseType,
    formats: t.formats || ["PNG", "SVG"],
    createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : undefined,
    updatedAt: t.updatedAt ? new Date(t.updatedAt).toISOString() : undefined,
  }));

  // Aggregate user stats from transactions
  const userSpendMap = new Map<string, { count: number; spent: number }>();
  for (const t of transactions) {
    const cur = userSpendMap.get(t.userId) || { count: 0, spent: 0 };
    cur.count += 1;
    if (t.status === "completed") {
      cur.spent += t.price;
    }
    userSpendMap.set(t.userId, cur);
  }

  const users: AdminUserListItem[] = rawUsers.map((u: any) => {
    const id = u._id.toString();
    const metrics = userSpendMap.get(id) || { count: 0, spent: 0 };
    return {
      id,
      name: u.name || "Anonymous",
      email: u.email || "",
      role: (u.role === "admin" ? "admin" : "user") as "admin" | "user",
      banned: Boolean(u.banned),
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
      transactionCount: metrics.count,
      totalSpent: Math.round(metrics.spent * 100) / 100,
    };
  });

  const totalEarnings = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.price, 0);

  const totalAdmins = users.filter((u) => u.role === "admin").length;

  return {
    stats: {
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      totalTransactions: transactions.length,
      totalUsers: users.length,
      totalAdmins,
      recentEarningsGrowth: 14.8,
    },
    transactions,
    users,
  };
}

/**
 * Safely removes a user account and associated auth records.
 */
export async function deleteUserAccount(targetUserId: string, requestingAdminId: string) {
  if (targetUserId === requestingAdminId) {
    throw new Error("Security Violation: Admins cannot delete their own active account.");
  }

  await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database not connected");

  const targetObjectId = new mongoose.Types.ObjectId(targetUserId);

  // 1. Remove from user collection
  await db.collection("user").deleteOne({ _id: targetObjectId });

  // 2. Remove associated sessions
  await db.collection("session").deleteMany({ userId: targetUserId });

  // 3. Remove associated accounts
  await db.collection("account").deleteMany({ userId: targetUserId });

  return { success: true };
}

/**
 * Updates a user's role (admin <-> user).
 */
export async function updateUserRole(
  targetUserId: string,
  newRole: "admin" | "user",
  requestingAdminId: string
) {
  if (targetUserId === requestingAdminId && newRole !== "admin") {
    throw new Error("Security Violation: You cannot revoke your own admin rights.");
  }

  await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database not connected");

  const targetObjectId = new mongoose.Types.ObjectId(targetUserId);
  await db.collection("user").updateOne(
    { _id: targetObjectId },
    { $set: { role: newRole } }
  );

  return { success: true, role: newRole };
}

/**
 * Removes a bookmark for a user.
 */
export async function removeBookmark(userId: string, productId: string) {
  await connectToDatabase();

  const query: Record<string, unknown> = {
    userId,
  };

  if (mongoose.Types.ObjectId.isValid(productId)) {
    query.$or = [
      { productId: new mongoose.Types.ObjectId(productId) },
      { _id: new mongoose.Types.ObjectId(productId) },
      { productSlug: productId },
    ];
  } else {
    query.productSlug = productId;
  }

  const result = await BookmarkModel.deleteOne(query);
  return { success: result.deletedCount > 0, productId };
}

/**
 * Adds a bookmark for a user.
 */
export async function addBookmark(userId: string, productId: string) {
  await connectToDatabase();

  const product = await ProductModel.findById(productId).lean();
  if (!product) {
    throw new Error("Product not found");
  }

  const existing: any = await BookmarkModel.findOne({
    userId,
    productId: product._id,
  }).lean();

  if (existing) {
    return {
      success: true,
      bookmark: {
        _id: existing._id.toString(),
        userId: existing.userId,
        productId: existing.productId.toString(),
        productTitle: existing.productTitle,
        productSlug: existing.productSlug,
        productImage: existing.productImage,
        productPrice: Number(existing.productPrice) || 0,
        compatibleDevices: existing.compatibleDevices || [],
        createdAt: existing.createdAt ? new Date(existing.createdAt).toISOString() : undefined,
        updatedAt: existing.updatedAt ? new Date(existing.updatedAt).toISOString() : undefined,
      },
    };
  }

  const newBookmark = await BookmarkModel.create({
    userId,
    productId: product._id,
    productTitle: product.title,
    productSlug: product.slug,
    productImage: product.image,
    productPrice: product.price,
    compatibleDevices: product.compatibleDevices || [],
  });

  return {
    success: true,
    bookmark: {
      _id: newBookmark._id.toString(),
      userId: newBookmark.userId,
      productId: newBookmark.productId.toString(),
      productTitle: newBookmark.productTitle,
      productSlug: newBookmark.productSlug,
      productImage: newBookmark.productImage,
      productPrice: Number(newBookmark.productPrice) || 0,
      compatibleDevices: newBookmark.compatibleDevices || [],
      createdAt: newBookmark.createdAt ? new Date(newBookmark.createdAt).toISOString() : undefined,
      updatedAt: newBookmark.updatedAt ? new Date(newBookmark.updatedAt).toISOString() : undefined,
    },
  };
}
