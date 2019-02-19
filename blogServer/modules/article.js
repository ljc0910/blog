const mongoose = require('mongoose')
const Schema = mongoose.Schema
const articleSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    articleType:{
        type:String,
        required:true
    },
    value:{
        type:String,
        required:true
    },
    picBase:{
        type:String,
        required:true
    },
    curTime:{
        type:String,
        required:true
    },
    viewNum:{
        type:Number,
        required:false,
        default:0
    },
    commentNum:{
        type:Number,
        required:false,
        default:0
    },
    tags: { type: String, index: true }
})
const Article = mongoose.model('article',articleSchema)
module.exports = Article 