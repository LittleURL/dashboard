<template>
  <div>
    <!-- header -->
    <page-header :title="String($t('auth.forgotPassword'))" />

    <!-- email -->
    <v-card v-if="stage === 'EMAIL'">
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            :label="$t('auth.email')"
            outlined
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="$emit('cancel')">
          {{ $t('cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="email === undefined"
          :loading="loading"
          @click="start"
        >
          {{ $t('submit') }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- code -->
    <v-card v-else-if="stage === 'CODE'">
      <v-card-title>{{ $t('auth.codeSent') }}</v-card-title>
      <v-card-text>
        <v-form>
          <v-otp-input
            v-model="code"
            length="6"
            :label="$t('auth.code')"
            outlined
            required
            @finish="saveCode"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="$emit('cancel')">
          {{ $t('cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="email === undefined"
          :loading="loading"
          @click="saveCode"
        >
          {{ $t('submit') }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- password -->
    <v-card v-else-if="stage === 'PASSWORD'" class="mb-4">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-card-text>
          <v-form @submit.prevent="submit">
            <v-row>
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
        <v-card-actions>
          <v-btn text @click="$emit('cancel')">
            {{ $t('cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="invalid"
            :loading="loading"
            @click="submit"
          >
            {{ $t('submit') }}
          </v-btn>
        </v-card-actions>
      </validation-observer>
    </v-card>

    <auth-password-policy v-if="stage === 'PASSWORD'" />
  </div>
</template>

<script lang="ts">
import { Auth } from '@aws-amplify/auth'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import AuthPasswordPolicy from '~/components/auth/passwordPolicy.vue'
import PageHeader from '~/components/pageHeader.vue'
import { successAlert } from '~/helpers'
import { AuthValidator } from '~/types'
import { AlertType } from '~/types/alert'

type Data = {
  loading: boolean
  stage: 'EMAIL' | 'CODE' | 'PASSWORD'
  email?: string
  code?: string
  password?: string
  passwordConfirm?: string
  validationRules: typeof AuthValidator
}

export default {
  name: 'ForgotPassword',

  components: {
    PageHeader,
    ValidationObserver,
    ValidationProvider,
    AuthPasswordPolicy,
  },

  data: (): Data => ({
    loading: false,
    stage: 'EMAIL',
    email: undefined,
    code: undefined,
    password: undefined,
    passwordConfirm: undefined,
    validationRules: AuthValidator,
  }),

  methods: {
    async start() {
      this.loading = true

      try {
        await Auth.forgotPassword(this.email)
        this.stage = 'CODE'
      } catch (err) {
        this.$store.commit('addAlert', {
          type: AlertType.Error,
          text: `Auth Error: ${err.name}`,
          details: err,
          timeout: 5000,
        })
      }

      this.loading = false
    },

    saveCode() {
      this.stage = 'PASSWORD'
    },

    async submit() {
      this.loading = true

      try {
        await Auth.forgotPasswordSubmit(this.email, this.code, this.password)
        this.$store.commit('addAlert', successAlert(this.$t('auth.passwordChanged')))
        this.$emit('cancel')
      } catch (err) {
        this.$store.commit('addAlert', {
          type: AlertType.Error,
          text: `Auth Error: ${err.name}`,
          details: err,
          timeout: 5000,
        })
        this.stage = 'CODE'
      }

      this.loading = false
    },
  },
}
</script>
