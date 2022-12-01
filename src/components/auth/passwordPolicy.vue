<template>
  <v-card>
    <v-card-title>
      {{ $t('auth.passwordPolicy.title') }}
    </v-card-title>
    <v-card-text>
      <ul>
        <li>
          {{
            $t('auth.passwordPolicy.minLength', {
              len: passwordPolicy.minLength,
            })
          }}
        </li>
        <li>{{ $t('auth.passwordPolicy.whitespace') }}</li>
        <li v-if="passwordPolicy.lowercase">
          {{ $t('auth.passwordPolicy.lowercase') }}
        </li>
        <li v-if="passwordPolicy.uppercase">
          {{ $t('auth.passwordPolicy.uppercase') }}
        </li>
        <li v-if="passwordPolicy.numbers">
          {{ $t('auth.passwordPolicy.numbers') }}
        </li>
        <li v-if="passwordPolicy.symbols">
          {{ $t('auth.passwordPolicy.symbols') }}
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { passwordPolicy } from '~/types'

type Data = {
  passwordPolicy: typeof passwordPolicy
}

export default {
  name: 'AuthPasswordPolicy',

  data: (): Data => ({
    passwordPolicy,
  }),
}
</script>
