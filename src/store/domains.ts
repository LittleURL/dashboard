
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Domain, DomainID } from '../types/domain'
import { RootState } from '.'

export type DomainsState = {
  currentDomainId: DomainID|undefined
  domains: Domain[]
}

export const state = (): DomainsState => ({
  currentDomainId: undefined,
  domains: [
    { id: "id1", domain: "example.com" },
    { id: "id2", domain: "foobar.io" }
  ]
})

export const getters: GetterTree<DomainsState, RootState> = {
  current: state => state.domains.find(domain => domain.id === state.currentDomainId),
  all: state => state.domains
}

export const mutations: MutationTree<DomainsState> = {
  setCurrent: (state, id: DomainID) => (state.currentDomainId = id),
  domains: (state, domains: Domain[]) => (state.domains = domains)
}

export const actions: ActionTree<DomainsState, RootState> = {
  async refresh({ commit, state }) {
    // const domains = await this.$axios.$get('/domains')
    // commit('domains', domains)
    await new Promise(resolve => setTimeout(resolve, 3000))
    commit('domains', [...state.domains, {id:"id3", domain:"bazquxx"}])
  },
}

