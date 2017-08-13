<template>
  <div class="user">
    <h3>{{ quote }}</h3>
    <p><nuxt-link to="/">Home</nuxt-link></p>
  </div>
</template>

<script>
import quotes from '../../quotes.js';
export default {
  validate ({ params }) {
    return !isNaN(+params.id)
  },
  asyncData({ params, error }) {
    const { id } = params;
    if (id < 0 || id > quotes.length) {
      error({ message: `Quote not found`, statusCode: 404 });
      return;
    } else {
      return { quote: quotes[params.id] }
    }
  }
}
</script>

<style scoped>
.user {
  text-align: center;
  margin-top: 100px;
  font-family: sans-serif;
}
</style>