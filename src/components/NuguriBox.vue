<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'NuguriBox',
  props: {
    image: {
      type: String,
      required: true
    }
  }
});
</script>

<template>
  <div class="ment">
    <p class="ment2">
      <slot></slot>
    </p>
    <ion-img class="nuguri" :src="image"></ion-img>
  </div>
</template>

<style scoped>
.ment {
  display: flex;
  justify-content: space-between; /* 요소 사이에 공간을 균등하게 배분 */
  border: 1px solid green;
  margin: 5% 3%; /* 5% 상하좌우 여백 */
  border-radius: 35px;
  background-color: #9abfa6;
  height: 80px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* 버튼에 그림자 효과를 추가합니다. */

}

.ment2 {
  display: flex;
  align-items: center;
  padding-left: 3vw;
  font-size: 3.5vw;
  font-weight: bold;
  flex: 1;
}

.nuguri {
  height: 8.7vh;
  margin: 0 2.3vh 0 1vh;
  align-self: flex-end; /* 아래 경계선에 맞추기 */
}
</style>
