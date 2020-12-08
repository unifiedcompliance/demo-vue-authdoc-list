import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  render: (h) => h(App)
}).$mount('#app');

Vue.filter('dateFormat', function (input) {
  if (!input) {
    return '';
  }

  let d = new Date(input);

  if (Number.isNaN(d.getMonth())) {
    let arr = input.split(/[- :]/);
    d = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
  }

  return d.toLocaleDateString('en-US');
});
