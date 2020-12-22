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
      <hierarchy
        @item-info="showDocumentCard"
        viewType="double"
        treeLabel="Categories and Authority Documents"
        selectedTreeLabel="Selected Authority Documents"
        :filterKey="filterKey"
        :treeItems="geographyHierarchy"
      ></hierarchy>
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
import {
  FETCH_GEOGRAPHY_HIERARCHY,
  GET_GEOGRAPHY_HIERARCHY,
  FETCH_SUBJECT_MATTER_HIERARCHY,
  SET_SHOW_LOADING_PROGRESS
} from '../store/types';
import {
  HIERARCHY_GEOGRAPHY,
  HIERARCHY_SUBJECT_MATTER
} from '../store/constant';
export default {
  components: {
    Hierarchy: () => import('../components/Hierarchy'),
    AuthorityDocumentCard: () => import('../components/AuthorityDocumentCard')
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
    ...mapGetters({ geographyHierarchy: `${GET_GEOGRAPHY_HIERARCHY}` })
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
    },
    onKeyUp(e) {
      if (e.key === 'Enter') {
        this.onSearch();
      }
    },
    async onClearSearchKey() {
      this.isFiltering = false;
      this.filterKey = '';
    },
    async onSearch() {
      this.isFiltering = this.searchKey !== '';
      this.filterKey = this.searchKey;
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

  &:last-child {
    border-right: none;
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
