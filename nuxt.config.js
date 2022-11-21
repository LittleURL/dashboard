import {
  exponentialDelay,
  isNetworkOrIdempotentRequestError
} from 'axios-retry'
import colors from 'vuetify/es5/util/colors'

export default {
  srcDir: 'src/',

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - LittleURL',
    title: 'LittleURL',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  crossOriginIsolated: false,

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vuetify',
    '~/plugins/validator',
    '~/plugins/luxon',
    { src: '~/plugins/vuex-persist', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'cookie-universal-nuxt',
    '@nuxtjs/auth-next',
    '@nuxtjs/axios',
    '@nuxtjs/i18n',
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: `https://api.littleurl.dev/v1`,
    retry: {
      retries: 3,
      retryDelay: exponentialDelay,
      retryCondition: isNetworkOrIdempotentRequestError
    }
  },

  auth: {
    strategies: {
      cognito: {
        scheme: 'openIDConnect',
        clientId: '24jot6kfr6648ihq4dtqhum1rb',
        endpoints: {
          configuration: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_wWJ25Mayx/.well-known/openid-configuration'
        },
        scope: "openid profile",
        autoLogout: true,
      }
    },
    plugins: ['~/plugins/auth']
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  router: {
    middleware: ['auth']
  },

  // i18n Configuration: https://nuxt-community.github.io/nuxt-i18n/
  i18n: {
    defaultLocale: 'en',
    lazy: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: 'en'
    },
    locales: [{ code: 'en', iso: 'en-US', file: 'en-US/index.ts' }]
  },
  'nuxt-i18n': {
    seo: false
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        light: {
          background: colors.grey.lighten3
        },
        dark: {
          background: colors.black
          // primary: colors.blue.darken2,
          // accent: colors.grey.darken3,
          // secondary: colors.amber.darken3,
          // info: colors.teal.lighten1,
          // warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          // success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      "vee-validate/dist/rules"
    ]
  },

  // https://nuxtjs.org/docs/configuration-glossary/configuration-generate/
  generate: {
    fallback: 'error.html'
  },

  // Dev server config: https://nuxtjs.org/docs/features/configuration/#edit-host-and-port
  server: {
    host: '0.0.0.0'
  }
}
