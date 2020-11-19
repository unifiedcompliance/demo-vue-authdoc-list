import Vue from 'vue';
import Vuex from 'vuex';

//modules
import search from './modules/search';
import cardModal from './modules/cardModal';
import ui from './modules/ui';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    search,
    cardModal,
    ui
  }
});
