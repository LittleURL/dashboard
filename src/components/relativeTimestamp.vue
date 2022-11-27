<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">{{ ts | luxonRelative }}</span>
    </template>
    <span>{{ ts | luxonLocaleFull }}</span>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'RelativeTimestamp',

  props: {
    ts: { type: String, default: undefined },
  },
}
</script>
