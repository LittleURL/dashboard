<template>
  <!-- Avatar -->
  <v-menu offset-y :close-on-content-click="false">
    <template #activator="{ on }">
      <v-btn color="primary" icon v-on="on">
        <v-avatar size="32">
          <v-img v-if="avatar" :src="avatar" :alt="`@${nickname}`">
            <template #placeholder>
              <v-icon size="32">mdi-account</v-icon>
            </template>
          </v-img>
        </v-avatar>
      </v-btn>
    </template>
    <v-list min-width="230">
      <v-list-item>
        <v-spacer />
        <span class="text-center">@{{ nickname }}</span>
        <v-spacer />
        <v-btn icon :title="$t('auth.logout')" @click="logout">
          <v-icon color="red">mdi-logout</v-icon>
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
    nickname: undefined,
    avatar: undefined,
  }),

  async mounted() {
    const user = await Auth.currentAuthenticatedUser()
    this.nickname = user.attributes.nickname
    this.avatar = user.attributes.picture
  },

  methods: {
    async logout() {
      await Auth.signOut()
      this.$router.push('/login')
    },
  },
}
</script>
