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
    },
    emotions: {
      type: Array,
      required: true
    }
  },
  emits: ['bubble-click'],
  setup(props, { emit }) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    const store = useStore();
    let chartInstance: ChartJS | null = null;

    const createChart = () => {
      const filteredEmotionData = props.emotions.map(tag => ({
        x: tag.xvalue,
        y: tag.yvalue,
        r: tag.count * 10, // count 값에 10을 곱하여 반영
        label: tag.name,
        backgroundColor: tag.color,
        id: tag.id // 감정 태그 ID 추가
      }));


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
            backgroundColor: '#ffffff', // 툴팁 배경색 흰색
            borderColor: '#000000', // 툴팁 경계선 색상
            borderWidth: 1, // 툴팁 경계선 두께
            titleColor: '#000000',
            bodyColor: '#000000',
            bodyFont: {
              weight: '600', // 툴팁 본문 텍스트를 두껍게
              size: 14, // 폰트 크기
              family: 'Arial, sans-serif', // 폰트 패밀리 설정
            },
            padding: 8,
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
              lineWidth: (context) => (context.tick.value === 0 ? 3 : 0),
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
              lineWidth: (context) => (context.tick.value === 0 ? 3 : 0),
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
      createChart();
    });

    watch(() => props.emotions, () => {
      createChart();
    }, { deep: true });

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