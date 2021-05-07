<template>
  <div>
    <h3 class="title-underlined">{{ $t('players.overview.title') }}</h3>
    <div class="edit-header">
      <div>
        <h1>
          {{ item.name }}
        </h1>
      </div>
    </div>
    <player-summary :player="item"></player-summary>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Player } from '@/api';

import PlayerSummary from '@/components/dashboard/PlayerSummary.vue';

@Component({ components: { PlayerSummary } })
export default class PlayerOverview extends Vue {
  item: Player | null = null;

  tags: string[] = [];

  valid = false;

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
      this.item = (await Player.where({ rcId: this.itemId }).first()).data;
      this.setTitle();
    } catch (e) {
      document.title = 'RCP';
      throw e;
    }
  }

  async mounted() {
    await this.prepareItem();
  }
}
</script>
