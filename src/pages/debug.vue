<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card class="mx-auto mb-3">
        <v-card-title>auth: {{ $auth.loggedIn }}</v-card-title>
        <v-card-actions>
          <v-btn @click="login">{{ $t('auth.login') }}</v-btn>
          <v-btn @click="login">{{ $t('auth.logout') }}</v-btn>
        </v-card-actions>
      </v-card>

      <v-card class="mx-auto mb-3">
        <v-card-title>Access Token</v-card-title>
        <v-card-text>
          <v-textarea v-model="token" readonly></v-textarea>
        </v-card-text>
      </v-card>

      <v-card class="mx-auto mb-3">
        <v-card-title>ID Token</v-card-title>
        <v-card-text>
          <v-textarea v-model="idToken" readonly></v-textarea>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DebugPage',
  computed: {
    token() {
      try {
        return this.$auth.strategy.token.get().replace(/^Bearer /, '')
      } catch (error) {
        console.warn(error)
        return ''
      }
    },
    idToken() {
      try {
        return this.$auth.strategy.idToken.get().replace(/^Bearer /, '')
      } catch (error) {
        console.warn(error)
        return ''
      }
    },
  },
  methods: {
    login() {
      this.$auth.login()
    },
    logout() {
      this.$auth.logout()
    },
  },
}
</script>
