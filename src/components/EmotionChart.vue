<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
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
  props: {
    selectedYear: {
      type: String,
      required: true
    },
    selectedMonth: {
      type: String,
      required: true
    }
  },
  emits: ['bubble-click'],
  setup(props, { emit }) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    const store = useStore();
    let chartInstance: ChartJS | null = null;

    // API로 불러온 감정 데이터를 저장할 상태
    const emotions = ref([] as any[]);

    const fetchEmotions = async () => {
      try {
        const yearMonth = `${props.selectedYear}-${props.selectedMonth}`;
        const response = await axios.get('http://192.168.0.154:8092/api/v1/statistics/emotion', {
          params: {
            yearMonth,
          },
          headers: {
            'X-User-Id': '4',
          },
        });

        const data = response.data;
        const names = Object.keys(data).map(key => {
          const nameMatch = key.match(/name=([^,)]+)/);
          return {
            name: nameMatch ? nameMatch[1] : 'Unknown',
            count: data[key], // 감정 태그의 카운트 값을 함께 저장
            id: key.match(/emotionTagNo=(\d+)/)[1], // 감정 태그 ID 추출
            color: store.state.emotionTags.find(e => e.name === nameMatch[1])?.color || '#randomColor' // 색상 설정
          };
        });

        // Vuex 스토어에 감정 데이터 설정
        store.commit('setEmotionTags', names.map(tag => ({ name: tag.name, id: tag.id, color: tag.color })));
        emotions.value = names;

      } catch (error) {
        console.error('Error fetching emotions:', error);
      }
    };

    const createChart = () => {
      const filteredEmotionData = store.state.emotionTags.filter(tag => emotions.value.some(e => e.name === tag.name)).map(tag => {
        const emotion = emotions.value.find(e => e.name === tag.name);
        return {
          x: tag.xvalue,
          y: tag.yvalue,
          r: emotion ? emotion.count * 10 : 20, // count 값에 10을 곱하여 반영
          label: tag.name,
          backgroundColor: tag.color,
          id: emotion.id // 감정 태그 ID 추가
        };
      });

      const data = {
        datasets: [
          {
            label: 'Emotion Data',
            data: filteredEmotionData,
            backgroundColor: filteredEmotionData.map(tag => tag.backgroundColor),
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
              lineWidth: (context) => (context.tick.value === 0 ? 0.2 : 0),
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
              lineWidth: (context) => (context.tick.value === 0 ? 0.2 : 0),
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
              const emotionId = chart.data.datasets[element.datasetIndex].data[element.index].id;
              emit('bubble-click', emotionLabel, emotionId);
            }
          }
        }
      };

      if (chartCanvas.value) {
        if (chartInstance) {
          chartInstance.destroy();
        }
        chartInstance = new ChartJS(chartCanvas.value, {
          type: 'bubble',
          data: data,
          options: options,
        });
      }
    };

    onMounted(async () => {
      await fetchEmotions();
      createChart();
    });

    watch([() => props.selectedYear, () => props.selectedMonth], async () => {
      await fetchEmotions();
      createChart();
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