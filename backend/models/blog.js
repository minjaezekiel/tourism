const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const blogSchema = new Schema(
{
title:{type: String, required:true},
content:{type: String, required: true},
image: {type:String,required:true},
author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This is the crucial part
        required: true
    }
},
{
    timestamps: true
}
)

const blog = mongoose.model("Blog", blogSchema)

module.exports = blog