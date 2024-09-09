<template>
 <ion-page class="custom-page">
   <LoadingContent v-show="isLoading"></LoadingContent>
   <ion-content  v-show="!isLoading" scroll-y="false" style="--background: var(--background-color)">
     <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
       <ion-refresher-content refreshing-spinner="circles"></ion-refresher-content>
     </ion-refresher>

     <div class="user-container">
       <div class="setting-container">
       <ion-buttons slot="start" class="settings-button">
         <ion-button @click="openModal" class="settings-button">
           <ion-icon :icon="settingSharp"></ion-icon>
         </ion-button>
       </ion-buttons>
       </div>

       <!-- 닉네임 영역 -->
       <div class="nickname-container">
         <ion-chip color="medium" style="height: 6vh"><ion-text class="nickname" color="success">{{ nickname }}</ion-text></ion-chip>
       </div>
     </div>

     <!-- 오른쪽 네비게이션 바 -->
     <div class="right-navbar">
       <ul class="item-list">
         <li v-for="item in itemList" :key="item.id">
           <div @click="navigate(item.routerLink)">
              <ion-img :src="item.imageUrl" class="nav-img"/>
           </div>
         </li>
       </ul>
     </div>

     <!-- 메인 컨텐츠 영역 -->
     <div class="main-content-wrapper">
       <div class="speech-bubble shadow">
         <div class="speech-bubble-description">
           <p v-html="interactionText"></p>
         </div>
       </div>
       <ion-img class="interaction-img" :src="interactionImg"></ion-img>
       <ion-img class="background-img" :src="groundImg"></ion-img>
     </div>
   </ion-content>
   <BaseBottomBar></BaseBottomBar>
 </ion-page>

</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {
  IonPage,
  IonContent,
  IonImg,
  IonText,
  IonChip,
  onIonViewWillEnter,
  IonIcon,
  IonButton,
  modalController, IonButtons, useIonRouter,
IonRefresher,
IonRefresherContent,
} from '@ionic/vue';
import BaseBottomBar from "@/components/common/BaseBottomBar.vue";
import ground from '@/assets/home/ground.png'
import chart from '@/assets/home/chart.png';
import calendar from '@/assets/home/callender.png';
import {navigate, settingsSharp} from "ionicons/icons";

import {ref} from "vue";
import SettingModal from "@/components/SettingModal.vue";
import apiClient, {isLogin} from "@/axios";
import {useStore} from "vuex";
import LoadingContent from "@/components/common/LoadingContent.vue";
import router from "@/router";



interface ListItem {
  id: number;
  imageUrl: string;
  routerLink: string;
}

export default defineComponent({
  name: 'MyComponent',
  components: {
    IonButtons,
    IonButton,
    BaseBottomBar,
    IonRefresher, IonRefresherContent,
    IonPage,
    IonContent,
    IonImg,
    IonText,
    IonChip, IonIcon, LoadingContent,
  },
  setup: function () {
    const isLoading = ref(true);
    const router = useIonRouter();
    const showModal = ref(false);
    const nickname = computed(
        () => store.state.name
    )
    const groundImg = ground;
    const settingSharp = settingsSharp;
    const store = useStore();
    const interactionImg = ref('');
    const interactionText = ref('')

    const itemList: ListItem[] = [
      {id: 1, imageUrl: chart, routerLink: "/statistics"},
      {id: 2, imageUrl: calendar, routerLink: "/calendar"}
    ];

    const handleRefresh = async (event) => {
      await getInteraction();
      await updateInfo();
      event.target.complete();
    };

    const getInteraction = async () => {
      const response = await apiClient.get('/api/diary/interaction/user');
      console.log(response.data)
      const interactionData = response.data;
      interactionImg.value = `data:image/jpeg;base64,${interactionData.image}`
      const ran = Math.floor(Math.random() * interactionData.texts.length);
      interactionText.value = interactionData.texts[ran]
      console.log(interactionText.value);
    }

    const updateInfo = async () => {

      try {
        const response = await apiClient.get('/api/account/info', {

        });

        if (response.data) {
          store.dispatch('setUser', response.data.nickname);
          store.dispatch('setBirthday', response.data.birthdate);
          store.dispatch('setGender', response.data.gender.toLowerCase());

        }
      } catch (error) {
        console.error(error)
      }

    }

    onIonViewWillEnter(async () => {
      isLoading.value = true;
      if (!await isLogin()) {
        console.log("라우팅")
        router.replace({path: '/login'})
        return
      }
      await updateInfo();
      await getInteraction();
      isLoading.value = false;
    });

    const navigate = (path: string) => {
      router.push({ path });
    }


    const openModal = async () => {
      const modal = await modalController.create({
        component: SettingModal,
        cssClass: 'setting-modal'
      });

      await modal.present();

    };

    return {
      openModal,
      nickname,
      itemList,
      groundImg, settingSharp, interactionImg, interactionText,
      isLoading, handleRefresh, navigate

    };
  }
});
</script>

