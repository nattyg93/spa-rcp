<template>
  <v-autocomplete
    v-model="selected"
    :items="items"
    :loading="loading"
    :search-input.sync="search"
    :item-text="itemText"
    :item-value="itemValue"
    :label="label"
    :placeholder="placeholder"
    :no-data-text="noDataText"
    :clearable="clearable"
    :rules="rules"
    :disabled="readonly"
    :prepend-inner-icon="prependInnerIcon"
    return-object
    :cache-items="cacheItems"
    chips
    :hide-details="hideDetails"
    @change="$emit('change', $event)"
  >
    <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
    <template
      v-for="(_, name) in $scopedSlots"
      :slot="name"
      slot-scope="slotData"
      ><slot :name="name" v-bind="slotData"
    /></template>
  </v-autocomplete>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Model } from 'vue-property-decorator';
import { Scope } from 'spraypaint';
import { ApplicationRecord } from '@/api';
import { debounce } from 'lodash';

@Component({
  components: {},
})
export default class extends Vue {
  @Prop({ default: '' }) readonly label: string;

  @Prop({ default: '' }) readonly placeholder: string;

  @Prop({ default: 'name' }) readonly itemText: string;

  @Prop({ default: 'id' }) readonly itemValue: string;

  @Prop() readonly emptyFieldText: string;

  @Prop() readonly noResultsText: string;

  @Prop({ type: Boolean, default: true }) readonly cacheItems: boolean;

  @Prop({ type: Boolean, default: false }) readonly clearable: boolean;

  @Prop({ type: Boolean, default: false }) readonly hideDetails: boolean;

  @Prop() readonly rules: [];

  @Prop({ required: true }) readonly scopeFactory: () => Scope<
    ApplicationRecord
  >;

  @Prop() readonly scopeWhere: { [key: string]: string | boolean | [] };

  @Prop({ type: Boolean, default: false }) readonly readonly: string;

  @Prop() readonly prependInnerIcon: string;

  @Model('input', { type: ApplicationRecord })
  readonly value: ApplicationRecord | null;

  get selected() {
    return this.value;
  }

  set selected(d) {
    this.$emit('input', d);
  }

  get noDataText() {
    return this.noResultsText && this.didSearch
      ? this.noResultsText
      : this.emptyFieldText;
  }

  loading = false;

  didSearch = false;

  updateForced = false;

  search: string | null = null;

  items: ApplicationRecord[] = [];

  update: () => void;

  async doUpdate(forceUpdate = false) {
    if (this.loading) {
      return;
    }

    if (forceUpdate && this.selected) {
      this.updateForced = true;
      this.items = [this.selected];
    } else {
      try {
        this.loading = true;
        if (this.search) {
          let where = { search: this.search };
          if (this.scopeWhere) {
            where = Object.assign(this.scopeWhere, where);
          }
          const scope = this.scopeFactory().where(where);
          const result = await scope.all();
          this.items = result.data;
          this.didSearch = true;
        } else {
          if (!this.cacheItems) {
            this.items = [];
          }
          this.didSearch = false;
        }
      } catch (e) {
        this.items = [];
      } finally {
        this.loading = false;
      }
    }
  }

  mounted() {
    this.doUpdate(true);
    this.update = debounce(this.doUpdate, 500);
  }

  @Watch('search')
  searchChanged() {
    if (this.updateForced) {
      this.updateForced = false;
    } else {
      this.update();
    }
  }

  @Watch('scopeWhere')
  scopeChanged() {
    this.update();
  }
}
</script>
