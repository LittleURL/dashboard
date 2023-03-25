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
          :to="`/${$route.params.domainId}/edit`"
          icon
          :title="$t('domains.edit')"
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
          :to="`/${$route.params.domainId}/links/create`"
          @click="$fetch"
        >
          <v-icon color="primary">mdi-plus</v-icon>
        </v-btn>
      </template>
    </page-header>

    <!-- content -->
    <v-container>
      <v-card class="mx-auto mb-3 pb-0" outlined>
        <v-data-table
          :loading="$fetchState.pending"
          :headers="tableHeaders"
          :items="links"
          :options.sync="tableOptions"
          :footer-props="tableFooterOptions"
          :server-items-length="totalItems"
        >
          <!-- search  -->
          <template #top>
            <v-card-actions>
              <v-text-field
                v-model="prefix"
                :label="$t('searchPrefix')"
                clearable
                autofocus
                outlined
                prepend-inner-icon="mdi-magnify"
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
            <div align="right">
              <NuxtLink
                :to="`/${$route.params.domainId}/links/${linkId(item)}/edit`"
              >
                <v-icon>mdi-pencil</v-icon>
              </NuxtLink>
              <v-icon @click="$refs.confirmDelete.open(item, item.uri)">
                mdi-delete
              </v-icon>
            </div>
          </template>

          <!-- pagination -->
          <template #footer.page-text="{ pageStart, pageStop }">
            {{ pageStart }}-{{ pageStop }}
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- dialogues -->
    <delete-dialogue ref="confirmDelete" @confirm="deleteLink" />
  </div>
</template>

<script lang="ts">
import { DataOptions, DataTableHeader } from 'vuetify'
import DeleteDialogue from '~/components/deleteDialogue.vue'
import PageHeader from '~/components/pageHeader.vue'
import RelativeTimestamp from '~/components/relativeTimestamp.vue'
import { linkId, prefixString, successAlert } from '~/helpers'
import { Domain, Link } from '~/types'

type TableOptions = Omit<DataOptions, 'sortBy'> & {
  sortBy: (keyof Link)[]
}

type Data = {
  tableHeaders: DataTableHeader[]
  tableOptions: Partial<TableOptions>
  tableFooterOptions: any
  links: Link[]
  prefix?: string
  paginationTokens: {
    [page: number]: string
  }
  deleteDialogue: boolean
}

export default {
  name: 'LinksList',
  components: { PageHeader, DeleteDialogue, RelativeTimestamp },

  data(): Data {
    return {
      tableHeaders: [
        {
          text: this.$t('links.uri') as string,
          value: 'uri',
          sortable: true,
          // align: 'start',
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
          class: 'text-right',
        },
      ],
      tableOptions: {
        sortBy: ['uri'],
        sortDesc: [false],
        itemsPerPage: 10,
        multiSort: false,
        mustSort: true,
      },
      tableFooterOptions: {
        'items-per-page-options': [10, 30, 50],
        'show-first-last-page': true,
        'last-icon': ''
      },
      links: [],
      prefix: undefined,
      paginationTokens: {},
      deleteDialogue: false,
    }
  },

  fetchDelay: 100,
  async fetch() {
    const { domainId } = this.$route.params
    const currentPage = this.tableOptions.page || 1

    // load data from API
    const res = await this.$axios.get(`/domains/${domainId}/links`, {
      params: {
        ...(this.prefix && {
          prefix: encodeURIComponent(prefixString('/', this.prefix)),
        }),
        ...(this.tableOptions.sortBy && {
          sortBy: this.tableOptions.sortBy[0],
        }),
        ...(this.tableOptions.sortDesc && {
          sortDesc: this.tableOptions.sortDesc[0],
        }),
        ...(this.tableOptions.itemsPerPage && {
          pageLimit: this.tableOptions.itemsPerPage,
        }),
      },
      headers: {
        ...(this.paginationTokens[currentPage] && {
          'x-pagination-token': this.paginationTokens[currentPage],
        }),
      },
    })

    // set data
    this.links = res.data
    this.paginationTokens[currentPage + 1] = res.headers['x-pagination-token']

    // cleanup tokens
    for (const page of Object.keys(this.paginationTokens)) {
      if (page > currentPage + 1) {
        delete this.paginationTokens[page]
      }
    }
  },

  computed: {
    currentDomain(): Domain | undefined {
      const { domainId } = this.$route.params
      return this.$store.getters['domains/current'](domainId)
    },

    totalItems(): number {
      const { page, itemsPerPage } = this.tableOptions
      const total = page * itemsPerPage

      if (this.links.length < itemsPerPage) {
        return total - itemsPerPage + this.links.length
      }

      return total + itemsPerPage
    },
  },

  watch: {
    tableOptions: {
      handler() {
        this.$fetch()
      },
      deep: true,
    },
  },

  methods: {
    linkId,

    async deleteLink(link: Link) {
      const { domainId } = this.$route.params
      this.$refs.confirmDelete.pending()

      try {
        await this.$axios.$delete(`/domains/${domainId}/links/${linkId(link)}`)
        this.$store.commit(
          'addAlert',
          successAlert(this.$t('links.deleteSuccess'))
        )
        this.$fetch()
      } finally {
        this.$refs.confirmDelete.close()
      }
    },
  },
}
</script>

<style>
/* hide "last page" button, since that doesn't work with token based pagination */
.v-data-footer__icons-after > button:nth-last-child(1) {
  display: none;
}
</style>
