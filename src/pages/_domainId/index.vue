<template>
  <div>
    <h1 class="v-heading text-center">{{ currentDomain?.domain }}</h1>
    <v-card class="mx-auto mb-3 pb-0" outlined>
      <v-card-text>lorem ipsum</v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Domain } from '~/types/domain'
export default {
  name: 'DomainShow',

  data: (): { domain: Domain } => ({
    domain: undefined,
  }),

  computed: {
    currentDomain(): Domain | undefined {
      const { domainId } = this.$route.params
      return this.$store.getters['domains/current'](domainId)
    },
  },

  // async fetch() {
  //   const { domainId } = this.$route.params
  //   this.domain = await this.$axios.$get(`/domains/${domainId}`)
  // },
}
</script>
