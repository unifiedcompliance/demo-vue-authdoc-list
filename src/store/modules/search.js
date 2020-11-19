import axios from '../../plugins/axios';
import _ from 'lodash';

import {
  FETCH_GEOGRAPHY_HIERARCHY,
  GET_GEOGRAPHY_HIERARCHY,
  SET_GEOGRAPHY_HIERARCHY,
  FETCH_SUBJECT_MATTER_HIERARCHY,
  SET_SUBJECT_MATTER_HIERARCHY,
  SET_ADD_DOCUMENT_TO_SELECTED,
  SET_REMOVE_DOCUMENT_FROM_SELECTED,
  GET_SELECTED_DOCUMENTS,
  SET_GEOGRAPHY_EXPANDED_TREE_NODES,
  SET_SM_EXPANDED_TREE_NODES,
  GET_EXPANDED_TREE_NODES,
  SET_FILTERED_DOCUMTENTS
} from '../types';
import { HIERARCHY_GEOGRAPHY, HIERARCHY_SUBJECT_MATTER } from '../constant';
const state = {
  documents: [],
  geographyTreeList: [],
  selectedDocuments: [],
  expandedTreeNodes: [],
  filteredDocuments: []
};

const actions = {
  async [FETCH_GEOGRAPHY_HIERARCHY](context) {
    try {
      const res = await axios.get('ADHierarchy');
      const { data } = res;
      await context.commit(SET_GEOGRAPHY_HIERARCHY, data);
      await context.commit(SET_GEOGRAPHY_EXPANDED_TREE_NODES, data);
    } catch (e) {
      console.log('[error]', e);
    }
  },
  async [FETCH_SUBJECT_MATTER_HIERARCHY](context) {
    try {
      const resSubject = await axios.get('SubjectMatters');
      const res = await axios.get('ADSubjectMatters');

      await context.commit(SET_SUBJECT_MATTER_HIERARCHY, {
        subjectData: resSubject.data,
        adData: res.data
      });
      await context.commit(SET_SM_EXPANDED_TREE_NODES, {
        subjectData: resSubject.data,
        adData: res.data
      });
    } catch (e) {
      console.log('[error]', e);
    }
  }
};

const mutations = {
  [SET_GEOGRAPHY_HIERARCHY](state, payload) {
    const { treeList, selectedList } = structureTreeList(
      [],
      payload,
      HIERARCHY_GEOGRAPHY
    );
    state.documents = payload;
    state.geographyTreeList = treeList;
    state.selectedDocuments = selectedList;
  },
  [SET_SUBJECT_MATTER_HIERARCHY](state, payload) {
    const { subjectData, adData } = payload;
    state.documents = [...adData];
    const { treeList, selectedList } = structureTreeList(
      subjectData,
      adData,
      HIERARCHY_SUBJECT_MATTER
    );
    state.geographyTreeList = treeList;
    state.selectedDocuments = selectedList;
  },
  [SET_ADD_DOCUMENT_TO_SELECTED](state, payload) {
    const idx = state.selectedDocuments.indexOf(payload);
    if (idx > -1) {
      state.selectedDocuments.splice(idx, 1);
    }
    state.selectedDocuments.push(payload);
  },
  [SET_REMOVE_DOCUMENT_FROM_SELECTED](state, payload) {
    const idx = state.selectedDocuments.indexOf(payload);
    state.selectedDocuments.splice(idx, 1);
  },
  [SET_GEOGRAPHY_EXPANDED_TREE_NODES](state, payload) {
    const expandedTreeNodes = getExpandedNodes(payload, HIERARCHY_GEOGRAPHY);
    state.expandedTreeNodes = expandedTreeNodes;
  },
  [SET_SM_EXPANDED_TREE_NODES](state, payload) {
    const { adData } = payload;
    const expandedTreeNodes = getExpandedNodes(
      adData,
      HIERARCHY_SUBJECT_MATTER
    );
    state.expandedTreeNodes = expandedTreeNodes;
  },
  [SET_FILTERED_DOCUMTENTS](state, { searchKey, hierarchy }) {
    if (searchKey === '') {
      state.filteredDocuments = [...state.selectedDocuments];
      state.expandedTreeNodes = getExpandedNodes(state.documents, hierarchy);
    } else {
      state.filteredDocuments = _.filter(state.documents, function (o) {
        return o.authority_document_name.includes(searchKey);
      });
      state.expandedTreeNodes = getExpandedNodes(state.documents, hierarchy);
    }
  }
};

