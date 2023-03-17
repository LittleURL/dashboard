<template>
  <v-container>
    <v-row>
      <!-- breadcrumbs -->
      <v-col cols="6" md="2" order-md="first">
        <v-btn v-if="!!backTo && !!backText" :to="backTo" text nuxt exact>
          <v-icon>mdi-chevron-left</v-icon>{{ backText }}
        </v-btn>
      </v-col>

      <!-- title -->
      <v-col cols="12" md="8" order="first">
        <h2 class="text-center">
          {{ title }}
        </h2>
      </v-col>

      <!-- actions -->
      <v-col cols="6" md="2" align="right">
        <slot name="actions"></slot>
      </v-col>
    </v-row>
  </v-container>
</template>
o

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
