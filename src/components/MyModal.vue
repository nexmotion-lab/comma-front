<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MyModal',
  setup() {
    const modal = ref<any>(null);

    const openModal = () => {
      if (modal.value) {
        modal.value.present();
      }
    };

    const dismiss = () => {
      if (modal.value) {
        modal.value.dismiss();
      }
    };

    return {
      modal,
      openModal,
      dismiss,
    };
  },
})
</script>

<template>
  <ion-modal id="example-modal" ref="modal">
    <div class="wrapper">
      <slot></slot>
    </div>
  </ion-modal>
</template>

<style scoped>
ion-modal#example-modal {
  --width: fit-content;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

ion-modal#example-modal .wrapper {
  margin-bottom: 10px;
}
</style>