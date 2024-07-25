import { type Commit, diaryStore } from 'vuex'

interface State {
    formData: { [key: string]: any };
    selectedEvents: number[];
    selectedEmotions: number[];
}

export default diaryStore<State>({
    state: {
        formData: {},
        selectedEvents: [],
        selectedEmotions: []
    },
    mutations: {
        SET_FORM_DATA(state, payload: { [key: string]: any }) {
            state.formData = { ...state.formData, ...payload };
        },
        SET_SELECTED_EVENTS(state, events: number[]) {
            state.selectedEvents = events;
        },
        SET_SELECTED_EMOTIONS(state, emotions: number[]) {
            state.selectedEmotions = emotions;
        }
    },
    actions: {
        saveFormData({ commit }: { commit: Commit }, payload: { [key: string]: any }) {
            commit('SET_FORM_DATA', payload);
        },
        saveSelectedEvents({ commit }: { commit: Commit }, events: number[]) {
            commit('SET_SELECTED_EVENTS', events);
        },
        saveSelectedEmotions({ commit }: { commit: Commit }, emotions: number[]) {
            commit('SET_SELECTED_EMOTIONS', emotions);
        }
    },
    getters: {
        getFormData: (state: State) => state.formData,
        getSelectedEvents: (state: State) => state.selectedEvents,
        getSelectedEmotions: (state: State) => state.selectedEmotions
    }
});