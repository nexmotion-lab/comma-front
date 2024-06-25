<template>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from "vue";
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
  
      const data = {
        datasets: [
          {
            label: 'Emotion Data',
            data: [
              { x: 1, y: 1, r: 20, label: '아주 신나는' },
              { x: -1, y: 1, r: 20, label: '만족스러운' },
              { x: -1, y: -1, r: 20, label: '행복한' },
              { x: 1, y: -1, r: 20, label: '즐거운' },
            ],
            backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
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
            min: -2,
            max: 2,
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
            min: -2,
            max: 2,
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
  
      onMounted(() => {
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