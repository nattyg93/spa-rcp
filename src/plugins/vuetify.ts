import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#0079A5',
        secondary: '#0D92AA',
        beige: '#F2E4B1',
        navy: '#012855',
        // green: '#8CC740',
      },
    },
  },
});
