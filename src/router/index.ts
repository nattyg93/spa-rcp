import Login from '@/components/auth/Login.vue';
import PasswordResetConfirmForm from '@/components/auth/PasswordResetConfirmForm.vue';
import PasswordResetForm from '@/components/auth/PasswordResetForm.vue';
import Register from '@/components/auth/Register.vue';
import Players from '@/components/dashboard/Players.vue';
import PlayerOverview from '@/components/dashboard/PlayerOverview.vue';
import Clubs from '@/components/dashboard/Clubs.vue';
import ClubOverview from '@/components/dashboard/ClubOverview.vue';
import nextQuery from '@/nextQuery';
import authModule from '@/store/Auth';
// auth
import AuthView from '@/views/AuthView.vue';
import DashboardView from '@/views/DashboardView.vue';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '',
    component: DashboardView,
    redirect: '/players/',
    meta: { showAppBar: true },
    children: [
      {
        path: 'players',
        name: 'players',
        component: Players,
        meta: { title: 'Players' },
      },
      {
        path: 'players/:itemId',
        name: 'player-overview',
        component: PlayerOverview,
        meta: { title: 'Player Overview' },
      },
      {
        path: 'clubs',
        name: 'clubs',
        component: Clubs,
        meta: { title: 'Clubs' },
      },
      {
        path: 'clubs/:itemId',
        name: 'club-overview',
        component: ClubOverview,
        meta: { title: 'Club Overview' },
      },
    ],
  },
  {
    path: '',
    component: AuthView,
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: { title: 'Login' },
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: { title: 'Register' },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: PasswordResetForm,
        meta: { title: 'Forgot Password' },
      },
      {
        path: 'set-password',
        name: 'set-password',
        component: PasswordResetConfirmForm,
        meta: { title: 'Set Password' },
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  // init once
  if (!authModule.ready) {
    await authModule.init();
  }

  if (authModule.isLoggedIn) {
    let canAccess = true;

    // check user permissions
    let roles;
    if (to.meta.roles) {
      roles = to.meta.roles;
    } else {
      roles = to.matched.reduce(
        (combined, route) => [...combined, ...((route.meta.roles as []) || [])],
        [],
      );
    }
    canAccess = canAccess && authModule.canAccess(roles);

    // Allow or deny access to current route
    authModule.setCanAccessRoute(canAccess);
  }

  // need to handle authed routes
  const requiresAuth = to.matched.some(match => match.meta.auth);
  if (requiresAuth && !authModule.isLoggedIn) {
    next(`/login?next=${nextQuery()}`);
  }

  next();
});

export default router;
