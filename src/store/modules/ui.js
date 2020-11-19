import { SET_SHOW_LOADING_PROGRESS, GET_SHOW_LOADING_PROGRESS } from '../types';
const state = {
  showLoadingProgress: false
};

const actions = {};

const mutations = {
  [SET_SHOW_LOADING_PROGRESS](state, payload) {
    state.showLoadingProgress = payload;
  }
};

const getters = {
  [GET_SHOW_LOADING_PROGRESS]: (state) => state.showLoadingProgress
};

export default {
  state,
  actions,
  mutations,
  getters
};
