<template>
  <p>HELLO THERE</p>
</template>

<script lang="ts">
import base64url from 'base64url'
import DeleteDialogue from '~/components/deleteDialogue.vue'
import PageHeader from '~/components/pageHeader.vue'
import { linkId } from '~/helpers'
import { Domain, Link } from '~/types'

type Data = {
  link: Link | undefined
}

export default {
  name: 'LinksShow',
  components: { PageHeader, DeleteDialogue },

  data(): Data {
    return {
      link: undefined,
    }
  },

  fetchDelay: 500,
  async fetch() {
    const { domainId, uri } = this.$route.params
    this.links = await this.$axios.$get(`/domains/${domainId}/links/${uri}`)
  },

  computed: {
    currentDomain(): Domain | undefined {
      const { domainId } = this.$route.params
      return this.$store.getters['domains/current'](domainId)
    },
  },

  watch: {
    sortBy: '$fetch',
    sortDesc: '$fetch',
  },

  methods: {
    linkId,

    async deleteLink(uri: string) {
      const { domainId } = this.$route.params
      this.$refs.confirmDelete.pending()
      await this.$axios.$delete(`/domains/${domainId}/links/${base64url(uri)}`)
      this.$refs.confirmDelete.close()
    }
  },
}
</script>