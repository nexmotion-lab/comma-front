<script setup lang="ts">
import {IonCard, IonImg} from "@ionic/vue";
import {computed, defineProps} from 'vue';

const props = defineProps<{
  text: string
}>();

import imageSrcDoto from '@/assets/diary/doto-diary.png';
import imageSrcDore from '@/assets/diary/dore-diary.png';
import {useStore} from "vuex";

const store = useStore();

const imageSrc = computed(() => {
  return store.state.diaryChar === 'doto' ? imageSrcDoto : imageSrcDore;
});

</script>

<template>
  <div class="container">
    <ion-card class="information">
      {{text}}
    </ion-card>
    <ion-img :src="imageSrc" class="diary-img"></ion-img>
  </div>
</template>

<style scoped>

.container {
  display: flex;
  align-items: center;
}

.information {
  width: 68vw;
  height: 10vh;
  margin-bottom: 0;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 5vw;
  white-space: pre-line;
  border-radius: 30px;
  border: 1.5vw solid #A3E2B8FF;
  --background: white;
  margin-right: 0;
}

.diary-img {
  margin-top: 0.5vh;
  width: 25vw;
}

</style>