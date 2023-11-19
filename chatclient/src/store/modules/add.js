const state = {
    validateNewsResults: []
};
const mutations = {
    setValidateNewsResults(state, data) {
        state.validateNewsResults = data;
    }
};
const actions = {
    SET_VALIDATE_NEWS_RESULTS({ commit }, data) {
        commit('setValidateNewsResults', data);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
