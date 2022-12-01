<template>
  <v-card :loading="loading" outlined>
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
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import UserRole from '~/components/userRole.vue'
import { Domain, DomainValidator } from '~/types'
import { successAlert } from '~/helpers'

type Data = {
  headers: DataTableHeader[]
  deleteDialogue: boolean
  loading: boolean
  domain?: Domain
  validationRules: typeof DomainValidator
}

export default {
  name: 'DomainEdit',
  components: { UserRole, ValidationObserver, ValidationProvider },

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
      loading: false,
      domain: undefined,
      validationRules: DomainValidator,
    }
  },

  fetchDelay: 500,
  async fetch() {
    this.loading = true
    const { domainId } = this.$route.params
    this.domain = await this.$axios.$get(`/domains/${domainId}`)
    this.loading = false
  },

  methods: {
    async submit() {
      this.$refs.observer!.validate()
      this.loading = true
      const { domainId } = this.$route.params

      try {
        await this.$axios.$patch(`/domains/${domainId}`, {
          ...(this.domain.description && { description: this.domain.description }),
          ...(this.domain.default_target && { default_target: this.domain.default_target })
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
  },
}
</script>
