<template>
  <div>
    <v-app v-if="!ready">
      <div class="loading-container">
        <div class="accent-bar"></div>
        <v-progress-circular
          color="primary"
          indeterminate
          size="56"
        ></v-progress-circular>
      </div>
    </v-app>
    <v-app
      class="app-container"
      :class="{ 'app-container--full-width': showAppBar }"
      v-else
    >
      <v-navigation-drawer
        v-if="showAppBar"
        app
        absolute
        clipped
        permanent
        color="grey lighten-4"
        class="side-nav"
        mobile-breakpoint="0"
        touchless
      >
        <div class="side-nav__inner">
          <v-list nav class="pt-0">
            <v-list-item
              v-for="item in filteredMenu"
              :key="item.to.name"
              :to="item.to"
              color="primary"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>

      <v-app-bar app color="primary" clipped-left flat dark v-if="showAppBar">
        <router-link
          :to="{ name: 'dashboard' }"
          title="RCP"
          class="app-bar-logo"
        >
          <img src="@/assets/images/logo.svg" alt="RCP" />
        </router-link>
        <v-spacer></v-spacer>
        <v-menu offset-y left dense>
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom color="grey darken-4">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  class="ma-0"
                  icon
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                >
                  <v-avatar size="40" color="beige">
                    <v-img :src="userAvatar" alt=""></v-img>
                  </v-avatar>
                </v-btn>
              </template>
              <span>{{ $t('users.labels.settings') }}</span>
            </v-tooltip>
          </template>
          <v-list dense class="user-menu" min-width="200px">
            <v-list-item :to="{ name: 'user-details' }">
              <v-list-item-title>
                {{ $t('common.menuItems.userDetails') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>
                {{ $t('common.logout') }}
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item :href="`${wpBase}/versions/`">
              <v-list-item-title>
                <v-tooltip left color="grey darken-4">
                  <template v-slot:activator="{ on }">
                    <span v-on="on">
                      {{ version }}
                    </span>
                  </template>
                  {{ hash }}
                </v-tooltip>
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
          </v-list>
        </v-menu>
      </v-app-bar>
      <v-main :key="locale">
        <router-view></router-view>
      </v-main>
      <snackbar></snackbar>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import authModule from '@/store/Auth';

import Snackbar from '@/components/common/Snackbar.vue';
import { Route } from 'vue-router';

@Component({
  components: {
    Snackbar,
  },
})
export default class App extends Vue {
  menu = [
    {
      title: this.$t('players.menuLabel'),
      to: {
        name: 'players',
      },
      show: () => true,
    },
    {
      title: this.$t('clubs.menuLabel'),
      to: {
        name: 'clubs',
      },
      show: () => true,
    },
  ];

  get filteredMenu() {
    return this.menu.filter(item => item.show());
  }

  get ready(): boolean {
    return authModule.ready;
  }

  get showAppBar() {
    return (
      this.$route.matched &&
      this.$route.matched[0] &&
      this.$route.matched[0].meta &&
      !!this.$route.matched[0].meta.showAppBar
    );
  }

  get locale() {
    return 'en';
  }

  get version() {
    return `Version: ${process.env.VUE_APP_VERSION}`;
  }

  get hash() {
    return `Commit: ${process.env.VUE_APP_COMMIT}`;
  }

  logout() {
    authModule.logout();
  }

  @Watch('$route', { immediate: true })
  titleChange(to: Route, from: Route) {
    if (!from || from.name !== to.name) {
      if (to.meta.title) {
        document.title = `${to.meta.title} - RCP`;
      } else {
        document.title = 'RCP';
      }
    }
  }
}
</script>

<style lang="scss">
.app-container {
  &--full-width {
    min-width: 1600px;
  }
}
.side-nav {
  height: 100% !important;
  overflow: visible !important;
  font-family: $secondary-font-family;

  .v-navigation-drawer__content {
    overflow: visible !important;
  }

  &__inner {
    position: sticky;
    top: 64px;
    max-height: calc(100vh - 64px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
.user-menu {
  font-family: $secondary-font-family;
}
</style>
