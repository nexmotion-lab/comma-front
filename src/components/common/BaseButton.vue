<template>
  <ion-button class="btn"><slot>default</slot></ion-button>
</template>

<script lang="ts">
import { IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonButton },
});
</script>

<style scoped>
  .btn {
    /*
    --background: var(--main-color);
     */
    --background: #A3E2B8;
    --color: black;
    --border-radius: 20px;
    margin: 0.5em;
    width: 13vh;
    height: 4vh;
  }

  .btn:active {
    --background: var(--main-dark-color);
  }
</style>