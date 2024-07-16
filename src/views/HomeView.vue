<template>
  <BaseView/>
 <ion-page class="custom-page">
   <ion-content scroll-y="false">

     <div class="user-container">
       <!-- 설정 아이콘 -->
       <div class="setting-container" @click="showModal = true">
         <ion-img src="/public/select.png" class="setting-img"/>
       </div>

       <!-- 닉네임 영역 -->
       <div class="nickname-container">
         <ion-chip color="medium"><ion-text class="nickname" color="success">{{ nickname }}</ion-text></ion-chip>
       </div>
     </div>
     <ModalComponent :isVisible="showModal" @close="showModal = false" />

     <!-- 오른쪽 네비게이션 바 -->
     <div class="right-navbar">
       <ul class="item-list">
         <li v-for="item in itemList" :key="item.id">
           <router-link :to="item.routerLink">
              <ion-img :src="item.imageUrl" class="nav-img"/>
           </router-link>
         </li>
       </ul>
     </div>

     <!-- 메인 컨텐츠 영역 -->
     <div class="main-content-wrapper">
       <div class="speech-bubble shadow">
         <div class="speech-bubble-description">
           <p v-html="currentInteraction.text"></p>
         </div>
       </div>
       <ion-img class="interaction-img" :src="currentInteraction.imageUrl"></ion-img>
       <ion-img class="background-img" src="/public/ground.png"></ion-img>
     </div>
   </ion-content>
   <ion-footer>
     <BaseBottomBar></BaseBottomBar>
   </ion-footer>
 </ion-page>
</template>

<script lang="ts">
import { IonPage, IonFooter, IonContent} from '@ionic/vue';
import BaseBottomBar from "@/components/common/BaseBottomBar.vue";
import BaseView from "@/components/common/BaseView.vue";
import ModalComponent from '@/components/SettingModal.vue';
import {ref} from "vue";

interface ListItem{
  id:number;
  imageUrl: string;
  routerLink:string;
}

interface Interaction {
  id: number;
  imageUrl: string;
  text: string;
}

export default {
  components: {ModalComponent, BaseView, BaseBottomBar, IonPage, IonFooter, IonContent},
  data() {
    return {
      showModal: false,
      nickname: "아아아아아"
    };
  },
  setup() {
    const itemList: ListItem[] = [
      { id: 1, imageUrl: "/public/chart.png", routerLink: "/statichome" },
      { id: 2, imageUrl: "/public/callender.png", routerLink: "/calendar" }
    ];

    const interactions: Interaction[] = [
      { id: 1, imageUrl: "/src/assets/action1-2.png", text: "무엇보다 너가 가장 소중한 사실<br>절대 잊지마" },
      { id: 2, imageUrl: "/src/assets/action2-2.png", text: "슬픔이란 누구나 느낄 수 있는<br>자연스러운 감정이야" },
      { id: 3, imageUrl: "/src/assets/action3-2.png", text: "너의 약점을 잘 살펴봐.<br>분명 너를 강하게 해줄테니" },
      { id: 4, imageUrl: "/src/assets/action4-2.png", text: "'어떡하지'보다 '어쩌겠어'로<br>어차피 할 거 기분 좋게<br>해보는거 어때?" },
      { id: 5, imageUrl: "/src/assets/action5-3.png", text: "오늘도 나는 널<br>사랑해 사랑해 사랑해" },
      { id: 6, imageUrl: "/src/assets/action6-2.png", text: "너의 웃음 하나에 살아갈 힘을 얻는 사람이 있다는 사실을 잊지마~" },
      { id: 7, imageUrl: "/src/assets/action7-2.png", text: "잘 살아라, 그게 최고의 복수다.<br>-탈무드-" },
      { id: 8, imageUrl: "/src/assets/action8-2.png", text: "오래 살아보니 알겠다.<br>꾸준함이 재능이고, 그 꾸준함은<br>좋아하는 마음에서 나온다는 것을.<br>좋아하는 것을 찾으세요.<br>당신은 천재가 됩니다." },
      { id: 9, imageUrl: "/src/assets/action9-2.png", text: "지각했다고?<br>아니야 세상이 빨랐던거야" },
      { id: 10, imageUrl: "/src/assets/action10-2.png", text: "또! 너무 과하게 생각하고 있네<br>생각 스탑" },
      { id: 11, imageUrl: "/src/assets/action11-2.png", text: "너의 약점을 잘 살펴봐.<br>분명 너를 강하게 해줄테니" },
      { id: 12, imageUrl: "/src/assets/action12-2.png", text: "이젠 나를 좀 더 사랑할거야<br>[버즈 - 나에게로 떠나는 여행]" },
      { id: 13, imageUrl: "/src/assets/action13-1.png", text: "보고 싶었어!!<br>왜 이제 왔어" },
      { id: 14, imageUrl: "/src/assets/action14-2.png", text: "삶이 있는 한 희망은 존재한다" },
      { id: 15, imageUrl: "/src/assets/action15-2.png", text: "혹시 일기 썼어?<br>안 썼으면 같이 쓰러 가자" },
      { id: 16, imageUrl: "/src/assets/action16-3.png", text: "일기 안 썼으면<br>지금 당장 쓰러 가자!!!" },
      { id: 17, imageUrl: "/src/assets/action17-2.png", text: "같이 일기 쓰러 가자~~~~" },
      { id: 18, imageUrl: "/src/assets/action18-2.png", text: "일기 쓰러 가지 않을래?<br>(๑•᎑<๑)ｰ☆" },
    ];

    const currentInteraction = ref<Interaction>({ id: 0, imageUrl: '', text: '' });

    // 페이지가 생성될 때 랜덤으로 이미지와 텍스트를 선택
    const selectRandomInteraction = () => {
      const randomIndex = Math.floor(Math.random() * interactions.length);
      currentInteraction.value = interactions[randomIndex];
    };

    // 컴포넌트가 생성될 때 랜덤 이미지 설정
    selectRandomInteraction();

    return {
      itemList,
      currentInteraction,
    };
  }
}
</script>

<style scoped>
.user-container {
  position: absolute;
  display: inline-flex;
  align-items: center;
  top: 20px;
  left: 5px;
}

.custom-page{
  justify-content: normal;
}

ion-content{
  align-items: center;
}

.nickname-container{
  justify-content: space-between;
}

.nickname{
  padding: 4px;
  font-weight: bold;
  font-size: 4vw;
}

.setting-container{
  justify-content: space-between;
  width: 60px;
}

.setting-img{
  width: auto;
}

.right-navbar {
  position: absolute;
  left: 75%;
  top: 2%;
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
  font-size: 1.7vh;
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