<style scoped>

.settings-button {
  --background: rgba(255, 255, 255, 0);
  --color: #595656;
  --padding: 0;
  font-size: 10vw;
}



ion-content{
  align-items: center;
}

.ios .user-container {
  margin-left: 3vw;
}

.user-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  top: 20px;
  left: 5px;
}

.ios ion-content {
  --padding-top: 5vh
}

.nickname{
  padding-left: 2vw;
  padding-right: 2vw;
  font-weight: bold;
  font-size: 4vw;
}

.setting-container{
  justify-content: space-between;
  width: 20vw;
  z-index: 2;
}

.setting-img{
  --background: rgba(255, 255, 255, 0);
  --color: #595656;
  --padding: 0;
  font-size: 10vw;
}

.right-navbar {
  position: absolute;
  left: 75%;
  top: 5%;
}

.item-list {
  list-style-type: none; /* 리스트에서 점 제거 */
  padding: 0;
}

.nav-img{
  margin-bottom: 20px;
  width : 70%;
}

.main-content-wrapper{
  display: flex;
  justify-content: center
}

.speech-bubble {
  background: #ffffff;
  border-radius: 1.6em;
  position: absolute;
  border: 1px solid lightgray;
  padding: 1.5vh 4vh;
  bottom: 58%;
  height: auto;
  width: auto;
  margin: 0 10px;
  z-index: 2;
}

.speech-bubble:after {
  content: '';
  position: absolute;
  bottom: -2.1vh; /* 말풍선 아래에 위치하도록 설정 */
  left: 36%;
  width: 2.4vh; /* 꼬리의 너비 */
  height: 2vh; /* 꼬리의 높이 */
  background: #ffffff; /* 꼬리의 배경색 */
  border: 1px solid lightgray; /* 꼬리의 테두리 색 */
  border-top: none; /* 상단 테두리 제거 */
  border-bottom-left-radius: 8vh; /* 하단 왼쪽 모서리를 둥글게 */
  border-bottom-right-radius: 2vh; /* 하단 오른쪽 모서리를 둥글게 */
  transform: translateX(-1vh);

  box-shadow: 0 1px 1px rgba(100,100,100,0.11),
  0 2px 2px rgba(100,100,100,0.11),
  0 1px 1px rgba(100,100,100,0.11),
  0 1px 1px rgba(100,100,100,0.11),
  0 1px 1px rgba(100,100,100,0.11);
}

.speech-bubble-description{
  font-size: 4vw;
  text-align: center;
  font-weight: bold;
}

.shadow {
  box-shadow: 0 1px 1px rgba(100,100,100,0.11),
  0 2px 2px rgba(100,100,100,0.11),
  0 1px 1px rgba(100,100,100,0.11),
  0 1px 1px rgba(100,100,100,0.11),
  0 1px 1px rgba(100,100,100,0.11);
}

.interaction-img {
  position: absolute;
  height: 80%;
  width: 90%;
  top: 20%;
  z-index: 1;
}

.background-img {
  position: absolute;
  height: 80%;
  width: 90%;
  top: 30%;
  z-index: 0;
}

</style>