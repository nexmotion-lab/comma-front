<template>
  <ion-card>
    <ion-card-content><slot>대사 출력 부분</slot></ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import { IonCard, IonCardContent } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonCard, IonCardContent },
});
</script>
<style scoped>
  ion-card {
    margin: 10px;
    margin-left: 30px;
    margin-right: 30px;
    border-radius: 1.5rem;
    border: 0.8vw solid darkgray;
  }
  ion-card-content {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    text-align: center;
    font-size: 5vw;
  }
</style>