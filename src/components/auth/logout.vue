<template>
  <v-list-item link>
    <v-list-item-icon>
      <v-icon>mdi-logout</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title @click="logout" v-text="$t('navbar.logout')" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'AuthLogout',
  methods: {
    logout() {
      this.$fireAuth.signOut()
    }
  }
}
</script>