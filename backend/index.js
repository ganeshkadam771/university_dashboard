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
    const result = await pool.query(
      "INSERT INTO fields (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.json(result.rows[0]);
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
    const result = await pool.query(
      "INSERT INTO students (username,password,name,year,field_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [username, hashedPassword, name, year, field_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//student login
app.post("/student/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE username = $1",
      [username]
    );
    if (result.rows.length > 0) {
      const match = await bcrypt.compare(password, result.rows[0].password);
      if (match) {
        const token = jwt.sign(
          { studentId: result.rows[0].id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ token });
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