const getters = {
  [GET_GEOGRAPHY_HIERARCHY]: (state) => state.geographyTreeList,
  [GET_SELECTED_DOCUMENTS]: (state) => state.selectedDocuments,
  [GET_EXPANDED_TREE_NODES]: (state) => {
    return state.expandedTreeNodes;
  }
};

function structureTreeList(subjectData, adData, hierarchy) {
  const dataTree = [];
  const treeList = [];
  const selectedList = [];
  for (const item of adData) {
    const selected = isSelected(item);
    const treeItem = {
      id: item.authority_document_fk,
      name: item.authority_document_name,
      selected,
      ...item
    };
    dataTree.push(treeItem);
    if (selected) {
      selectedList.push(treeItem);
    }
  }

  switch (hierarchy) {
    case HIERARCHY_GEOGRAPHY:
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
            item.id = item.parent_id + '-' + item.authority_document_fk;
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
      break;
    case HIERARCHY_SUBJECT_MATTER:
      for (const item of subjectData) {
        treeList.push({
          ...item,
          has_children: true,
          children: []
        });
      }
      for (const item of dataTree) {
        if (
          !item.SubjectMattersStub['@set'] ||
          item.SubjectMattersStub['@set'].length === 0
        ) {
          treeList.push(item);
          continue;
        }
        for (const sm of item.SubjectMattersStub['@set']) {
          for (const subject of treeList) {
            if (sm.sm_id === subject.id) {
              item.id = sm.sm_id + '-' + item.authority_document_fk;
              subject.children.push(item);
            }
          }
        }
      }
      break;
    default:
      break;
  }

  return { treeList, selectedList };
}

function isSelected(item) {
  for (const sel of state.selectedDocuments) {
    if (sel.authority_document_fk === item.authority_document_fk) {
      return true;
    }
  }
  return false;
}

function getExpandedNodes(adData, hierarchy) {
  const expanded = [];
  const expandedNodes = [];
  switch (hierarchy) {
    case HIERARCHY_GEOGRAPHY:
      for (const leaf of state.filteredDocuments) {
        const leafID = leaf.authority_document_fk;
        const geoItem = _.find(adData, function (o) {
          return o.authority_document_fk === leafID;
        });
        let { parent_id } = geoItem;
        const temp = true;
        while (temp) {
          if (parent_id === null) break;
          if (expanded.includes(parent_id)) break;

          const parent = _.find(adData, function (o) {
            return o.authority_document_fk === parent_id;
          });
          if (parent) {
            expanded.push(parent_id);
            parent_id = parent.parent_id;
            const parentNodeId =
              parent_id !== null
                ? parent_id + '-' + parent.authority_document_fk
                : parent.authority_document_fk;
            expandedNodes.push(parentNodeId); //id means tree node id
          } else {
            break;
          }
        }
      }
      return expandedNodes;
    case HIERARCHY_SUBJECT_MATTER:
      for (const leaf of state.filteredDocuments) {
        const smItem = _.find(adData, function (o) {
          return o.authority_document_fk === leaf.authority_document_fk;
        });
        if (
          !smItem ||
          !smItem.SubjectMattersStub['@set'] ||
          smItem.SubjectMattersStub['@set'].length === 0
        ) {
          continue;
        }
        for (const node of smItem.SubjectMattersStub['@set']) {
          const { sm_id } = node;
          if (expanded.includes(sm_id)) continue;
          expanded.push(sm_id);
          expandedNodes.push(sm_id);
        }
      }
      return expandedNodes;
    default:
      return expandedNodes;
  }
}

export default {
  state,
  actions,
  mutations,
  getters
};
