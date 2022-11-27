import { Plugin } from '@nuxt/types'
import { AlertType } from '~/types/alert'

const axiosPlugin: Plugin = ({ $axios, store, i18n }) => {
  $axios.onError((err) => {
    const res = err.response.data
    store.commit('addAlert', {
      type: AlertType.Error,
      text: i18n.t('apiError', { code: res.code, message: res.message }),
      details: res.details,
      timeout: 8000
    })
  })
}

export default axiosPlugin
