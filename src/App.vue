<template>
  <div>
    <default-layout>
      <Home />
    </default-layout>
    <v-overlay :value="showLoadingProgress">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DefaultLayout from './layout/DefaultLayout.vue';
import Home from './views/Home.vue';
import { GET_SHOW_LOADING_PROGRESS } from './store/types';
export default {
  name: 'App',
  components: {
    DefaultLayout,
    Home
  },
  computed: {
    ...mapGetters({ showLoadingProgress: `${GET_SHOW_LOADING_PROGRESS}` })
  }
};
</script>
