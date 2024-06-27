<template>
  <ion-button><slot>default</slot></ion-button>
</template>

<script lang="ts">
import { IonButton } from '@ionic/vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { IonButton }
})
</script>

<style scoped>
ion-button {
  --background: #459b62;
  --border-color: #65bf8c;
  --color: white;
  --border-radius: 1em;
  --padding-top: 1px;
  --padding-bottom: 1px;
  --padding-start: 1.2em;
  --padding-end: 1.2em;
  margin: 0.5em;
}
</style>
