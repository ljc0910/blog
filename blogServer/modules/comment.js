const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CommentSchema = new Schema({
    id:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:false,
        default:new Date().getTime()
    },
    textVal:{
        type:String,
        required:true
    },
    curTime:{
        type:String,
        required:true
    },
    replyVal:{
        type:Object,
        required:false,
        default:[]
    },
    tags: { type: String, index: true }
})
const Comment = mongoose.model('comment',CommentSchema)
module.exports = Comment 