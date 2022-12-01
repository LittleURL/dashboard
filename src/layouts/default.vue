<template>
  <v-app>
    <v-app-bar fixed app>
      <v-btn icon plain nuxt exact to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <!-- domain -->
      <v-spacer />
      <v-menu offset-y>
        <!-- activator -->
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" text v-on="on">
            <span v-if="!currentDomain" class="text--disabled">{{
              $t('domains.select')
            }}</span>
            <span v-else>{{ currentDomain?.domain }}</span>
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>

        <!-- dropdown -->
        <domains-list />
      </v-menu>

      <!-- user -->
      <nav-profile />
    </v-app-bar>

    <!-- main content -->
    <v-main class="background">
      <v-container fluid class="mt-4">
        <global-alerts />
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import DomainsList from '~/components/domains.vue'
import GlobalAlerts from '~/components/globalAlerts.vue'
import NavProfile from '~/components/navbar/profile.vue'
import { Domain } from '~/types/domain'

export default {
  name: 'DefaultLayout',
  components: { NavProfile, GlobalAlerts, DomainsList },

  data() {
    return {
      drawer: false,
    }
  },

  computed: {
    currentDomain(): Domain | undefined {
      const { domainId } = this.$route.params
      return this.$store.getters['domains/current'](domainId)
    },
  },

  async mounted() {
    await this.$store.dispatch('domains/refresh')
  },
}
</script>
