<template>
  <!-- Avatar -->
  <v-menu offset-y :close-on-content-click="false">
    <template #activator="{ on }">
      <v-btn color="primary" dark icon size="32" v-on="on">
        <v-avatar v-if="avatar" size="32">
          <img :src="avatar" :alt="`@${username}`" />
        </v-avatar>
        <v-icon v-else size="32">mdi-account</v-icon>
      </v-btn>
    </template>
    <v-list width="230">
      <v-list-item>
        <v-spacer />
        <span class="text-center"> @{{ username }} </span>
        <v-spacer />
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-list-item>

      <!-- settings -->
      <v-divider />
      <nav-settings />
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Auth } from 'aws-amplify'
import NavSettings from './settings.vue'

export default {
  name: 'NavProfile',
  components: { NavSettings },

  data: () => ({
    username: undefined,
    avatar: undefined,
  }),

  async mounted() {
    const user = await Auth.currentAuthenticatedUser()
    this.username = user.username
    this.avatar = user.attributes.picture
  },

  methods: {
    async logout() {
      await Auth.signOut()
      this.$router.push('/login')
    }
  }
}
</script>
