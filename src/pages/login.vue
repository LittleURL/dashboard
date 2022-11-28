<template>
  <v-card>
    <v-card-title>
      <v-tabs v-model="tab" grow>
        <v-tab key="login">{{ $t('auth.login') }}</v-tab>
        <v-tab key="register">{{ $t('auth.register') }}</v-tab>
      </v-tabs>
    </v-card-title>

    <v-card-text>
      <v-tabs-items v-model="tab">
        <!-- login -->
        <v-tab-item key="login">
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
            <v-btn color="primary" :loading="loading" @click="login">
              {{ $t('submit') }}
            </v-btn>
          </v-form>
        </v-tab-item>

        <!-- register -->
        <v-tab-item key="register">
          <v-form> TODO </v-form>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Auth } from 'aws-amplify'

type Data = {
  tab: 'login' | 'register'
  loading: boolean
  email?: string
  password?: string
}

export default {
  name: 'LoginPage',
  layout: 'auth',
  auth: false,

  data: (): Data => ({
    tab: 'login',
    loading: false,
    email: undefined,
    password: undefined,
  }),

  methods: {
    async login() {
      this.loading = true
      // const { email, password } = this
      // await this.$store.dispatch('auth/signIn', { email, password })
      await Auth.signIn(this.email, this.password)
      this.$router.push('/')
      this.loading = false
    },
  },
}
</script>
