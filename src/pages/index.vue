<template>
  <div>
    <h1 class="v-heading text-center">{{ $t('domains.select') }}</h1>
    <v-card class="mx-auto mb-3 pb-0" outlined>
      <domains-list />
    </v-card>
  </div>
</template>

<script lang="ts">
import DomainsList from '~/components/domains.vue'

export default {
  name: 'DefaultLayout',
  components: { DomainsList },
}
</script>
