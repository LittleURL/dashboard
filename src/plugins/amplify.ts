import { Amplify, Hub } from 'aws-amplify'
import { Plugin } from '@nuxt/types'
import { AlertType } from '~/types/alert'

Amplify.configure({
  Auth: {
    userPoolId: 'us-east-1_wWJ25Mayx',
    userPoolWebClientId: '24jot6kfr6648ihq4dtqhum1rb',
    region: 'us-east-1',
    // identityPoolId: config['aws_cognito_identity_pool_id'],
    // identityPoolRegion: config['aws_cognito_region'],
    mandatorySignIn: true,
    signUpVerificationMethod: 'code',
  },
})

const amplifyPlugin: Plugin = ({ store, isDev }) => {
  if (isDev) {
    Hub.listen('auth', (event) => {
      store.commit('addAlert', {
        type: AlertType.Info,
        text: `Amplify Auth: ${event.payload.event}`,
        details: event,
      })
    })
  }
}

export default amplifyPlugin
