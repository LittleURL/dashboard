<template>
  <div>
    <!-- header -->
    <page-header :title="String($t('auth.editProfile'))" />

    <!-- email -->
    <v-card class="mb-4" :loading="loading">
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            :label="$t('auth.email')"
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
    </v-card>

    <!-- password policy -->
    <auth-password-policy
      v-if="!!oldPassword || !!password || !!passwordConfirm"
    />
  </div>
</template>

<script lang="ts">
import { Auth } from 'aws-amplify'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import AuthPasswordPolicy from '~/components/auth/passwordPolicy.vue'
import { successAlert } from '~/helpers'
import { AuthValidator } from '~/types'
import { AlertType } from '~/types/alert'

type Data = {
  loading: boolean
  changePasswordLoading: boolean
  email?: string
  oldPassword?: string
  password?: string
  passwordConfirm?: string
  validationRules: typeof AuthValidator
}

export default {
  name: 'ProfilePage',

  components: {
    ValidationObserver,
    ValidationProvider,
    AuthPasswordPolicy,
  },

  data: (): Data => ({
    loading: false,
    changePasswordLoading: false,
    email: undefined,
    oldPassword: undefined,
    password: undefined,
    passwordConfirm: undefined,
    validationRules: AuthValidator,
  }),

  fetchDelay: 500,
  async fetch() {
    this.loading = true

    const user = await Auth.currentAuthenticatedUser()
    this.email = user.attributes.email

    this.loading = false
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
  },
}
</script>
