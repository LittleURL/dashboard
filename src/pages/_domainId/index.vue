<script>
export default {
  name: 'DomainShow',

  mounted() {
    const { domainId } = this.$route.params
    this.$router.replace(`/${domainId}/links`)
  }
}
</script>