import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import { App as CapacitorApp} from '@capacitor/app'
import './global.scss'


import {IonContent, IonicVue, IonPage} from '@ionic/vue';

import '@ionic/vue/css/core.css';

import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';


/* Theme variables */
import './theme/variables.css';
import bgmFile from '@/assets/bgm/main.mp3'
import bgmDiary from '@/assets/bgm/diary.mp3'
import {Preferences} from "@capacitor/preferences";


export const diaryBgm = new Audio(bgmDiary)
export const bgm = new Audio(bgmFile);
bgm.loop = true;
diaryBgm.loop = true;

if (store.state.bgmPlaying) {
    bgm.play();
}

Preferences.get({ key: 'bgm' }).then((result) => {
    if (result.value === 'true') {  // Preferences는 값이 문자열로 저장되므로 'true'로 체크
        store.dispatch('setBgmPlaying', true);
    }
})
Preferences.get({ key: 'alarm' }).then((result) => {
    if (result.value === 'true') {  // Preferences는 값이 문자열로 저장되므로 'true'로 체크
        store.dispatch('setAlarmPermission', true);
    }
})


store.watch(
    (state) => state.bgmPlaying,
    (newVal) => {
      if (newVal) {
          bgm.play();
      } else {
          bgm.pause();
      }
    }
)

CapacitorApp.addListener('appStateChange', (state) => {
    if (!state.isActive) {
        bgm.pause();
        diaryBgm.pause();
    } else {
        if (store.state.bgmPlaying) {
            bgm.play();
        }
    }
});

const app = createApp(App)
  .use(IonicVue)
  .use(router)
    .component('ion-page', IonPage)
    .component('ion-content', IonContent)

    .use(store);



router.isReady().then(() => {
  app.use(store);
  app.mount('#app');

});
