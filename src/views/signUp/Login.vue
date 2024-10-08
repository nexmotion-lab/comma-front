<script lang="ts">
import { defineComponent } from 'vue'
import {IonPage, useIonRouter} from '@ionic/vue'
import { useRouter } from "vue-router";

import {InAppBrowser} from "@awesome-cordova-plugins/in-app-browser";
import {Preferences} from "@capacitor/preferences";
import store from "@/store";
import apiClient, {setTokens} from "@/axios";


export default defineComponent({
  name: 'Login',
  components: {
    IonPage
  },
  setup() {
    const router = useIonRouter();

    const handleSocialLogin = async (event: Event, provider: string) => {
      event.preventDefault();

      const browser = InAppBrowser.create(`https://www.comma-coders.com:8998/oauth2/authorization/${provider}`, '_blank', {
        zoom: 'no',
        toolbar: 'yes',
        location: 'no',
        usewkwebview: 'yes',
        clearcache: 'yes',
        clearsessioncache: 'yes'
      });

      browser.on('loadstop').subscribe(async (event) => {
        const url = event.url;

        if (url.startsWith('comma://home') || url.startsWith('comma://firstLogin')) {
          browser.close();

          const urlParams = new URL(url).searchParams;
          const accessToken = urlParams.get('accessToken');
          const refreshToken = urlParams.get('refreshToken');

          if (accessToken && refreshToken) {
            await setTokens(accessToken, refreshToken);

            if (url.startsWith('comma://firstLogin')) {
              router.replace({name: 'InitMain'});
            } else {
              router.replace({name: 'Home'});
            }
          } else {
            console.error("토큰이 포함되지 않았습니다.");
          }
        }
      })
    }

    return {
      handleSocialLogin
    };

  }
});
</script>

<template>
  <ion-page>
    <div class="login-container">
      <div class="login-header">
        <h1 class="login-title-comma"></h1>
        <h1>오늘의 쉼표</h1>
        <h1>다이어리</h1>
      </div>
      <button @click="handleSocialLogin($event, 'naver')" class="social-buttons" id="naver-connect">
        <span>네이버 로그인</span>
      </button>
      <button @click="handleSocialLogin($event, 'kakao')" class="social-buttons" id="kakao-connect">
        <span>카카오 로그인</span>
      </button>
    </div>
    <footer><b>Version</b> 1.0</footer>
  </ion-page>
</template>

<style scoped>
body {
  font-family: 'Montserrat', sans-serif;
}

.login-container {
  display: block;
  max-width: 680px;
  width: 80%;
  margin: 150px auto;
}

.login-header {
  & h1 {
    font-weight: bold;
    color: #548263;
    font-size: 24px;
    letter-spacing: -1px;
    text-align: center;
    transition: 0.2s linear;
    margin: 15px;
  }
  & .login-title-comma {
    background: url('../../assets/comma_icon.png') no-repeat center;
    height: 50px;
    background-size: 70px;
    filter: invert(26%) sepia(38%) saturate(7498%) hue-rotate(326deg) brightness(92%) contrast(99%);
  }
  margin-bottom: 40px;
}

.social-buttons {
  background-position: 25px 0px;
  box-sizing: border-box;
  color: rgb(255, 255, 255);
  cursor: pointer;
  display: inline-block;
  height: 50px;
  line-height: 43px;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  width: 100%;
  border-radius: 5px;
  margin: 10px auto;
  outline: none;
  padding-left: 10%;
  transition: all 0.2s cubic-bezier(0.72, 0.01, 0.56, 1) 0s;
  border: none; /* button 기본 테두리 제거 */
  font-size: inherit; /* 부모 폰트 크기 상속 */
  font-family: inherit; /* 부모 폰트 패밀리 상속 */
}

#naver-connect {
  background: #03c75a url('../../assets/signUp/naver_login.png') no-repeat scroll 5px 0 / 50px 50px
    padding-box border-box;
}

#naver-connect span {
  box-sizing: border-box;
  color: black;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  border: 0 none rgb(255, 255, 255);
  outline: rgb(255, 255, 255) none 0px;
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

#google-connect {
  background: rgb(255, 255, 255) url('../../assets/signUp/google_login.png') no-repeat scroll 5px 0px / 50px
    50px padding-box border-box;
}

#google-connect span {
  box-sizing: border-box;
  color: black;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  border: 0 none rgb(220, 74, 61);
  outline: rgb(255, 255, 255) none 0px;
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

#kakao-connect {
  background: #fee500 url('../../assets/signUp/kakao_login.png') no-repeat scroll 5px 0px / 50px 50px
    padding-box border-box;
}

#kakao-connect span {
  box-sizing: border-box;
  color: black;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  text-transform: uppercase;
  border: 0 none rgb(220, 74, 61);
  outline: rgb(255, 255, 255) none 0px;
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #939393; /* 좀 연한 회색 */
  font-size: 17px;
  margin: 60px auto;
}
</style>
