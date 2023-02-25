<template>
  <div>
    <!-- header -->
    <page-header
      :title="String($t('links.create'))"
      :back-text="String($t('domains.links'))"
      :back-to="{ name: 'domainId-links', params: { domainId: currentDomain.id }}"
    />

    <!-- content -->
    <v-card class="mx-auto mb-3 pb-0" outlined>
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
      >
        <v-card-text>
          <v-form @submit.prevent="submit">
            <!-- URI -->
            <validation-provider
              v-slot="{ errors, valid }"
              :name="$t('links.uri')"
              :rules="validationRules.uri"
            >
              <v-text-field
                v-model="link.uri"
                :counter="validationRules.uri.max"
                :required="validationRules.uri.required"
                :label="$t('links.uri')"
                :error-messages="errors"
                :success="valid"
                placeholder="google"
              />
            </validation-provider>

            <!-- Target -->
            <validation-provider
              v-slot="{ errors, valid }"
              :name="$t('links.target')"
              :rules="validationRules.target"
            >
              <v-text-field
                v-model="link.target"
                :counter="validationRules.target.max"
                :required="validationRules.target.required"
                :label="$t('links.target')"
                :error-messages="errors"
                :success="valid"
                placeholder="https://google.com"
              />
            </validation-provider>

            

            <!-- Description -->
            <validation-provider
              v-slot="{ errors, valid }"
              :name="$t('links.description')"
              :rules="validationRules.description"
            >
              <v-text-field
                v-model="link.description"
                :counter="validationRules.description.max"
                :required="validationRules.description.required"
                :label="$t('links.description')"
                :error-messages="errors"
                :success="valid"
              />
            </validation-provider>
          </v-form>
        </v-card-text>
        <v-card-actions>
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

    <!-- example -->
    <v-card v-if="!!link.uri && !!link.target" class="mx-auto mb-3 pb-0" outlined>
      <v-card-text>{{ $t('example') }}</v-card-text>
      <v-card-text>
        <a :href="link.target">
          https://{{ currentDomain.domain }}{{ link.uri | uriPrefix }}
        </a>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
setInteractionMode, ValidationObserver,
ValidationProvider
} from 'vee-validate'
import PageHeader from '~/components/pageHeader.vue'
import { prefixString, successAlert } from '~/helpers'
import { Domain, Link, LinkValidator } from '~/types'

setInteractionMode('eager')

type Data = {
  link: Partial<Link>
  loading: boolean
  validationRules: typeof LinkValidator
}

export default {
  name: 'CreateLink',
  components: { PageHeader, ValidationObserver, ValidationProvider },

  filters: {
    uriPrefix: (value: string) => prefixString('/', value)
  },

  data(): Data {
    return {
      loading: false,
      link: {},
      validationRules: LinkValidator
    }
  },

  computed: {
    currentDomain(): Domain | undefined {
      const { domainId } = this.$route.params
      return this.$store.getters['domains/current'](domainId)
    },
  },

  methods: {
    async submit() {
      this.$refs.observer!.validate()
      this.loading = true
      const { domainId } = this.$route.params

      try {
        await this.$axios.$post(`/domains/${domainId}/links`, {
          ...this.link,
          uri: prefixString('/', this.link.uri),
        })
      } catch (err) {
        this.loading = false
        return
      }

      // success
      this.$store.commit('addAlert', successAlert(this.$t('links.createSuccess')))
      await this.$router.push(`/${this.currentDomain.id}`)
    },
  },
}
</script>
