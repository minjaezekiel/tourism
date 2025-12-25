const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Gallery schema
const gallerySchema = new Schema(
    {
        img_src: {type:String,required:true},
        content: {type:String,required:true}
    },
    {
        // Adds createdAt and updatedAt timestamps automatically
        timestamps: true 
    }
)

const gallery = mongoose.model("Gallery",gallerySchema)

module.exports = gallery