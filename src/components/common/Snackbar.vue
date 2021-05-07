<template>
  <v-snackbar
    v-model="showErrorSnackbar"
    :multi-line="snackbarErrors.length > 0"
    top
    :color="snackbarType"
    text
    outlined
  >
    <div class="d-flex align-center">
      <v-icon left :color="snackbarType">{{ snackbarIcon }}</v-icon>
      <strong>{{ snackbarText }}</strong>
    </div>
    <ul class="mt-2" v-if="snackbarErrors.length > 0">
      <li v-for="(error, i) in snackbarErrors" :key="i">
        <strong>{{ error.source.pointer }}:</strong>
        &nbsp;
        <span>{{ error.detail }}</span>
      </li>
    </ul>
    <template v-slot:action="{ attrs }">
      <v-btn
        icon
        :color="snackbarType"
        v-bind="attrs"
        @click="showErrorSnackbar = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import snackModule from '@/store/Snack';

@Component({})
export default class Snackbar extends Vue {
  showErrorSnackbar = false;

  get snackbarText() {
    return snackModule.snackText;
  }

  get snackbarErrors() {
    return snackModule.errors;
  }

  get snackbarType() {
    return snackModule.snackType;
  }

  get snackbarIcon() {
    switch (snackModule.snackType) {
      case 'error':
        return 'mdi-alert-circle';
      case 'warning':
        return 'mdi-alert-circle-outline';
      case 'success':
        return 'mdi-check-circle';
      default:
        return '';
    }
  }

  @Watch('snackbarErrors')
  snackMessageChanged() {
    this.showErrorSnackbar = true;
  }
}
</script>
