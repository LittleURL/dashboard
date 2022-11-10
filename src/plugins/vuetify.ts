import { Plugin } from '@nuxt/types'

const vuetifyPlugin: Plugin = (context) => {
  const cookie = context.$cookies.get('vuetify-dark-theme') || false
  context.$vuetify.theme.dark = cookie
}

export default vuetifyPlugin