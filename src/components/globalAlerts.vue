<template>
  <div ref="global-alerts">
    <complex-alert v-for="alert in alerts" :key="alert?.id" :alert="alert" />
  </div>
</template>

<script lang="ts">
import { Alert } from '~/types/alert'
import ComplexAlert from '~/components/complexAlert.vue'

export default {
  name: 'GlobalAlerts',

  components: { ComplexAlert },

  computed: {
    alerts(): Alert[] {
      return this.$store.getters.alerts
    },
  },
}
</script>
