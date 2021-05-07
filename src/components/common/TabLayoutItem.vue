<template>
  <v-tab-item eager :transition="false">
    <div class="tab-layout__row">
      <div class="tab-layout__side">
        <slot name="side"></slot>
      </div>
      <div class="tab-layout__main">
        <slot name="main"></slot>
      </div>
    </div>
  </v-tab-item>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class TabLayoutItem extends Vue {}
</script>
