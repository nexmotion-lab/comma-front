<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import {IonPage, IonContent, IonCard, IonFooter} from "@ionic/vue";
import SettingModal from "@/components/SettingModal.vue";
import selectImg from "@/assets/diary/select.png";
import dotoImg from "@/assets/diary/select_doto.png";
import doreImg from "@/assets/diary/select_dore.png";
import BaseHeader from "@/components/common/BaseHeader.vue";
import ModalComponent from "@/components/home/SettingModal.vue";

export default defineComponent({
  name: 'SelectCharacter',
  components: {
    ModalComponent,
    IonPage,IonContent, IonCard, IonFooter,
    BaseHeader,
    'BaseButton': BaseButton,
    'BaseBottomBar': BaseBottomBar,
    SettingModal
  },
  data() {
    return {
      showModal: false,
      nickname: "아아아아아"
    };
  },
  setup() {
    return {
      selectImg,
      dotoImg,
      doreImg,
    };
  }
})
</script>

<template>
  <ion-page class="custom-page">
    <ion-content scroll-y="false" class="background">
      <div class="content-container">
        <div class="user-container">
          <!-- 설정 아이콘 -->
          <div class="setting-container" @click="showModal = true">
            <ion-img src="/public/select.png" class="setting-img"/>
          </div>

          <!-- 닉네임 영역 -->
          <div class="nickname-container">
            <ion-chip color="medium" style="height: 6vh"><ion-text class="nickname" color="success">{{ nickname }}</ion-text></ion-chip>
          </div>
        </div>
        <ion-card class="speech-bubble"><ion-card-content class="text">누구랑 일기 쓸래?</ion-card-content></ion-card>
        <div class="img-container">
          <ion-img class="img" :src="dotoImg" alt="도토 이미지" />
          <ion-img class="img" :src="doreImg" alt="도레 이미지" />
        </div>
        <div class="btn-wrap">
          <BaseButton @click="$router.push({path: '/diary/create', query: { character: 'doto' }})">도토</BaseButton>
          <BaseButton @click="$router.push({path: '/diary/create', query: { character: 'dore' }})">도레</BaseButton>
        </div>
      </div>
    </ion-content>
    <ion-footer>
      <BaseBottomBar></BaseBottomBar>
    </ion-footer>
  </ion-page>
  <ModalComponent :isVisible="showModal" @close="showModal = false" />
</template>

<style scoped>
.custom-page{
  justify-content: normal;
}

ion-content{
  align-items: center;
}

.user-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  top: 20px;
  left: 5px;
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
  width: auto;
}

.content-container {
  display: grid;
  height: 90vh;
  grid-template-rows: 15vh 20vh 35vh;
}

.speech-bubble {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  text-align: center;
  margin: 10px 30px;
  border-radius: 25px;
}

.background {
  --background: var(--background-color)
}

.text {
  flex: 1;
}

.img-container {
  display:flex;
  margin-right: 0.5vw;
  margin-left: 0.5vw;
  margin-top: 20px;
}

.img {
  width: 50vw;
}

.btn-wrap{
  display: flex;
  justify-content: center;
  gap: 25px;
}


</style>
