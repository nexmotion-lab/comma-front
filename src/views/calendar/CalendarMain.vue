<template>
  <BaseHeader></BaseHeader>
  <BaseView/>
  <ion-content class="custom-content">
    <ion-card>
      <ion-card-header>
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-modal :keep-contents-mounted="true">
          <ion-datetime id="datetime" presentation="month-year" show-default-buttons="true" cancel-text="취소" done-text="확인"></ion-datetime>
        </ion-modal>
      </ion-card-header>
      <ion-card-content>
        ㅎㅇ
      </ion-card-content>
    </ion-card>
  </ion-content>
  <BaseBottomBar></BaseBottomBar>

</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import { IonModal, IonDatetime, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonDatetimeButton
,IonPopover} from '@ionic/vue';
import BaseView from "@/components/common/BaseView.vue";
import BaseBottomBar from "@/components/common/BaseBottomBar.vue";
import BaseHeader from "@/components/common/BaseHeader.vue";



export default defineComponent({
  name: "CalendarMain",
  setup() {
    const isModalOpen = ref(false);
    const selectedDate = ref('');

    const formattedDate = computed(() => {
      if (!selectedDate.value) return '';
      const date = new Date(selectedDate.value);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    });

    const openDatePicker = async () => {
      isModalOpen.value = true;
    };

    const closeDatePicker = () => {
      isModalOpen.value = false;
    };

    const onDateChange = (event) => {
      selectedDate.value = event.detail.value;
    };

    return {
      isModalOpen,
      openDatePicker,
      closeDatePicker,
      onDateChange,
      formattedDate,
      selectedDate,
    };
  },
  components: {
    BaseView,
    IonDatetimeButton,
    BaseBottomBar,
    BaseHeader,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonModal,
    IonDatetime,
    IonButton,
    IonPopover
  },

});
</script>

<style scoped>
.custom-content {
  --background: #f0fff7; /* 배경색 변경 */
}
</style>
