<template>
  <div>
    <!-- header -->
    <page-header
      :title="String($t('links.create'))"
      :back-text="String($t('domains.links'))"
      :back-to="`/${currentDomain.id}/links`"
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
              :rules="{ required:true, max:1024, regex: /^(\/?[\w\-]+)+$/ }"
            >
              <v-text-field
                v-model="link.uri"
                :counter="1024"
                :label="$t('links.uri')"
                :error-messages="errors"
                :success="valid"
                placeholder="google"
                required
              />
            </validation-provider>

            <!-- Target -->
            <validation-provider
              v-slot="{ errors, valid }"
              :name="$t('links.target')"
              rules="required|max:2048"
            >
              <v-text-field
                v-model="link.target"
                :counter="2048"
                :label="$t('links.target')"
                :error-messages="errors"
                :success="valid"
                placeholder="https://google.com"
                required
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
import { Domain } from '~/types'

setInteractionMode('eager')

type Data = {
  link: {
    uri?: string
    target?: string
  }
  invalid: boolean
  loading: boolean
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
      invalid: true,
      link: {},
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
