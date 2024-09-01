const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    field:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Field',
    },
});

module.exports = mongoose.model('Subject', subjectSchema);