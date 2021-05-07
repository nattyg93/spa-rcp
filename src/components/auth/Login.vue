<template>
  <v-form class="form-vertical-gap" @submit.prevent="login" v-model="valid">
    <div class="content content--text-lg">
      <h3 class="title-underlined" v-html="$t('login.title')"></h3>
      <i18n path="login.register" tag="p">
        <template v-slot:link>
          <router-link :to="{ name: 'register' }">
            {{ $t('login.registerLink') }}
          </router-link>
        </template>
      </i18n>
    </div>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>
    <v-text-field
      v-model="email"
      type="text"
      :label="$t('login.labels.email')"
    ></v-text-field>
    <v-text-field
      v-model="password"
      type="password"
      :label="$t('common.labels.password')"
    ></v-text-field>
    <v-btn
      block
      large
      depressed
      color="primary"
      type="submit"
      :loading="loading"
      :disabled="loading || !valid"
    >
      {{ $t('common.login') }}
    </v-btn>
    <v-btn block large depressed @click="forgotPassword">
      {{ $t('login.forgotPassword') }}
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import authModule from '@/store/Auth';

@Component({
  components: {},
})
export default class LoginForm extends Vue {
  email = '';

  password = '';

  loading = false;

  valid = false;

  error = '';

  get isLoggedIn(): boolean {
    return authModule.isLoggedIn;
  }

  get nextQuery(): string {
    return typeof this.$route.query.next === 'string'
      ? this.$route.query.next
      : '';
  }

  async login() {
    this.loading = true;
    try {
      await authModule.login({ email: this.email, password: this.password });
    } catch (e) {
      this.error = e.response.errors[0].detail;
    } finally {
      this.loading = false;
    }
  }

  forgotPassword() {
    this.$router.push({ name: 'forgot-password' });
  }

  @Watch('isLoggedIn', { immediate: true })
  isLoggedInChange() {
    if (this.isLoggedIn) {
      const location = this.nextQuery || { name: 'dashboard' };
      this.$router.replace(location).catch(() => {
        // catching in case next query is overriden in global hook
      });
    }
  }
}
</script>
