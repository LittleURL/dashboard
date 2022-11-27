import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { v4 as uuid } from 'uuid'
import { Alert } from '~/types/alert'

export type RootState = {
  alerts: Alert[]
}

export const state = (): RootState => ({
  alerts: [],
})

export const getters: GetterTree<RootState, RootState> = {
  alerts: (state) => state.alerts,
}

export const mutations: MutationTree<RootState> = {
  addAlert: (state, alert: Alert) => {
    if (!alert.id) alert.id = uuid()
    state.alerts.push(alert)
  },

  deleteAlert: (state, id: string) => {
    const index = state.alerts.findIndex(alert => alert.id === id)
    state.alerts.splice(index, 1)
  },
}

export const actions: ActionTree<RootState, RootState> = {}
