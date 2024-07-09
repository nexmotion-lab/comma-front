<script lang="ts">
import { defineComponent, computed } from 'vue';
import { mapState } from 'vuex';

export default defineComponent({
  name: 'TestComponent',
  computed: {
    ...mapState({
      formData: (state: any) => state.formData,
      selectedEvents: (state: any) => state.selectedEvents,
      emotionTags: (state: any) => state.emotionTags,
      selectedEmotions: (state: any) => state.selectedEmotions,
    }),
  },
  created() {
    // 상태 데이터를 콘솔에 출력
    console.log('FormData:', this.formData);
    console.log('SelectedEvents:', this.selectedEvents);
    console.log('EmotionTags:', this.emotionTags);
    console.log('SelectedEmotions:', this.selectedEmotions);
  },
});
</script>

<template>
  <div>
    <h1>Vuex State Test</h1>
    <p>콘솔에서 상태 데이터를 확인하세요.</p>
  </div>
</template>

<style scoped>
</style>
