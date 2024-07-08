<script lang="ts">
import { defineComponent } from 'vue'
import { IonButton } from '@ionic/vue'

export default defineComponent({
  name: 'BaseRoundButton',
  components: { IonButton }
})
</script>

<template>
  <ion-button class="ios"><slot>default</slot></ion-button>
</template>

<style scoped>
ion-button {
  --background: var(--main-color);
  --background-activated: var(--main-color-shade);
  --color: black;
  --border-radius: 20em;
  --padding-start: 1.2em;
  --padding-end: 1.2em;
}
</style>