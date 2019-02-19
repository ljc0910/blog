<template>
  <div>
    <Header />
    <nuxt />
  </div>
</template>
<script>
import Header from '~/components/Header.vue';
export default {
  components: {
    Header
  }
}
</script>
<style>
@import ".././static/css/normalize.css";
</style>
