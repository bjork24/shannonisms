<template>
  <div>
    <p>Hi from {{ data.show }}</p>
    <p>Hi from {{ data.airDate }}</p>
    <img :src=data.bjork />
    <nuxt-link to="/">Home page</nuxt-link>
  </div>
</template>

<style>
  img {
    max-width: 50vw;
  }
</style>

<script>
import axios from 'axios';

export default {
  head: {
    title: 'Submission page',
    meta: [
      { hid: 'description', name: 'description', content: 'Submission description' }
    ]
  },
  async asyncData ({ params }) {
    let { data } = await axios.get('https://ltts.netlify.com/v1/game-of-thrones/s1e1.json');
    return { data };
  }
}
</script>
