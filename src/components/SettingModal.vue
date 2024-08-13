<template>
  <ion-content scroll-y="false">
    <div class="modal-container">
      <div class="modal-content" v-if="!showAccountLinking && !showNameChange && !showAppInfo">
        <div class="close-button-wrap">
          <button @click="closeSettingModal" class="close-button">✕</button>
        </div>
        <h2 class="modal-header">설정</h2>
        <div class="modal-body">
          <div class="setting-item">
            <span>알림</span>
            <div class="switch" @click="alarmSetUp()">
              <input type="checkbox" v-model="alarmPermission" />
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
              @click="logoutBtn()"
              class="footer-button">
            로그아웃
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
          <input type="text" v-model="newNickname" maxlength="12" />
        </div>
        <div class="modal-footer">
          <button class="footer-button" @click="changeNickname">결정</button>
        </div>
        <div class="note">*이름 변경 후 한달동안 변경 불가</div>
      </div>
    </div>
  </ion-content>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {alertController, IonModal, modalController, useIonRouter} from "@ionic/vue"
import {useStore} from "vuex";
import store from "@/store";
import apiClient from "@/axios";
import {LocalNotifications} from "@capacitor/local-notifications";
import {Preferences} from "@capacitor/preferences";

export default defineComponent({
  components: { IonModal, modalController },
  name: 'ModalComponent',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      alarmPermission: computed({
        get: () => store.state.alarmPermission,
        set: (value) => store.commit('SET_ALARM_PERMISSION', value),
      }),
      bgmSound: computed({
        get: () => store.state.bgmPlaying,
        set: (value) => store.commit('SET_BGM_PLAYING', value),
      }),
      showAccountLinking: false,
      showNameChange: false,
      showAppInfo: false,
      studentId: '',
      password: '',
      isLinked: false,
      newNickname: store.state.name,
    };
  },
  setup() {
    const store = useStore();
    const router = useIonRouter();
    return {
      store, router
    }
  },
  methods: {

    async logoutBtn() {
      const alert = await alertController.create({
        header: '로그아웃',
        message: '로그아웃 하시겠습니까?',
        buttons: [
          {
            text: '취소',
            role: 'cancel',
          },
          {
            text: '확인',
            handler: () => {
              this.closeSettingModal();
              this.logout();
            }
          }
        ],
        cssClass: 'my-custom-alert-class'
      });
      await alert.present();
    },

    async logout() {
      await Preferences.clear();
      this.router.replace({path: '/login'});

    },

    async alarmSetUp() {
      if (this.alarmPermission) {
        const pending = await LocalNotifications.getPending();

        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel({notifications: pending.notifications});
        }

        this.alarmPermission = false;
      } else {
        this.alarmPermission = true;

        if ((await LocalNotifications.checkPermissions()).display !== 'granted') {
          const permission = await LocalNotifications.requestPermissions();
          if (permission.display !== 'granted') {
            this.alarmPermission = false;
            return;
          }
        }

        await LocalNotifications.schedule({
          notifications: [
            {
              id: 1,
              title: '감정일기',
              body: '오늘 하루는 어땠어? 가',
              schedule: {
                every: 'day',
                at: new Date(new Date().setHours(22, 0, 0, 0)), // 저녁 10시
                allowWhileIdle: true,
              },
              sound: undefined
            },
            {
              id: 2,
              title: '생일 축하 알림',
              body: '생일을 축하드립니다!',
              schedule: {
                repeats: true,
                on: {
                  month: parseInt(store.state.birthday.split('-')[1], 10), // 월
                  day: parseInt(store.state.birthday.split('-')[2], 10), // 일
                  hour: 10,
                },
                allowWhileIdle: true,
              },
              sound: undefined
            },
            {
              id: 3,
              title: '매월 1일 알림',
              body: '이것은 매월 1일에 오는 알림입니다.',
              schedule: {
                repeats: true,
                on: {
                  day: 1,
                },
                allowWhileIdle: true,
              },
              sound: undefined
            },
          ],
        });
        console.log('New notifications scheduled');
        console.log((await LocalNotifications.getPending()).notifications)
      }
    }

    ,

    closeSettingModal() {
      modalController.dismiss(null, 'cancel');
      },

    linkAccount() {
      if (this.studentId && this.password) {
        this.isLinked = true;
        this.showAccountLinking = false;
      } else {
        alert("모든 필드를 입력해주세요.");
      }
    },
    async changeNickname() {
      if (this.newNickname != store.state.name) {
        console.log(this.newNickname)

        try {
          const response = await apiClient.post('/api/account/name', {}, {
            params: {
              nickname: this.newNickname
            }
          });

          if (response.data) {
            store.dispatch('setUser', response.data)
            console.log(response.data)
            const message = `닉네임이 ${this.newNickname}로 변경되었습니다.`;
            const alert = await alertController.create({
              header: '설정',
              message: message,
              buttons: ['확인'],
              cssClass: 'my-custom-alert-class'
            });
            await alert.present();
          }
        } catch (error) {
          console.log(error);
        }
        this.showNameChange = false;
      } else {
        const message = `닉네임을 변경해주세요.`;
        const alert = await alertController.create({
          header: '설정',
          message: message,
          buttons: ['확인'],
          cssClass: 'my-custom-alert-class'
        });
        await alert.present();
      }
    }
  }
});
</script>

<style scoped>
.modal-container {
  width: 100%;
  height: 100%;
  background: white;
  padding: 2vh;
  border-radius: 10px;
  position: relative;
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
.modal-content .close-button-wrap{
  margin-bottom: 3vh;
}
.app-info .close-button-wrap{
  margin-bottom: 3vh;
}
.name-change .close-button-wrap{
  margin-bottom: 6vh;
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
  padding: 1vh;
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