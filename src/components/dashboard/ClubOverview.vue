<template>
  <div v-if="loading">
    <div class="loading-container">
      <div class="accent-bar"></div>
      <v-progress-circular
        color="primary"
        indeterminate
        size="56"
      ></v-progress-circular>
    </div>
  </div>
  <div v-else-if="item">
    <h3 class="title-underlined">{{ $t('clubs.overview.title') }}</h3>
    <div class="edit-header">
      <div>
        <h1>
          {{ item.name }}
        </h1>
      </div>
    </div>
    <club-summary :club="item"></club-summary>
  </div>
  <div v-else>
    <h1>{{ $t('clubs.overview.notFound') }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Club } from '@/api';

import ClubSummary from '@/components/dashboard/ClubSummary.vue';

@Component({ components: { ClubSummary } })
export default class ClubOverview extends Vue {
  item: Club | null = null;

  tags: string[] = [];

  valid = false;

  loading = false;

  get itemId() {
    return this.$route.params.itemId || -1;
  }

  setTitle() {
    if (this.item) {
      document.title = `${this.item.name} - RCP`;
    }
  }

  async prepareItem() {
    try {
      this.loading = true;
      this.item = (await Club.where({ rcId: this.itemId }).first()).data;
      this.setTitle();
    } catch (e) {
      document.title = 'RCP';
      throw e;
    } finally {
      this.loading = false;
    }
  }

  async mounted() {
    await this.prepareItem();
  }
}
</script>
