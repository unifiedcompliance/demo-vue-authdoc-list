<template>
  <v-card outlined elevation="2" class="py-2">
    <div class="text-subtitle-1 font-weight-bold grey--text mx-2">
      Mapped Version
    </div>
    <v-row class="mx-2">
      <v-col cols="8" sm="8">
        <v-card class="d-flex align-center" elevation="0">
          <div class="font-weight-bold">Reference Controls:</div>
          <div class="font-weight-regular ml-2">
            {{ data.reference_control | displayData }}
          </div>
        </v-card>
      </v-col>
      <v-col cols="4" sm="4">
        <v-card class="d-flex align-center" elevation="0">
          <div class="font-weight-bold">Release Date:&nbsp;</div>
          <div class="font-weight-regular ml-2">
            {{ data.release_date | displayData | dateFormat }}
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-for="(role, idx) in roles" :key="idx" class="mx-0 mb-2 mt-2">
      <v-col cols="6" sm="6" class="pa-0 mb-1">
        <v-row class="align-center">
          <v-col cols="4" class="pa-0">
            <div
              class="font-weight-bold text-right"
              style="text-transform: capitalize"
            >
              {{ role }}:
            </div>
          </v-col>
          <v-col cols="8" class="pa-0">
            <div class="font-weight-regular ml-1">
              {{ memberName(role) }}
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" sm="6" class="pa-0">
        <v-row class="align-center">
          <v-col cols="4" class="pa-0">
            <div class="font-weight-bold text-right">Organization:</div>
          </v-col>
          <v-col cols="8" class="pa-0">
            <div class="font-weight-regular ml-1">
              {{ memberOrganization(role) }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="mx-0">
      <v-col cols="12" sm="12" class="pa-0">
        <v-row class="align-center">
          <v-col cols="2" class="pa-0">
            <div class="font-weight-bold text-right">URL:&nbsp;&nbsp;</div>
          </v-col>
          <v-col cols="8" class="pa-0">
            <div class="font-weight-regular ml-1">
              {{ data.url | displayData }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: 'MappedVerson',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      roles: ['mapper', 'reviewer', 'approver']
    };
  },
  filters: {
    displayData: function (value) {
      if (value) {
        return value;
      }
      return 'unknown';
    },
    dateFormat: function (value) {
      if (!value || value === 'unknown') {
        return 'unknown';
      }

      let d = new Date(value);

      if (Number.isNaN(d.getMonth())) {
        let arr = value.split(/[- :]/);
        d = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
      }

      return d.toLocaleDateString('en-US');
    }
  },
  methods: {
    memberName(role) {
      if (this.data.Members && this.data.Members['@set']) {
        for (const mem of this.data.Members['@set']) {
          if (role === mem.role) {
            return mem.person_name;
          }
        }
      }
      return 'unknown';
    },
    memberOrganization(role) {
      if (this.data.Members && this.data.Members['@set']) {
        for (const mem of this.data.Members['@set']) {
          if (role === mem.role) {
            return mem.organization_name;
          }
        }
      }
      return 'unknown';
    },
    getSetArray(data) {
      if (data && data['@set']) {
        return data['@set'];
      }
      return [];
    }
  }
};
</script>
