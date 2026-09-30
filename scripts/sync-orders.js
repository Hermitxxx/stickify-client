const mongoose = require("mongoose");

async function main() {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri, { dbName: "stickify" });

  const txnsColl = mongoose.connection.collection("transactions");
  const usersColl = mongoose.connection.collection("user");
  const productsColl = mongoose.connection.collection("products");

  // 1. Remove old fake seed transactions
  const dummyIds = ["TXN-9842A1", "TXN-7629B4", "TXN-4190C8", "TXN-5511D2"];
  const del = await txnsColl.deleteMany({ transactionId: { $in: dummyIds } });
  console.log("Deleted dummy transactions:", del.deletedCount);

  // 2. Fetch user and real products
  const user = await usersColl.findOne({ email: "cvenom477@gmail.com" });
  const p3 = await productsColl.findOne({ slug: "sticker-03" });
  const p4 = await productsColl.findOne({ slug: "sticker-04" });

  if (user && p3 && p4) {
    const orders = [
      {
        userId: user._id.toString(),
        userEmail: user.email,
        userName: user.name || "Venom Carnage",
        productId: p3._id,
        productTitle: p3.title,
        productSlug: p3.slug,
        productImage: p3.image,
        price: 3.49,
        currency: "USD",
        status: "completed",
        transactionId: "LSQ-9605244",
        licenseType: "Commercial & Personal Vinyl Cut License (300 DPI)",
        formats: ["PNG", "SVG"],
        createdAt: new Date("2026-09-29T17:45:15.000Z"),
        updatedAt: new Date("2026-09-29T17:45:15.000Z"),
      },
      {
        userId: user._id.toString(),
        userEmail: user.email,
        userName: user.name || "Venom Carnage",
        productId: p4._id,
        productTitle: p4.title,
        productSlug: p4.slug,
        productImage: p4.image,
        price: 2.49,
        currency: "USD",
        status: "completed",
        transactionId: "LSQ-9605254",
        licenseType: "Commercial & Personal Vinyl Cut License (300 DPI)",
        formats: ["PNG", "SVG"],
        createdAt: new Date("2026-09-29T17:46:14.000Z"),
        updatedAt: new Date("2026-09-29T17:46:14.000Z"),
      },
    ];

    for (const order of orders) {
      await txnsColl.replaceOne(
        { transactionId: order.transactionId },
        order,
        { upsert: true }
      );
      console.log("Recorded real transaction:", order.transactionId, order.productTitle, `$${order.price}`);
    }
  }

  const allTxns = await txnsColl.find({}).toArray();
  console.log("Current transactions in DB:", allTxns.map((t) => ({ id: t.transactionId, title: t.productTitle, price: t.price, user: t.userEmail })));

  await mongoose.disconnect();
}

main().catch(console.error);
