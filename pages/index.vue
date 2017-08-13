<template>
  <div>
    <h1 id="title">{{ quote }}</h1>
    <nuxt-link :to="/quote/+quoteId">Quote #{{ quoteId }}</nuxt-link> | 
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
    const quoteId = Math.floor(Math.random() * quotes.length);
    return {
      quote: quotes[quoteId],
      quoteId
    };
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