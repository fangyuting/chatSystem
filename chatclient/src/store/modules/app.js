const state = {
    agreeFriendValidate: false, // 同意好友申请
    searchUserResult: [],
    searchGroupResult: [],
    allFriends: [] // 所有好友
};

const mutations = {
    setAgreeFriendValidate(state, data) {
        state.agreeFriendValidate = data;
    },
    setSearchUserResult(state, data) {
        state.searchUserResult = data;
    },
    setSearchGroupResult(state, data) {
        state.searchGroupResult = data;
    },
    setAllFriends(state, data) {
        console.log('state.allFriends1', state.allFriends);
        state.allFriends = [];
        console.log('state.allFriends2', state.allFriends);
        state.allFriends = data;
        console.log('state.allFriends3', state.allFriends);
    }
};

const actions = {
    SET_AGREE_FRIEND_VALIDATE({ commit }, data) {
        commit('setAgreeFriendValidate', data);
    },
    SET_SEARCH_USER_RESULTS({ commit }, data) {
        commit('setSearchUserResult', data);
    },
    SET_SEARCH_GROUP_RESULTS({ commit }, data) {
        commit('setSearchGroupResult', data);
    },
    SET_ALL_FRIENDS({ commit }, data) {
        commit('setAllFriends', data);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
