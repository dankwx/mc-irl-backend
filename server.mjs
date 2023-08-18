import express from "express";
import cors from "cors";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./firebase.js";

const app = express();
const port = 3001;
app.use(cors());

app.get("/data", async (req, res) => {
  const db = getFirestore();
  const bauDocRef = doc(db, "baus", "ZyejZzpG4ScQCEnEerAQ");
  const bauDocSnapshot = await getDoc(bauDocRef);
  if (bauDocSnapshot.exists()) {
    res.json(bauDocSnapshot.data());
  } else {
    res.status(404).json({ error: "Document not found" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
