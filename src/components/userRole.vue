<template>
  <v-chip :color="color"  outlined>{{ role | upperFirst }}</v-chip>
</template>

<script lang="ts">
import { PropOptions } from 'vue'
import { UserRole } from '~/types'

export default {
  name: 'UserRole',

  filters: {
    upperFirst: (value: string) => {
      const firstChar = value.charAt(0).toUpperCase()
      return firstChar + value.slice(1)
    }
  },

  props: {
    role: { type: String, default: UserRole.Nobody } as PropOptions<UserRole>,
  },

  computed: {
    color(): string {
      switch (this.role) {
        case UserRole.Admin: {
          return 'red'
        }

        case UserRole.Editor: {
          return 'orange'
        }

        case UserRole.Viewer: {
          return 'blue'
        }

        default: {
          return 'grey'
        }
      }
    },
  },
}
</script>
