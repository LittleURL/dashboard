<template>
  <v-list-item-group>
    <v-list-item @click.stop="toggleDarkmode">
      <v-icon>mdi-brightness-4</v-icon>
      <v-spacer />
      {{ $t('settings.darkMode') }}
      <v-spacer />
      <v-switch v-model="isDarkmode" primary />
    </v-list-item>
  </v-list-item-group>
</template>

<script lang="ts">
import { setCookie } from 'tiny-cookie'

export default {
  name: 'NavSettings',

  computed: {
    isDarkmode() {
      return this.$vuetify.theme.dark
    },
  },

  methods: {
    toggleDarkmode() {
      const theme = !this.$vuetify.theme.dark
      const cookieOptions = { samesite: 'strict' }
      setCookie('littleurl-darkmode', theme, cookieOptions)
      this.$vuetify.theme.dark = theme
    },
  },
}
</script>
