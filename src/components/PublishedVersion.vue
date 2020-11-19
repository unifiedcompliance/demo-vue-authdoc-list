<template>
  <v-card outlined elevation="2">
    <div class="text-subtitle-1 font-weight-bold grey--text mx-2">
      Published Version
    </div>
    <v-row class="mx-2">
      <v-col cols="6" sm="3">
        <v-card class="d-flex align-center" elevation="0">
          <div class="font-weight-bold">Type:</div>
          <div class="font-weight-regular ml-2">
            {{ data.document_type | displayData }}
          </div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="d-flex align-center" elevation="0">
          <div class="font-weight-bold">Availability:</div>
          <div class="font-weight-regular ml-2">
            {{ data.availability | displayData }}
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="d-flex align-center justify-center" elevation="0">
          <div class="font-weight-bold">Language:</div>
          <div class="font-weight-regular ml-2">
            {{ data.language | displayData }}
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="d-flex mx-8" elevation="0">
      <v-card class="d-flex flex-column align-end" elevation="0">
        <div class="font-weight-bold d-flex align-center" style="height: 30px">
          <span>Wesite Publisher or Periodical Title:</span>
        </div>
        <div class="font-weight-bold d-flex align-center" style="height: 30px">
          <span>Volume or Issue:</span>
        </div>
        <div class="font-weight-bold d-flex align-center" style="height: 30px">
          <span>Published Date:</span>
        </div>
      </v-card>
      <v-card class="d-flex flex-column align-start ml-2" elevation="0">
        <div
          class="font-weight-regular d-flex align-center"
          style="height: 30px"
        >
          {{ data.calculated_publisher_title | displayData }}
        </div>
        <div
          class="font-weight-regular d-flex align-center"
          style="height: 30px"
        >
          {{ (data.volume + data.vomlume_issue) | displayData }}
        </div>
        <div
          class="font-weight-regular d-flex align-center"
          style="height: 30px"
        >
          {{ data.published_date | displayData }}
        </div>
      </v-card>
    </v-card>
    <v-card class="mx-8 my-4" outlined elevation="2">
      <div class="mx-2 my-1 font-weight-bold grey--text">
        Locator Information
      </div>
      <v-row class="mx-0">
        <v-col cols="12" sm="4">
          <v-card class="d-flex align-center" elevation="0">
            <div class="font-weight-bold">ISBN:</div>
            <div class="font-weight-regular ml-1">
              {{ data.isbn | displayData }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8">
          <v-card class="d-flex" elevation="0">
            <v-card class="d-flex flex-column align-end" elevation="0">
              <div
                class="font-weight-bold d-flex align-center"
                style="height: 30px"
              >
                UUID:
              </div>
              <div
                class="font-weight-bold d-flex align-center"
                style="height: 30px"
              >
                Search Info:
              </div>
            </v-card>
            <v-card class="d-flex flex-column align-start ml-1" elevation="0">
              <div
                class="font-weight-regular d-flex align-center"
                style="height: 30px"
              >
                {{ data.uuid | displayData }}
              </div>
              <div
                class="font-weight-regular d-flex align-center"
                style="height: 30px"
              >
                {{ data.search_information | displayData }}
              </div>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
      <v-card class="d-flex mx-4 mb-2" elevation="0">
        <v-card class="d-flex flex-column align-end" elevation="0">
          <div
            v-if="data.url"
            class="font-weight-bold d-flex align-center"
            style="height: 30px"
          >
            URL:
          </div>
          <div
            v-if="data.doi"
            class="font-weight-bold d-flex align-center"
            style="height: 30px"
          >
            DOI:
          </div>
        </v-card>
        <v-card class="d-flex flex-column align-start ml-1" elevation="0">
          <div
            v-if="data.url"
            class="font-weight-regular d-flex align-center"
            style="height: 30px"
          >
            {{ data.url }}
          </div>
          <div
            v-if="data.doi"
            class="font-weight-regular d-flex align-center"
            style="height: 30px"
          >
            {{ data.doi }}
          </div>
        </v-card>
      </v-card>
    </v-card>
  </v-card>
</template>
<script>
export default {
  name: 'PublishedVersion',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  filters: {
    displayData: function (value) {
      if (value) {
        return value;
      }
      return 'unknown';
    }
  }
};
</script>
