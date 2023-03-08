import express from "express";
import mongoose from "mongoose";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.hngcx2r.mongodb.net/blog?retryWrites=true&w=majority"
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

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", checkAuth, PostController.getAll);
// app.get('/posts/:id', PostController.getOne)
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
// app.delete('/posts/:id', PostController.remove)
// app.patch('/posts', PostController.update)

app.listen(PORT, (err) => {
  if (err) {
    console.err("Server Not Ok! >>" + " " + err.message);
  }
  console.log(`Server Started in the http://localhost:${PORT}`);
});
