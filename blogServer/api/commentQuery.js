const express = require('express')
const router = express.Router()
const Comment = require('../modules/comment')	//mongoose.model模型
const Article = require('../modules/article')

router.post('/enterComment',(req,res,next)=>{
    const {id,userName,textVal,replyVal} = req.body
    Comment.create({
        id:id,
        userName:userName,
        textVal:textVal,
        replyVal:replyVal,
        curTime:new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()
    }).then(()=>{
        Comment.find({id:id}).then((docs)=>{
            Article.update({_id:id},{commentNum:docs.length}).then(()=>{
                res.json({
                    success:true
                })
            })
        })
    }).catch(next)
})
router.post('/updateComment',(req,res,next)=>{
    const {_id,replyVal} = req.body
    Comment.update({_id:_id},{
        replyVal:replyVal 
    }).then(()=>{
        res.json({
            success:true
        })
    })
})
router.get('/outComment',(req,res,next)=>{
    const {id} = req.query;
    Comment.find({id:id}).then((docs)=>{
        res.json({
            success:true,
            data:docs
        })
    })
})

module.exports = router 