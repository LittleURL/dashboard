<template>
  <validation-observer ref="observer" v-slot="{ invalid }">
    <v-card-text>
      <v-form @submit.prevent="submit">
        <v-row>
          <!-- nickname -->
          <v-col>
            <validation-provider
              v-slot="{ errors, valid }"
              :name="$t('auth.nickname')"
              :rules="validationRules.nickname"
            >
              <v-text-field
                v-model="nickname"
                :counter="validationRules.nickname.max"
                :required="validationRules.nickname.required"
                :label="$t('auth.nickname')"
                :error-messages="errors"
                :success="valid"
                outlined
              />
            </validation-provider>
          </v-col>
        </v-row>
        <v-row>
          <!-- email -->
          <v-col cols="12" sm="6">
            <validation-provider
              v-slot="{ errors, valid }"
              :name="$t('auth.email')"
              :rules="validationRules.email"
            >
              <v-text-field
                v-model="email"
                :counter="validationRules.email.max"
                :required="validationRules.email.required"
                :label="$t('auth.email')"
                :error-messages="errors"
                :success="valid"
                outlined
              />
            </validation-provider>
          </v-col>

          <!-- emailConfirm -->
          <v-col cols="12" sm="6">
            <validation-provider
              v-slot="{ errors, valid }"
              :name="$t('auth.emailConfirm')"
              rules="required"
              vid="emailConfirm"
            >
              <v-text-field
                v-model="emailConfirm"
                :counter="validationRules.email.max"
                :required="validationRules.email.required"
                :label="$t('auth.emailConfirm')"
                :error-messages="errors"
                :success="valid"
                outlined
              />
            </validation-provider>
          </v-col>
        </v-row>

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
      <v-spacer />
      <v-btn
        color="primary"
        :disabled="invalid"
        :loading="loading"
        @click="register"
      >
        {{ $t('submit') }}
      </v-btn>
    </v-card-actions>
  </validation-observer>
</template>

<script lang="ts">
import { Auth } from 'aws-amplify'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { RegisterValidator } from '~/types'
import { AlertType } from '~/types/alert'

type Data = {
  loading: boolean
  email?: string
  emailConfirm?: string
  password?: string
  passwordConfirm?: string
  validationRules: typeof RegisterValidator
}

export default {
  name: 'AuthRegister',

  components: { ValidationObserver, ValidationProvider },

  data: (): Data => ({
    loading: false,
    email: undefined,
    emailConfirm: undefined,
    password: undefined,
    passwordConfirm: undefined,
    validationRules: RegisterValidator,
  }),

  methods: {
    async register() {
      this.$refs.observer!.validate()
      this.loading = true

      try {
        await Auth.signUp({
          username: this.email,
          password: this.password,
          attributes: {
            email: this.email,
            nickname: this.nickname
          },
        })

        this.$store.commit('addAlert', {
          type: AlertType.Warning,
          text: this.$t('auth.emailNotConfirmed'),
        })

        // go back to login
        this.emailConfirm = undefined
        this.password = undefined
        this.passwordConfirm = undefined
        this.$emit('success', this.email)
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
  },
}
</script>
