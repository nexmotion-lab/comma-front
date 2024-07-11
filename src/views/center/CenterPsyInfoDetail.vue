<script lang="ts">
import { defineComponent } from 'vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { useRoute } from 'vue-router';
import { IonPage, IonCard } from "@ionic/vue";
import router from "@/router";
import TeachingNuguri from "@/assets/center/teaching_nuguri.png"

export default defineComponent({
  name: 'CenterPsyInfoDetail',
  components: {
    BaseButton,
    IonPage,
    IonCard,
  },
  setup() {
    const route = useRoute();
    const psyInfo = {
      id: route.params.id,
      title: route.query.title as string,
      content: route.query.content as string,
      image: route.query.image as string,
    };

    const navigate = (component: string) => {
      router.push({name:component})
    };

    return {
      psyInfo,
      navigate,
      TeachingNuguri
    };
  },
});
</script>


<!-- 상담센터 상담 정보 상세 페이지-->
<template>
  <ion-page>
  <ion-card class="content-wrapper">
    <div class="content">
      <div class="content-header">
        <div class="content-title">
    <!--        <p class="content-question">상담의 효과는 무엇인가요?</p>-->
          <p class="content-question">{{ psyInfo.title }}</p>
        </div>
        <button class="close-button" @click="navigate('CenterPsyInfo')">×</button>
      </div>
      <div class="content-description">
        <div class="content-summary-wrapper">
          <div class="content-summary-header">
            <p>내용 요약</p>
          </div>
          <div class="content-summary">
            <p>
              {{psyInfo.content}}
            </p>
          </div>
          <div class="content-summary-footer">
            <img class="footer-img" :src="TeachingNuguri" />
          </div>
        </div>
      <div class="content-cf-wrapper" v-if="psyInfo.image">
        <div class="content-cf-header">
          <p>참고)</p>
        </div>
        <div class="content-cf-image">
          <img src="" alt="이미지"/>
        </div>
        <div class="content-cf-description-header"><p>설명</p></div>
        <div class="content-cf-description">
          <p>
            Quisque tempus porttitor massa, vel condimentum risus finibus a. Aliquam viverra maximus-->
                      odio, id ornare justo tristique ac. Mauris euismod arcu eget neque sagittis rutrum. Ut
                      vehicula porta lacus nec lobortis. Vestibulum et elit ultrices, lacinia metus in, lobortis
                      est. Vivam
          </p>
        </div>
      </div>
    </div>
    <div class="content-bottom">
      <BaseButton class="previous-button" @click="navigate('CenterPsyInfo')">
        도움이 되었어요!
      </BaseButton>
    </div>
    </div>
  </ion-card>
  </ion-page>
</template>

<style scoped>


.content-wrapper {
  position: relative; /* 상대적 위치 설정 */
  letter-spacing: 0.6px;
  background-color: white;
  color: black;
  height: 80%;
  border-radius: 20px;
  margin: 20px 20px 15px 20px;

  display: flex;
  flex-direction: column; /* Flexbox로 세로 정렬 설정 */

}

.content{
  flex: 1; /* 콘텐츠가 남은 공간을 채우도록 설정 */
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 세로 스크롤 설정 */
  padding: 14px 0 18px 0; /* padding 조정 */
}

.content-header {
  display: flex;
  justify-content: center;
}

.content-title {
  justify-content: center;
  text-align: center;
  background-color: #9abfa6;
  border-radius: 20px;
  color: white;
  display: flex;
  margin-top : 0;
  margin-right: 10px;
  width: 80%;
}

.content-question {
  font-weight: 800;
  margin : 4px 0;
}

.close-button {
  background-color: rgb(168, 209, 168);
  padding-left: 1vh;
  padding-right: 1vh;
  padding-bottom: 0.5vh;
  border-radius: 50%;
  font-weight: 800;
  font-size: 20px;
  color: rgb(85, 163, 85);
}

.content-description{
  margin-bottom: 40px;
}

.content-summary-wrapper {
  margin: 0 15px 0 15px;
  position: relative;
  padding: 5px 0 5px 0;
  min-height: 400px;
}
.content-summary-wrapper p {
  color:black;
}

.content-summary{
  margin-bottom: 50px;
}
.content-summary-header p {
  font-size: 16px;
  font-weight: bold;
  display: flex;
}

.content-summary-footer {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  width: 100%;
  border-bottom : 2px solid #548263;
}
.footer-img {
  width: 35%; /* 필요에 따라 크기 조절 */
  margin-left: auto;
}

.content-cf-header p {
  font-size: 16px;
  font-weight: bold;
  display: flex;
}
.content-cf-wrapper{
  margin: 0 15px 0 15px;
}
.content-cf-image{
  width: 100%; /* Example width */
  height: 150px; /* Example height */
  border-radius: 10%; /* For circular shape */
  background-color: #cfd8dc; /* Example background color */
  display: flex;
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically */
}

.content-cf-description-header p {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 0;
}
.content-cf-description p{
  margin-top:5px;
}

.content-bottom {
  flex-shrink: 0;
  padding: 1vh 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: auto; /* 자동으로 위의 요소들을 밀어내면서 아래로 이동 */
}

.previous-button{
  border: none; /* 테두리를 제거합니다. */
  border-radius: 20px; /* 버튼의 모서리를 약간 둥글게 만듭니다. */
  width: fit-content;
  font-size: 16px; /* 텍스트 크기를 설정합니다. */
  cursor: pointer; /* 마우스를 올렸을 때 커서 모양을 변경합니다. */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 버튼에 그림자 효과를 추가합니다. */
}
</style>
