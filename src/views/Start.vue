<script lang="ts">
import { defineComponent, ref, onBeforeUnmount, onMounted } from 'vue'
import { IonPage, useIonRouter, createAnimation } from '@ionic/vue'
import type { Ref } from 'vue'
import type { Animation } from '@ionic/vue'

interface State {
  isRedirecting: Ref<boolean>
}

export default defineComponent({
  name: 'Start',
  components: {
    IonPage
  },
  setup(): State {
    const customAnimation: Animation = createAnimation()
      .duration(1000)
      .fromTo('opacity', '1', '0.5')
    const router = useIonRouter()
    const isRedirecting: Ref<boolean> = ref<boolean>(false)

    onMounted(() => {
      setTimeout(() => {
        isRedirecting.value = true
        customAnimation.play().then(() => {
          router.push({ name: 'InitNickname' })
        })
      }, 500)
    })

    onBeforeUnmount(() => {
      if (customAnimation) {
        customAnimation.stop()
        customAnimation.fromTo('opacity', '1', '0.5').progress(0)
      }
      isRedirecting.value = false
    })

    return { isRedirecting }
  }
})
</script>

<template>
  <ion-page>
    <div class="start-container">
      <div class="start-header">
        <h1 class="start-title-comma" :class="{ 'is-redirecting': isRedirecting }"></h1>
        <h1>나만의 감정일기</h1>
      </div>
    </div>
    <footer v-show="!isRedirecting"><b>Version</b> 1.0</footer>
  </ion-page>
</template>

<style scoped>
body {
  font-family: 'Montserrat', sans-serif;
}

.start-container {
  display: block;
  max-width: 680px;
  width: 80%;
  height: 50%;
  margin: 150px auto;
  align-content: center;
}

.start-header {
  & h1 {
    color: #e91e63;
    font-size: 27px;
    letter-spacing: -1px;
    text-align: center;
    transition: 0.2s linear;
    margin: 20px;
  }
  & .start-title-comma {
    background: url('../assets/main_icon.png') no-repeat center;
    height: 150px;
    background-size: 250px;
  }

  margin-bottom: 40px;
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #939393; /* 좀 연한 회색 */
  font-size: 17px;
  margin: 60px -40px;
}
.start-title-comma.is-redirecting {
  transition: transform 1s ease; /* 전환 효과 설정 */
  transform-origin: center; /* 확대 중심 설정 */
  transform: scale(3); /* 전환 시 확대 */
}

/*
.route-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-to {
  opacity: 0;
  transform: translateX(-100px)
}
.route-leave-active {
  transition: all 0.3s ease-in;
}
*/
</style>
