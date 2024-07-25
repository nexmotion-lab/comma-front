<script setup lang="ts">
import {IonRouterOutlet, IonPage, IonCard, IonLabel, IonTabs, IonTabBar, IonTabButton, IonChip, IonContent} from "@ionic/vue";
import {computed, ref, watch} from "vue";
import {selectedTab, selectTab } from "@/utils/tabs";
import {useStore} from "vuex";
import {useRoute} from "vue-router";

const store = useStore();
const route = useRoute()
const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

watch(route, (newRoute) => {
  const tabName = newRoute.path.split('/').pop();
  if (tabName) {
    selectedTab.value = tabName;
  }
});

const date = ref(getCurrentDate());

const isSetCoreEmotionTag = computed(() => {
  return store.state.diary.selectedEmotionTags.length >= 1;
})

const character = route.query.character;
store.dispatch('setDiaryChar', character);

</script>

<template>
  <ion-page>
    <ion-content scroll-y="false">
      <ion-card class="date-card">
        {{ date }}
      </ion-card>
      <ion-card class="tab-card">
        <ion-tabs>
          <ion-router-outlet animated="false"></ion-router-outlet>
          <ion-tab-bar slot="top">
            <ion-tab-button tab="event" href="/diary/create/event" >
              <ion-chip :class="['tab-button', { 'selected': selectedTab === 'event' }]">
                <ion-label>
                  사건
                </ion-label>
              </ion-chip>
            </ion-tab-button>

            <ion-tab-button tab="content" href="/diary/create/content" >
              <ion-chip :class="['tab-button', { 'selected': selectedTab === 'content' }]">
                <ion-label>
                  생각
                </ion-label>
              </ion-chip>
            </ion-tab-button>

            <ion-tab-button tab="emotion" href="/diary/create/emotion" >
              <ion-chip :class="['tab-button', { 'selected': selectedTab === 'emotion' }]">
                <ion-label>
                  감정
                </ion-label>
              </ion-chip>
            </ion-tab-button>

            <ion-tab-button tab="coreEmotion" href="/diary/create/coreEmotion" :disabled="!isSetCoreEmotionTag">
              <ion-chip :class="['tab-button', { 'selected': selectedTab === 'coreEmotion' }]">
                <ion-label>
                  핵심
                </ion-label>
              </ion-chip>
            </ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<style scoped>

.tab-card{
  height: 80vh;
  box-shadow: none;
  margin-top: 1vh;
}

ion-content {
  --ion-background-color: #f0fff7;
}

.date-card {
  margin-top: 3vh;
  --background: white;
  height: 5.5vh;
  margin-bottom: 0;
  margin-left: 4vw;
  margin-right: 4vw;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 5vw;
  white-space: pre-line;
  border-radius: 30px;
  border-left: 2vw solid #A3E2B8FF;
  border-right: 2vw solid #A3E2B8FF;
}

ion-tab-bar {
  border: 0;
  height: 7vh;
}

ion-tab-button {
  --width: auto;
  --padding-start: 0;
  --padding-end: 0;
}



.tab-button {
  --background: #A3E2B8FF;
  width: 21vw;
  height: 5vh;
  border-radius: 40px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 5vw;
}

.tab-button.selected {
  --background: #4f8d69; /* 선택된 탭의 색상 */
  color: white;
}

</style>