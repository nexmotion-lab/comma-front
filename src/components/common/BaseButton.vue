<template>
  <div class="btn"><slot>default</slot></div>
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
    background-color: var(--main-color);
    color: black;
    border-radius: 15px;
    padding: 7px 20px;
    margin: 0.5em;
    width: max-content;
  }

  .btn:active {
    background-color: var(--main-dark-color);
  }
</style>