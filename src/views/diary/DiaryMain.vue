<script lang="ts">
import { defineComponent } from 'vue'
import BaseView from '@/components/common/BaseView.vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import SpeechBubble from '@/components/icons/SpeechBubble.vue'
import NicknameComponent from '@/components/icons/NicknameComponent.vue'

export default defineComponent({
  name: 'DiaryMain',
  components: {
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
  <nickname>정찬희</nickname>
  <div class="container">
    <speech-bubble>오늘의 감정을 일기로 남길까?</speech-bubble>
    <ion-img src="public/도토 기쁨 5.svg" alt="도토 이미지" />
    <div class="btn-wrap">
      <BaseButton>네</BaseButton>
      <BaseButton>아니오(타임라인)</BaseButton>
    </div>
  </div>
  <BaseBottomBar></BaseBottomBar>
</template>

<style scoped>
div {
  text-align: center;
}

ion-img {
  height: 45vh;
}

.container {

}

.btn-wrap {
  text-align: center;
}

bottom-nav {
  float: right;
}
</style>