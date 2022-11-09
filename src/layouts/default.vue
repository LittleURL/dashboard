<template>
  <v-app dark>
    <!-- drawer -->
    <v-navigation-drawer v-model="drawer" fixed app></v-navigation-drawer>

    <!-- navbar -->
    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <!-- domain -->
      <v-spacer class="pull-right" />
      <v-menu offset-y>
        <!-- activator -->
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" text v-on="on">
            {{ currentDomain?.domain || '???' }}
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
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Domain } from '../types/domain'
import NavProfile from '../components/auth/navbar/profile.vue'
import DomainsList from '../components/domains.vue'

export default {
  name: 'DefaultLayout',
  components: { NavProfile, DomainsList },

  data() {
    return {
      drawer: false,
    }
  },

  computed: {
    currentDomain(): Domain | undefined {
      return this.$store.getters['domains/current']
    },
  },
}
</script>
