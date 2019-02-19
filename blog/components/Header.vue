<template>
  <div class="Header">
    <div class="Header-cont">
      <div class="header-title">
        jc的博客
      </div>
      <ul class="header-list">
        <router-link tag="li" to="/">首页</router-link>
        <router-link tag="li" to="/timeline">时光轴</router-link>
        <router-link tag="li" to="/aboutme">关于我</router-link>
        <router-link tag="li" to="/foo">未来</router-link>
      </ul>
    </div>
  </div>
</template>

<style>
.Header{padding: 20px 0
;background: rgba(255, 255, 255, 0.5);overflow: hidden;position: fixed;top: 0;left: 0;width: 100%;z-index: 1;}
.Header-cont{width: 1200px;margin: 0 auto;}
.header-title{float: left;margin-left: 30px;}
.header-list{float: right;}
.header-list li{cursor: pointer;float: left;margin: 0 20px;}
</style>
