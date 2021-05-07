<template>
  <v-form
    class="form-vertical-gap"
    @submit.prevent="submit"
    v-model="valid"
    v-if="!complete"
  >
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      type="text"
      :label="$t('passwordReset.labels.email')"
    ></v-text-field>
    <v-btn
      block
      large
      depressed
      color="primary"
      type="submit"
      :disabled="loading || !valid"
    >
      {{ $t('common.next') }}
    </v-btn>
    <v-btn block large depressed @click="back">{{ $t('common.cancel') }}</v-btn>
  </v-form>
  <div class="form-vertical-gap" v-else>
    <v-alert type="success">
      <span v-html="$t('passwordReset.alerts.sentSuccess', { email })"></span>
    </v-alert>
    <v-btn block large depressed @click="back">{{ $t('common.back') }}</v-btn>
  </div>
</template>

<script lang="ts">
import v8n from 'v8n';
import { Component, Vue } from 'vue-property-decorator';
import { PasswordReset } from '@/api';

@Component
export default class PasswordResetForm extends Vue {
  email = '';

  loading = false;

  valid = false;

  complete = false;

  error = '';

  emailRules = [
    (v: string) =>
      v8n()
        .string()
        .not.empty()
        .test(v) || this.$t('users.validation.emailRequired'),

    (v: string) =>
      v8n()
        .pattern(/\S+@\S+\.\S+/)
        .test(v) || this.$t('users.validation.emailValid'),
  ];

  async submit() {
    this.loading = true;
    try {
      const result = await PasswordReset.resetPassword(this.email);
      if (!result) {
        this.error = this.$t('passwordReset.alerts.sentError') as string;
      } else {
        this.error = '';
        this.complete = true;
      }
    } catch (e) {
      this.error = e.response.errors[0].detail;
    } finally {
      this.loading = false;
    }
  }

  back() {
    this.$router.back();
  }
}
</script>
