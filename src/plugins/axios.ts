import { Plugin } from '@nuxt/types'
import { Auth } from 'aws-amplify'
import { AlertType } from '~/types/alert'

const axiosPlugin: Plugin = ({ $axios, store, i18n }) => {
  // error alerts
  $axios.onError((err) => {
    const res = err.response.data
    store.commit('addAlert', {
      type: AlertType.Error,
      text: i18n.t('apiError', {
        code: res.code || err.code,
        message: res.message,
      }),
      details: res.details,
      timeout: 10000,
    })
  })

  // auth
  $axios.onRequest(async (config) => {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken()
    $axios.setToken(token, 'Bearer')
    return config
  })
}

export default axiosPlugin
