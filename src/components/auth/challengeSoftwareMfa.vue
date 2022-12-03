<template>
  <v-card>
    <v-card-title>{{ $t('auth.challenge.softwareMfa') }}</v-card-title>
    <v-card-text>
      <v-otp-input
        v-model="code"
        length="6"
        outlined
        :disabled="loading"
        @finish="submit"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Auth, CognitoUser } from '@aws-amplify/auth'
import { authErrorAlert } from '~/helpers'

type Data = {
  loading: boolean
  code?: string
}

export default {
  name: 'ChallengeSoftwareMfa',

  props: {
    user: { type: CognitoUser, default: undefined },
  },

  data: (): Data => ({
    loading: false,
    code: undefined,
  }),

  methods: {
    async submit() {
      this.loading = true

      try {
        await Auth.confirmSignIn(this.user, this.code, 'SOFTWARE_TOKEN_MFA')
        this.$router.push('/')
      } catch (err) {
        this.$store.commit('addAlert', authErrorAlert(err))
      }

      this.loading = false
    },
  },
}
</script>
