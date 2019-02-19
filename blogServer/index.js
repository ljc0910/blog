const express = require('express');
const mongoose = require('mongoose')  
const morgan = require('morgan'); //日志中间件
const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const os = require('os'); // 获取CPU 的数量
let numCPUs = os.cpus().length;
let workers = {};
const app = express();
const FileStreamRotator = require('file-stream-rotator')  //日志切割插件
const uerRouters = require('./api/articleQuery')
const commentRouters = require('./api/commentQuery')
const bloginfoRouters = require('./api/bloginfoQuery')
const bodyParser = require('body-parser') //请求信息由字符串转换成对象
let logDirectory = __dirname + '/log';
let dbUrl = 'mongodb://localhost:27017/blogServer';
mongoose.connect(dbUrl);  //连接数据库

app.get('/',(req,res)=>{
	res.send('server run 4001')
})

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); 
  }
  else {
    next();
  }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);  //检查到该文件夹则继续运行，否则创建文件夹
var accessLogStream = FileStreamRotator.getStream({ //创建一个写文件流，并且保存在当前文件夹的log文件中
  date_format: 'YYYYMMDD',
  filename: logDirectory + '/%DATE%.log',
  frequency: 'daily',
  verbose: false
});
var errLogStream = FileStreamRotator.getStream({ //异常日志
  date_format: 'YYYYMMDD',
  filename: logDirectory + 'err' +  '/%DATE%.log',
  frequency: 'daily',
  verbose: false
});
app.use(morgan('combined',{ stream: accessLogStream }));//'combined'是日志显示的格式
// 错误处理
app.use((err, req, res, next) => { 
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errLogStream.write(meta + err.stack + '\n');
  res.status(442).send({ error: err.message })
})


app.use('/api',uerRouters)  //挂载路由
app.use('/api',commentRouters)
app.use('/api',bloginfoRouters)
app.get('/public/images/*', function (req, res) {
  res.sendFile( __dirname + "/" + req.url );
})

if (cluster.isMaster) {
  // 主进程分支
  cluster.on('death', function (worker) {
      // 当一个工作进程结束时，重启工作进程
      delete workers[worker.pid];
      worker = cluster.fork();
      workers[worker.pid] = worker;
  });
  // 初始开启与CPU 数量相同的工作进程
  for (var i = 0; i < numCPUs; i++) {
      var worker = cluster.fork();
      workers[worker.pid] = worker;
  }
} else {
  // 工作进程分支，启动服务器
  if (!module.parent) {   //判断当前模块是否由其他模块调用
    const server = app.listen(4001,()=>{
      console.log('run at 4001')
    })
  }
}
// 当主进程被终止时，关闭所有工作进程
process.on('SIGTERM', function () {
  for (var pid in workers) {
      process.kill(pid);
  }
  process.exit(0);
});

/*cluster.js 的功能是创建与CPU 核心个数相同的服务器进程，以确保充分利用多核CPU 的
资源。主进程生成若干个工作进程，并监听工作进程结束事件，当工作进程结束时，重新启
动一个工作进程。分支进程产生时会自顶向下重新执行当前程序，并通过分支判断进入工作
进程分支，在其中读取模块并启动服务器。通过cluster启动的工作进程可以直接实现端口
复用，因此所有工作进程只需监听同一端口。当主进程终止时，还要主动关闭所有工作进程。*/

