<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import {IonPage, IonContent, IonCard, IonFooter, onIonViewDidEnter} from "@ionic/vue";
import SettingModal from "@/components/SettingModal.vue";
import selectImg from "@/assets/diary/select.png";
import dotoImg from "@/assets/diary/select_doto.png";
import doreImg from "@/assets/diary/select_dore.png";
import BaseHeader from "@/components/common/BaseHeader.vue";
import ModalComponent from "@/components/home/SettingModal.vue";
import SpeechBubble from "@/components/icons/SpeechBubble.vue";

export default defineComponent({
  name: 'SelectCharacter',
  components: {
    'speech-bubble': SpeechBubble,
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
  <ion-page>
    <BaseHeader></BaseHeader>
    <ion-content scroll-y="false" class="background">
      <div class="content-container">
        <speech-bubble style="margin-top: 5vh">누구랑 일기 쓸래?</speech-bubble>
        <div class="img-container">
          <ion-img class="img" :src="dotoImg" alt="도토 이미지" />
          <ion-img class="img" :src="doreImg" alt="도레 이미지" />
        </div>
        <div class="btn-wrap">
          <BaseButton class="diary-finish-btn" @click="$router.push({path: '/diary/create', query: { character: 'doto' }})">도토</BaseButton>
          <BaseButton class="diary-finish-btn" @click="$router.push({path: '/diary/create', query: { character: 'dore' }})">도레</BaseButton>
        </div>
      </div>
    </ion-content>
      <BaseBottomBar></BaseBottomBar>
    <ModalComponent :isVisible="showModal" @close="showModal = false" />
  </ion-page>
</template>

<style scoped>
.diary-finish-btn {
  width: 34vw;
  height: 5vh;
  font-size: 4vw;
  --border-radius: 30px;
  --border-color: black;
  --border-style: solid;
  --border-width: 1px;
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
  padding-top: 10vh;
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
  font-size: 5vw;
}

.img-container {
  display:flex;
  margin-right: 0.5vw;
  margin-left: 0.5vw;
  margin-top: 20px;
  height: 30vh;
}

.img {
  width: 50vw;
}

.btn-wrap{
  display: flex;
  justify-content: center;
  gap: 25px;
  padding-top: 15vh;
}


</style>
