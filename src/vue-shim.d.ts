import { Store } from 'vuex'
import { NuxtCookies } from 'cookie-universal-nuxt'

declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $cookies: NuxtCookies
    $store: Store<any>
  }
}