<template>
  <div @click.stop>
    <filter-item
      :label="item.label"
      :param-name="item.param"
      v-for="(item, i) in filterItems"
      :items="item.options"
      :key="i"
    ></filter-item>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import FilterItem from '@/components/common/FilterItem.vue';

@Component({ components: { FilterItem } })
export default class TableFilters extends Vue {
  @Prop({ required: true }) readonly filterItems: Array<
    Record<string, unknown>
  >;
}
</script>
