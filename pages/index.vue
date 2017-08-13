<template>
  <div>
    <h1 id="title">Welcome!</h1>
    <ul>
      <li v-for="quote in quotes">{{ quote }}</li>
    </ul>
    <nuxt-link to="/submit">About page</nuxt-link>
  </div>
</template>

<script>
import quotes from '../quotes.js';
export default {
  head: {
    title: 'Home page ð',
    meta: [
      { hid: 'description', name: 'description', content: 'Home page description' }
    ]
  },
  data() {
    return { quotes };
  }
}
</script>

<style lang="scss" scoped>
$red: #DC0000;
#title {
  color: $red;
  font-size: 20px;
}
</style>