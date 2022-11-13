<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn v-if="!!backTo && !!backText" :to="backTo" text nuxt exact>
          <v-icon>mdi-chevron-left</v-icon>{{ backText }}
        </v-btn>
      </v-col>
      <v-col>
        <h2 class="text-center">
          {{ title }}
        </h2>
      </v-col>
      <v-col align-self="end" align="right">
        <slot name="actions"></slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'PageHeader',

  props: {
    title: { type: String, default: undefined },
    backTo: { type: String, default: undefined },
    backText: { type: String, default: undefined },
  },

  head() {
    return {
      title: this?.title,
    }
  },
}
</script>
