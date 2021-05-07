<template>
  <v-list-item class="filter-item" :ripple="false" @click.stop="toggleSort">
    <v-list-item-action class="filter-item__action">
      <v-icon :color="selected === sortValue ? 'secondary' : null">{{
        sortIcon
      }}</v-icon>
    </v-list-item-action>
    <v-list-item-content class="filter-item__content">
      <v-list-item-title>{{ label }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop, VModel } from 'vue-property-decorator';

@Component({})
export default class SortItem extends Vue {
  @VModel({ type: String }) selected!: string | null;

  @Prop({ required: true }) readonly sortValue: string;

  @Prop({ required: true }) readonly label: string;

  order: 'asc' | 'desc' = 'asc';

  get sortIcon() {
    let icon = 'mdi-checkbox-blank-outline';
    if (this.selected === this.sortValue) {
      if (this.order === 'asc') {
        icon = 'mdi-arrow-down-bold-box-outline';
      } else {
        icon = 'mdi-arrow-up-bold-box-outline';
      }
    }
    return icon;
  }

  toggleSort() {
    if (this.selected !== this.sortValue) {
      this.selected = this.sortValue;
    } else if (this.selected === this.sortValue && this.order === 'asc') {
      this.order = 'desc';
    } else {
      this.selected = null;
      this.order = 'asc';
    }
    this.$emit('change', this.order);
  }
}
</script>
