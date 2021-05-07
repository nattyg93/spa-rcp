<template>
  <div class="tab-layout">
    <div class="tab-layout__tabs">
      <v-tabs class="tab-switch" show-arrows v-model="tabIndex">
        <slot name="tabs"></slot>
      </v-tabs>
    </div>
    <v-tabs-items v-model="tabIndex" touchless>
      <slot name="items"></slot>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { Component, Vue, VModel } from 'vue-property-decorator';

@Component({})
export default class TabLayout extends Vue {
  @VModel({ default: null }) tabNum: null | number;

  internalIndex = 0;

  get tabIndex() {
    // If the v-model isn't set use the internal index
    return this.tabNum === null ? this.internalIndex : this.tabNum;
  }

  set tabIndex(index: number) {
    this.tabNum = index;
    this.internalIndex = index;
  }
}
</script>
