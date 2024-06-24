<script lang="ts">
import { defineComponent } from 'vue'
import { IonInput, IonButton, IonPage } from '@ionic/vue'
import axios from 'axios'

export default defineComponent({
  name: 'InitNickname',
  components: { IonInput, IonButton, IonPage },
  data() {
    return {
      nickname: '', // 사용자가 입력한 닉네임
      isNextButtonDisabled: true // 다음 버튼 비활성화 여부
    } as {
      nickname: string
      isNextButtonDisabled: boolean
    }
  },
  methods: {
    previousPage() {
      // 이전 페이지로 이동하는 로직을 작성
      console.log('이전 페이지로 이동')
    },
    async nextPage() {
      if (this.validateNickname()) {
        console.log(111, this.nickname)
        alert('닉네임 업데이트 완료')
        this.$router.push('/start') // Vue Router를 사용하는 경우
        // try {
        //   // 서버에 닉네임 값을 보내는 API 요청
        //   const response = await axios.post('/account/update', { nickname: this.nickname });
        //
        //   // API 요청이 성공하면 시작 페이지로 리디렉션
        //   if (response.status === 200) {
        //     console.log('닉네임 업데이트 완료');
        //     this.$router.push('/start'); // Vue Router를 사용하는 경우
        //   }
        // } catch (error) {
        //   console.error('닉네임 업데이트 중 실패:', error);
        // }
      } else {
        console.error('닉네임을 입력하세요!')
      }
    },
    handleInput(event: Event) {
      const input = event.target as HTMLInputElement
      // 입력 값이 변경될 때마다 호출되는 메서드
      // 입력값이 없으면 다음 버튼을 비활성화하고, 있으면 활성화
      this.nickname = input.value
      this.isNextButtonDisabled = this.nickname.trim() === ''
    },
    validateNickname(): boolean {
      console.log('validate')
      return this.nickname.trim() !== '' && this.nickname.trim().length <= 10
    }
  }
})
</script>

<template>
  <ion-page>
    <div class="initNickname-container">
      <div class="initNickname-header">
        <h1>닉네임 설정</h1>
      </div>

      <div class="nickname">
        <ion-input
          class="input-nickname"
          :value="nickname"
          label="nickname"
          @input="handleInput"
          label-placement="floating"
          fill="outline"
          placeholder="닉네임(10자이내/특수문자 입력 불가)"
          :counter="true"
          maxlength="10"
        ></ion-input>
        <div class="nickname-comment">
          닉네임 중복 가능하며, 본인의 이름이나 별칭을 사용하는 것을 추천드립니다.
        </div>
      </div>

      <div class="page-item">
        <ion-button ref="prevButton" class="page-button" id="prevButton" @click="previousPage"
          >이전</ion-button
        >
        <ion-button
          ref="nextButton"
          class="page-button"
          id="nextButton"
          :disabled="isNextButtonDisabled"
          @click="nextPage"
          >다음</ion-button
        >
      </div>
    </div>
  </ion-page>
</template>

<style scoped>
.initNickname-container {
  display: block;
  max-width: 680px;
  width: 80%;
  height: 50%;
  margin: 150px auto;
  align-content: center;
}

.initNickname-header h1 {
  font-weight: bold;
  color: #a1a28b;
  font-size: 24px;
  letter-spacing: -1px;
  text-align: center;
  transition: 0.2s linear;
}

.input-nickname {
  --border-color: #000000;
  --padding-bottom: 2px;
  --placeholder-color: #182454;
  --placeholder-size: 2px;
  --border: 2px solid blue;
}

.nickname {
  margin: 40px auto;
  & .nickname-comment {
    color: red;
    font-weight: lighter;
    font-size: 11px;
    margin: 10px 10px;
  }
}
.page-item {
  margin-top: 75px;
  display: flex;
  justify-content: center;
  gap: 25px;
}

.page-button {
  width: 90px;
}

#prevButton {
  --background: red;
  --background-activated: red;
}
</style>
