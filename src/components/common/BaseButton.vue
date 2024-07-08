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
  --background: var(--main-color);
  --background-activated: var(--main-color-shade);
  --color: black;
  --border-radius: 15px;
}
</style>