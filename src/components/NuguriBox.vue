<script lang="ts"></script>

<template>
  <div class="ment">
    <p class="ment2">
      <slot></slot>
    </p>
    <ion-img class="nuguri" src="/public/nuguri.png"></ion-img>
  </div>
</template>

<style scoped>
.ment {
  color: black;
  justify-content: left;
  display: flex;
  padding: 10px;
  border: 1px solid green;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 5%;
  margin-bottom: 5%;
  border-radius: 35px;
  background-color: #9abfa6;
  height: 90px;
  align-items: center;
}
.ment2 {
  margin-left: 5px;
  width: 220px;
  font-size: 18px;
  font-weight: bold;
}
.nuguri {
  height: 70px;
  margin-right: -10px;
}
</style>
