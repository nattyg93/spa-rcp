<template>
  <div class="auth-view">
    <div class="accent-bar"></div>

    <div class="auth-view__inner">
      <div class="page-head page-head--auth">
        <a class="page-head__logo" href="/">
          <img src="@/assets/images/logo.svg" alt="RCP" />
        </a>
        <v-spacer></v-spacer>
      </div>
      <div class="auth-view__container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class AuthView extends Vue {}
</script>
