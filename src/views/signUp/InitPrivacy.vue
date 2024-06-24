<script lang="ts">
import { defineComponent } from 'vue';
import { IonButton, IonDatetime, IonDatetimeButton, IonModal } from '@ionic/vue'

export default defineComponent({
  name: 'InitPrivacy',
  components: { IonButton, IonDatetime, IonDatetimeButton, IonModal },

  data() {
    return {
      selectedGender: '',
      selectedBirthdate:''
      };
  },
  methods:{
    genderClick(gender : string){
      if (this.selectedGender === gender) {
        // 이미 선택된 성별을 다시 클릭하면 선택을 취소합니다.
        this.selectedGender = '';
      } else {
        // 다른 성별을 선택하면 선택된 성별을 변경합니다.
        this.selectedGender = gender;
      }
    }
  },
  computed:{
    genderClass: function() {
      return {
        'clicked': this.selectedGender === 'male' || this.selectedGender === 'female',
        'clicked-male': this.selectedGender === 'male',
        'clicked-female': this.selectedGender === 'female'
      }
    }
  }
});
</script>

<template>
  <div class="initPrivacy-container">
    <!-- 성별 -->
    <div class="gender">
      <div class="gender-title">성별</div>
      <div class="gender-select">
        <div class="gender-male" @click="genderClick('male')" :class="genderClass">
          <div class="gender-icon male-icon"></div>
          남자
        </div>
        <div class="gender-female" @click="genderClick('female')" :class="genderClass">
          <div class="gender-icon female-icon"></div>
          여자
        </div>
      </div>
    </div>

    <!-- 생년월일 -->
    <div class="birthdate">
      <div class="birthdate-title">생년월일</div>
      <div class="birthdate-select">
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-modal :keep-contents-mounted="true">
          <ion-datetime id="datetime" presentation="date" :prefer-wheel="true"></ion-datetime>
        </ion-modal>
      </div>
    </div>

    <div class="page-item">
      <ion-button id="prevButton" @click="previousPage">이전</ion-button>
      <ion-button id="nextButton" v-bind:disabled="selectedGender=='' && selectedBirthdate==''" @click="nextPage">다음</ion-button>
    </div>
  </div>
</template>



<style scoped>
body {
  font-family: 'Montserrat', sans-serif;
}

.datepicker-modal-wrapper {
  width: auto !important;
  height: auto !important;
}

.initPrivacy-container {
  display: block;
  max-width: 680px;
  width: 80%;
  margin: 150px auto;
  align-content: center;
}

.gender {
  margin-bottom: 40px;
}
.gender-select{
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  text-align: center;
}

.gender-icon {
  width: 96px; /* 아이콘의 너비 */
  height: 96px; /* 아이콘의 높이 */
  background-size: cover; /* 배경 이미지를 요소에 맞게 조정 */
  cursor: pointer; /* 마우스 포인터를 손가락 모양으로 변경하여 클릭 가능한 요소임을 나타냄 */
  margin-bottom: 20px;
}

.male-icon {
  background-image: url('../../assets/male_icon.png'); /* 남성 아이콘 이미지 경로 설정 */
  filter: invert(57%) sepia(20%) saturate(675%) hue-rotate(201deg) brightness(95%) contrast(82%);
}

.female-icon {
  background-image: url('../../assets/female_icon.png'); /* 여성 아이콘 이미지 경로 설정 */
  filter: invert(57%) sepia(20%) saturate(675%) hue-rotate(201deg) brightness(95%) contrast(82%);
}

.gender-male,
.gender-female {
  margin: 5px 23px; /* 아이템 사이의 간격 설정 */
  color: #8a8abd;
}


.gender-male.clicked-male,
.gender-female.clicked-female {
  color: blue; /* 클릭한 요소의 배경색을 노란색으로 변경 */
}

/* 클릭한 요소에 적용될 스타일 */
.gender-male.clicked-male .male-icon,
.gender-female.clicked-female .female-icon {
  filter: invert(7%) sepia(99%) saturate(7388%) hue-rotate(247deg) brightness(105%) contrast(145%);
}

.gender-male.clicked .gender-icon,
.gender-female.clicked .gender-icon {
  background-color: transparent; /* 클릭한 요소의 배경색을 투명으로 설정 */
}


.gender-title, .birthdate-title {
  color: #e91e63;
  font-size: 27px;
  letter-spacing: -1px;
  text-align: center;
  transition: .2s linear;
  margin: 25px;
}
.birthdate{
  margin-bottom: 40px;
}
ion-datetime {
  --background: rgb(245, 235, 247);
  --background-rgb: 245, 235, 247;
  --wheel-highlight-background: rgb(218, 216, 255);
  --wheel-fade-background-rgb: 245, 235, 247;
}

ion-datetime::part(wheel-item) {
  color: rgb(255, 66, 97);
}

ion-datetime::part(wheel-item active) {
  color: rgb(128, 30, 171);
}

.page-item {
  display: flex;
  justify-content: center;
  gap : 25px;
}

ion-button{
  width: 70px;
}

#prevButton{
  --background: red ;
}


</style>
