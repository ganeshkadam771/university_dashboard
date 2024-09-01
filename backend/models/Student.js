const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique:true,
    },
    password:{
        type: String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    year:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Field',
    },
    createdAt:{
        type:Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Student', studentSchema);