const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

async function seed() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db("stickify");

  const users = await db.collection("user").find({}).toArray();
  const products = await db.collection("products").find({}).toArray();

  console.log(`Found ${users.length} users and ${products.length} products`);

  if (users.length > 0 && products.length > 0) {
    // Set first user to admin, others to user
    await db.collection("user").updateOne(
      { _id: users[0]._id },
      { $set: { role: "admin" } }
    );
    console.log("Assigned admin role to:", users[0].email);

    for (let i = 1; i < users.length; i++) {
      await db.collection("user").updateOne(
        { _id: users[i]._id },
        { $set: { role: "user" } }
      );
    }

    const txnCount = await db.collection("transactions").countDocuments();
    if (txnCount === 0) {
      const sampleTxns = [
        {
          userId: users[0]._id.toString(),
          userEmail: users[0].email,
          userName: users[0].name,
          productId: products[0]._id,
          productTitle: products[0].title,
          productSlug: products[0].slug,
          productImage: products[0].image,
          price: products[0].price,
          currency: "USD",
          status: "completed",
          transactionId: "TXN-9842A1",
          licenseType: "Commercial Vinyl Cut License",
          formats: ["PNG", "SVG"],
          createdAt: new Date(Date.now() - 86400000 * 2),
        },
        {
          userId: (users[1] || users[0])._id.toString(),
          userEmail: (users[1] || users[0]).email,
          userName: (users[1] || users[0]).name,
          productId: (products[1] || products[0])._id,
          productTitle: (products[1] || products[0]).title,
          productSlug: (products[1] || products[0]).slug,
          productImage: (products[1] || products[0]).image,
          price: (products[1] || products[0]).price,
          currency: "USD",
          status: "completed",
          transactionId: "TXN-7629B4",
          licenseType: "Commercial Vinyl Cut License",
          formats: ["PNG", "SVG"],
          createdAt: new Date(Date.now() - 86400000 * 5),
        },
        {
          userId: (users[2] || users[0])._id.toString(),
          userEmail: (users[2] || users[0]).email,
          userName: (users[2] || users[0]).name,
          productId: (products[2] || products[0])._id,
          productTitle: (products[2] || products[0]).title,
          productSlug: (products[2] || products[0]).slug,
          productImage: (products[2] || products[0]).image,
          price: (products[2] || products[0]).price,
          currency: "USD",
          status: "completed",
          transactionId: "TXN-4190C8",
          licenseType: "Personal Vinyl Cut License",
          formats: ["PNG", "SVG"],
          createdAt: new Date(Date.now() - 86400000 * 1),
        },
        {
          userId: users[0]._id.toString(),
          userEmail: users[0].email,
          userName: users[0].name,
          productId: (products[3] || products[0])._id,
          productTitle: (products[3] || products[0]).title,
          productSlug: (products[3] || products[0]).slug,
          productImage: (products[3] || products[0]).image,
          price: (products[3] || products[0]).price,
          currency: "USD",
          status: "completed",
          transactionId: "TXN-5511D2",
          licenseType: "Precision Vector Cut License",
          formats: ["PNG", "SVG"],
          createdAt: new Date(Date.now() - 86400000 * 3),
        },
      ];

      await db.collection("transactions").insertMany(sampleTxns);
      console.log(`Inserted ${sampleTxns.length} transactions`);
    }

    const bookmarkCount = await db.collection("bookmarks").countDocuments();
    if (bookmarkCount === 0) {
      const sampleBookmarks = [
        {
          userId: users[0]._id.toString(),
          productId: (products[4] || products[0])._id,
          productTitle: (products[4] || products[0]).title,
          productSlug: (products[4] || products[0]).slug,
          productImage: (products[4] || products[0]).image,
          productPrice: (products[4] || products[0]).price,
          compatibleDevices: ["Phone", "Tablet"],
          createdAt: new Date(),
        },
        {
          userId: (users[1] || users[0])._id.toString(),
          productId: (products[0] || products[0])._id,
          productTitle: (products[0] || products[0]).title,
          productSlug: (products[0] || products[0]).slug,
          productImage: (products[0] || products[0]).image,
          productPrice: (products[0] || products[0]).price,
          compatibleDevices: ["Laptop"],
          createdAt: new Date(),
        },
      ];

      await db.collection("bookmarks").insertMany(sampleBookmarks);
      console.log(`Inserted ${sampleBookmarks.length} bookmarks`);
    }
  }

  await client.close();
  console.log("Seeding finished successfully!");
}

seed().catch(console.error);
