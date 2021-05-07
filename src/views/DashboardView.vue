<template>
  <v-container fluid class="pa-12">
    <template v-if="canAccess">
      <router-view :key="routeKey"></router-view>
    </template>
    <div v-else>
      <h3 class="title-underlined mb-10">
        {{ $t('common.noAccessTitle') }}
      </h3>
      <p>{{ $t('common.noAccessContent') }}</p>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import authModule from '@/store/Auth';

@Component({})
export default class DashboardView extends Vue {
  welcomeDialog = false;

  setWelcomeCookie = false;

  get canAccess() {
    return authModule.canAccessRoute;
  }

  get routeKey() {
    return authModule.dashboardRouteKey;
  }

  get updatingDialog() {
    return authModule.updatingDialog;
  }
}
</script>
