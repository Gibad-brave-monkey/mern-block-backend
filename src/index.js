import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";
import chalk from "chalk";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations/validations.js";

import { UserController, PostController } from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.hngcx2r.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log(chalk.bgGreen("DB OK"));
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
app.use(cors());
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
    url: `src/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastTags);
app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
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
    console.err(chalk.bgRed("Server Not Ok! >>" + " " + err.message));
  }
  console.log(chalk.green(`Server Started in the http://localhost:${PORT}`));
});
