<template>
	<div class="loginPage" :style="{height:height}">
        <div class="loginPage_bg"></div>
		<div class="content">
			<div>帐号：<input type="text" v-model="account" /></div>
			<div>密码：<input type="password" v-model="password" /></div>
			<button @click="login()">登录</button>
			<!-- <button @click="register()">注册</button> -->
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				account: '',
				password: '',
				height:''
			}
		},
		mounted () {
			this.height = window.innerHeight+'px';	
		},
		methods: {
			login() {
				this.$axios.post(`http://106.12.22.249:4000/api/user`, { 
					username: this.account,
					passwords: this.password,
					type: 'login'
				}).then(res => {
					console.log(res)
					if(res.data.success){
						//  store.commit('updateLoginInfo', {
						// 	userName: this.account,
						// 	userId: 1
						// });
						document.cookie = "token=" + res.data.token
						this.$router.push({path:'/admin'}) 						
					}else{
						alert('密码错误')
					}
				})
			},
			register() {
				this.$axios.post(`http://106.12.22.249:4000/api/user`, {
					username: this.account,
					passwords: this.password,
					type: 'register'
				}).then(res => {
					console.log(res)
				})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.loginPage{ overflow: hidden;position: relative;z-index: 1;}
    .loginPage_bg{background:url('../static/img/login_bg.jpg') no-repeat;background-size:cover;-webkit-filter: blur(3px);
    filter: blur(3px);position: absolute;z-index: -1;width: 100%;height: 100%;}
	.content{width: 240px;height: 200px;margin: 300px auto;}
	button:nth-of-type(1){margin-left: 70px;}
	button{margin-top:30px; }
</style>