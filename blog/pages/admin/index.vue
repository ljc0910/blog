<template>
    <div class="admin">
         <el-select v-model="articleType" placeholder="发布到">
                <el-option label="vue" value="1"></el-option>
                <el-option label="nodejs" value="2"></el-option>
                <el-option label="html、css" value="3"></el-option>
        </el-select>
        <el-input placeholder="请输入文章标题" v-model="title" class="input-with-select">
        </el-input>
        <mavon-editor ref=md :ishljs = "true" @imgAdd="$imgAdd" v-if='docu' v-model="value"/>
        <el-upload
            class="admin-upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="getFile"
            :auto-upload="false"
            :limit='1'
            :on-exceed='handlePreview'
            list-type="picture">
            <el-button size="small" type="primary">上传略缩图</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-row>
            <el-button type="info" @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit" >提 交</el-button>
        </el-row>
    </div>
</template>
<script>
export default {
   data () {
       return {
           title:'',
           articleType:'',
           value:'',
           docu:false,  
           picBase:''
       }
   },
   methods:{
        $imgAdd(pos, $file){// 将图片上传到服务器.
           var formdata = new FormData();
           formdata.append('image', $file);
           var $vm = this.$refs.md
           this.$axios({
               url: 'http://localhost:4001/api/upload',
               method: 'post',
               data: formdata,
               headers: { 'Content-Type': 'multipart/form-data' },
            }).then((res) => {
               // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
               // $vm.$img2Url 详情见本页末尾
                $vm.$img2Url(pos, res.data)
           })
        },
       handlePreview(){
           this.$message('最多只能上传一张图片');
       },
       getFile(file){
           this.getBase64(file.raw).then(res => {
             this.picBase = res;
            });
       },
        getBase64(file) {
            return new Promise(function(resolve, reject) {
                let reader = new FileReader();
                let imgResult = "";
                reader.readAsDataURL(file);
                reader.onload = function() {
                imgResult = reader.result;
                };
                reader.onerror = function(error) {
                reject(error);
                };
                reader.onloadend = function() {
                resolve(imgResult);
                };
            });
        },
       cancel(){
           if(!this.value.trim()==''){
                this.$confirm('当前文本域存在未发布的内容，是否离开？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({path:'/'}) 
                })        
           }else{
               this.$router.push({path:'/'}) 		
           }
       },
       submit(){
           if(this.title.trim()==''){
              this.$message({message:'请输入标题',type: 'warning'});
           }else if(this.articleType==''){
              this.$message({message:'请选择发布类型',type: 'warning'});
           }else if(this.value.trim()==''){
              this.$message({message:'请输入文章内容',type: 'warning'});  
           }else if(this.picBase.trim()==''){
              this.$message({message:'请上传略缩图',type: 'warning'});
           }else{
            var _this = this
            this.$axios.post(`http://localhost:4001/api/enterArticle`, {
                    // ts:Date.parse(new Date()),
                    title:_this.title,
                    articleType:_this.articleType,
                    value:_this.value,
                    picBase:_this.picBase
                }).then(res => {
            })
           }
       }
   },
   mounted(){
       this.docu = true;    //页面未初始化时，没有document对象。通过mounted生命周期函数，异步渲染富文本插件。
   }
}
</script>
<style>
    .admin{position: relative;z-index: 4;background: #fff;}
    .admin .el-row{text-align: center;margin: 40px;}
    .admin .admin-upload{margin:30px 5px;}
    .admin .el-select{width: 220px;right: 0;}
    .admin>.el-input{float: left;width: calc(100% - 220px)}
    .admin .el-input__inner{font-size: 30px;height: 70px;line-height: 70px;}
</style>
