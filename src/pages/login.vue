<template>
  <div>
    <h1 class="v-heading text-center">Authentication required.</h1>
    <v-card class="mx-auto mb-3">
      <v-card-actions>
        <v-btn color="primary" block @click="login">Login</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LoginPage',
  auth: false,
  layout: 'auth',

  computed: {
    isLoggedIn(): boolean {
      return this.$auth.loggedIn
    }
  },

  methods: {
    login() {
      this.$auth.login()
    },
  }
}
</script>
