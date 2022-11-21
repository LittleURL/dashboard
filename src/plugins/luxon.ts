import { Plugin } from '@nuxt/types'
import { DateTime } from 'luxon'
import Vue from 'vue'

const luxonPlugin: Plugin = () => {
  Vue.filter('luxonRelative', (isoString: string) => DateTime.fromISO(isoString).toRelative())
  Vue.filter('luxonLocaleFull', (isoString: string) => DateTime.fromISO(isoString).toLocaleString(DateTime.DATETIME_FULL))
}

export default luxonPlugin