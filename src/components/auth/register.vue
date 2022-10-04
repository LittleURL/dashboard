<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="displayName"
      name="displayName"
      autocomplete="name"
      :label="$t('profile.displayName')"
      prepend-icon="mdi-account"
      type="text"
    />
    <v-text-field
      v-model="email"
      name="email"
      autocomplete="email"
      :label="$t('auth.email')"
      prepend-icon="mdi-email"
      type="email"
    />
    <v-text-field
      v-model="emailConfirm"
      name="confirm-email"
      autocomplete="confirm-email"
      :label="$t('auth.emailConfirm')"
      prepend-icon="mdi-email"
      type="email"
    />
    <v-text-field
      v-model="password"
      name="new-password"
      autocomplete="new-password"
      :label="$t('auth.password')"
      prepend-icon="mdi-lock"
      type="password"
    />
    <v-text-field
      v-model="passwordConfirm"
      name="confirm-password"
      autocomplete="confirm-password"
      :label="$t('auth.passwordConfirm')"
      prepend-icon="mdi-lock"
      type="password"
    />
    <v-btn
      :disabled="loading || !valid"
      :loading="loading"
      color="primary"
      block
      @click="register"
    >
      {{ $t('auth.register') }}
    </v-btn>
  </v-form>
</template>

<script>
export default {
  name: 'AuthRegister',
  data: () => ({
    loading: false,
    valid: false,
    displayName: null,
    email: null,
    emailConfirm: null,
    password: null,
    passwordConfirm: null
  }),
  methods: {
    async register() {
      // TODO: validation
      if (!this.$refs.form.validate()) return
      this.loading = true
      try {
        await this.$fireAuth.createUserWithEmailAndPassword(
          this.email,
          this.password
        )
        await this.$store.dispatch('auth/updateProfile', {
          displayName: this.displayName
        })
        this.$emit('success')
      } catch (error) {
        console.error(error.message)
        const code = error.code.replace('auth/', '')
        const message = this.$t(`auth.errors.${code}`)
        this.$emit('error', message)
      }
      this.loading = false
    }
  }
}
</script>