import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { getToken } from '../helpers'
import { Domain, DomainID } from '../types/domain'
import { RootState } from '.'

export type DomainsState = {
  domains: Domain[]
}

export const state = (): DomainsState => ({
  domains: [],
})

export const getters: GetterTree<DomainsState, RootState> = {
  current: (state) => (id: DomainID) => {
    return state.domains.find((domain) => domain.id === id)
  },
  all: (state) => state.domains,
}

export const mutations: MutationTree<DomainsState> = {
  domains: (state, domains: Domain[]) => (state.domains = domains),
}

export const actions: ActionTree<DomainsState, RootState> = {
  async refresh({ commit }) {
    const domains = await this.$axios.$get('/domains', {
      headers: {
        Authorization: getToken(this.$auth),
      },
    })
    commit('domains', domains)
  },
}
