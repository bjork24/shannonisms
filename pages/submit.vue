<template>
  <div>
    <p>Hi from {{ name }}</p>
    <nuxt-link to="/">Home page</nuxt-link>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Submission page ð',
    meta: [
      { hid: 'description', name: 'description', content: 'Submission description' }
    ]
  },
  asyncData ({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  }
}
</script>