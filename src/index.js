import express from "express";

const PORT = 5555;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, (err) => {
  if (err) {
    console.err("Server Not Ok! >>" + " " + err.message);
  }
  console.log(`Server Started in the http://localhost:${PORT}`);
});
