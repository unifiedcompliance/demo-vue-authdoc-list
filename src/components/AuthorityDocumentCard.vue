<template>
  <v-card class="overflow-hidden">
    <v-app-bar
      absolute
      elevation="0"
      scroll-target="adcardcontent"
      class="ad-doc-card-header-bar"
    >
      <div class="addoc-card-header">
        <p class="mb-0 text-h6 font-weight-bold">
          Authority Document Card&nbsp;({{ adId }})
        </p>
        <span @click="$emit('close')"><v-icon>mdi-close</v-icon></span>
      </div>
    </v-app-bar>
    <v-divider />
    <v-sheet
      id="adcardcontent"
      class="overflow-y-auto px-4 py-2 mt-12"
      max-height="85vh"
    >
      <v-row>
        <v-col>
          <v-card class="d-flex align-center ml-6" elevation="0">
            <div class="font-weight-bold">Official Name:</div>
            <div
              class="align-center font-weight-regular ml-4"
              style="font-size: 16px"
            >
              {{ authorityDocument.official_name }}
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" xs="12">
          <v-card class="d-flex" elevation="0">
            <div class="font-weight-bold mr-2">Common Names:</div>
            <v-list
              dense
              height="128px"
              max-height="128px"
              style="border: 1px solid #ccc"
              class="overflow-y-auto flex-grow-1"
            >
              <v-list-item
                v-for="(cm, idx) in getSetArray(authorityDocument.CommonNames)"
                :key="idx"
                dense
              >
                <v-list-item-content>
                  <p class="ma-0">{{ cm.name }}</p>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="6" xs="12">
          <v-card class="d-flex" elevation="0">
            <v-card class="d-flex flex-column align-end" elevation="0">
              <div
                class="font-weight-bold d-flex align-center ma-0"
                style="height: 35px"
              >
                <span>Type:</span>
              </div>
              <div
                class="font-weight-bold d-flex align-center ma-0"
                style="height: 35px"
              >
                <span>Pages:</span>
              </div>
              <div
                class="font-weight-bold d-flex align-center ma-0"
                style="height: 35px"
              >
                <span>Effective Date:</span>
              </div>
            </v-card>
            <v-card class="d-flex flex-column ml-2 align-start" elevation="0">
              <p
                class="font-weight-regular d-flex align-center ma-0"
                style="height: 35px"
              >
                <span v-if="authorityDocument.type">{{
                  authorityDocument.type
                }}</span>
                <span v-else>unknown</span>
              </p>
              <p
                class="font-weight-regular d-flex align-center ma-0"
                style="height: 35px"
              >
                <span v-if="authorityDocument.pages">{{
                  authorityDocument.pages
                }}</span>
                <span v-else>unknown</span>
              </p>
              <p
                class="font-weight-regular d-flex align-center ma-0"
                style="height: 35px"
              >
                <span v-if="authorityDocument.effective_date">{{
                  authorityDocument.effective_date
                }}</span>
                <span v-else>unknown</span>
              </p>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="6" xs="12">
          <div class="font-weight-bold">Authors:</div>
          <v-list
            dense
            height="144px"
            max-height="144px"
            style="border: 1px solid #ccc"
            class="overflow-y-auto flex-grow-1"
          >
            <v-list-item
              v-for="(author, idx) in getSetArray(authorityDocument.Authors)"
              :key="idx"
            >
              <v-list-item-content>
                <p class="ma-0">
                  {{ author.author_editor_name | displayData }}
                </p>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="6" xs="12">
          <div class="font-weight-bold">Editors:</div>
          <v-list
            dense
            height="144px"
            max-height="144px"
            style="border: 1px solid #ccc"
            class="overflow-y-auto flex-grow-1"
          >
            <v-list-item
              v-for="(editor, idx) in getSetArray(authorityDocument.Editors)"
              :key="idx"
            >
              <v-list-item-content>
                <p class="ma-0">
                  {{ editor.author_editor_name | displayData }}
                </p>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-list
            dense
            max-height="460px"
            style="border: 1px solid #ccc"
            class="overflow-y-auto flex-grow-1"
          >
            <v-list-item
              v-for="(identifier, idx) in getSetArray(
                authorityDocument.ADIdentifiers
              )"
              :key="idx"
            >
              <v-list-item-content>
                <PublishedVersion :data="identifier" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-list
            dense
            max-height="432px"
            style="border: 1px solid #ccc"
            class="overflow-y-auto flex-grow-1"
          >
            <v-list-item
              v-for="(mapping, idx) in getSetArray(authorityDocument.ADMappings)"
              :key="idx"
            >
              <v-list-item-content>
                <mapped-version :data="mapping" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-sheet>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import PublishedVersion from './PublishedVersion.vue';
import MappedVersion from './MappedVersion.vue';
import {
  FETCH_AUTHORITY_DOCUMENT,
  GET_AUTHORITY_DOCUMENT,
  SET_SHOW_LOADING_PROGRESS
} from '../store/types';
export default {
  name: 'AuthorityDocumentCard',
  components: {
    PublishedVersion,
    MappedVersion
  },
  props: {
    adId: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters({ authorityDocument: `${GET_AUTHORITY_DOCUMENT}` })
  },
  async created() {
    await this.$store.commit(SET_SHOW_LOADING_PROGRESS, true);
    await this.$store.dispatch(FETCH_AUTHORITY_DOCUMENT, this.adId);
    await this.$store.commit(SET_SHOW_LOADING_PROGRESS, false);
  },
  async mounted() {},
  filters: {
    displayData: function (value) {
      if (value) {
        return value;
      }
      return 'unknown';
    }
  },
  methods: {
    getSetArray(data) {
      if (data && data['@set']) {
        return data['@set'];
      }
      return [];
    }
  }
};
</script>

<style scoped>
.addoc-card {
  padding: 15px 20px;
}
.ad-doc-card-header-bar {
  border-bottom: 1px solid #999999;
}
.addoc-card-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
</style>
