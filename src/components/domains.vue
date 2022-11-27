<template>
  <v-list class="py-0">
    <!-- actions -->
    <v-list-item>
      <v-btn left text color="primary" tile>
        <v-icon>mdi-plus</v-icon>{{ $t('new') }}
      </v-btn>
      <v-spacer />
      <v-btn icon right tile :loading="loading" @click.stop="refreshDomains">
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </v-list-item>

    <!-- available domains -->
    <v-divider />
    <v-list-item-group :value="currentDomain?.id">
      <template v-for="(domain, index) in allDomains">
        <v-list-item :key="domain.id" nuxt :to="`/${domain.id}`">
            <v-list-item-content class="my-2">
              <v-list-item-title>{{ domain.domain }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-divider v-if="index < allDomains.length - 1" :key="index" />
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import { Domain } from '../types/domain'

export default {
  name: 'DomainsList',

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    currentDomain(): Domain | undefined {
      const { domainId } = this.$route.params
      return this.$store.getters['domains/current'](domainId)
    },
    allDomains(): Domain[] {
      return this.$store.getters['domains/all']
    },
  },

  async mounted() {
    await this.refreshDomains()
  },

  methods: {
    async refreshDomains() {
      this.loading = true
      await this.$store.dispatch('domains/refresh')
      this.loading = false
    },
  },
}
</script>
