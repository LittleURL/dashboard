<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card>
      <!-- message -->
      <v-card-title class="d-flex justify-center text-h5">
          {{ message || $t('deleteConfirm') }}
      </v-card-title>

      <!-- item name -->
      <v-card-text v-if="!!name" class="d-flex justify-center pb-2">
        <code>{{ name }}</code>
      </v-card-text>

      <!-- buttons -->
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn color="error" :loading="loading" @click="confirm">
          {{ $t('delete') }}
        </v-btn>
        <v-spacer />
      </v-card-actions>

      <!-- details -->
      <div v-if="!!item" class="d-flex justify-center">
        <v-btn
          text
          class="info--text text-lowercase detail-button"
          @click="toggleDetails"
        >
          Details
          <v-icon>mdi-chevron-{{ showDetails ? 'up' : 'down' }}</v-icon>
        </v-btn>
      </div>
      <code-block v-if="showDetails">
        <pre class="language-json">{{ JSON.stringify(item, null, 2) }}</pre>
      </code-block>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import CodeBlock from '~/components/codeBlock.vue'

type Data = {
  show: boolean
  showDetails: boolean
  loading: boolean
  name: string | undefined
  item: undefined | string | Object
}

export default {
  name: 'DeleteDialogue',

  components: { CodeBlock },

  props: {
    message: { type: String, default: undefined }
  },

  emits: ['confirm'],

  // expose: ['item',  'open', 'close'],

  data: (): Data => ({
    show: false,
    showDetails: false,
    item: undefined,
    name: undefined,
    loading: false,
  }),

  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails
    },

    detailsTarget() {
      return this.$el.querySelector('pre')
    },

    confirm() {
      this.$emit('confirm', this.item)
    },

    close() {
      this.item = undefined
      this.name = undefined
      this.show = false
      this.showDetails = false
      this.loading = false
    },

    open(item: string | Object, name?: string) {
      this.item = item
      this.name = name
      this.show = true
    },

    pending() {
      this.loading = true
    },
  },
}
</script>

<style lang="scss">
.v-dialog {
  overflow-y: visible;
}
.detail-button {
  z-index: 10;
  position: absolute;
}
</style>
