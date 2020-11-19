import axios from '../../plugins/axios';
import {
  FETCH_AUTHORITY_DOCUMENT,
  GET_AUTHORITY_DOCUMENT,
  SET_AUTHORITY_DOCUMENT
} from '../types';
const state = {
  authorityDocument: {}
};

const actions = {
  async [FETCH_AUTHORITY_DOCUMENT](context, adID) {
    try {
      const res = await axios.get(`AuthorityDocument/${adID}`);
      context.commit(SET_AUTHORITY_DOCUMENT, res.data);
      console.log('[document]', res.data);
    } catch (e) {
      console.log('[AD Error]', e);
    }
  }
};

const mutations = {
  [SET_AUTHORITY_DOCUMENT](state, payload) {
    state.authorityDocument = payload;
  }
};

const getters = {
  [GET_AUTHORITY_DOCUMENT]: (state) => state.authorityDocument
};

export default {
  state,
  actions,
  mutations,
  getters
};
