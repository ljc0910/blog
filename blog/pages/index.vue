<template>
  <div class="home">
    <div class="home_bg"></div>
    <div class="home-cont">
      <div class="cont-nav">
        <ul class="summary">
          <li>
            <div>文章</div>
            <div>{{blogInfo.articleLength}}</div>
          </li>
          <li>
            <div>评论</div>
            <div>{{blogInfo.comment}}</div>
          </li>
          <li>
            <div>访问</div>
            <div>{{blogInfo.traffic}}</div>
          </li>
        </ul>
        <p>
          欢迎来到jc的个人博客，本网站建于2019年1月28号。在这里你可以看到一些web相关的文章，今天是{{curDate.year}}年{{curDate.month}}月{{curDate.day}}日，农历{{lunarDate.lunarYear}}年{{lunarDate.lunarMonth}}月{{lunarDate.lunarDay}}日，您是第{{blogInfo.traffic}}位访问者！
        </p>
        <ul class="latest-article">
          <li>
            <h2>最新文章</h2>
          </li>
          <router-link tag="li" class="alink" :to="{name:'detail',query:{id:v._id}}" v-for="(v,i) in newInfo.newArticle" :key=i>{{v.title}}</router-link>
        </ul>
        <ul class="latest-comments">
          <li>
            <h2>最新评论</h2>
          </li>
          <router-link tag="li" class="alink" :to="{name:'detail',query:{id:v.id}}" v-for="(v,i) in newInfo.newComment" :key=i>{{v.textVal}}</router-link>
        </ul>
      </div>
      <div class="cont-detail">
          <!-- <div class="lunbo">
            <el-carousel :interval="5000" arrow="hover">
              <el-carousel-item v-for="item in 4" :key="item">
                <h3>{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </div> -->
          <el-input placeholder="请输入关键词" v-model="searchVal" class="input-with-select">
            <el-select v-model="articleType"  slot="prepend"  placeholder="请选择" @change="articleQuery">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          
          <ul class="cont-detail_list">
              <router-link tag="li" :to="{name:'detail',query:{id:v._id}}" v-for="(v,i) in articleCont" :key=i >
                  <div class="article">
                    <img :src=v.picBase alt="">
                    <div class="article-cont">
                      <h1>
                        {{v.title}}
                      </h1>
                      <p>
                        {{v.value}}
                      </p>
                      <div class="article-info">
                        <div class="article-time">
                           <i class="el-icon-time">{{v.curTime}}</i> 
                        </div>
                        <div class="article-readnum">
                          <i class="el-icon-view">{{v.viewNum}}</i>
                          <i class="el-icon-document">{{v.commentNum}}</i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="comments"></div>
              </router-link>
              <li v-if="!articleCont.length"><h3  style="height:100px;line-height:100px;text-align:center;">暂无相关数据!</h3></li>
          </ul>
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="pageNum"
            :total="pageNums"
            @current-change="articleQuery">
          </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import sloarToLunar from '../plugins/fragment.js'
export default {
  data(){
    return{
      articleCont:[
        
      ],
      pageNums:0,
      pageNum:1,
      articleType:0,
      searchVal:'',
      options: [{
        value: 0,
        label: '全部'
      },{
        value: 1,
        label: 'vue'
      }, {
        value: '2',
        label: 'node'
      }, {
        value: '3',
        label: 'html'
      }],
      blogInfo:'',
      curDate:{
        year:'',
        month:'',
        day:''
      },
      lunarDate:{
        lunarDay:'',
        lunarMonth:'',
        lunarYear:''
      },
      newInfo:{}
    }
  },
  methods: {
    articleQuery(){
      var _this = this;
      this.$axios.get(`http://localhost:4001/api/outArticle`, {
                  params:{
                    articleType:_this.articleType,
                    pageNum:this.pageNum,
                    searchVal:this.searchVal
                  }
        }).then(res => {
            _this.articleCont = res.data.data,
            _this.pageNums = res.data.pageNums*10
        })
    },
    search(){
      this.articleQuery()
    }
  },
  mounted(){
      var curTime = new Date();
      this.curDate = {
        year:curTime.getFullYear(),
        month:curTime.getMonth()+1,
        day:curTime.getDate()
      }
      this.lunarDate = sloarToLunar(this.curDate.year,this.curDate.month,this.curDate.day)
      this.articleQuery();
      this.$axios.get(`http://localhost:4001/api/getBlogInfo`).then(res=>{
        this.blogInfo = res.data
      })
      this.$axios.get(`http://localhost:4001/api/getNewInfo`).then(res=>{
        this.newInfo = res.data
      })
  }
}
</script>

<style>
.home{height: 100vh;overflow: auto;}
.home .home_bg{background: url('../static/img/index_bg.jpg') no-repeat;
    background-size:cover; -webkit-filter: blur(3px);
    filter: blur(3px);height: 100vh;width:100vw;position: absolute;
    z-index: -1;}
.home .home-cont{width: 1200px;border-radius:5px;margin:80px auto;background: rgba(255, 255, 255, 0.5);height: 800px;padding: 3px;}
.home .cont-nav{width: 290px;float: left;background: rgba(255, 255, 255, 0.5);height: calc(100% - 10px);padding:5px;}
.home .cont-detail{width: 890px;float: right;}
.home .el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.home .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.home .el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.home .cont-detail_list{height: 718px;}
.home .cont-detail_list li{margin: 1px 0;overflow: hidden;border: 1px solid #eaeefb;background: #fff;cursor: pointer;}
.home .article>img{float: left;width: 200px;height: 140px;}
.home .article-cont{float: right;width: 670px;}
.home .article-cont h1{font-size: 20px;height: 30px;line-height: 30px;}
.home .article-cont p{font-size: 14px;line-height: 16px;height: 90px;overflow: hidden;}
.home .article-readnum{height: 20px;line-height: 20px; float: right;margin-right: 10px;}
.home .article-readnum i{font-size: 14px;}
.home .summary{display: flex;justify-content: space-around;border-bottom: 1px solid #eaeefb;background: rgba(255, 255, 255, 0.5);padding: 10px;margin-bottom: 5px; }
.cont-nav>p{padding: 10px;background: rgba(255, 255, 255, 0.5)}
.home .el-pagination{text-align: center;background: rgba(255, 255, 255, 0.6);}
.home .el-pagination button{background:none;}
.home .el-pagination li{background: none;}
.home .article-time{float:left;}
.home .el-select{width: 100px;}
.latest-article,.latest-comments{background: rgba(255, 255, 255, 0.5);padding: 10px;margin: 5px 0;}
.latest-article .alink{color: royalblue;cursor: pointer;margin: 4px;}
.latest-article .alink:hover{ text-decoration:underline;}
.latest-comments .alink{color: royalblue;cursor: pointer;margin: 4px;}
.latest-comments .alink:hover{ text-decoration:underline;}
</style>
