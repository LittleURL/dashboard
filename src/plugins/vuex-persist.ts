import { Plugin } from '@nuxt/types'
import { VuexPersistence } from 'vuex-persist'

const persistedStores = ['domains']
const keyPrefix = 'littleurl.'

const vuexPersistPlugin: Plugin = ({ store }) => {
  for (const persistedStore of persistedStores) {
    new VuexPersistence({
      key: keyPrefix + persistedStore,
      modules: [persistedStore],
    }).plugin(store)
  }
}

export default vuexPersistPlugin
