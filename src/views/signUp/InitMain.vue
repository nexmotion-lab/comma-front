<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonAvatar,
  IonChip,
  IonModal,
  IonDatetime, IonButton, IonInput
} from "@ionic/vue";
import {onMounted, ref, watch} from "vue";
import { calendarNumberOutline } from "ionicons/icons";
import store from "@/store";
import apiClient from "@/axios";
import router from "@/router";

const isOpen = ref(false);
const selectedSegment = ref('');
const selectedDate = ref('');
const name = ref( '');
const inputClass = ref('');
const dateClass = ref('');

const setOpen = (open: boolean) => (isOpen.value = open);
const handleSegmentChange = (event) => {
  selectedSegment.value = event.detail.value;
};

const handleDateChange = (event) => {
  const date = event.detail.value;
  selectedDate.value = date.split('T')[0];
}

const segmentPopover = ref(false);
const namePopover = ref(false);
const datePopover = ref(false);

const openPopover = (popoverType) => {
  if (popoverType === 'segment') {
    segmentPopover.value = true;
  } else if (popoverType === 'name') {
    inputClass.value = 'input-danger'
    namePopover.value = true;
  } else if (popoverType === 'date') {
    dateClass.value = 'date-danger'
    datePopover.value = true;
  }
};

async function startProcess() {
  if (!selectedSegment.value) {
    openPopover('segment');
  } else if (!name.value) {
    openPopover('name');
  } else if (!selectedDate.value) {
    openPopover('date');
  } try {
    const response = await apiClient.post('/account/info', {}, {
      params: {
        nickname: name.value,
        birthdate: selectedDate.value,
        gender: selectedSegment.value.toUpperCase()
      }
    });

    if (response.status === 200) {
      router.push({path: "/firstLogin"})
    }
  } catch (error) {
    console.log(error);
  }
}

watch(name, (newValue) => {
  if (newValue) {
    inputClass.value = '';
  }
})

watch(selectedDate, (newDate) => {
  if (newDate) {
    dateClass.value = '';
  }
})


onMounted(async () => {

  const response = await apiClient.get('/account/info', {});

  selectedSegment.value = response.data.gender.toUpperCase();
  selectedDate.value = response.data.birthdate;
  name.value = response.data.nickname;
});
</script>

<template>
  <ion-page class="page-custom">
    <ion-content class="background-content" scroll-y="false">
      <div class="title">
        <ion-text class="title-text"></ion-text>
      </div>
      <ion-card class="main-card">
        <ion-card-content class="content">
          <ion-text color="dark" class="first-text">
            당신의 정보를 <br>입력해주세요
          </ion-text>
          <ion-segment :scrollable="false" @ionChange="handleSegmentChange" :value="selectedSegment">
            <ion-segment-button value="man" class="man-segment">
              <ion-text>남자</ion-text>
              <ion-avatar>
                <span class="material-symbols-outlined man">face_6</span>
              </ion-avatar>
            </ion-segment-button>
            <ion-segment-button value="woman" class="woman-segment">
              <ion-text>여자</ion-text>
              <ion-avatar>
                <span class="material-symbols-outlined woman">face_3</span>
              </ion-avatar>
            </ion-segment-button>
          </ion-segment>
          <ion-input v-model="name" :class="inputClass" label="닉네임 입력" label-placement="stacked" fill="outline" :clear-input="true" placeholder="이름"
                     helper-text="실명 사용을 추천합니다." counter="true" maxlength="20" class="input-name"></ion-input>
          <ion-chip :class="dateClass" outline="true" id="datetime-modal" @click="setOpen(true)" class="date-chip">
            <ion-avatar class="calendar-avatar">
              <ion-icon :icon="calendarNumberOutline" class="calendar-icon"></ion-icon>
            </ion-avatar>
            <ion-label>출생년도 : &nbsp;&nbsp;&nbsp;&nbsp;{{ selectedDate }}</ion-label>
          </ion-chip>
          <ion-modal :is-open="isOpen" @willDismiss="setOpen(false)" id="example-modal">
            <ion-datetime presentation="date" :prefer-wheel="true" @ionChange="handleDateChange" :value="selectedDate"></ion-datetime>
          </ion-modal>
          <ion-button class="start-button" @click="startProcess">시작하기</ion-button>

          <ion-popover id="segment-popover" :is-open="segmentPopover" @didDismiss="segmentPopover = false">
            <ion-content class="ion-padding">성별을 선택하세요.</ion-content>
          </ion-popover>
          <ion-popover id="name-popover" :is-open="namePopover" @didDismiss="namePopover = false">
            <ion-content class="ion-padding">이름을 입력하세요.</ion-content>
          </ion-popover>
          <ion-popover id="date-popover" :is-open="datePopover" @didDismiss="datePopover = false">
            <ion-content class="ion-padding">출생년도를 선택하세요.</ion-content>
          </ion-popover>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<style scoped>


.page-custom {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #a8e063
}

.input-danger {
  --border-color: red !important;
  --highlight-color-focused: red
}

.date-danger {
  --color: red ;
  border-color: red;
}


.man {
  font-size: 48px; /* 아이콘 크기 */
  color: dodgerblue; /* 아이콘 색상 */
}

.woman {
  font-size: 48px;
  color: deeppink;
}

.background-content {
  --background: transparent;
}

.title {
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 6vw;
}

.title-text {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.5;
  color: white;
  z-index: 10;
}
.main-card {
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  height: 80vh;
  margin: 0;
  width: 100%;
}

.input-name {
  margin-top: 5vh;
  width: 72vw;
  --placeholder-color: #000000;
  --border-radius: 10px;
  --padding-start: 10px;
  --border-width: 1.5px;

}

.first-text {
  margin-top: 5vh;
  margin-bottom: 5vh;
  font-family: "Noto Sans KR", sans-serif;
  font-weight: 400;
  font-size: 25px;
  font-style: normal;
}




.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.man-segment {
  --color-checked: dodgerblue;
}

.woman-segment {
  --color-checked: hotpink;
}

.calendar-icon {
  font-size: 6vw;
}

.calendar-avatar {
  margin-left: 1vw;
}
ion-modal#example-modal {
  --width: fit-content;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

.date-chip {
  margin-top: 5vh;
  width: 72vw;
  height: 6vh;
  --border-color: red;
}

.start-button {
  margin-top: 5vh;
}

ion-popover#segment-popover::part(content) {
  top: unset !important;
  left: 25vw !important;
  bottom: 40vh;
  width: auto;
  border-radius: 20px;
}

ion-popover#name-popover::part(content) {
  top: unset !important;
  left: 25vw !important;
  bottom: 28vh;
  width: auto;
  border-radius: 20px;
}

ion-popover#date-popover::part(content) {
  top: unset !important;
  left: 22vw !important;
  bottom: 17vh;
  width: auto;
  border-radius: 20px;
}


</style>

