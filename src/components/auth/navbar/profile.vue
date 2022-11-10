<template>
  <!-- Avatar -->
  <v-menu offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark icon size="32" v-on="on">
        <v-avatar v-if="user.picture" size="32">
          <img :src="user.picture" :alt="`@${user['cognito:username']}`" />
        </v-avatar>
        <v-icon v-else size="32" color="white">mdi-account</v-icon>
      </v-btn>
    </template>
    <v-list width="230">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-center">
            @{{ user['cognito:username'] }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- settings -->
      <v-divider />
      <nav-settings />
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import NavSettings from './settings'
import { User } from '~/types/auth'
export default {
  name: 'NavProfile',
  components: { NavSettings },
  middleware: 'auth',
  computed: {
    isLoggedIn() {
      return this.$auth.loggedIn
    },
    user(): User {
      return this.$auth.user
    },
  },
}
</script>
