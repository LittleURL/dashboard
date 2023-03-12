<template>
  <v-dialog v-model="show" max-width="600px" @click:outside="close()">
    <template #activator="{ on }">
      <v-btn icon color="primary" :title="$t('auth.invite')" v-on="on">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </template>

    <v-card :loading="loading" class="mx-auto mb-3 pb-0">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-card-title class="d-flex justify-center text-h5">
          {{ $t(`auth.invite`) }}
        </v-card-title>

        <!-- role selector -->
        <v-card-text>
          <v-form>
            <!-- Email -->
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

            <!-- Role -->
            <validation-provider
              v-slot="{ errors, valid }"
              :name="$t('auth.role')"
              :rules="validationRules.role"
            >
              <v-select
                v-model="role"
                :counter="validationRules.role.max"
                :required="validationRules.role.required"
                :label="$t('auth.role')"
                :items="userRoles"
                :error-messages="errors"
                :success="valid"
                outlined
              />
            </validation-provider>
          </v-form>
        </v-card-text>

        <!-- buttons -->
        <v-card-actions>
          <v-btn color="primary" :loading="loading" @click="submit">
            {{ $t('submit') }}
          </v-btn>
          <v-spacer />
          <v-btn text @click="close()">
            {{ $t('cancel') }}
          </v-btn>
        </v-card-actions>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  setInteractionMode,
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate'
import { successAlert } from '~/helpers'
import { UserRoles, UserInviteValidator } from '~/types'

setInteractionMode('eager')

type Data = {
  show: boolean
  loading: boolean
  role: UserRoles
  email?: string
  validationRules: typeof UserInviteValidator
}

export default {
  name: 'InviteUser',
  components: { ValidationObserver, ValidationProvider },

  filters: {
    upperFirst: (value: string) => {
      const firstChar = value.charAt(0).toUpperCase()
      return firstChar + value.slice(1)
    },
  },

  data(): Data {
    return {
      show: false,
      loading: false,
      role: UserRoles.Nobody,
      email: undefined,
      validationRules: UserInviteValidator,
    }
  },

  computed: {
    userRoles() {
      return Object.values(UserRoles).map((role) => {
        const firstChar = role.charAt(0).toUpperCase()
        return {
          text: firstChar + role.slice(1),
          value: role,
        }
      })
    },
  },

  methods: {
    close() {
      this.role = UserRoles.Nobody
      this.email = undefined
      this.show = false
    },

    async submit() {
      this.$refs.observer!.validate()
      this.loading = true
      const { domainId } = this.$route.params

      try {
        await this.$axios.$post(`/domains/${domainId}/users/invite`, {
          email: this.email,
          role: this.role,
        })
      } catch (err) {
        this.loading = false
        return
      }

      // success
      this.$store.commit(
        'addAlert',
        successAlert(this.$t('auth.inviteSuccess'))
      )
      this.loading = false
      this.close()
    },
  },
}
</script>
