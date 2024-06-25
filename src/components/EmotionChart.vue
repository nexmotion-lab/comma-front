<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import axios from 'axios';
import { useStore } from 'vuex';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  CategoryScale,
  LinearScale,
  BubbleController,
} from "chart.js";
import type { ChartConfiguration } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, PointElement, CategoryScale, LinearScale, BubbleController);

export default defineComponent({
  name: "EmotionChart",
  emits: ['bubble-click'],
  setup(_, { emit }) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    const store = useStore();

    // API로 불러온 감정 데이터를 저장할 상태
    const emotions = ref([] as any[]);

    const fetchEmotions = async () => {
      try {
        const response = await axios.get('http://192.168.0.154:8092/api/v1/statistics', {
          params: {
            yearMonth: '2024-06',
          },
          headers: {
            'X-User-Id': '4',
          },
        });

        const data = response.data;
        const names = Object.keys(data).map(key => {
          const nameMatch = key.match(/name=([^,)]+)/);
          return nameMatch ? nameMatch[1] : 'Unknown';
        });
        
        // Vuex 스토어에 감정 데이터 설정
        store.commit('setEmotionTags', names);
        emotions.value = names;

      } catch (error) {
        console.error('Error fetching emotions:', error);
      }
    };

    onMounted(async () => {
      await fetchEmotions();

      const filteredEmotionData = computed(() => {
        return store.state.emotionTags.filter(tag => emotions.value.includes(tag.name)).map(tag => ({
          x: tag.xvalue,
          y: tag.yvalue,
          r: 20, // You can adjust the radius as needed
          label: tag.name,
          backgroundColor: tag.color,
        }));
      });

      const data = {
        datasets: [
          {
            label: 'Emotion Data',
            data: filteredEmotionData.value,
            backgroundColor: filteredEmotionData.value.map(tag => tag.backgroundColor),
            borderColor: "transparent",
            borderWidth: 0,
          },
        ],
      };

      const options: ChartConfiguration<'bubble'>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.raw.label || '';
                return `${label}`;
              }
            }
          },
          title: {
            display: true,
          },
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: -6,
            max: 6,
            grid: {
              color: (context) => (context.tick.value === 0 ? "#000000" : "transparent"),
              lineWidth: (context) => (context.tick.value === 0 ? 2 : 0),
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
            border: {
              display: false, // x축 변 경계선 없애기
            },
          },
          y: {
            type: 'linear',
            min: -6,
            max: 6,
            grid: {
              color: (context) => (context.tick.value === 0 ? "#000000" : "transparent"),
              lineWidth: (context) => (context.tick.value === 0 ? 2 : 0),
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
            border: {
              display: false, // y축 변 경계선 없애기
            },
          },
        },
        elements: {
          point: {
            backgroundColor: (context) => context.dataset.backgroundColor as string,
            borderColor: 'transparent',
            borderWidth: 0,
          },
        },
        onClick(event, elements) {
          if (elements.length > 0) {
            const chart = elements[0].element.$context.chart;
            const element = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)[0];
            if (element) {
              const emotionLabel = chart.data.datasets[element.datasetIndex].data[element.index].label;
              emit('bubble-click', emotionLabel);
            }
          }
        }
      };

      if (chartCanvas.value) {
        new ChartJS(chartCanvas.value, {
          type: 'bubble',
          data: data,
          options: options,
        });
      }
    });

    return {
      chartCanvas,
    };
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  position: relative;
}
</style>