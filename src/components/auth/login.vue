<template>
  <div>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="email"
          class="pt-1"
          :label="$t('auth.email')"
          required
          outlined
        />
        <v-text-field
          v-model="password"
          :label="$t('auth.password')"
          required
          outlined
          type="password"
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn text @click="$emit('forgotPassword')">
        {{ $t('auth.forgotPassword') }}
      </v-btn>
      <v-spacer />
      <v-btn color="primary" :loading="loading" @click="login">
        {{ $t('submit') }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { Auth } from 'aws-amplify'
import { AlertType } from '~/types/alert'

type Data = {
  loading: boolean
  email?: string
  password?: string
}

export default {
  name: 'AuthLogin',

  props: {
    autofillEmail: { type: String, default: undefined },
  },

  data: (): Data => ({
    loading: false,
    email: undefined,
    password: undefined,
  }),

  watch: {
    autofillEmail() {
      if (this.email === undefined) {
        this.email = this.autofillEmail
      }
    },
  },

  methods: {
    async login() {
      this.loading = true

      try {
        const res = await Auth.signIn(this.email, this.password)

        if (res.challengeName !== undefined) {
          this.$emit('challenge', res)
          this.loading = false
          return
        }

        this.$router.push('/')
      } catch (err) {
        if (err.code === 'UserNotConfirmedException') {
          this.$emit('emailNotConfirmed', this.email)
        } else {
          this.$store.commit('addAlert', {
            type: AlertType.Error,
            text:
              err.code === 'NotAuthorizedException'
                ? this.$t('auth.invalidLogin')
                : `Auth Error: ${err.name}`,
            details: err,
            timeout: 5000,
          })
        }
      }

      this.loading = false
    },
  },
}
</script>
