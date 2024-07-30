<template>
  <ion-button :class="buttonClass" mode="ios"><slot>default</slot></ion-button>
</template>

<script lang="ts">
import { IonButton } from '@ionic/vue';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  components: { IonButton },
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const buttonClass = computed(() => {
      return props.isActive ? 'active-button' : 'inactive-button';
    });

    return {
      buttonClass,
    };
  },
});
</script>

<style scoped>
.active-button {
  --background: #459b62;
  --border-color: #65bf8c;
  --color: white;
  --border-radius: 1em;
  --padding-top: 1px;
  --padding-bottom: 1px;
  --padding-start: 1.2em;
  --padding-end: 1.2em;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  --transition: background-color 0.3s, box-shadow 0.3s;
  margin: 0.5em;
}

.inactive-button {
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  --transition: background-color 0.3s, box-shadow 0.3s;
  --background: #A3E2B8;
  --color: black;
  --border-radius: 1em;
  --padding-top: 1px;
  --padding-bottom: 1px;
  --padding-start: 1.2em;
  --padding-end: 1.2em;
  margin: 1vh;
}
</style>