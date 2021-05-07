import './component-hooks';

import Vue from 'vue';

import '@/hack';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';

import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';

import '@/scss/index.scss';

dayjs.extend(relativeTime);
dayjs.extend(dayOfYear);
dayjs.extend(quarterOfYear);
dayjs.extend(utc);
dayjs.extend(isBetween);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app');
