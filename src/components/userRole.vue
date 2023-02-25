<template>
  <v-chip v-if="!editable" :color="color" outlined label>
    {{ role | upperFirst }}
  </v-chip>

  <v-dialog v-else v-model="show" max-width="600px" @click:outside="close()">
    <template #activator="{ on }">
      <v-btn
        :color="color"
        outlined
        label
        :loading="loading"
        min-width="120"
        v-on="on"
      >
        {{ role | upperFirst }}
        <v-icon right>mdi-pencil-outline</v-icon>
      </v-btn>
    </template>

    <v-card :loading="loading">
      <v-card-title class="d-flex justify-center text-h5">
        {{ $t(`domains.users.${deleteMode ? 'deleteRole' : 'editRole'}`) }}
        <v-spacer />
        <v-btn icon class="error--text" @click="deleteMode = true">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-title>

      <!-- role selector -->
      <v-card-text v-if="!deleteMode" class="d-flex pb-2">
        <v-radio-group v-model="newRole">
          <v-radio
            v-for="userRole in userRoles"
            :key="userRole"
            :label="userRole | upperFirst"
            :color="getColor(userRole)"
            :value="userRole"
          />
        </v-radio-group>
      </v-card-text>

      <!-- buttons -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          :color="deleteMode ? 'error' : 'primary'"
          :loading="loading"
          @click="confirm"
        >
          {{ $t(deleteMode ? 'delete' : 'submit') }}
        </v-btn>
        <v-spacer />
        <v-btn text @click="close()">
          {{ $t('cancel') }}
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { PropOptions } from 'vue'
import { UserRoles } from '~/types'

const roleColors = {
  [UserRoles.Admin]: 'red',
  [UserRoles.Editor]: 'orange',
  [UserRoles.Viewer]: 'blue',
  [UserRoles.Nobody]: 'grey',
}

type Data = {
  show: boolean
  deleteMode: boolean
  loading: boolean
  newRole: UserRoles
}

export default {
  name: 'UserRole',

  filters: {
    upperFirst: (value: string) => {
      const firstChar = value.charAt(0).toUpperCase()
      return firstChar + value.slice(1)
    },
  },

  props: {
    role: { type: String, default: UserRoles.Nobody } as PropOptions<UserRoles>,
    userId: { type: String, default: undefined },
    editable: { type: Boolean, default: false },
  },

  data(): Data {
    return {
      show: false,
      deleteMode: false,
      loading: false,
      newRole: this.$props.role,
    }
  },

  computed: {
    color(): string {
      return roleColors[this.role] || roleColors[UserRoles.Nobody]
    },

    userRoles() {
      return UserRoles
    },
  },

  methods: {
    getColor(role: UserRoles): string {
      return roleColors[role] || roleColors[UserRoles.Nobody]
    },

    async confirm() {
      if (this.deleteMode) {
        await this.deleteUserRole()
        return
      }

      await this.updateUserRole()
    },

    close(force: boolean = false) {
      const originalMode = this.deleteMode
      this.newRole = this.role
      this.deleteMode = false

      console.log(force, originalMode)

      if (force || !originalMode) {
        this.show = false
      }
    },

    async updateUserRole() {
      this.loading = true

      const { domainId } = this.$route.params
      await this.$axios.$put(`/domains/${domainId}/users/${this.userId}`, {
        role_name: this.newRole,
      })

      this.loading = false
      this.$emit('edited')
      this.close()
    },

    async deleteUserRole() {
      this.loading = true

      const { domainId } = this.$route.params
      await this.$axios.$delete(`/domains/${domainId}/users/${this.userId}`)

      this.loading = false
      this.$emit('edited')
      this.close(true)
    },
  },
}
</script>
