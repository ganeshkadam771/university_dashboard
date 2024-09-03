const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//Import mongoose models
const Field = require("./models/Field");
const Student = require("./models/Student");
const Subject = require("./models/Subject");
const Mark = require("./models/Mark");

//Connect to mongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewURLParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected !"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(bodyparser.json());

//Middleware for checking JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

//Admin Login Route
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
    console.log(`Token - ${token}`);
  } else {
    res.status(401).send("Invalid credentials");
  }
});

//CRUD Operations for Admin
app.post("/fields", authenticateToken, async (req, res) => {
  const { name } = req.body;
  try {
    const newField = new Field({ name });
    await newField.save();
    res.json(newField);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/subjects", authenticateToken, async (req, res) => {
  const { name, field_id } = req.body;
  try {
    const field = await Field.findById(field_id);
    if (!field) return res.status(404).send("Field not found");
    const newSubject = new Subject({ name, field: field_id });
    await newSubject.save();
    res.json(newSubject);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// More crud operations

// Student sign up
app.post("/student/signup", async (req, res) => {
  const { username, password, name, year, field_id } = req.body;
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newStudent = new Student({
      username,
      password: hashedPassword,
      name,
      year,
      field: field_id,
    });
    await newStudent.save();
    res.json(newStudent);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//student login
app.post("/student/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const student = await Student.findOne({ username });
    if (!student) return res.status(404).send("User not found");

    const match = await bcryptjs.compare(password, student.password);
    if (!match) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
