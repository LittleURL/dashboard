<template>
  <v-sheet
    class="code-block"
    dir="ltr"
    outlined
    :max-width="maxWidth"
    min-with="1"
  >
    <!-- copy button -->
    <v-btn
      class="v-btn--copy mr-n2 mt-n2"
      style="background-color: inherit"
      absolute
      icon
      right
      top
      @click="copy"
    >
      <v-fade-transition hide-on-leave>
        <v-icon :key="String(copyClicked)" color="grey">
          {{ copyClicked ? 'complete' : 'mdi-content-copy' }}
        </v-icon>
      </v-fade-transition>
    </v-btn>

    <!-- code -->
    <div class="overflow-x-auto">
      <slot></slot>
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: 'CodeBlock',

  props: {
    maxWidth: { type: Number, default: undefined },
  },

  data: () => ({
    copyClicked: false,
    copyWait: 2000,
  }),

  computed: {
    isDark() {
      return this.$vuetify.isDark()
    },
  },

  methods: {
    target() {
      return this.$el.querySelector('pre')
    },

    async copy() {
      if (typeof window === 'undefined') return
      const el = this.target()
      el.setAttribute('contenteditable', 'true')
      el.focus()
      document.execCommand('selectAll', false, null)
      document.execCommand('copy')
      el.removeAttribute('contenteditable')
      this.copyClicked = true
      await Promise.resolve((resolve) => setTimeout(resolve, this.copyWait))
      this.copyClicked = false
    },
  },
}
</script>

<style lang="sass">
.v-sheet.code-block
  position: relative
  padding: 12px 50px 12px 16px
  &:not(:hover) .v-btn--copy .v-icon
    opacity: .4
</style>
