const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BloginfoSchema = new Schema({
    traffic:{
        type:Number,
        required:false
    }
})
const Cloginfo = mongoose.model('bloginfo',BloginfoSchema)
module.exports = Cloginfo 