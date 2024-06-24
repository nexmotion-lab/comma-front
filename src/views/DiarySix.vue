<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseView from '@/components/common/BaseView.vue'
import FeelBlock from '@/components/icons/FeelBlock.vue';
import { personCircle } from 'ionicons/icons';
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import DiaryListItem from '@/components/DiaryListItem.vue'
import Nickname from '@/components/icons/NicknameComponent.vue'
// import DatePicker from '@/components/DatePicker.vue'

export default defineComponent({
  name: 'DiarySix',
  components: {
    BaseView,
    BaseBottomBar,
    FeelBlock,
    Nickname,
    DiaryListItem,
    // DatePicker
  },
  data(){
    return {
      visible: false
    }
  },
  methods: {
    handleClick(){
      this.visible = !this.visible
    }
  },
  setup() {
    const modal1 = ref<any>(null);
    const modal2 = ref<any>(null);
    const modal3 = ref<any>(null);

    const openModal1 = () => {
      if (modal1.value) {
        modal1.value.present();
      }
    };
    const openModal2 = () => {
      if (modal2.value) {
        modal2.value.present();
      }
    };
    const openModal3 = () => {
      if (modal3.value) {
        modal3.value.present();
      }
    };

    const dismiss1 = () => {
      if (modal1.value) {
        modal1.value.dismiss();
      }
    };
    const dismiss2 = () => {
      if (modal2.value) {
        modal2.value.dismiss();
      }
    };
    const dismiss3 = () => {
      if (modal3.value) {
        modal3.value.dismiss();
      }
    };

    return {
      modal1,
      openModal1,
      dismiss1,
      modal2,
      openModal2,
      dismiss2,
      modal3,
      openModal3,
      dismiss3,
      personCircle
    };
  },
})
</script>

<template>
  <BaseView/>
<!--  <div class="content">-->
<!--      <div class="nickname">-->
<!--        <p>닉네임</p>-->
<!--      </div>-->
<!--      <div class="memory">의 기록</div>-->
<!--  </div>-->
  <div class="nickname-wrap">
    <Nickname>임시닉네임123456<span class="description"> 의 기록</span></Nickname>
<!--    <div class="description">의 기록</div>-->
  </div>
  <div class="search-wrap">
    <div>
        <ion-img class="sea" src="/public/search.png" @click="handleClick"></ion-img>
        <p class="search-tag">2024.01.01 ~ 2024.03.31</p>
        <p class="shop">#</p>
    </div>
  </div>
<!--  <DatePicker :visible="visible"></DatePicker>-->
<!--    <ion-modal id="example-modal" ref="modal1">-->
<!--      <div class="wrapper">-->
<!--        <ion-list lines="none">-->
<!--          <ion-item>-->
<!--            <ion-label>시작일</ion-label>-->
<!--          </ion-item>-->
<!--          <ion-item>-->
<!--            <ion-label><h1>2024년 02월 27일</h1></ion-label>-->
<!--          </ion-item>-->
<!--          <ion-item>-->
<!--            <ion-label>종료일</ion-label>-->
<!--          </ion-item>-->
<!--          <ion-item>-->
<!--            <ion-label><h1>2024년 03월 13일</h1></ion-label>-->
<!--          </ion-item>-->
<!--          <ion-item :button="true" :detail="false" @click="dismiss1()">-->
<!--            <ion-label>취소</ion-label><ion-label @click="openModal2">확인</ion-label>-->
<!--          </ion-item>-->
<!--        </ion-list>-->
<!--      </div>-->
<!--    </ion-modal>-->

    <ion-modal id="example-modal" ref="modal2">
      <div class="wrapper">
        <ion-list lines="none">
          <ion-item>
            <ion-label><h1><br>#감정</h1></ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="feeltag">
              <div class="click">대인관계</div>
              <div class="click">가족</div>
              <div class="click">취미/여가</div>
              <div class="click">친구</div>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label><h1>#사건</h1></ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <div class="click">대인관계</div>
              <div class="click">가족</div>
              <div class="click">취미/여가</div>
              <div class="click">친구</div>
            </ion-label>
          </ion-item>
          <ion-item :button="true" :detail="false" @click="dismiss2()">
            <ion-label>
              <div class="center">
                <div class="xx">취소</div>
                <div class="yy">확인</div>
              </div>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-modal>

    <ion-modal id="example-modal" ref="modal3">
      <div class="wrapper">
        <ion-list lines="none">
          <ion-item>
            <ion-label><br><h1>2024년 03월 12일</h1></ion-label>
          </ion-item>
          <ion-item class="profile1">
            <ion-img class="profile2" src="/public/profile.png"></ion-img>
            <ion-label class="profile3"><h2><p class="pp">오늘 하루는 어땠어?</p></h2></ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="profile4"><h2><p class="pp">#기쁜 #좋은</p></h2></ion-label>
          </ion-item>
          <ion-item>
            <ion-img class="profile2" src="/public/profile.png"></ion-img>
            <ion-label class="profile3"><h2><p class="pp">무슨 일이 있었는지 궁금해!</p></h2></ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="profile4"><h2><p class="pp">#일</p></h2></ion-label>
          </ion-item>
          <ion-item>
            <ion-img class="profile2" src="/public/profile.png"></ion-img>
            <ion-label class="profile3"><h2><p class="pp">너의 생각을 듣고싶어</p></h2></ion-label>
          </ion-item>
          <ion-item :button="true" :detail="false" @click="dismiss3()">
            <ion-label>
              <div class="back">돌아가기</div><br></ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-modal>

