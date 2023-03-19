<template>
  <!-- content -->
  <v-container>
    <v-card :loading="loading">
      <v-card-title>
        {{ $t('auth.acceptInvite') }}
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { successAlert } from '~/helpers'

type Data = {
  loading: boolean
}

export default {
  name: 'InviteAccept',
  layout: 'auth',

  data(): Data {
    return {
      loading: true,
    }
  },

  fetchDelay: 500,
  async fetch() {
    this.loading = true

    try {
      const { code } = this.$route.params
      await this.$axios.$get(`/invites/${code}`)
      this.$store.commit(
        'addAlert',
        successAlert(this.$t('auth.inviteAccepted'))
      )
    } finally {
      this.loading = false
      await this.$router.push(`/`)
    }
  },
}
</script>
