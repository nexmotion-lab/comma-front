<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseBottomBar'
})
</script>

<template>
  <ion-footer class="footer">
    <div class="image-container">
      <ion-img class="nav-btn" src="/public/letter.png"></ion-img>
      <ion-img class="nav-btn" src="/public/house.png"></ion-img>
      <ion-img class="nav-btn" src="/public/memo.png"></ion-img>
    </div>
  </ion-footer>
</template>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: var(--bottom-nav-bar);
}

.image-container {
  display: flex;
  text-align: center;
  align-items: center; /* 세로 방향으로 가운데 정렬 */
  justify-content: center; /* 가로 방향으로 가운데 정렬 */
  gap: 10%;
}

.nav-btn {
  height: 3.5em;
  margin: 0.5em;
}
</style>