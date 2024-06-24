<template>
    <ion-page>
      <ion-content :scroll-y="false">
        <div class="content">
            <div class="navbar">
                <button class="button" @click="toggleList"><ion-img class="burger" src="/public/icon.png"></ion-img></button>
                <ul v-if="showList" class="item-list">
                    <li v-for="item in itemList" :key="item.id">
                        <img :src="item.imageUrl" style="width: 50%; height: 50%;">
                    </li>
                </ul>
            </div>
            <ion-img class="rabbit" src="/public/rabbit.png"></ion-img>
            <ion-img class="ground" src="/public/ground.png"></ion-img>
            <div class="nickname">
                <p>닉네임</p>
            </div>
            <div class="ment">
                <p>오늘 하루도 수고했어!</p>
                <p>항상 최승민을 응원해!!</p>
            </div>
        </div>
      </ion-content>

      <ion-footer class="footer">
        <div class="image-container">
            <ion-img class="flight" src="/public/letter.png"></ion-img>
            <ion-img class="house" src="/public/house.png"></ion-img>
            <ion-img class="memo" src="/public/memo.png"></ion-img>
        </div>
      </ion-footer>
    </ion-page>
  </template>
  
  <script setup lang="ts">
    import { ref } from 'vue';

    interface ListItem {
        id: number;
        imageUrl: string; // 아이템 이미지 URL 추가
    }

    // 리스트 아이템 데이터
    const itemList: ListItem[] = [
    { id: 1, imageUrl: "/public/select.png" },
    { id: 2, imageUrl: "/public/chart.png" },
    { id: 3, imageUrl: "/public/callender.png" }
    ];

    // 리스트 표시 여부 상태
    const showList = ref(false);

    // 리스트 보이기/숨기기 함수
    const toggleList = () => {
        showList.value = !showList.value;
    };
  </script>

  <style scoped>
    .item-list {
        list-style-type: none; /* 리스트에서 점 제거 */
        height: 150px;
        width: 150px;
        margin-left: -35px;
        margin-top: 1px;
    }
    .button {
        background-color: transparent;
        border: none;
    }
    .burger {
        height: 50px;
        width: 50px;
    }
    .nickname {
        position: absolute;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 20px;
        font-style: bold;
        top: 5%;
        left: 5%;
        border: 1px solid black;
        padding: 5px;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 10px;
        background-color: lightgray;
    }
    .ment {
        font-size: 20px;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        text-align: center;
        justify-content: center;
        display: flex;
        flex-direction: column; /* 세로 방향으로 정렬 */
        position: absolute;
        bottom: 65%;
        left: 5%;
        height: 20%;
        width: 60%;
        border: 1px solid black;
        border-radius: 20px;
        background-color: white;
    }
    .rabbit {
        position: absolute;
        height: 90%;
        width: 90%;
        top: 15%;
        z-index: 1;
        justify-content: center;
    }
    .ground {
        position: absolute;
        height: 90%;
        width: 90%;
        top: 25%;
        z-index: 0;
        justify-content: center;
    }
    .navbar {
        position: absolute;
        left: 80%;
        top: 5%;
    }
    .content {
        padding: 20px;
        height: 110%;
        background-color: rgba(144, 238, 144, 0.48);
    }
    .footer {
        bottom: 110px;
        height: 50px;
    }
    .image-container {
        border-top: 1px solid rgba(0, 0, 0, 0.439);
        background-color: lightgreen;
        display: flex;
        text-align: center;
        align-items: center; /* 세로 방향으로 가운데 정렬 */
        justify-content: center; /* 가로 방향으로 가운데 정렬 */
        gap: 10%;
    }
    .flight {
        height: 110px;
    }
    .house {
        height: 110px;
        margin-left: -20px;
    }
    .memo {
        height: 110px;
        margin-right: 10px;
    }
  </style>