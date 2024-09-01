const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  markObtained: {
    type: Number,
    min: 0,
    max: 100,
  },
});

module.exports = mongoose.model("Mark", markSchema);
