<template>
  <div>
    <h3 class="title-underlined">
      {{ $t('players.list.title') }}
    </h3>
    <div class="search-bar">
      <div class="search-bar__item">
        <v-text-field
          v-model="search"
          solo
          flat
          prepend-inner-icon="mdi-magnify"
          background-color="grey lighten-4"
          :placeholder="$t('players.list.search')"
          clearable
          hide-details
        ></v-text-field>
      </div>
    </div>
    <div class="actions-bar">
      <div class="actions-bar__item"></div>
      <div class="actions-bar__item actions-bar__item--last page-actions">
        <div class="form-horizontal-gap-small">
          <table-menu-button
            :tooltip="$t('common.labels.filter')"
            icon="mdi-filter-outline"
            :menu-dense="false"
            menu-width="300"
            :is-active="filtersActive"
          >
            <table-filters :filterItems="filterItems"></table-filters>
          </table-menu-button>
          <table-menu-button
            :tooltip="$t('common.labels.sort')"
            icon="mdi-swap-vertical"
            :menu-dense="false"
            menu-width="300"
            :is-active="!!this.sortValue"
          >
            <table-sort
              @change="sortChanged"
              :sortItems="sortItems"
            ></table-sort>
          </table-menu-button>
        </div>
      </div>
    </div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <abstract-table
          v-model="selected"
          :headers="headers"
          :scopeFactory="scopeFactory"
          ref="table"
        >
          <template v-slot:[`item.name`]="{ item, value }">
            <v-list-item
              class="table-item"
              :ripple="false"
              :to="{ name: 'player-overview', params: { itemId: item.rcId } }"
            >
              <v-list-item-content>
                <v-list-item-title class="table-item__title">
                  <span>
                    {{ value }}
                  </span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.email }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template v-slot:[`item.rcPrimaryClubId`]="{ value }">
            <v-list-item
              class="table-item"
              :ripple="false"
              :href="getClubRcUri(value)"
              target="_blank"
            >
              <v-list-item-content>
                <v-list-item-title class="table-item__title">
                  <span>
                    {{ value }}
                  </span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template v-slot:[`item.status`]="{ value }">
            <v-chip small outlined :color="chipColor(value)">
              {{ chipLabel(value) }}
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <table-menu-button
              :tooltip="$t('common.labels.actions')"
              icon="mdi-dots-horizontal"
              x-small
            >
              <single-recipe-actions
                :item="item"
                @do-action="doSingleAction($event, item)"
              ></single-recipe-actions>
            </table-menu-button>
          </template>
          <template v-slot:[`item.modified`]="{ value }">
            {{ formatDate(value) }}
          </template>
        </abstract-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { debounce } from 'lodash';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { SortDir } from 'spraypaint/lib-esm/scope';
import { Player, Club } from '@/api';

import AbstractTable from '@/components/common/AbstractTable.vue';
import TableFilters from '@/components/common/TableFilters.vue';
import TableMenuButton from '@/components/common/TableMenuButton.vue';
import TableSort from '@/components/common/TableSort.vue';

import dayjs from 'dayjs';

@Component({
  components: {
    AbstractTable,
    TableMenuButton,
    TableFilters,
    TableSort,
  },
})
export default class Players extends Vue {
  search = '';

  searchQuery = '';

  debounceSearch: () => void;

  sortValue: string | null = null;

  sortOrder = 'asc';

  selected: Player[] = [];

  actionsDialog = false;

  activeAction: string | null = null;

  getClubRcUri(clubRcId: number) {
    return Club.getRcUri(clubRcId);
  }

  get sortItems() {
    return [
      { label: this.$t('common.labels.rcId'), value: 'rc_id' },
      { label: this.$t('players.name'), value: 'name' },
      { label: this.$t('players.playerRating'), value: 'rating,st_dev' },
      { label: this.$t('players.lastPlayed'), value: 'last_played' },
    ];
  }

  get filterItems() {
    return [
      {
        label: this.$t('players.deceased'),
        param: 'deceased',
        options: [
          { label: this.$t('players.yes'), value: 'true' },
          { label: this.$t('players.no'), value: 'false' },
        ],
      },
    ];
  }

  get headers() {
    return Player.listHeaders();
  }

  get table() {
    return this.$refs.table as AbstractTable;
  }

  get scopeFactory() {
    return () =>
      Player.scopeFactory()
        .order(this.order)
        .where(this.whereClause);
  }

  get whereClause() {
    const whereObj: Record<string, unknown> = {
      name__icontains: this.searchQuery,
      ...this.filters,
    };
    return whereObj;
  }

  get order() {
    return this.sortValue
      ? ({ [this.sortValue]: this.sortOrder } as Record<string, SortDir>)
      : { rc_id: 'desc' as SortDir };
  }

  get filters() {
    const filterObj: {
      deceased?: string;
    } = {};
    Object.entries(this.$route.query).map(item => {
      const [key, value] = item;

      if (value != null) {
        switch (key) {
          case 'deceased':
            filterObj.deceased = value as string;
            break;

          default:
            break;
        }
      }
      return item;
    });
    return filterObj;
  }

  get filtersActive() {
    return Object.keys(this.filters).length > 0;
  }

  formatDate(val: string) {
    return dayjs(val).fromNow();
  }

  sharedIconColor(val: boolean) {
    return val ? 'success' : 'grey lighten-1';
  }

  sortChanged(sort: { value: string; order: string }) {
    this.sortValue = sort.value;
    this.sortOrder = sort.order;
  }

  doAction(action: string) {
    this.activeAction = action;
    this.actionsDialog = true;
  }

  doSingleAction(action: string, item: Player) {
    this.selected = [item];
    this.activeAction = action;
    this.actionsDialog = true;
  }

  update() {
    this.table.update();
  }

  mounted() {
    this.debounceSearch = debounce(() => {
      this.searchQuery = this.search;
    }, 500);

    if (this.$route.query.search) {
      this.searchQuery = this.$route.query.search as string;
      this.search = this.$route.query.search as string;
    }
  }

  @Watch('whereClause')
  @Watch('order')
  queryChanged() {
    this.table.update();
  }

  @Watch('search')
  searchChanged() {
    // Remove search query string on search change
    if (this.$route.query.search && this.search !== this.searchQuery) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          search: undefined,
        },
      });
    }

    this.debounceSearch();
  }
}
</script>
