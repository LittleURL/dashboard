<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="email"
      name="email"
      autocomplete="email"
      :label="$t('auth.email')"
      prepend-icon="mdi-email"
      type="email"
      required
    />
    <v-text-field
      v-model="password"
      name="password"
      autocomplete="password"
      :label="$t('auth.password')"
      prepend-icon="mdi-lock"
      type="password"
      required
    />
    <v-btn
      :disabled="loading || !valid"
      :loading="loading"
      color="primary"
      block
      @click="login"
    >
      {{ $t('auth.login') }}
    </v-btn>
  </v-form>
</template>

<script>
export default {
  name: 'AuthLogin',
  data() {
    return {
      loading: false,
      valid: false,
      email: null,
      password: null
    }
  },
  methods: {
    async login() {
      if (!this.$refs.form.validate()) return
      this.loading = true

      try {
        await this.$fireAuth.signInWithEmailAndPassword(
          this.email,
          this.password
        )
        this.$emit('success')
      } catch (error) {
        this.$emit('error', error.message)
      }

      // cleanup
      this.loading = false
    }
  }
}
</script>
