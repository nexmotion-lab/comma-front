<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start" class="settings-button">
        <ion-button @click="openSettings" class="settings-button">
          <ion-icon :icon="settingsSharp"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <ion-fab vertical="center" horizontal="end" class="centered-fab">
      <ion-fab-button>
        <ion-icon :icon="chevronBackCircle" class="custom-color"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="start" class="custom-fab-list">
        <ion-fab-button class="fab-button" size="large">
          <img src="/src/assets/calendar_btn.png" alt="Document Icon" class="fab-icon" />
        </ion-fab-button>
        <ion-fab-button class="fab-button" size="large">
          <img src="/src/assets/statistics_btn.png" alt="Color Palette Icon" class="fab-icon" />
        </ion-fab-button>
      </ion-fab-list>
    </ion-fab>
  </ion-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonFab, IonFabButton, IonFabList } from '@ionic/vue';
import { settingsSharp, chevronBackCircle } from 'ionicons/icons';

export default defineComponent({
  components: { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonFab, IonFabButton, IonFabList },
  setup() {
    return { settingsSharp, chevronBackCircle };
  },
  methods: {
    openSettings() {
      console.log('Settings button clicked');
    }
  }
});
</script>

<style scoped>

ion-toolbar {
  --background: var(--background-color);
  --color: #c0c0c0;
  --box-shadow: none;
  --border: none;
  --min-height: 10vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-color {
  color: white;
}


ion-fab-button {
  --padding: 10px;
}

/* 설정 버튼 스타일 조정 */
.settings-button {
  --background: rgba(255, 255, 255, 0);
  --color: #595656;
  --border-radius: 50%;
  --padding: 0;
  --width: 60px;
  --height: 60px;
}

ion-button {
  --background: transparent;
  --color: #ffffff;
}

ion-icon {
  font-size: 50px;
}

.custom-fab-list{
  gap: 1%;
  transform: translateY(-8px);
}

/* Fab 버튼 크기 조정 및 배경 투명 */
.fab-button {
  --background: transparent; /* 배경 투명 */
  width: 80px; /* 버튼 크기 키움 */
  height: 80px; /* 버튼 크기 키움 */
  --box-shadow: none; /* 그림자 제거 */
  padding: 0; /* 패딩 제거 */
  margin: 0;
}

/* Fab 버튼 안에 이미지 스타일링 */
.fab-icon {
  width: 70%; /* 이미지 크기 조정 */
  height: 70%; /* 이미지 크기 조정 */
  object-fit: contain; /* 이미지 비율 유지하며 버튼에 맞춤 */
  border-radius: 50%; /* 원형 이미지로 표시 */
}
</style>
