<script lang="ts">
import { defineComponent } from 'vue'
import BaseView from '@/components/common/BaseView.vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import {IonPage} from "@ionic/vue";
import ModalComponent from "@/components/SettingModal.vue";

export default defineComponent({
  name: 'SelectCharacter',
  components: {
    'ion-page':IonPage,
    'BaseView': BaseView,
    'BaseButton': BaseButton,
    'BaseBottomBar': BaseBottomBar,
    ModalComponent
  },
  data() {
    return {
      nickname: "아아아아",
      showModal: false
    }
  }
})
</script>

<template>
  <BaseView/>
  <ion-page class="custom-page">
    <ion-content scroll-y="false">
      <div class="content-container">
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


        <ion-card class="speech-bubble"><ion-card-content class="text">누구랑 일기 쓸래?</ion-card-content></ion-card>
        <div class="img-container">
          <ion-img class="img" src="src/assets/select_doto.png" alt="도토 이미지" />
          <ion-img class="img" src="src/assets/select_dore.png" alt="도레 이미지" />
        </div>
        <div class="btn-wrap">
          <BaseButton @click="$router.push('/DiaryOne')">도토</BaseButton>
          <BaseButton @click="$router.push('/DiaryOne')">도레</BaseButton>
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
  display: inline-flex;
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
  cursor: pointer;
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
  margin-top: 5vh;
  display: flex;
  justify-content: center;
  gap: 25px;
}
</style>