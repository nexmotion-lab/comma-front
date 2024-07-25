import Vuex from 'vuex';
import {state} from "vue-tsc/out/shared";
import {diamond} from "ionicons/icons";

export interface EmotionTag {
    xvalue: number;
    yvalue: number
    emotion_tag_no: number;
    name: string;
    color: string;
}

export interface EventTag {
    eventTagNo: number;
    name: string
}

interface State {
    name: string;
    gender: string;
    birthday: string;
    emotionTags: EmotionTag[];
    diary: Diary
    diaryChar: string
}

interface Diary {
    selectedEmotionTags: EmotionTag[];
    selectedEventTags: EventTag[];
    content: string;
    coreEmotionTag: EmotionTag;
}

export default new Vuex.Store<State>({
    state: {
        name: '',
        gender: '',
        birthday: '2004-04-27',
        diary: {
          selectedEmotionTags: [],
            selectedEventTags: [],
            content: '',
            coreEmotionTag: {
                xvalue: 0,
                yvalue: 0,
                emotion_tag_no: 0,
                name: '',
                color: ''
            },
        },
        diaryChar: '',
        emotionTags: [
            { xvalue: -1, yvalue: 4, emotion_tag_no: 1, name: '충격받은', color: '#F04F3D' },
            { xvalue: -1, yvalue: 3, emotion_tag_no: 2, name: '두려운', color: '#F26757' },
            { xvalue: -1, yvalue: 2, emotion_tag_no: 3, name: '거슬리는', color: '#F48478' },
            { xvalue: -1, yvalue: 1, emotion_tag_no: 4, name: '마음이 불편한', color: '#F69A90' },
            { xvalue: -2, yvalue: 4, emotion_tag_no: 5, name: '혼란한', color: '#EF3631' },
            { xvalue: -2, yvalue: 3, emotion_tag_no: 6, name: '초조한', color: '#F84F4B' },
            { xvalue: -2, yvalue: 2, emotion_tag_no: 7, name: '걱정하는', color: '#F2625F' },
            { xvalue: -2, yvalue: 1, emotion_tag_no: 8, name: '답답한', color: '#F4817E' },
            { xvalue: -3, yvalue: 4, emotion_tag_no: 9, name: '질투난', color: '#E31926' },
            { xvalue: -3, yvalue: 3, emotion_tag_no: 10, name: '짜증나는', color: '#E52B37' },
            { xvalue: -3, yvalue: 2, emotion_tag_no: 11, name: '버거운', color: '#EF505A' },
            { xvalue: -3, yvalue: 1, emotion_tag_no: 12, name: '억울한', color: '#EC6971' },
            { xvalue: -4, yvalue: 4, emotion_tag_no: 13, name: '긴장한', color: '#C8121B' },
            { xvalue: -4, yvalue: 3, emotion_tag_no: 14, name: '스트레스받은', color: '#CB1F28' },
            { xvalue: -4, yvalue: 2, emotion_tag_no: 15, name: '예민한', color: '#DB444B' },
            { xvalue: -4, yvalue: 1, emotion_tag_no: 16, name: '수치스러운', color: '#D05E63' },
            { xvalue: -5, yvalue: 4, emotion_tag_no: 17, name: '화난', color: '#B10C15' },
            { xvalue: -5, yvalue: 3, emotion_tag_no: 18, name: '불만스러운', color: '#B02830' },
            { xvalue: -5, yvalue: 2, emotion_tag_no: 19, name: '불안한', color: '#CA3D45' },
            { xvalue: -5, yvalue: 1, emotion_tag_no: 20, name: '불쾌한', color: '#BC5359' },
            { xvalue: 1, yvalue: 4, emotion_tag_no: 21, name: '놀란', color: '#FFE82B' },
            { xvalue: 1, yvalue: 3, emotion_tag_no: 22, name: '설레는', color: '#FFEB49' },
            { xvalue: 1, yvalue: 2, emotion_tag_no: 23, name: '좋은', color: '#FFF076' },
            { xvalue: 1, yvalue: 1, emotion_tag_no: 24, name: '상쾌한', color: '#FFF49A' },
            { xvalue: 2, yvalue: 4, emotion_tag_no: 25, name: '흥겨운', color: '#FFDD00' },
            { xvalue: 2, yvalue: 3, emotion_tag_no: 26, name: '기대되는', color: '#FFE32F' },
            { xvalue: 2, yvalue: 2, emotion_tag_no: 27, name: '반가운', color: '#FFE752' },
            { xvalue: 2, yvalue: 1, emotion_tag_no: 28, name: '유쾌한', color: '#FFED7C' },
            { xvalue: 3, yvalue: 4, emotion_tag_no: 29, name: '기운넘치는', color: '#FFD204' },
            { xvalue: 3, yvalue: 3, emotion_tag_no: 30, name: '자랑스러운', color: '#FFD720' },
            { xvalue: 3, yvalue: 2, emotion_tag_no: 31, name: '기쁜', color: '#FFE159' },
            { xvalue: 3, yvalue: 1, emotion_tag_no: 32, name: '즐거운', color: '#FFE677' },
            { xvalue: 4, yvalue: 4, emotion_tag_no: 33, name: '아주 신나는', color: '#FEC70B' },
            { xvalue: 4, yvalue: 3, emotion_tag_no: 34, name: '재미있는', color: '#FECE2A' },
            { xvalue: 4, yvalue: 2, emotion_tag_no: 35, name: '행복한', color: '#FED95A' },
            { xvalue: 4, yvalue: 1, emotion_tag_no: 36, name: '희망찬', color: '#FFE074' },
            { xvalue: 5, yvalue: 4, emotion_tag_no: 37, name: '황홀한', color: '#FDBD12' },
            { xvalue: 5, yvalue: 3, emotion_tag_no: 38, name: '흥분한', color: '#FDC632' },
            { xvalue: 5, yvalue: 2, emotion_tag_no: 39, name: '짜릿한', color: '#FDCD4B' },
            { xvalue: 5, yvalue: 1, emotion_tag_no: 40, name: '매우 행복한', color: '#FFD563' },
            { xvalue: -1, yvalue: -4, emotion_tag_no: 41, name: '지친', color: '#48A3DA' },
            { xvalue: -1, yvalue: -3, emotion_tag_no: 42, name: '피곤한', color: '#66B0DC' },
            { xvalue: -1, yvalue: -2, emotion_tag_no: 43, name: '지루한', color: '#89BDDC' },
            { xvalue: -1, yvalue: -1, emotion_tag_no: 44, name: '덤덤한', color: '#8EC1E0' },
            { xvalue: -2, yvalue: -4, emotion_tag_no: 45, name: '외로운', color: '#1888CA' },
            { xvalue: -2, yvalue: -3, emotion_tag_no: 46, name: '귀찮은', color: '#3095D0' },
            { xvalue: -2, yvalue: -2, emotion_tag_no: 47, name: '안타까운', color: '#469DD0' },
            { xvalue: -2, yvalue: -1, emotion_tag_no: 48, name: '아쉬운', color: '#79B1D2' },
            { xvalue: -3, yvalue: -4, emotion_tag_no: 49, name: '서러운', color: '#0062AB' },
            { xvalue: -3, yvalue: -3, emotion_tag_no: 50, name: '기죽은', color: '#1470B5' },
            { xvalue: -3, yvalue: -2, emotion_tag_no: 51, name: '슬픈', color: '#3578A9' },
            { xvalue: -3, yvalue: -1, emotion_tag_no: 52, name: '실망스러운', color: '#5283A8' },
            { xvalue: -4, yvalue: -4, emotion_tag_no: 53, name: '우울한', color: '#030093' },
            { xvalue: -4, yvalue: -3, emotion_tag_no: 54, name: '쓸쓸한', color: '#15129C' },
            { xvalue: -4, yvalue: -2, emotion_tag_no: 55, name: '속상한', color: '#2F2D9C' },
            { xvalue: -4, yvalue: -1, emotion_tag_no: 56, name: '부끄러운', color: '#464492' },
            { xvalue: -5, yvalue: -4, emotion_tag_no: 57, name: '절망한', color: '#000B67' },
            { xvalue: -5, yvalue: -3, emotion_tag_no: 58, name: '비참한', color: '#17217A' },
            { xvalue: -5, yvalue: -2, emotion_tag_no: 59, name: '침울한', color: '#283282' },
            { xvalue: -5, yvalue: -1, emotion_tag_no: 60, name: '역겨운', color: '#3D458B' },
            { xvalue: 1, yvalue: -4, emotion_tag_no: 61, name: '편안한', color: '#88BB56' },
            { xvalue: 1, yvalue: -3, emotion_tag_no: 62, name: '편한', color: '#92BE67' },
            { xvalue: 1, yvalue: -2, emotion_tag_no: 63, name: '홀가분한', color: '#A0C57C' },
            { xvalue: 1, yvalue: -1, emotion_tag_no: 64, name: '무기력한', color: '#A4C385' },
            { xvalue: 2, yvalue: -4, emotion_tag_no: 65, name: '따뜻한', color: '#8EC63E' },
            { xvalue: 2, yvalue: -3, emotion_tag_no: 66, name: '안정된', color: '#97D045' },
            { xvalue: 2, yvalue: -2, emotion_tag_no: 67, name: '차분한', color: '#99C659' },
            { xvalue: 2, yvalue: -1, emotion_tag_no: 68, name: '평화로운', color: '#A1C66C' },
            { xvalue: 3, yvalue: -4, emotion_tag_no: 69, name: '신뢰하는', color: '#2DAC47' },
            { xvalue: 3, yvalue: -3, emotion_tag_no: 70, name: '고요한', color: '#3FB357' },
            { xvalue: 3, yvalue: -2, emotion_tag_no: 71, name: '뿌듯한', color: '#4EB964' },
            { xvalue: 3, yvalue: -1, emotion_tag_no: 72, name: '차가운', color: '#6CB47B' },
            { xvalue: 4, yvalue: -4, emotion_tag_no: 73, name: '가벼운', color: '#009D48' },
            { xvalue: 4, yvalue: -3, emotion_tag_no: 74, name: '정적인', color: '#1E9D58' },
            { xvalue: 4, yvalue: -2, emotion_tag_no: 75, name: '평온한', color: '#389864' },
            { xvalue: 4, yvalue: -1, emotion_tag_no: 76, name: '보송보송한', color: '#4C9D71' },
            { xvalue: 5, yvalue: -4, emotion_tag_no: 77, name: '몽롱한', color: '#377C46' },
            { xvalue: 5, yvalue: -3, emotion_tag_no: 78, name: '만족스러운', color: '#4D8258' },
            { xvalue: 5, yvalue: -2, emotion_tag_no: 79, name: '기대지않은', color: '#4D7D58' },
            { xvalue: 5, yvalue: -1, emotion_tag_no: 80, name: '덜렁이는', color: '#577F60' }
        ] as EmotionTag[]
    },
    mutations: {
        SET_NAME(state, name) {
            state.name = name;
        },
        SET_GENDER(state, gender) {
            state.gender = gender;
        },
        SET_BIRTHDAY(state, birthday) {
            state.birthday = birthday;
        },
        ADD_EMOTION_TAG(state, emotionTag) {
            state.diary.selectedEmotionTags.push(emotionTag);
        },
        REMOVE_EMOTION_TAG(state, emotionTag) {
            state.diary.selectedEmotionTags = state.diary.selectedEmotionTags
                .filter(tag => tag.emotion_tag_no !== emotionTag.emotion_tag_no);
        },
        ADD_EVENT_TAG(state, eventTag) {
            state.diary.selectedEventTags.push(eventTag);
        },
        REMOVE_EVENT_TAG(state, eventTag) {
            state.diary.selectedEventTags = state.diary.selectedEventTags
                .filter(tag => tag.eventTagNo !== eventTag.eventTagNo);
        },
        SET_DIARY_CONTENT(state, content) {
            state.diary.content = content;
        },
        SET_CORE_EMOTION_TAG(state, emotionTag) {
            state.diary.coreEmotionTag = emotionTag;
        },
        SET_DIARYCHAR(state, character) {
            state.diaryChar = character;
        },
    },
    actions: {
        setUser({commit}, name) {
            commit('SET_NAME', name);
        },
        setGender({commit}, gender) {
            commit('SET_GENDER', gender);
        },
        setBirthday({commit}, birthday) {
            commit('SET_BIRTHDAY', birthday);
        },
        toggleEmotionTag({ commit, state }, emotionTag) {
            const isSelected = state.diary.selectedEmotionTags.some(tag => tag.emotion_tag_no === emotionTag.emotion_tag_no);
            if (isSelected) {
                if (emotionTag.emotion_tag_no === state.diary.coreEmotionTag.emotion_tag_no) {
                    state.diary.coreEmotionTag = {
                        xvalue: 0,
                        yvalue: 0,
                        emotion_tag_no: 0,
                        name: '',
                        color: ''
                    };
                }
                commit('REMOVE_EMOTION_TAG', emotionTag);
                return true;
            } else {
                if (state.diary.selectedEmotionTags.length < 10) {
                    commit('ADD_EMOTION_TAG', emotionTag);
                    return true;
                } else {
                    return false;
                }
            }
        },
        toggleEventTag({ commit, state }, eventTag) {
            const isSelected = state.diary.selectedEventTags.some(tag => tag.eventTagNo === eventTag.eventTagNo);
            if (isSelected) {
                commit('REMOVE_EVENT_TAG', eventTag);
                return true;
            } else {
                if (state.diary.selectedEventTags.length < 10) {
                    commit('ADD_EVENT_TAG', eventTag);
                    return true;
                } else {
                    return false;
                }
            }
        },
        updateDiaryContent({commit}, content) {
            commit('SET_DIARY_CONTENT', content);

        },
        setCoreEmotionTag({commit}, emotionTag) {
            commit('SET_CORE_EMOTION_TAG', emotionTag);
        },
        setDiaryChar({commit}, character) {
            commit('SET_DIARYCHAR', character)
        },
    },
    getters: {
        getEmotionColor: (state) => (emotionTagNo: number) => {
            const tag = state.emotionTags.find(tag => tag.emotion_tag_no === emotionTagNo);
            return tag ? tag.color : "#a9a9a9"
        },
    },

});