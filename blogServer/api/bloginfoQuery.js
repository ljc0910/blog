const express = require('express')
const router = express.Router()
const Bloginfo = require('../modules/bloginfo')	
const Comment = require('../modules/comment')	
const Article = require('../modules/article')	
router.get('/getBlogInfo',(req,res,next)=>{ //blog首页信息
    const articleType = [1,2,3]
    Bloginfo.find().then((pdocs)=>{
        if(pdocs.length<1){
            Bloginfo.create({
                traffic:1
            })
        }else{
            Bloginfo.update({traffic:pdocs[0].traffic+1}).then(()=>{
            })
        }
    })
    Article.find({articleType:articleType}).then((docs)=>{
        Comment.find().then((docs2)=>{
            Bloginfo.find().then((docs3)=>{
                res.json({
                    success:true,
                    articleLength:docs.length,
                    comment:docs2.length,
                    traffic:docs3[0].traffic
                })
            })
        })
    })
})
router.get('/getNewInfo',(req,res,next)=>{
    Article.find({},{title:1}).sort({_id:1}).limit(10).then((docs)=>{
        Comment.find({},{textVal:1,id:1}).sort({_id:1}).limit(10).then((docs2)=>{
            docs.forEach(v=>{
                if(v.title.length>10){
                    v.title = v.title.substring(0,10)+'...'
                }
            })
            docs2.forEach(v=>{
                if(v.textVal.length>10){
                    v.textVal = v.textVal.substring(0,10)+'...'
                }
            })
            res.json({
                success:true,
                newArticle:docs,
                newComment:docs2
            })
        })
    })
})
module.exports = router 