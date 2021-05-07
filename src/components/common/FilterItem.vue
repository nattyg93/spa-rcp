<template>
  <v-list-item
    class="filter-item"
    :ripple="false"
    @click="hasQuery = !hasQuery"
  >
    <v-list-item-action class="filter-item__action">
      <v-checkbox dense v-model="hasQuery" @click.stop></v-checkbox>
    </v-list-item-action>
    <v-list-item-content class="filter-item__content">
      <v-list-item-title>{{ label }}</v-list-item-title>
      <v-expand-transition>
        <div class="filter-item__filter" v-show="hasQuery">
          <v-select
            v-model="currentQuery"
            :items="allItems"
            item-text="label"
            item-value="value"
            hide-details
            @click.stop
          ></v-select>
        </div>
      </v-expand-transition>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class FilterItem extends Vue {
  @Prop({ required: true }) readonly label: string;

  @Prop({ required: true }) readonly paramName: string;

  @Prop({ required: true }) readonly items: Array<{
    label: string;
    value: string;
  }>;

  hasQuery = false;

  get allItems() {
    return [{ label: this.$t('common.labels.all'), value: '' }, ...this.items];
  }

  get currentQuery() {
    return (this.$route.query[this.paramName] as string) || '';
  }

  set currentQuery(val: string) {
    if (val !== this.currentQuery) {
      this.$router.push({
        query: {
          ...this.$route.query,
          [this.paramName]: val || undefined,
        },
      });
    }
  }

  mounted() {
    this.hasQuery = !!this.currentQuery;
  }

  @Watch('hasQuery')
  filterChanged() {
    if (!this.hasQuery) {
      this.currentQuery = '';
    }
  }
}
</script>
