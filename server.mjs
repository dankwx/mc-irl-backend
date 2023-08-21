import express from "express";
import cors from "cors";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import "./firebase.js";

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

//

const API_KEY = "senha123456789";

//

app.get("/data", async (req, res) => {
  const db = getFirestore();
  const bauCollectionRef = collection(db, "baus");
  const bauCollectionSnapshot = await getDocs(bauCollectionRef);
  const baus = [];
  bauCollectionSnapshot.forEach((doc) => {
    baus.push({ id: doc.id, ...doc.data() });
  });
  res.json(baus);
});

app.post("/log", (req, res) => {
  console.log(req.body);
  const message = req.body.message;
  console.log(message);
  res.status(200).send("Mensagem recebida e exibida no console.");
});

app.get("/status", (req, res) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey === API_KEY) {
    res.status(200).json({ message: "API online e funcionando" });
  } else {
    res.status(401).json({ error: "Chave de API inválida" });
  }
});

app.post("/baus", async (req, res) => {
  const db = getFirestore();
  const bauData = req.body;
  try {
    let docRef;
    if (bauData.id) {
      const id = bauData.id;
      delete bauData.id;
      docRef = doc(db, "baus", id);
      await setDoc(docRef, bauData, { merge: true });
    } else {
      docRef = await addDoc(collection(db, "baus"), bauData);
    }
    res.status(201).json({ message: "Bau criado com sucesso", id: docRef.id });
  } catch (e) {
    res.status(500).json({ error: "Erro ao criar bau" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
