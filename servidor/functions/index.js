// const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./perm.json")),
});

const app = express();
app.use(cors({origin: true}));


const db = admin.firestore();

app.post("/users", async (req) => {
  try {
    await db.collection("users").doc().create({
      name: req.body.name,
      password: req.body.password,
    });

    // eslint-disable-next-line no-undef
    return res.status(200).send("Add user");
  } catch (e) {
    console.error(e);
  }
});

app.get("/users", async (req, res) => {
  try {
    const {docs} = await db.collection("users").get();
    const users = docs.map((e)=> ({id: e.id, ...e.data()}));
    if (!users.length) return res.status(400).send("No hay usuarios");
    return res.status(200).json(users);
  } catch (e) {
    console.error(e);
  }
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.app = functions.https.onRequest(app);
