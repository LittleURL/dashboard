<template>
  <v-app dark>
    <v-main class="background">
      <v-container class="mt-4">
        <global-alerts />
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import GlobalAlerts from '~/components/globalAlerts.vue'

export default {
  name: 'AuthLayout',

  components: { GlobalAlerts }
}
</script>
