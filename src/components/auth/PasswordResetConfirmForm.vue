<template>
  <v-form
    class="form-vertical-gap"
    @submit.prevent="setPassword"
    v-model="valid"
    ref="form"
  >
    <v-alert type="success" v-if="success">
      <span v-html="$t('passwordReset.alerts.success')"></span>
    </v-alert>
    <v-alert type="error" v-else-if="error">
      <span v-html="$t('passwordReset.alerts.error', { error })"></span>
    </v-alert>
    <v-alert type="info" v-else-if="welcome && queryOk">
      <span v-html="$t('passwordReset.alerts.setPassword', { email })"></span>
    </v-alert>
    <v-alert type="info" v-else-if="queryOk">
      <span v-html="$t('passwordReset.alerts.resetPassword', { email })"></span>
    </v-alert>
    <v-alert type="error" v-else>
      <span v-html="$t('passwordReset.alerts.invalid')"></span>
    </v-alert>
    <template v-if="!success">
      <div class="d-flex form-horizontal-gap" v-if="welcome">
        <v-text-field
          v-model="firstName"
          :rules="requiredString"
          type="text"
          :label="$t('users.labels.firstName')"
        ></v-text-field>
        <v-text-field
          v-model="lastName"
          :rules="requiredString"
          type="text"
          :label="$t('users.labels.lastName')"
        ></v-text-field>
      </div>
      <v-text-field
        v-model="password1"
        :rules="passwordRules"
        type="password"
        :label="$t('passwordReset.labels.newPassword')"
      ></v-text-field>
      <v-text-field
        v-model="password2"
        :rules="passwordRules2"
        type="password"
        :label="$t('passwordReset.labels.confirmNewPassword')"
      ></v-text-field>

      <v-btn
        block
        large
        depressed
        color="primary"
        type="submit"
        :disabled="loading || !valid"
      >
        {{ $t('common.continue') }}
      </v-btn>
    </template>
    <v-btn block large depressed @click="home">
      {{ $t('passwordReset.back') }}
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import v8n from 'v8n';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { PasswordResetConfirmation } from '@/api';

interface VuetifyForm extends Vue {
  validate: () => boolean;
}

@Component
export default class PasswordResetConfirmForm extends Vue {
  valid = false;

  loading = false;

  success = false;

  firstName = '';

  lastName = '';

  password1 = '';

  password2 = '';

  error = '';

  requiredString = [
    (v: string) =>
      v8n()
        .string()
        .not.empty()
        .test(v) || this.$t('common.validation.generalRequired'),
  ];

  passwordRules = [
    (v: string) =>
      v8n()
        .string()
        .not.empty()
        .test(v) || this.$t('users.validation.passwordRequired'),
    (v: string) =>
      v8n()
        .string()
        .minLength(8)
        .test(v) || this.$t('users.validation.passwordLength'),
    (v: string) =>
      v8n()
        .not.numeric()
        .minLength(8)
        .test(v) || this.$t('users.validation.passwordNonNumeric'),
  ];

  get passwordRules2() {
    return [
      (v: string) =>
        this.password1 === v || this.$t('users.validation.passwordMatch'),
    ];
  }

  get uid() {
    return typeof this.$route.query.uid === 'string'
      ? this.$route.query.uid
      : '';
  }

  get token() {
    return typeof this.$route.query.token === 'string'
      ? this.$route.query.token
      : '';
  }

  get email() {
    return typeof this.$route.query.email === 'string'
      ? atob(this.$route.query.email)
      : '';
  }

  get welcome() {
    return (
      typeof this.$route.query.welcome === 'string' &&
      this.$route.query.welcome === 'true'
    );
  }

  get queryOk() {
    return !!this.uid && !!this.token && !!this.email;
  }

  async setPassword() {
    this.loading = true;
    try {
      const passwordObj: {
        uid: string;
        token: string;
        newPassword1: string;
        newPassword2: string;
        firstName?: string;
        lastName?: string;
      } = {
        uid: this.uid,
        token: this.token,
        newPassword1: this.password1,
        newPassword2: this.password2,
      };
      if (this.firstName) {
        passwordObj.firstName = this.firstName;
      }
      if (this.lastName) {
        passwordObj.lastName = this.lastName;
      }

      await PasswordResetConfirmation.setPassword(passwordObj);
      this.error = '';
      this.success = true;
    } catch (e) {
      this.error = e.response.errors[0].detail;
    } finally {
      this.loading = false;
    }
  }

  home() {
    this.$router.push({ name: 'login' });
  }

  @Watch('password1')
  @Watch('password2')
  passwordChanged() {
    (this.$refs.form as VuetifyForm).validate();
  }
}
</script>
