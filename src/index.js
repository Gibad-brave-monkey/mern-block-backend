import express from "express";
import multer from "multer";
import mongoose from "mongoose";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

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

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "src/uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(express.json());
app.use("/src/uploads", express.static("src/uploads"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", checkAuth, PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, PostController.update);

app.listen(PORT, (err) => {
  if (err) {
    console.err("Server Not Ok! >>" + " " + err.message);
  }
  console.log(`Server Started in the http://localhost:${PORT}`);
});
