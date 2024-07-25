<template>
  <ion-content class="ion-padding">
    <ion-text>{{ message }}</ion-text>
  </ion-content>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{ message: string }>();
</script>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다. */
</style>
