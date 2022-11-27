<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <!-- header -->
    <page-header
      :back-text="String($t('domains.domains'))"
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
        :items-per-page.sync="perPage"
        :loading="$fetchState.pending"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :footer-props="{ 'items-per-page-options': [10, 30, 50] }"
      >
        <!-- search  -->
        <template #top>
          <v-card-actions>
            <v-text-field
              v-model="prefix"
              outlined
              :label="$t('searchPrefix')"
              clearable
              autofocus
              @change="$fetch"
            />
          </v-card-actions>
        </template>

        <!-- updated -->
        <template #item.updated_at="{ item }">
          <relative-timestamp :ts="item.updated_at" />
        </template>

        <!-- item actions -->
        <template #item.actions="{ item }">
          <NuxtLink :to="`${$route.path}/${linkId(item)}/edit`">
            <v-icon>mdi-pencil</v-icon>
          </NuxtLink>
          <v-icon @click="$refs.confirmDelete.open(item, item.uri)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- dialogues -->
    <delete-dialogue ref="confirmDelete" @confirm="deleteLink" />
  </div>
</template>

<script lang="ts">
import { DateTime } from 'luxon'
import { DataTableHeader } from 'vuetify'
import DeleteDialogue from '~/components/deleteDialogue.vue'
import PageHeader from '~/components/pageHeader.vue'
import RelativeTimestamp from '~/components/relativeTimestamp.vue'
import { linkId, successAlert } from '~/helpers'
import { Domain, Link } from '~/types'
import { AlertType } from '~/types/alert'

type Data = {
  headers: DataTableHeader[]
  links: Link[]
  prefix: string | undefined
  sortBy: keyof Link
  sortDesc: boolean
  perPage: number
  deleteDialogue: boolean
}

export default {
  name: 'LinksList',
  components: { PageHeader, DeleteDialogue, RelativeTimestamp },

  filters: {
    timeRelative: (isoString: string) =>
      DateTime.fromISO(isoString).toRelative(),
    timeLocaleFull: (isoString: string) =>
      DateTime.fromISO(isoString).toLocaleString(DateTime.DATETIME_FULL),
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
      links: [],
      prefix: undefined,
      sortBy: 'uri',
      sortDesc: false,
      perPage: 10,
      deleteDialogue: false,
    }
  },

  fetchDelay: 500,
  async fetch() {
    const { domainId } = this.$route.params
    this.links = await this.$axios.$get(`/domains/${domainId}/links`, {
      params: {
        ...(this.prefix && { prefix: encodeURIComponent(this.prefix) }),
        ...(this.sortBy && { sortBy: this.sortBy }),
        ...(this.sortDesc && { sortDesc: this.sortDesc }),
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
    sortBy: '$fetch',
    sortDesc: '$fetch',
  },

  methods: {
    linkId,

    async deleteLink(link: Link) {
      const { domainId } = this.$route.params
      this.$refs.confirmDelete.pending()

      try {
        await this.$axios.$delete(`/domains/${domainId}/links/${linkId(link)}`)
        this.$store.commit('addAlert', successAlert(this.$t('links.deleteSuccess')))
        this.$fetch()
      } finally {
        this.$refs.confirmDelete.close()
      }
    },
  },
}
</script>
