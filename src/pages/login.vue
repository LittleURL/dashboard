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

  <challenge-new-password
    v-else-if="challengeName === 'NEW_PASSWORD_REQUIRED'"
    :user="user"
  />

  <challenge-confirm-email
    v-else-if="challengeName === 'CONFIRM_EMAIL'"
    :email="email"
  />
</template>

<script lang="ts">
import { CognitoUser, ChallengeName } from 'amazon-cognito-identity-js'
import AuthLogin from '~/components/auth/login.vue'
import AuthRegister from '~/components/auth/register.vue'
import AuthPasswordPolicy from '~/components/auth/passwordPolicy.vue'
import ChallengeNewPassword from '~/components/auth/challengeNewPassword.vue'
import ChallengeConfirmEmail from '~/components/auth/challengeConfirmEmail.vue'
import { AlertType } from '~/types/alert'

type Data = {
  tab: 'login' | 'register'
  email?: string
  challengeName?: ChallengeName | 'CONFIRM_EMAIL'
  user?: CognitoUser
}

export default {
  name: 'LoginPage',

  components: {
    AuthLogin,
    AuthRegister,
    AuthPasswordPolicy,
    ChallengeNewPassword,
    ChallengeConfirmEmail,
  },

  layout: 'auth',

  data: (): Data => ({
    tab: 'login',
    email: undefined,
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

    emailNotConfirmed(email: String) {
      this.$store.commit('addAlert', {
        type: AlertType.Warning,
        text: this.$t('auth.emailNotConfirmed'),
      })

      this.challengeName = 'CONFIRM_EMAIL'
      this.email = email
    },
  },
}
</script>
