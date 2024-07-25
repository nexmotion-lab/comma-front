import { ref } from 'vue';

export const selectedTab = ref('event');

export const selectTab = (tabName: string) => {
    selectedTab.value = tabName;
    console.log('현재 선택된 탭:', selectedTab.value);
};