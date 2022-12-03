<template>
  <NuxtLink :to="`/${$route.params.domainId}/links`">
    Click here to go somewhere with actual content
  </NuxtLink>
</template>

<script>
export default {
  name: 'DomainShow',

  mounted() {
    const { domainId } = this.$route.params
    this.$router.replace(`/${domainId}/links`)
  },
}
</script>
