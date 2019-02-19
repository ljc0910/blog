<template>
    <div>
        <div class="articleBox"></div>
        <div class="articleDetail" ref="el" >
             <mavon-editor :ishljs = "true"  
              :subfield = "false"  
              :toolbarsFlag = "false" 
              defaultOpen='preview' 
              v-if='docu'
              v-model="detailData"/>
        </div>
        <div class="comment">
            <VueEmoji ref="emoji" @input="onInput" :value="textVal" v-show="subShow"/>
            <el-row >
                <el-button type="info" @click="cancel" v-if="subShow" v-show="!textVal">取消</el-button>
                <el-button type="info" @click="clearTextarea" v-if="subShow" v-show="textVal">清空</el-button>
                <el-button type="primary" @click="submit">评论</el-button>
            </el-row>
            <ul class="commentList">
                <li v-for="(v,i) in commentList" :key='i'>
                    <div>{{i+1}}楼评论：</div>
                    <div>{{v.textVal}}</div>
                    <div class="comment_interact">
                        <!-- <div class="comment_time">一小时前</div> -->
                        <i class="el-icon-document cursor" @click="reply(i)">回复</i>
                        <i class="el-icon-star-on on cursor">12</i>
                    </div>
                    <VueEmoji ref="emoji2" @input="onInput2" v-if="v.show" :value="replyVal"/>
                    <el-row v-if="v.show" >
                        <el-button type="info" size='mini' @click="clearTextarea2">清空</el-button>
                        <el-button type="primary" size='mini' @click="submitReply(i)">发送</el-button>
                    </el-row>
                    <div v-for="(cv,ci) in v.replyVal" :key='ci'>
                       <div style="text-indent:2em;">回复{{i+1}}楼： {{cv}}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div> 
</template>

<script>
import VueEmoji from 'emoji-vue'
export default {
    components: {
        VueEmoji
    },
    data(){
        return{
            id:this.$route.query.id,
            detailData:'',
            docu:false,  
            subShow:false,
            textVal:'',
            replyVal:'',
            commentList:[]
        }
    },
    methods: {
        onInput(event) {
          //event.data contains the value of the textarea
          this.textVal = event.data
        },
        onInput2(event) {
          this.replyVal = event.data
        },
        clearTextarea(){
            this.textVal = ''
        },
        clearTextarea2(){
            this.$refs.emoji2[0].clear()
        },
        cancel(){
            this.subShow=false;
        },
        submit(){
            if(!this.subShow){
                this.subShow = true;
            }else{
                var _this = this;
                this.$axios.post(`http://localhost:4001/api/enterComment`,
                        {
                            id:_this.id,
                            userName:new Date().getTime(),
                            textVal:_this.textVal
                        }
                ).then(res => {
                    this.loadComment()
                    _this.textVal = ''
                    _this.cancel();
                    // _this.detailData = res.data.data[0].value
                })
            }
        },
        reply(i){
            if(this.commentList[i].show==true){
                this.commentList[i].show=false
                this.commentList.splice(i,1,this.commentList[i])       //双向绑定失效，手动更新视图
            }else{
                this.commentList.forEach(e => {
                    e.show = false;
                });
                this.commentList[i].show = true;
                this.commentList.splice(i,1,this.commentList[i])
            }
        },
        submitReply(i){
            var _this = this;
            this.commentList[i].show = false;
            this.commentList.splice(i,1,this.commentList[i])
            this.commentList[i].replyVal.push(this.replyVal)
            this.replyVal = ''
            this.$axios.post(`http://localhost:4001/api/updateComment`, {
                    _id:_this.commentList[i]._id,
                    replyVal:_this.commentList[i].replyVal
            }).then(res => {
                if(!res.data.success){
                    _this.$message.error('网络错误，评论失败!');
                }
            })
        },
        loadComment(){
            var _this = this;
            this.$axios.get(`http://localhost:4001/api/outComment`, {
                  params:{
                    id:_this.id
                  }
            }).then(res => {
                _this.commentList = res.data.data
            })
        }
    },
    mounted (){
        var _this = this;
        this.$axios.get(`http://localhost:4001/api/outArticleDetail`, {
                  params:{
                    id:_this.id
                  }
        }).then(res => {
            _this.detailData = res.data.data[0].value
        })
        this.loadComment();
         this.docu = true;
    }
}
</script>

<style>
.articleBox{background: url('../../static/img/index_bg.jpg') no-repeat;
    background-size:cover; -webkit-filter: blur(3px);
    filter: blur(3px);height: 100vh;width:100vw;position: fixed;top: 0;
    z-index: -1;}
.comment{width: 1200px;margin: 0 auto 20px;}
.comment .el-row{text-align: right;}
.articleDetail{width: 1198px;overflow:auto;margin: 80px auto 0;border: 1px solid #eaeefb;border-radius: 3px;box-shadow: 2px 2px 15px #666}
.emoji-vue-wraper{width: 1202px;margin: 5px 0 5px;}
.emoji-vue-wraper .emoji-picker-container{width:1200px !important;}
.emoji-vue-textarea{width: 1158px !important;background:#fbfbfb; }
.commentList{background: #fbfbfb;border-radius: 3px;}
.commentList li{border-bottom: 1px solid #ccc;padding:20px;clear: both; overflow: hidden;}
.cursor{cursor: pointer;}
.comment_interact{overflow: hidden;}
.comment_interact .comment_time{float: left;}
.comment_interact>i{float: right;margin-left: 10px;}
.el-icon-star-on{color: #aaa;}
.on{color: #409EFF;}
.commentList .emoji-vue-wraper{width: 1160px;clear: both;}
.commentList .emoji-vue-wraper .emoji-picker-container{width: 1160px !important;}
.commentList .emoji-vue-textarea{width: 1116px !important;}
</style>
