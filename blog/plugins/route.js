export default ({ app }) => {
    app.router.afterEach((to, from, next) => {
        // if(to.name=='tologin'){
        //     next();   
        // }else if(getCookie()){
        //     if(to.matched.length ===0){
        //       // next('/Nullpoint')
        //       next()
        //     }else{
        //       next();
        //     }
        //   }else{
        //     next('/');
        //   }
        // if(to.name=='/'){
        //     next('/qiantai')
        // }
    })
  }