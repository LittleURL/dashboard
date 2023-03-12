<template>
  <div>
    <!-- header -->
    <page-header
      :title="String($t('domains.edit'))"
      :back-text="String($t('domains.links'))"
      :back-to="`/${$route.params.domainId}`"
    />

    <!-- content -->
    <v-container>
      <v-row>
        <v-col cols="12" xl="6">
          <v-card :loading="loading">
            <v-card-title>
              {{ domain?.domain }}
              <v-spacer />
              <user-role :role="domain?.user_role" />
            </v-card-title>

            <validation-observer ref="observer" v-slot="{ invalid }">
              <v-card-text v-if="domain !== undefined">
                <v-form @submit.prevent="submit">
                  <!-- Description -->
                  <validation-provider
                    v-slot="{ errors, valid }"
                    :name="$t('domains.description')"
                    :rules="validationRules.description"
                  >
                    <v-text-field
                      v-model="domain.description"
                      :counter="validationRules.description.max"
                      :required="validationRules.description.required"
                      :label="$t('domains.description')"
                      :error-messages="errors"
                      :success="valid"
                      outlined
                    />
                  </validation-provider>

                  <!-- Default target -->
                  <validation-provider
                    v-slot="{ errors, valid }"
                    :name="$t('domains.defaultTarget')"
                    :rules="validationRules.default_target"
                  >
                    <v-text-field
                      v-model="domain.default_target"
                      :counter="validationRules.default_target.max"
                      :required="validationRules.default_target.required"
                      :label="$t('domains.defaultTarget')"
                      :error-messages="errors"
                      :success="valid"
                      outlined
                    />
                  </validation-provider>
                </v-form>
              </v-card-text>

              <!-- form actions -->
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  :disabled="invalid"
                  :loading="loading"
                  @click="submit"
                >
                  {{ $t('save') }}
                </v-btn>
              </v-card-actions>
            </validation-observer>
          </v-card>
        </v-col>

        <v-col cols="12" xl="6">
          <v-card :loading="loadingUsers">
            <v-card-title>
              {{ $t('auth.users') }}
              <v-spacer />
              <invite-user />
            </v-card-title>
            <v-list>
              <!-- user name -->
              <v-list-item v-for="user in users" :key="user.id">
                <v-avatar size="32">
                  <v-img :src="user.picture" :alt="`@${user.nickname}`">
                    <template #placeholder>
                      <v-icon size="32">mdi-account</v-icon>
                    </template>
                  </v-img>
                </v-avatar>
                <span class="subtitle-1 ml-2">{{ user.nickname }}</span>

                <!-- role -->
                <v-spacer />
                <user-role
                  :role="user.role"
                  :user-id="user.id"
                  :disabled="user.id === currentUserId"
                  editable
                  @edited="loadUsers"
                />
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Auth } from 'aws-amplify'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { DataTableHeader } from 'vuetify'
import UserRole from '~/components/auth/userRole.vue'
import InviteUser from '~/components/auth/inviteUser.vue'
import { successAlert } from '~/helpers'
import { Domain, DomainValidator, User, UserRoles } from '~/types'

type Data = {
  headers: DataTableHeader[]
  deleteDialogue: boolean
  validationRules: typeof DomainValidator
  currentUserId?: string

  loading: boolean
  domain?: Domain

  loadingUsers: boolean
  users?: User[]
  updatingUser: {
    [key: string]: string
  }
}

export default {
  name: 'DomainEdit',
  components: {
    UserRole,
    InviteUser,
    ValidationObserver,
    ValidationProvider,
  },

  data(): Data {
    return {
      headers: [
        {
          text: this.$t('links.uri') as string,
          value: 'uri',
          sortable: true,
          align: 'start',
        },
        {
          text: this.$t('links.updatedAt') as string,
          value: 'updated_at',
          sortable: true,
        },
        {
          text: this.$t('actions') as string,
          value: 'actions',
          sortable: false,
        },
      ],
      deleteDialogue: false,
      validationRules: DomainValidator,
      currentUserId: undefined,

      loading: true,
      domain: undefined,

      loadingUsers: true,
      users: undefined,
      updatingUser: {},
    }
  },

  fetchDelay: 500,
  async fetch() {
    this.loadUsers()

    this.loading = true
    const { domainId } = this.$route.params
    this.domain = await this.$axios.$get(`/domains/${domainId}`)
    this.loading = false
  },

  computed: {
    userRoles: () => {
      return Object.keys(UserRoles).map((role, index) => ({
        text: role,
        value: Object.values(UserRoles)[index],
      }))
    },
  },

  async mounted() {
    const user = await Auth.currentAuthenticatedUser()
    this.currentUserId = user.attributes.sub
  },

  methods: {
    async submit() {
      this.$refs.observer!.validate()
      this.loading = true
      const { domainId } = this.$route.params

      try {
        await this.$axios.$patch(`/domains/${domainId}`, {
          ...(this.domain.description && {
            description: this.domain.description,
          }),
          ...(this.domain.default_target && {
            default_target: this.domain.default_target,
          }),
        })
      } catch (err) {
        this.loading = false
        return
      }

      // success
      this.$store.commit(
        'addAlert',
        successAlert(this.$t('links.createSuccess'))
      )
      await this.$router.push(`/${this.currentDomain.id}`)
    },

    async loadUsers() {
      this.loadingUsers = true
      const { domainId } = this.$route.params
      this.users = await this.$axios.$get(`/domains/${domainId}/users`)
      this.loadingUsers = false
    },
  },
}
</script>
