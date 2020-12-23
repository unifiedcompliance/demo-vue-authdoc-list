import axios from '../../plugins/axios';
import _ from 'lodash';

import {
  FETCH_GEOGRAPHY_HIERARCHY,
  GET_GEOGRAPHY_HIERARCHY,
  SET_GEOGRAPHY_HIERARCHY,
  FETCH_SUBJECT_MATTER_HIERARCHY,
  SET_SUBJECT_MATTER_HIERARCHY
} from '../types';

const state = {
  documents: [],
  geographyTreeList: []
};

const actions = {
  async [FETCH_GEOGRAPHY_HIERARCHY](context) {
    try {
      const hierarchy = await axios.get('ADHierarchy');
      await context.commit(SET_GEOGRAPHY_HIERARCHY, hierarchy.data);
    } catch (e) {
      console.log('[error]', e);
    }
  },
  async [FETCH_SUBJECT_MATTER_HIERARCHY](context) {
    try {
      const subjectMatters = await axios.get('SubjectMatters');
      const authorityDocuments = await axios.get('ADSubjectMatters');
      await context.commit(SET_SUBJECT_MATTER_HIERARCHY, {
        subjectMatters: subjectMatters.data,
        authorityDocuments: authorityDocuments.data
      });
    } catch (e) {
      console.log('[error]', e);
    }
  }
};

const mutations = {
  [SET_GEOGRAPHY_HIERARCHY](state, payload) {
    state.documents = payload;
    state.geographyTreeList = structureGeographyTree(payload);
  },
  [SET_SUBJECT_MATTER_HIERARCHY](state, payload) {
    const { subjectMatters, authorityDocuments } = payload;
    state.documents = [...authorityDocuments];
    state.geographyTreeList = structureSubjectMatterTree(subjectMatters, authorityDocuments);
  }
};

const getters = {
  [GET_GEOGRAPHY_HIERARCHY]: (state) => state.geographyTreeList
};

function structureGeographyTree(documents) {
  const dataTree = [];
  const treeList = [];

  for (const item of documents) {
    dataTree.push({
      id: item.authority_document_fk,
      name: item.authority_document_name,
      icon: item.category_fk === 1 ? 'mdi-file-document-outline' : 'mdi-folder',
      iconOpen: item.category_fk === 1 ? false : 'mdi-folder-open',
      info: item.category_fk === 1,
      selectable: item.category_fk === 1,
      selected: false,
      ...item
    });
  }

  for (const item of dataTree) {
    if (item.parent_id === null) {
      treeList.push(item);
      continue;
    }
    for (const parItem of dataTree) {
      if (parItem.authority_document_fk === item.parent_id) {
        if (!parItem.children || parItem.children === 0) {
          parItem.children = [];
        }
        parItem.children.push(item);
        _.sortBy(parItem.children, [
          function (o) {
            return o.sort_value;
          }
        ]);
        break;
      }
    }
  }

  _.sortBy(treeList, [
    function (o) {
      return o.sort_value;
    }
  ]);

  return treeList;
}

function structureSubjectMatterTree(subjectMatters, documents) {
  const dataTree = [];
  const treeList = [];

  for (const item of documents) {
    dataTree.push({
      id: item.authority_document_fk,
      name: item.authority_document_name,
      icon: item.category_fk === 1 ? 'mdi-file-document-outline' : 'mdi-folder',
      iconOpen: item.category_fk === 1 ? false : 'mdi-folder-open',
      info: item.category_fk === 1,
      selectable: item.category_fk === 1,
      selected: false,
      ...item
    });
  }

  for (const item of subjectMatters) {
    treeList.push({
      id: 'sm-' + item.id,
      name: item.name,
      icon: 'mdi-folder',
      iconOpen: 'mdi-folder-open',
      info: false,
      selectable: false,
      selected: false,
      has_children: true,
      children: []
    });
  }
  for (const item of dataTree) {
    if (!item.SubjectMattersStub['@set'] || item.SubjectMattersStub['@set'].length === 0) {
      treeList.push(item);
      continue;
    }
    for (const sm of item.SubjectMattersStub['@set']) {
      for (const subject of treeList) {
        if ('sm-' + sm.sm_id === subject.id) {
          item.id = item.authority_document_fk;
          subject.children.push(item);
        }
      }
    }
  }

  return treeList;
}

export default {
  state,
  actions,
  mutations,
  getters
};
