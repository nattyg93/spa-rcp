<template>
  <div @click.stop>
    <sort-item
      v-model="selectedFilter"
      :sort-value="item.value"
      :label="item.label"
      v-for="(item, i) in sortItems"
      :key="i"
      @change="sortChanged"
    ></sort-item>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import SortItem from '@/components/common/SortItem.vue';

@Component({ components: { SortItem } })
export default class TableSort extends Vue {
  selectedFilter: string | null = null;

  @Prop({ required: true }) readonly sortItems: Array<Record<string, string>>;

  sortChanged(order: string) {
    this.$emit('change', { value: this.selectedFilter, order });
  }
}
</script>
