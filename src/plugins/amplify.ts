import { Amplify, Hub } from 'aws-amplify'
import { Plugin } from '@nuxt/types'
import { AlertType } from '~/types/alert'

Amplify.configure({
  Auth: {
    userPoolId: process.env.cognitoPoolId,
    userPoolWebClientId: process.env.cognitoClientId,
    region: 'us-east-1',
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
