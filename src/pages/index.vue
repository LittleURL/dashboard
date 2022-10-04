<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card class="mx-auto">
        <v-card-title>auth: {{ $auth.loggedIn }}</v-card-title>
        <v-card-text>
          <v-textarea v-model="token"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="login">{{$t('auth.login')}}</v-btn>
          <v-btn @click="login">{{$t('auth.logout')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  auth: false,
  computed: {
    token() {
      return this.$auth.strategy.idToken.get()
    },
  },
  methods: {
    login() {
      this.$auth.login()
    },
    logout() {
      this.$auth.logout()
    }
  },
}
</script>
