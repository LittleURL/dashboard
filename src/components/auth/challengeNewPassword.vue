<template>
  <div>
    <v-card>
      <v-card-title>{{ $t('auth.challenge.newPassword') }}</v-card-title>
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

    <auth-password-policy class="mt-4" />
  </div>
</template>

<script lang="ts">
import { Auth, CognitoUser } from '@aws-amplify/auth'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import AuthPasswordPolicy from './passwordPolicy.vue'
import { authErrorAlert } from '~/helpers'
import { AuthValidator } from '~/types'

type Data = {
  loading: boolean
  password?: string
  passwordConfirm?: string
  validationRules: typeof AuthValidator
}

export default {
  name: 'ChallengeNewPassword',

  components: { ValidationObserver, ValidationProvider, AuthPasswordPolicy },

  props: {
    user: { type: CognitoUser, default: undefined },
  },

  data: (): Data => ({
    loading: false,
    password: undefined,
    passwordConfirm: undefined,
    validationRules: AuthValidator,
  }),

  methods: {
    async submit() {
      this.loading = true

      try {
        await Auth.completeNewPassword(this.user, this.password)
        this.$router.push('/')
      } catch (err) {
        this.$store.commit('addAlert', authErrorAlert(err))
      }

      this.loading = false
    },
  },
}
</script>
