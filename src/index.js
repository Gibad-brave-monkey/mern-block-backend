import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.hngcx2r.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => console.log("DB error", err.message));

const PORT = 5555;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body);

  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: "ilyas Gosling",
    },
    "secret123"
  );

  res.json({
    success: true,
    token,
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.err("Server Not Ok! >>" + " " + err.message);
  }
  console.log(`Server Started in the http://localhost:${PORT}`);
});