<!--  <div class="block">-->
<!--    <div class="ment">-->
<!--        <p>2024.03.12</p>-->
<!--        <p>#일 #기쁜 #좋은</p>-->
<!--    </div>-->
<!--    <div class="circle"></div>-->
<!--  </div>-->
<!--  <FeelBlock date="2024.03.12" tags="#일 #기쁜 #좋은" @click="openModal3"/>-->
<!--  <FeelBlock date="2024.03.12" tags="#일 #기쁜 #좋은" />-->
  <div class="diary-list">
    <DiaryListItem>1</DiaryListItem>
    <DiaryListItem>2</DiaryListItem>
    <DiaryListItem>3</DiaryListItem>
    <DiaryListItem>4</DiaryListItem>
    <DiaryListItem>5</DiaryListItem>
    <DiaryListItem>6</DiaryListItem>
    <DiaryListItem>7</DiaryListItem>
    <DiaryListItem>8</DiaryListItem>
    <DiaryListItem>9</DiaryListItem>
  </div>
  <BaseBottomBar></BaseBottomBar>
</template>

<style scoped>
.nickname-wrap {
  display: flex;
  align-items: center;
  margin: 0px;
}
.description {
  width: max-content;
  font-size: smaller;
  margin: 0px;
}
.diary-list {
  margin: 0px;
  text-align: left;
  height: 70%;
  overflow-y: auto;
}
.profile1 {
  display: flex;
}
.profile2 {
  display: inline-block;
  height: 40px;
  margin-top: 1px;
  margin-right: 10px;
  float: left;
  margin-left: auto;
}
.profile3 {
  padding: 3px;
  width: 200px;
  text-align: center;
  border-radius: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: rgb(73, 153, 73);
  color: white;
}
.profile4 {
  padding: 3px;
  border-radius: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: rgb(184, 226, 184);
  color: black;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 150px;
}
.pp {
  font-weight: 600;
  font-size: 17px;
  text-align: center;
}
.xx {
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 20px;
  background-color: rgb(89, 185, 89);
  color: white;
  font-weight: bold;
}
.back {
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 20px;
  background-color: rgb(89, 185, 89);
  color: white;
  font-weight: bold;
  margin-top: 30px;
  margin-left: 30%;
  margin-right: 30%;
}
.yy {
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 20px;
  background-color: rgb(89, 185, 89);
  color: white;
  font-weight: bold;
}
.center {
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center;
}
.click {
    border: 2px solid lightgreen;
    padding: 1px;
    padding-top: 1px;
    padding-bottom: 1px;
    border-radius: 20px;
    margin-top: 10px;
    margin-right: 5px;
    text-align: center;
  }
ion-modal#example-modal {
  --width: fit-content;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
  --background: rgb(176, 237, 176); /* 배경색 지정 */
  --border-radius: 10px; /* 모서리를 둥글게 만듭니다. */
}
ion-modal#example-modal h1 {
  margin: 1px 1px 10px 10px;
  text-align: center;
  margin-bottom: 20px;
}
ion-modal#example-modal .wrapper {
  margin-bottom: 10px;
}
.shop {
    display: inline-block;
    text-align: center;
    flex-grow: 1;
    margin-top: -2px;
    font-size: 20px;
    float: right;
}
.search-tag {
    display: inline-block;
    text-align: center;
    flex-grow: 1;
  }
.sea {
    display: inline-block;
    height: 30px;
    float: left;
    margin-left: auto;
}
.search-wrap {
    //display: grid;
    //grid-auto-flow: column;
    ////grid-template-columns: 0.99fr;
    //margin-top: 10px;
    background-color: white;
    border: 1px solid var(--main-dark-color);
    border-radius: 1.2em;
}
div {
  text-align: center;
  margin: 10px;
}
</style>