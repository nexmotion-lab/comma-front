<script lang="ts">
import {defineComponent, ref} from 'vue'
import BaseView from '@/components/common/BaseView.vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import {
  IonPage,
  modalController,
  onIonViewWillEnter,
  onIonViewWillLeave,
  useBackButton,
  useIonRouter
} from "@ionic/vue";
import ModalComponent from "@/components/SettingModal.vue";
import selectImg from "@/assets/diary/select.png"
import dotoImg from "@/assets/diary/doto-diary-finish.png";
import doreImg from "@/assets/diary/dore-diary-finish.png";
import BaseHeader from "@/components/common/BaseHeader.vue";
import { App } from '@capacitor/app'
import apiClient from "@/axios";
import DiaryDetail from "@/components/diary/DiaryDetail.vue";
import {Diary} from "@/views/diary/DiaryList.vue";

export default defineComponent({
  name: 'SelectCharacter',
  components: {
    BaseHeader,
    'ion-page':IonPage,
    'BaseButton': BaseButton,
    'BaseBottomBar': BaseBottomBar,
    ModalComponent
  },
  data() {
    return {
      nickname: "아아아아",
      showModal: false,
      selectImg, dotoImg, doreImg
    }
  },
  setup() {

    const diary = ref<Diary[]>([])


    async function onDateClick() {

      const date = new Date();

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0'); // 일자

      const formattedDate = `${year}-${month}-${day}`;

      const response = await apiClient.get<Diary[]>('/api/diary/diary', {
        params: {
          startDate: formattedDate,
          endDate: formattedDate,
          orderByDesc: true,
        }
      });

      if (response.data) {
        diary.value = response.data
        const modal = await modalController.create({
          component: DiaryDetail,
          componentProps: {
            diary: diary.value[0]
          },
          cssClass: 'diary-modal'
        });
        modal.present();
      }

    }

    const router = useIonRouter();
    const handleBackButton = () => {
      // 뒤로가기 버튼을 누르면 홈 페이지로 이동
      router.replace({ path: '/home' });
    };

    useBackButton(10, (processNextHandler) => {
      handleBackButton();
    });

    return {
      handleBackButton, onDateClick
    };
  }
})
</script>

<template>
  <ion-page class="custom-page">
    <BaseHeader></BaseHeader>
    <ion-content scroll-y="false" class="background">
      <div class="content-container">
        <div class="user-container">

        </div>


        <ion-card class="speech-bubble"><ion-card-content class="text">우리 꽤 친해진 것 같은데~ 너에 대해 알게 돼서 행복해</ion-card-content></ion-card>
        <div class="img-container">
          <ion-img class="img" style="height: 28vh" :src="dotoImg" alt="도토 이미지" />
          <ion-img class="img" :src="doreImg" alt="도레 이미지" />
        </div>
        <div class="btn-wrap">
          <BaseButton class="diary-finish-btn" @click="$router.replace({path: '/diary/list'})">타임라인</BaseButton>
          <BaseButton class="diary-finish-btn" @click="onDateClick">일기보기</BaseButton>
        </div>
      </div>
    </ion-content>
      <BaseBottomBar></BaseBottomBar>
  </ion-page>
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
  margin: 3vh 5vw;
  border-radius: 80px;
  height: 20vh;

}

.background {
  --background: var(--background-color)
}

.text {
  flex: 1;
  font-size: 5vw;
  padding-top: 3vh;
  padding-bottom: 3vh;
}

.img-container {
  display:flex;
  margin-right: 0.5vw;
  margin-left: 0.5vw;
  margin-top: 5vh;
}

.img {
  width: 50vw;
  height: 30vh;
}

.btn-wrap{
  margin-top: 3vh;
  display: flex;
  justify-content: center;
  gap: 9vw;
}

.diary-finish-btn {
  width: 34vw;
  height: 5vh;
  font-size: 5vw;
  --border-radius: 30px;
  --border-color: black;
  --border-style: solid;
  --border-width: 1px;
}
</style>