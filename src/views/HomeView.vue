<template>
  <BaseView/>
 <ion-page class="custom-page">
   <ion-content scroll-y="false">

     <!-- 닉네임 영역 -->
     <div class="nickname-container">
       <ion-chip color="medium"><ion-text color="success"><h1>윤동현</h1></ion-text></ion-chip>
     </div>

     <!-- 설정 아이콘 -->
     <div class="setting-container">
       <ion-img @click="showModal = true" src="/public/select.png" class="setting-img"/>
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
       <div class="speech-bubble">
         <div class="speech-bubble-description">
         <p>오늘 하루도 수고했어<br>항상 최승민을 응원해!!</p>
         </div>
       </div>
       <ion-img class="rabbit" src="/public/rabbit.png"></ion-img>
       <ion-img class="ground" src="/public/ground.png"></ion-img>
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

interface ListItem{
  id:number;
  imageUrl: string;
  routerLink:string;
}

export default {
  components: {ModalComponent, BaseView, BaseBottomBar, IonPage, IonFooter, IonContent},
  data() {
    return {
      showModal: false
    };
  },
  setup() {
    // 리스트 아이템 데이터
    const itemList: ListItem[] = [
      { id: 1, imageUrl: "/public/chart.png" , routerLink: "/"},
      { id: 2, imageUrl: "/public/callender.png", routerLink: "/"}
    ];

    return { itemList }
  },
};
</script>

<style scoped>
.custom-page{
  justify-content: normal;
}

ion-content{
  align-items: center;
}

ion-chip h1{
  margin-top: 1vh;
  font-size :25px;
}

.nickname-container{
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translateX(-50%);
}

.setting-container{
  position: absolute;
  top: 3%;
  left: 3%;
}

.setting-img{
  width: 50%;
}

.nav-img{
  margin-bottom: 3vh;
  width : 70%;
  height : 60%;
}

.right-navbar {
  position: absolute;
  left: 63%;
  top: 2%;
}

.item-list {
  list-style-type: none; /* 리스트에서 점 제거 */
  width: 40vw;
}

.main-content-wrapper{
  display: flex;
  justify-content: center
}

.speech-bubble {
  background: #ffffff;
  border-radius: 1.6em;
  position: absolute;
  border: 2px solid #000000;
  padding: 1vh 1.5vh;
  bottom: 58%;
  left: 15%;
  height: auto;
  width: auto;
}

.speech-bubble:after {
  content: '';
  position: absolute;
  bottom: -2.17vh; /* 말풍선 아래에 위치하도록 설정 */
  left: 36%;
  width: 2.4vh; /* 꼬리의 너비 */
  height: 2vh; /* 꼬리의 높이 */
  background: #ffffff; /* 꼬리의 배경색 */
  border: 2px solid #000000; /* 꼬리의 테두리 색 */
  border-top: none; /* 상단 테두리 제거 */
  border-bottom-left-radius: 8vh; /* 하단 왼쪽 모서리를 둥글게 */
  border-bottom-right-radius: 2vh; /* 하단 오른쪽 모서리를 둥글게 */
  transform: translateX(-1vh);
}

.speech-bubble-description{
  font-size: 2.1vh;
  text-align: center;
  font-weight: bold;
}

.rabbit {
  position: absolute;
  height: 80%;
  width: 90%;
  top: 20%;
  z-index: 1;
}

.ground {
  position: absolute;
  height: 80%;
  width: 90%;
  top: 30%;
  z-index: 0;
}

</style>