import { MongoClient } from "mongodb";
import * as fs from "fs";
import * as path from "path";

// Wrzuc przykładowy seed.json do katalogu projektu
const seedPath = path.join(__dirname, "seed.json");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));

async function main() {
  const uri = "mongodb://localhost:27017"; 
  const dbName = "tournamently";           
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    for (const [collection, docs] of Object.entries(seed)) {
      if (Array.isArray(docs) && docs.length) {
        await db.collection(collection).deleteMany({});
        await db.collection(collection).insertMany(docs);
        console.log(`Imported ${docs.length} docs to ${collection}`);
      }
    }
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
