<script lang="ts">
import { defineComponent } from 'vue'
import BaseView from '@/components/common/BaseView.vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import SpeechBubble from '@/components/icons/SpeechBubble.vue'
import NicknameComponent from '@/components/icons/NicknameComponent.vue'
import {IonPage} from "@ionic/vue";
import BaseHeader from "@/components/common/BaseHeader.vue";
import dotoImg  from "@/assets/diary/doto-write.png"
import {useRouter} from "vue-router";
import router from "@/router";

export default defineComponent({
  name: 'DiaryMain',
  methods: {
    router() {
      return router
    }
  },
  components: {
    BaseHeader,
    'BaseView': BaseView,
    'speech-bubble': SpeechBubble,
    'BaseButton': BaseButton,
    'BaseBottomBar': BaseBottomBar,
    'nickname': NicknameComponent,
    'ion-page': IonPage
  },
  setup() {
    const router = useRouter();
    return {dotoImg, router}
  }
})
</script>

<template>
  <ion-page class="custom-page">
  <BaseHeader></BaseHeader>
    <ion-content style="--background: var(--background-color)">


  <div class="container">
    <speech-bubble>오늘의 감정을 일기로 남길까?</speech-bubble>
    <ion-img :src="dotoImg" alt="도토 이미지" />
    <div class="btn-wrap">
      <BaseButton @click="router.push({path: '/diary/character'})">네</BaseButton>
      <BaseButton @click="router.push({path: '/diary/list'})">아니오<br>(타임라인)</BaseButton>
    </div>
  </div>
    </ion-content>
  <BaseBottomBar></BaseBottomBar>
  </ion-page>
</template>

<style scoped>



div {
  text-align: center;
}

.custom-page{
  justify-content: flex-start;
}
ion-img {
  height: 45vh;
}

.btn-wrap
{
  margin-top: 8vh;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 20px;
}

</style>