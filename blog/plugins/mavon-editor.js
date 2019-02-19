 // 全局注册
    // import with ES6
    import Vue from 'vue'
    import mavonEditor from 'mavon-editor'
    // markdown-it对象：md.s_markdown, md => mavonEditor实例
    //                 or
    //                 mavonEditor.markdownIt 
    import 'mavon-editor/dist/css/index.css'
    // use
    export default () => {
      Vue.use(mavonEditor)
    }