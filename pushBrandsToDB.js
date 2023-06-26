import fs from "fs";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.DB_URL;

async function pushJsonToMongo() {
  try {
    // Connection URI
    console.log("uri", uri);

    // Database and collection names
    const dbName = "test";
    const collectionName = "brands";

    // Read the JSON file
    const jsonFileData = fs.readFileSync("./B2B-&-B2C-Service.json");

    // Convert JSON data to an object
    const jsonData = JSON.parse(jsonFileData);

    // Add a time field to each document
    const documentsWithTime = jsonData.map((doc) => ({
      ...doc,
      time: new Date(),
    }));
    // Connect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");

    // Access the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert the JSON data into the collection
    // await collection.insertMany(documentsWithTime);
    console.log("JSON data inserted successfully");

    // Close the connection
    await client.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Call the function to push the JSON to MongoDB
pushJsonToMongo();
