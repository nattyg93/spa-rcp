<template>
  <div class="abstract-table">
    <v-data-table
      :headers="headers"
      :loading="loading"
      :server-items-length="total"
      :options.sync="options"
      :items="items"
      :show-select="showSelect"
      :single-select="singleSelect"
      :disable-sort="true"
      hide-default-footer
      v-model="selected"
      @click:row="itemClicked"
      mobile-breakpoint="0"
    >
      <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
      <template
        v-for="(_, name) in $scopedSlots"
        :slot="name"
        slot-scope="slotData"
        ><slot :name="name" v-bind="slotData"
      /></template>
    </v-data-table>
    <div class="abstract-table__footer form-horizontal-gap">
      <div>
        {{ displayCount }}
      </div>
      <v-pagination
        v-model="options.page"
        :length="pageCount"
        :total-visible="7"
        color="secondary"
        circle
      ></v-pagination>
      <v-btn x-small fab elevation="0" class="mr-4" @click="update">
        <v-icon color="grey darken-1">
          mdi-refresh
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, VModel } from 'vue-property-decorator';
import { Scope } from 'spraypaint';
import { ApplicationRecord } from '@/api';

@Component({
  components: {},
})
export default class AbstractTable extends Vue {
  // eg [{ value: 'id', text: 'ID' }]
  @Prop({ required: true }) readonly headers: object[];

  @Prop({ default: false }) readonly singleSelect: boolean;

  @Prop({ default: true }) readonly showSelect: boolean;

  // eg () => User.includes(['someFields']).where({ project: 1 });
  @Prop({ required: true }) readonly scopeFactory: () => Scope<
    ApplicationRecord
  >;

  @VModel() selected: ApplicationRecord[];

  loading = false;

  total = 0;

  items: ApplicationRecord[] = [];

  options = {
    page: 1,
    itemsPerPage: 20,
  };

  get pageCount() {
    return Math.ceil(this.total / this.options.itemsPerPage);
  }

  get displayCount() {
    return `Showing ${1 +
      (this.options.page - 1) * this.options.itemsPerPage} - ${Math.min(
      this.options.page * this.options.itemsPerPage,
      this.total,
    )} of ${this.total}`;
  }

  itemClicked(item: ApplicationRecord) {
    this.$emit('item-clicked', item);
  }

  async update() {
    this.loading = true;
    try {
      // initial scope + page + pageSize
      const scope = this.scopeFactory()
        .page(this.options.page)
        .per(this.options.itemsPerPage);

      // get result
      const result = await scope.all();
      this.items = result.data;
      this.total = result.meta.pagination.count;
    } catch (e) {
      this.items = [];
    } finally {
      this.loading = false;
    }
  }

  // onClick(item: ApplicationRecord) {
  //   this.selected = [item];
  // }

  @Watch('options', { deep: true })
  optionsChanged() {
    this.update();
  }
}
</script>
