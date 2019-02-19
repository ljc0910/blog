<template lang="html">
  <div class="loadding" v-if="loading">
    <img src="../static/img/timg.gif"/>
  </div>
</template>
<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>
<style>
    .loadding img{width:100vw;height: 100vw; }
</style>
