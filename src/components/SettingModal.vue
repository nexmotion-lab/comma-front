<!-- ****세팅 모달창 이거 근데 다이어리에 있는 것도 똑같긴해**** -->
<template>
  <ion-modal v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content" v-if="!showAccountLinking && !showNameChange && !showAppInfo">
        <div class="close-button-wrap">
          <button @click="closeModal" class="close-button">✕</button>
        </div>
        <h2 class="modal-header">설정</h2>
        <div class="modal-body">
          <div class="setting-item">
            <span>효과음</span>
            <div class="switch" @click="effectsSound = !effectsSound">
              <input type="checkbox" v-model="effectsSound" />
              <span class="slider"></span>
            </div>
          </div>
          <div class="setting-item">
            <span>BGM</span>
            <div class="switch" @click="bgmSound = !bgmSound">
              <input type="checkbox" v-model="bgmSound" />
              <span class="slider"></span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
              class="footer-button"
              :class="{ linked: isLinked }"
              @click="!isLinked && (showAccountLinking = true)"
              :disabled="isLinked"
          >
            {{ isLinked ? '연동 완료' : '계정연동' }}
          </button>
          <button class="footer-button" @click="showAppInfo = true">앱 정보</button>
          <button class="footer-button" @click="showNameChange = true">이름 변경</button>
        </div>
        <div class="note">Version: 1.0.0</div>
      </div>

      <div v-if="showAccountLinking" class="account-linking">
        <div class="close-button-wrap">
          <button @click="showAccountLinking = false" class="close-button">✕</button>
        </div>
        <h2 class="modal-header">계정 연동</h2>
        <div class="modal-body">
          <div class="account-item">
            <label for="university">삼육대학교</label>
          </div>
          <div class="account-item">
            <input type="text" id="studentId" v-model="studentId" placeholder="학번을 입력하세요" />
          </div>
          <div class="account-item">
            <input type="password" id="password" v-model="password" placeholder="비밀번호를 입력하세요" />
          </div>
        </div>
        <div class="modal-footer ">
          <button class="footer-button" @click="linkAccount">확인</button>
        </div>
        <div class="note">*로그인은 수톡 아이디와 동일합니다.</div>
      </div>

      <div v-if="showAppInfo" class="app-info">
        <div class="close-button-wrap">
          <button @click="showAppInfo = false" class="close-button">✕</button>
        </div>
        <h2 class="modal-header">앱 정보</h2>
        <div class="modal-body">
          <p>이 앱은 삼육대학교 컴퓨터공학부 '코더스랩' 에서 제작되었습니다. 상담심리학과 동아리 '컴마' 에는 해당 정보에 대한 저작권 및 지적 재산권이 있습니다. 무단으로 사용, 복제 및 배포하는 것은 금지되어 있습니다.</p>
        </div>
      </div>

      <div v-if="showNameChange" class="name-change">
        <div class="close-button-wrap">
          <button @click="showNameChange = false" class="close-button">✕</button>
        </div>
        <h2 class="modal-header">닉네임 변경</h2>
        <div class="modal-body">
          <input type="text" v-model="newNickname" placeholder="한글 2-6자, 영어 12자 이내" />
        </div>
        <div class="modal-footer">
          <button class="footer-button" @click="changeNickname">결정</button>
        </div>
        <div class="note">*이름 변경 후 한달동안 변경 불가</div>
      </div>
    </div>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ModalComponent',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      effectsSound: true,
      bgmSound: false,
      showAccountLinking: false,
      showNameChange: false,
      showAppInfo: false,
      studentId: '',
      password: '',
      isLinked: false,
      newNickname: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    linkAccount() {
      if (this.studentId && this.password) {
        this.isLinked = true;
        this.showAccountLinking = false;
      } else {
        alert("모든 필드를 입력해주세요.");
      }
    },
    changeNickname() {
      if (this.newNickname) {
        // 여기에 닉네임 변경 로직 추가
        alert(`닉네임이 ${this.newNickname}로 변경되었습니다.`);
        this.newNickname = "";
        this.showNameChange = false;
      } else {
        alert("닉네임을 입력해주세요.");
      }
    }
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}
.modal-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  position: relative;
  box-shadow: 0 0 0 9px #A3E2B8, 0 0 0 20px #E6FFF2;
}
.modal-header {
  text-align: center;
  font-weight: bold;
  border-bottom: 0.1rem solid #6e6e6e;
  padding-bottom: 10px;
  margin: 0;
}
.modal-body {
  border-bottom: 0.1rem solid #6e6e6e;
}
.close-button-wrap {
  text-align: right;
}
.close-button {
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
.setting-item, .account-item {
  margin: 7px 0;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #66bb6a;
}
input:checked + .slider:before {
  transform: translateX(26px);
}
.account-item input, .modal-body input {
  width: 100%;
  padding: 10px;
  border: none;
  background: transparent;
  outline: none;
  text-align: center;
  font-size: 16px;
}
.modal-footer {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
.footer-button {
  background: #A3E2B8;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
.footer-button.linked {
  background: #a0e0a0;
}
.footer-button[disabled] {
  cursor: not-allowed;
}
.note {
  margin-top: 20px;
  text-align: center;
  font-size: small;
  color: #888;
}
.app-info .modal-body {
  font-size: 14px;
  line-height: 1.5;
}
</style>