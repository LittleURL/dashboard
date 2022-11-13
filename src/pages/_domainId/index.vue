<template>
  <div>
    <!-- header -->
    <page-header
      :back-text="$t('domains.domains')"
      back-to="/"
      :title="currentDomain?.domain"
    >
      <template #actions>
        <!-- settings -->
        <v-btn
          :to="`/domains/${currentDomain.id}/settings`"
          icon
          :title="$t('domains.settings')"
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
        <!-- reload -->
        <v-btn
          icon
          :loading="$fetchState.pending"
          :title="$t('reload')"
          @click="$fetch"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <!-- create -->
        <v-btn
          icon
          :title="$t('links.create')"
          :to="`/${currentDomain.id}/create`"
          @click="$fetch"
        >
          <v-icon color="primary">mdi-plus</v-icon>
        </v-btn>
      </template>
    </page-header>

    <!-- content -->
    <v-card class="mx-auto mb-3 pb-0" outlined>
      <v-data-table
        :headers="headers"
        :items="links"
        :items-per-page="5"
        :loading="$fetchState.pending"
      >
        <template #top>
          <v-card-actions>
            <v-text-field
              v-model="prefix"
              outlined
              :label="$t('searchPrefix')"
              clearable
              autofocus
            ></v-text-field>
          </v-card-actions>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import PageHeader from '~/components/pageHeader.vue'
import { Domain, Link } from '~/types'
type Data = {
  headers: DataTableHeader[]
  links: Link[]
  prefix: string | undefined
}
export default {
  name: 'DomainShow',
  components: { PageHeader },

  data: (): Data => ({
    headers: [
      {
        text: 'Path',
        align: 'start',
        sortable: false,
        value: 'uri',
      },
      {
        text: 'Updated',
        value: 'updated_at',
      },
    ],
    links: [],
    prefix: undefined,
  }),

  fetchDelay: 500,
  async fetch() {
    const { domainId } = this.$route.params
    this.links = await this.$axios.$get(`/domains/${domainId}/links`, {
      params: {
        ...(this.prefix && { prefix: encodeURIComponent(this.prefix) }),
      },
    })
  },

  computed: {
    currentDomain(): Domain | undefined {
      const { domainId } = this.$route.params
      return this.$store.getters['domains/current'](domainId)
    },
  },

  watch: {
    prefix: '$fetch',
  },
}
</script>
