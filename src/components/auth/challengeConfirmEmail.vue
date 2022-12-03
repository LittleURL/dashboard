<template>
  <div>
    <v-card>
      <v-card-title>{{ $t('auth.challenge.confirmEmail') }}</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="username" :label="$t('auth.email')" />
          <v-otp-input
            v-model="code"
            length="6"
            outlined
            :disabled="loading"
            @finish="submit"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="$emit('cancel')">
          {{ $t('cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn color="primary" :loading="loading" @click="submit">
          {{ $t('submit') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Auth } from '@aws-amplify/auth'
import { authErrorAlert } from '~/helpers'

type Data = {
  loading: boolean
  code?: string
  username?: string
}

export default {
  name: 'ChallengeConfirmEmail',

  props: {
    email: { type: String, default: undefined },
  },

  data: (): Data => ({
    loading: false,
    code: undefined,
    username: undefined,
  }),

  watch: {
    email() {
      if (this.username === undefined) {
        this.username = this.email
      }
    },
  },

  methods: {
    async submit() {
      this.loading = true

      try {
        await Auth.confirmSignUp(this.username, this.code)
        this.$router.push('/login')
      } catch (err) {
        this.$store.commit('addAlert', authErrorAlert(err))
      }

      this.loading = false
    },
  },
}
</script>
