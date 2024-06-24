<template>
  <ion-card>
    <div class="content">
      <div class="content"><slot>2024.01.01</slot></div>
      <div class="content"><slot>#일 #기쁜 #좋은</slot></div>
    </div>
    <div class="circle "></div>
  </ion-card>
</template>

<script lang="ts">
import { IonCard } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonCard },
});
</script>

<style scoped>
  .circle {
    width: 4.5em;
    height: 4.5em;
    border-radius: 50%;
    background: indianred;
    float: right;
  }

  ion-card {
    margin: 0px 10px 10px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.8em;
  }

  .content {
    margin: 5px;
    color: black;
    font-weight: bold;
  }

  .content {
    width: 70%;
  }
</style>