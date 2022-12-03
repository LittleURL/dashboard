<template>
  <div>
    <!-- header -->
    <page-header :title="String($t('auth.editProfile'))" />

    <!-- email -->
    <v-card class="mb-4" :loading="$fetchState.pending">
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            :label="$t('auth.email')"
            :placeholder="user?.attributes.email"
            required
            outlined
            disabled
          />
        </v-form>
      </v-card-text>
    </v-card>

    <!-- change password -->
    <v-card class="mx-auto mb-4" :loading="changePasswordLoading">
      <v-card-title>{{ $t('auth.changePassword') }}</v-card-title>

      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-card-text>
          <v-form @submit.prevent="changePassword">
            <v-row>
              <!-- old password -->
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors, valid }"
                  :name="$t('auth.oldPassword')"
                  rules="required"
                >
                  <v-text-field
                    v-model="oldPassword"
                    :label="$t('auth.oldPassword')"
                    :error-messages="errors"
                    :success="valid"
                    type="password"
                    outlined
                    required
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <v-row v-if="!!oldPassword">
              <!-- password -->
              <v-col cols="12" sm="6">
                <validation-provider
                  v-slot="{ errors, valid }"
                  :name="$t('auth.password')"
                  :rules="validationRules.password"
                >
                  <v-text-field
                    v-model="password"
                    :counter="validationRules.password.max"
                    :required="validationRules.password.required"
                    :label="$t('auth.password')"
                    :error-messages="errors"
                    :success="valid"
                    type="password"
                    outlined
                  />
                </validation-provider>
              </v-col>

              <!-- passwordConfirm -->
              <v-col cols="12" sm="6">
                <validation-provider
                  v-slot="{ errors, valid }"
                  :name="$t('auth.passwordConfirm')"
                  rules="required"
                  vid="passwordConfirm"
                >
                  <v-text-field
                    v-model="passwordConfirm"
                    :counter="validationRules.password.max"
                    :required="validationRules.password.required"
                    :label="$t('auth.passwordConfirm')"
                    :error-messages="errors"
                    :success="valid"
                    type="password"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <!-- form actions -->
        <v-card-actions v-if="!!oldPassword">
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="invalid"
            :loading="changePasswordLoading"
            @click="changePassword"
          >
            {{ $t('submit') }}
          </v-btn>
        </v-card-actions>
      </validation-observer>

      <!-- password policy -->
      <auth-password-policy
        v-if="!!oldPassword || !!password || !!passwordConfirm"
        flat
      />
    </v-card>

    <!-- MFA -->
    <v-card :loading="$fetchState.pending">
      <v-card-title>{{ $t('auth.mfa') }}</v-card-title>
      <v-card-text v-if="mfaMethod === 'NOMFA'">
        <!-- start mfa setup -->
        <v-btn
          v-if="!setupMfa"
          color="primary"
          block
          :loading="setupMfaLoading"
          @click="startMfaSetup"
        >
          {{ $t('auth.enableMfa') }}
        </v-btn>

        <!-- QR code -->
        <div v-if="setupMfa" class="my-4">
          <div class="d-flex justify-center">
            <v-img :src="setupMfaUrl" contain max-width="500" />
          </div>
          <h4 class="text-center">
            {{ $t('auth.mfaScanCode') }}
            <a
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
            >
              Google Authenticator
            </a>
          </h4>
        </div>

        <!-- MFA code -->
        <v-otp-input
          v-if="setupMfa"
          v-model="setupMfaCode"
          length="6"
          outlined
          :disabled="setupMfaLoading"
          @finish="finishMfaSetup"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Auth } from '@aws-amplify/auth'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import QRCode from 'qrcode'
import AuthPasswordPolicy from '~/components/auth/passwordPolicy.vue'
import { successAlert } from '~/helpers'
import { AuthValidator, MFAMethods, CognitoUserWithAttributes } from '~/types'
import { AlertType } from '~/types/alert'

type Data = {
  user?: CognitoUserWithAttributes
  email?: string

  // change password
  oldPassword?: string
  password?: string
  passwordConfirm?: string
  changePasswordLoading: boolean
  validationRules: typeof AuthValidator

  // mfa
  mfaMethod?: MFAMethods
  setupMfa: boolean
  setupMfaUrl?: string
  setupMfaCode?: string
  setupMfaLoading: boolean
}

export default {
  name: 'ProfilePage',

  components: {
    ValidationObserver,
    ValidationProvider,
    AuthPasswordPolicy,
  },

  data: (): Data => ({
    user: undefined,
    email: undefined,

    // change password
    oldPassword: undefined,
    password: undefined,
    passwordConfirm: undefined,
    changePasswordLoading: false,
    validationRules: AuthValidator,

    // mfa
    mfaMethod: undefined,
    setupMfa: false,
    setupMfaUrl: undefined,
    setupMfaCode: undefined,
    setupMfaLoading: false,
  }),

  fetchDelay: 500,
  async fetch() {
    // user attributes
    this.user = await Auth.currentAuthenticatedUser()
    this.email = this.user.attributes.email

    // other
    this.mfaMethod = await Auth.getPreferredMFA(this.user)
  },

  methods: {
    async changePassword() {
      this.changePasswordLoading = true

      try {
        const user = await Auth.currentAuthenticatedUser()
        await Auth.changePassword(user, this.oldPassword, this.password)
        this.$store.commit('addAlert', successAlert(this.$t('passwordChanged')))
      } catch (err) {
        this.$store.commit('addAlert', {
          type: AlertType.Error,
          text: `Auth Error: ${err.name}`,
          details: err,
          timeout: 5000,
        })
      }

      this.oldPassword = undefined
      this.password = undefined
      this.passwordConfirm = undefined
      this.changePasswordLoading = false
    },

    async startMfaSetup() {
      this.setupMfaLoading = true

      try {
        // start mfa flow
        const mfaToken = await Auth.setupTOTP(this.user)
        const { nickname } = this.user.attributes

        // generate QR code
        const issuer = 'littleurl.io'
        this.setupMfaUrl = await QRCode.toDataURL(
          `otpauth://totp/LittleURL:${nickname}?secret=${mfaToken}&issuer=${issuer}`,
          { type: 'image/webp', quality: 1 }
        )

        // proceed to next setup
        this.setupMfa = true
      } catch (err) {
        this.$store.commit('addAlert', {
          type: AlertType.Error,
          text: `Auth Error: ${err.name}`,
          details: err,
          timeout: 5000,
        })
      }

      this.setupMfaLoading = false
    },

    async finishMfaSetup() {
      this.setupMfaLoading = true

      try {
        await Auth.verifyTotpToken(this.user, this.setupMfaCode)
        await Auth.setPreferredMFA(this.user, 'TOTP')
        this.setupMfa = false
      } catch (err) {
        this.$store.commit('addAlert', {
          type: AlertType.Error,
          text: `Auth Error: ${err.name}`,
          details: err,
          timeout: 5000,
        })
      }

      this.setupMfaLoading = false
    },
  },
}
</script>
