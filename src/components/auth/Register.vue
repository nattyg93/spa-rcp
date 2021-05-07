<template>
  <transition-group tag="div" name="register-out-in" class="register-container">
    <v-form
      ref="form"
      class="form-vertical-gap"
      @submit.prevent="register"
      v-model="valid"
      v-if="!isLoggedIn"
      key="0"
    >
      <div class="content content--text-lg">
        <h3 class="title-underlined" v-html="$t('register.title')"></h3>
        <i18n path="register.login" tag="p">
          <template v-slot:link>
            <router-link :to="{ name: 'login' }">
              {{ $t('register.loginLink') }}
            </router-link>
          </template>
        </i18n>
      </div>
      <v-alert v-if="error" type="error">
        {{ error }}
      </v-alert>
      <div class="d-flex form-horizontal-gap">
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
        v-model="email"
        :rules="emailRules"
        type="text"
        :label="$t('users.labels.email')"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        type="password"
        :label="$t('users.labels.password')"
      ></v-text-field>
      <v-text-field
        v-model="password2"
        :rules="passwordRules2"
        type="password"
        :label="$t('users.labels.confirmPassword')"
      ></v-text-field>
      <div class="d-flex">
        <v-checkbox
          v-model="readTerms"
          :rules="requiredBoolean"
          hide-details
          class="mb-8"
        >
          <template slot="label">
            <i18n path="users.labels.terms">
              <template v-slot:link>
                <a href="/registration-agreement/">
                  {{ $t('users.termsLink') }}
                </a>
              </template>
            </i18n>
          </template>
        </v-checkbox>
      </div>
      <v-btn
        block
        large
        depressed
        color="primary"
        type="submit"
        :disabled="loading || !valid"
        :loading="loading"
      >
        {{ $t('common.register') }}
      </v-btn>
    </v-form>
  </transition-group>
</template>

<script lang="ts">
import v8n from 'v8n';
import { Component, Vue, Watch } from 'vue-property-decorator';

import authModule from '@/store/Auth';
import snackModule from '@/store/Snack';

@Component({})
export default class LoginForm extends Vue {
  firstName = '';

  lastName = '';

  email = '';

  password = '';

  password2 = '';

  readTerms = false;

  loading = false;

  valid = false;

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

  requiredBoolean = [
    (v: boolean) =>
      v8n()
        .boolean()
        .exact(true)
        .test(v) || this.$t('register.validation.generalRequired'),
  ];

  get passwordRules2() {
    return [
      (v: string) =>
        this.password === v || this.$t('users.validation.passwordMatch'),
    ];
  }

  requiredString = [
    (v: string) =>
      v8n()
        .string()
        .not.empty()
        .test(v) || this.$t('common.validation.generalRequired'),
  ];

  get isLoggedIn() {
    return authModule.isLoggedIn;
  }

  logout() {
    authModule.logout();
  }

  async register() {
    this.loading = true;
    try {
      await authModule.registerUser({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      });
      snackModule.setSuccess(this.$t('register.alerts.success') as string);
    } catch (e) {
      this.error = e.response.errors[0].detail;
    } finally {
      this.loading = false;
    }
  }

  @Watch('password')
  @Watch('password2')
  passwordChanged() {
    (this.$refs.form as HTMLFormElement).validate();
  }
}
</script>

<style lang="scss">
.register-container {
  position: relative;
}

.register-out-in {
  &-leave-active {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
  }
  &-enter-active {
    position: relative;
  }

  &-enter-active,
  &-leave,
  &-leave-to {
    transition: opacity 0.5s ease, left 0.5s ease;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
  &-leave {
    top: 50%;
    left: 0;
  }
  &-leave-to {
    left: -100px;
  }
  &-enter {
    left: 100px;
  }
  &-enter-to {
    left: 0;
  }
}
</style>
