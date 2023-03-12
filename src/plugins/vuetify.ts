import { Plugin } from '@nuxt/types'
import { getCookie } from 'tiny-cookie'

const vuetifyPlugin: Plugin = (context) => {
  const cookie = getCookie('littleurl-darkmode')
  const cssPrefers = window.matchMedia("(prefers-color-scheme: dark)").matches
  context.$vuetify.theme.dark = cookie !== null ? cookie === 'true' : cssPrefers
}

export default vuetifyPlugin