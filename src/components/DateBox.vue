<script lang="ts">
import { defineComponent } from 'vue'
import { IonCard, IonCardContent } from '@ionic/vue'

export default defineComponent({
  name: 'DateBox',
  components: {
    IonCard, IonCardContent
  }
})
</script>

<template>
  <ion-card>
    <ion-card-content><slot>날짜 출력 부분</slot></ion-card-content>
  </ion-card>
</template>

<style scoped>
ion-card {
  margin: 10px;
  border-radius: 1rem;
}
ion-card-content {
  padding-top: 0.8em;
  padding-bottom: 0.8em;
  text-align: center;
}
</style>