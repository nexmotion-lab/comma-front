<script lang="ts">
import { defineComponent } from 'vue'
import BaseView from '@/components/common/BaseView.vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import SpeechBubble from '@/components/icons/SpeechBubble.vue'
import NicknameComponent from '@/components/icons/NicknameComponent.vue'
import {IonPage} from "@ionic/vue";

export default defineComponent({
  name: 'SelectCharacter',
  components: {
    'ion-page':IonPage,
    'BaseView': BaseView,
    'speech-bubble': SpeechBubble,
    'BaseButton': BaseButton,
    'BaseBottomBar': BaseBottomBar,
    'nickname': NicknameComponent
  }
})
</script>

<template>
  <BaseView/>
  <ion-page class="custom-page">
  <nickname>정찬희</nickname>
  <speech-bubble>누구랑 일기 쓸래?</speech-bubble>
  <div class="img-div">
    <ion-img src="public/도토 기쁨 5.svg" alt="도토 이미지" />
    <ion-img src="public/도레 기쁨 5.svg" alt="도레 이미지" />
  </div>
  <div class="btn-wrap">
    <BaseButton>도토</BaseButton>
    <BaseButton>도레</BaseButton>
  </div>
  <BaseBottomBar></BaseBottomBar>
  </ion-page>
</template>

<style scoped>
.custom-page{
  justify-content: normal;
}
div {
  text-align: center;
  margin: 30px;
}

img {
  width: 70%;
}

.img-div {
  display:flex;
  margin-right: 0.5vw;
  margin-left: 0.5vw;
  margin-top: 20px;
}

.btn-wrap{
  margin-top: 5vh;
  display: flex;
  justify-content: center;
  gap: 25px;
}
</style>