const express = require('express')
const router = express.Router()
const Article = require('../modules/article')	//mongoose.model模型
var multer = require('multer');
router.post('/enterArticle',(req,res,next)=>{           //文章写入
    const {title,articleType,value,picBase} = req.body
    Article.create({
        title:title,
        articleType:articleType,
        value:value,
        picBase:picBase,
        curTime:new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()
    }).then(()=>{
        res.json({
            success:true
        })
    }).catch(next)
})
router.get('/outArticle',(req,res,next)=>{               //文章查询
    const perCount = 5; //每页数量
    var {articleType,pageNum,searchVal} = req.query
    let regex = new RegExp(searchVal, 'ig');
    articleType = articleType==0?[1,2,3]:articleType;
    let Count = (pageNum-1)*perCount;  //跳过
    Article.find({articleType:articleType,title:regex}).then((pdocs)=>{
        let pageNums  = Math.ceil(pdocs.length/perCount);
        Article.find({articleType:articleType,title:regex}).sort({_id:1}).skip(Count).limit(perCount).then((docs)=>{
            for(var i = 0;i<docs.length;i++){
                if(docs[i].value.length>150){
                    docs[i].value =  docs[i].value.substring(0,150) + '......'
                }
            }
            res.json({
                success:true,
                data:docs,
                pageNums:pageNums
            })
        })
    })
})
router.get('/outArticleDetail',(req,res,next)=>{        //文章详情
    const {id} = req.query;
    Article.find({_id:id}).then((docs)=>{
        Article.update({_id:id},{viewNum:docs[0].viewNum+1}).then(()=>{
                res.json({
                    success:true,
                    data:docs
                })
        })
    })
})

//读取照片start
var storage = multer.diskStorage({
    // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
    destination: 'public/images/',
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        cb(null,  file.originalname);
     }
}); 
var upload = multer({
    storage: storage
})
router.post('/upload',upload.single('image'),(req,res)=>{
    // var file = req.file;
    res.send('http://127.0.0.1:4001/public/images/'+req.file.filename)
})
//读取照片end
module.exports = router 