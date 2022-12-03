<template>
  <v-card v-if="challengeName === undefined">
    <v-card-title>
      <v-tabs v-model="tab" grow>
        <v-tab key="login">{{ $t('auth.login') }}</v-tab>
        <v-tab key="register">{{ $t('auth.register') }}</v-tab>
      </v-tabs>
    </v-card-title>

    <v-card-text>
      <v-tabs-items v-model="tab">
        <!-- login -->
        <v-tab-item key="login">
          <auth-login
            :email="email"
            @challenge="loginChallenge"
            @emailNotConfirmed="emailNotConfirmed"
            @forgotPassword="forgotPassword"
          />
        </v-tab-item>

        <!-- register -->
        <v-tab-item key="register">
          <auth-register @success="registerSuccess" />
          <v-divider class="mt-4" />
          <auth-password-policy />
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>

  <challenge-software-mfa
    v-else-if="challengeName === 'SOFTWARE_TOKEN_MFA'"
    :user="user"
    @cancel="cancelChallenge"
  />

  <challenge-new-password
    v-else-if="challengeName === 'NEW_PASSWORD_REQUIRED'"
    :user="user"
    @cancel="cancelChallenge"
  />

  <challenge-confirm-email
    v-else-if="challengeName === 'CONFIRM_EMAIL'"
    :email="email"
    @cancel="cancelChallenge"
  />

  <forgot-password
    v-else-if="challengeName === 'FORGOT_PASSWORD'"
    @cancel="cancelChallenge"
  />
</template>

<script lang="ts">
import { ChallengeName, CognitoUser } from 'amazon-cognito-identity-js'
import ChallengeConfirmEmail from '~/components/auth/challengeConfirmEmail.vue'
import ChallengeNewPassword from '~/components/auth/challengeNewPassword.vue'
import ChallengeSoftwareMfa from '~/components/auth/challengeSoftwareMfa.vue'
import ForgotPassword from '~/components/auth/forgotPassword.vue'
import AuthLogin from '~/components/auth/login.vue'
import AuthPasswordPolicy from '~/components/auth/passwordPolicy.vue'
import AuthRegister from '~/components/auth/register.vue'
import { AlertType } from '~/types/alert'

type Data = {
  tab: 'login' | 'register'
  email?: string
  user?: CognitoUser
  challengeName?: ChallengeName | 'CONFIRM_EMAIL' | 'FORGOT_PASSWORD'
}

export default {
  name: 'LoginPage',

  components: {
    AuthLogin,
    AuthRegister,
    ForgotPassword,
    AuthPasswordPolicy,
    ChallengeNewPassword,
    ChallengeConfirmEmail,
    ChallengeSoftwareMfa,
  },

  layout: 'auth',

  data: (): Data => ({
    tab: 'login',
    email: undefined,
    user: undefined,
    challengeName: undefined,
  }),

  methods: {
    registerSuccess(email: string) {
      this.email = email
      this.tab = 'login'
    },

    loginChallenge(user: CognitoUser) {
      this.challengeName = user.challengeName
      this.user = user
    },

    cancelChallenge() {
      this.challengeName = undefined
      this.email = undefined
      this.user = undefined
    },

    emailNotConfirmed(email: String) {
      this.$store.commit('addAlert', {
        type: AlertType.Warning,
        text: this.$t('auth.emailNotConfirmed'),
      })

      this.challengeName = 'CONFIRM_EMAIL'
      this.email = email
    },

    forgotPassword() {
      this.challengeName = 'FORGOT_PASSWORD'
    },
  },
}
</script>
