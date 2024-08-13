import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import { App as CapacitorApp } from "@capacitor/app";
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

import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './registerServiceWorker.js';
import {Preferences} from "@capacitor/preferences";
import bgmFile from '@/assets/bgm.mp3'

const bgm = new Audio(bgmFile);
bgm.loop = true;

if (store.state.bgmPlaying) {
  bgm.play();
}

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
