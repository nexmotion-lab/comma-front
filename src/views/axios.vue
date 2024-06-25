<template>
  <div>
    <h1>emotion</h1>
    <ul>
      <li v-for="(emotion, index) in emotions" :key="index">{{ emotion.name }} {{ emotion.count }}회</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      emotions: [] as { name: string; count: number }[],
    };
  },
  mounted() {
    this.fetchEmotions();
  },
  methods: {
    async fetchEmotions() {
      try {
        const response = await axios.get('http://192.168.0.154:8092/api/v1/statistics/emotion', {
          params: {
            yearMonth: '2024-06',
          },
          headers: {
            'X-User-Id': '4',
          },
        });

        const data = response.data;
        const emotions = Object.keys(data).map(key => {
          // 키에서 name 값을 추출하고 괄호를 제거
          const nameMatch = key.match(/name=([^,)]+)/);
          const name = nameMatch ? nameMatch[1] : 'Unknown';
          const count = data[key];
          return { name, count };
        });
        console.log(emotions);
        this.emotions = emotions;
      } catch (error) {
        console.error('Error fetching emotions:', error);
      }
    },
  },
});
</script>