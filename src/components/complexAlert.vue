<template>
  <v-dialog v-model="showDetails">
    <!-- alert -->
    <template #activator="{ on, attrs }">
      <v-alert
        :type="alert.type"
        :dismissible="alert.dismissible ?? true"
        transition="slide-x-reverse-transition"
        @input="dismiss"
      >
        {{ alert.text }}
        <template v-if="!!alert.details" #append>
          <v-btn icon :title="$t('details')" v-bind="attrs" v-on="on">
            <v-icon>mdi-code-braces-box</v-icon>
          </v-btn>
        </template>

        <v-progress-linear
          v-if="alert.timeout !== undefined"
          v-model="timeoutProgress"
          absolute
          bottom
          color="white"
          height="8"
        />
      </v-alert>
    </template>

    <!-- details -->
    <v-container>
      <v-card :class="alert.type">
        <v-card-title class="white--text">
          {{ alert.text }}
          <v-spacer />
          <v-btn icon @click="showDetails = false">
            <v-icon color="white">mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <code-block>
            <pre class="language-json">{{
              typeof alert.details === 'string'
                ? alert.details
                : JSON.stringify(alert.details, null, 2)
            }}</pre>
          </code-block>
        </v-card-text>
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import { PropOptions } from 'vue'
import { Alert } from '~/types/alert'

export default {
  name: 'ComplexAlert',

  props: {
    alert: { type: Object, default: undefined } as PropOptions<Alert>,
  },

  data: () => ({
    showDetails: false,
    timeoutProgress: 100,
    currentTimeout: 0,
    interval: 0,
  }),

  mounted() {
    this.setTimeout()
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  methods: {
    dismiss() {
      this.$store.commit('deleteAlert', this.alert?.id)
    },

    setTimeout() {
      clearInterval(this.interval)

      if (this.alert?.timeout === undefined) {
        return
      }

      const intervalStep = 100
      this.interval = setInterval(() => {
        // set current progress, unless details are open
        if (!this.showDetails) {
          this.currentTimeout += intervalStep
        }

        // update progress bar
        const percentage = (this.currentTimeout / this.alert.timeout) * 100
        this.timeoutProgress = 100 - percentage

        // dismiss alert when completed
        if (this.currentTimeout >= this.alert.timeout) {
          this.dismiss()
        }
      }, intervalStep)
    },
  },
}
</script>
