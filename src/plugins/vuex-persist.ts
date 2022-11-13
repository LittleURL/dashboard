import { Plugin } from '@nuxt/types'
import VuexPersistence from 'vuex-persist'

const persistedStores = ['domains']

const vuexPersistPlugin: Plugin = ({ store }) => {
  for (const persistedStore of persistedStores) {
    new VuexPersistence({
      key: persistedStore,
      modules: [persistedStore],
    }).plugin(store)
  }
}
export default vuexPersistPlugin
