<template>
  <div>
    <div class="options">
      <v-text-field
        v-model="searchKey"
        label="Search document"
        clearable
        dense
        outlined
        append-icon="mdi-magnify"
        @keyup="onKeyUp"
        @click:append="(e) => onSearch(e)"
        @click:clear="onClearSearchKey"
      />
    </div>
    <div class="mb-2 d-flex align-center ml-5">
      <p class="mb-0 text-h5">Or show hierarchy by</p>
      <v-item-group mandatory @change="onHierarchyChange" class="d-flex ml-4">
        <v-item v-slot:default="{ active, toggle }">
          <v-btn
            :color="active ? 'primary' : ''"
            dense
            class="hierarchy mr-2"
            @click="toggle"
          >
            Geography
          </v-btn>
        </v-item>
        <v-item v-slot:default="{ active, toggle }">
          <v-btn
            :color="active ? 'primary' : ''"
            class="hierarchy"
            dense
            @click="toggle"
          >
            Subject Matter
          </v-btn>
        </v-item>
      </v-item-group>
    </div>
    <div class="documents">
      <div class="document-tree">
        <p class="tree-label">Categories and Authority Documents</p>
        <v-treeview
          v-model="tree"
          :items="geographyHierarchy"
          :search="filterKey"
          :filter="filterTree"
          :open="expandedNodes"
          item-key="id"
          open-on-click
        >
          <template v-slot:label="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ item.name }}</span>
              </template>
              <span>{{ item.name }}</span>
            </v-tooltip>
          </template>

          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="item.category_fk !== 1">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
              {{ files.txt }}
            </v-icon>
          </template>
          <template v-slot:append="{ item }">
            <div
              v-if="item.category_fk === 1"
              class="remove-action d-flex"
              style="align-items: center; justify-content-center;"
            >
              <v-icon
                medium
                @click.stop="showDocumentCard(item.authority_document_fk)"
                >mdi-information-outline
              </v-icon>
              <div
                class="d-flex"
                style="align-items: center; justify-content-center;"
              >
                <v-checkbox
                  v-model="item.selected"
                  @click.stop="selectDocument(item)"
                ></v-checkbox>
              </div>
            </div>
          </template>
        </v-treeview>
      </div>
      <div class="selected-list">
        <ul>
          <li class="list-header">
            <div class="document-name">Selected List</div>
            <div class="remove-action">Remove</div>
          </li>
          <li v-for="(doc, idx) in selectedDocuments" :key="idx">
            <selected-document-item v-if="doc.selected" :doc="doc" />
          </li>
        </ul>
      </div>
    </div>
    <v-dialog v-model="adCardDlg">
      <authority-document-card
        v-if="adCardDlg"
        :adId="selectedAdID"
        @close="adCardDlg = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SelectedDocumentItem from '../components/SelectedList/SelectedDocumentItem.vue';
import {
  FETCH_GEOGRAPHY_HIERARCHY,
  GET_GEOGRAPHY_HIERARCHY,
  FETCH_SUBJECT_MATTER_HIERARCHY,
  SET_SHOW_LOADING_PROGRESS,
  GET_SELECTED_DOCUMENTS,
  SET_ADD_DOCUMENT_TO_SELECTED,
  GET_EXPANDED_TREE_NODES,
  SET_FILTERED_DOCUMTENTS
} from '../store/types';
import {
  HIERARCHY_GEOGRAPHY,
  HIERARCHY_SUBJECT_MATTER
} from '../store/constant';
export default {
  components: {
    AuthorityDocumentCard: () =>
      import(
        /* webpackChunkName: "AuthorityDocumentCard" */ '../components/AuthorityDocumentCard'
      ),
    SelectedDocumentItem
  },
  data: () => ({
    searchKey: '',
    hierarchy: '',
    expandedNodes: [],
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-code-json',
      md: 'mdi-language-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel'
    },
    tree: [],
    adCardDlg: false,
    selectedAdID: null,
    isFiltering: false,
    filterKey: ''
  }),
  computed: {
    ...mapGetters({ geographyHierarchy: `${GET_GEOGRAPHY_HIERARCHY}` }),
    ...mapGetters({ selectedDocuments: `${GET_SELECTED_DOCUMENTS}` }),
    filterTree() {
      const filterFunction = (item, search) => {
        return item.name.indexOf(search) > -1;
      };
      return filterFunction;
    }
  },
  methods: {
    async onHierarchyChange(hr) {
      await this.$store.commit(SET_SHOW_LOADING_PROGRESS, true);
      this.hierarchy = hr;
      switch (hr) {
        case HIERARCHY_GEOGRAPHY:
          await this.$store.dispatch(FETCH_GEOGRAPHY_HIERARCHY);
          break;
        case HIERARCHY_SUBJECT_MATTER:
          await this.$store.dispatch(FETCH_SUBJECT_MATTER_HIERARCHY);
          break;
      }
      await this.$store.commit(SET_SHOW_LOADING_PROGRESS, false);
      if (!this.isFiltering) {
        await this.$store.commit(SET_FILTERED_DOCUMTENTS, {
          searchKey: '',
          hierarchy: this.hierarchy
        });
      }
      this.expandedNodes = this.$store.getters[GET_EXPANDED_TREE_NODES];
    },
    onKeyUp(e) {
      if (e.key === 'Enter') {
        this.onSearch();
      }
    },
    async onClearSearchKey() {
      await this.$store.commit(SET_FILTERED_DOCUMTENTS, {
        searchKey: '',
        hierarchy: this.hierarchy
      });
      this.isFiltering = false;
      this.filterKey = '';
      this.expandedNodes = this.$store.getters[GET_EXPANDED_TREE_NODES];
    },
    async onSearch() {
      await this.$store.commit(SET_FILTERED_DOCUMTENTS, {
        searchKey: this.searchKey,
        hierarchy: this.hierarchy
      });
      this.isFiltering = this.searchKey === '' ? false : true;
      this.expandedNodes = this.$store.getters[GET_EXPANDED_TREE_NODES];
      this.filterKey = this.searchKey;
    },
    selectDocument(item) {
      if (item.selected) {
        this.$store.commit(SET_ADD_DOCUMENT_TO_SELECTED, item);
      }
    },
    showDocumentCard(id) {
      this.selectedAdID = id.toString();
      this.adCardDlg = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.options {
  display: flex;
}
.hierarchy {
  width: 150px !important;
}
.documents {
  border: 1px solid #999999;
  display: flex;
}
.tree-label {
  margin: 0;
  padding: 5px;
  border-bottom: 1px solid #999999;
}
.document-tree {
  width: 50%;
  border-right: 1px solid #999999;
  overflow-x: auto;
}
.selected-list {
  width: 50%;
  ul {
    list-style: none;
    padding: 0;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      &.list-header {
        padding: 5px;
        border-bottom: 1px solid #cccccc;
      }
    }
  }
}
</style>

<style lang="scss">
.remove-action {
  .v-input--selection-controls {
    margin: 0;
    padding: 0;
  }
  .v-messages {
    display: none;
  }
  .v-input__slot {
    margin-bottom: 0px !important;
  }
}
</style>
