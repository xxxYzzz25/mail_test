import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue';
import VCharts from 'v-charts';
import VeeValidate from 'vee-validate'
import zhTW from 'vee-validate/dist/locale/zh_TW'
import VueI18n from 'vue-i18n'
import VeLine from 'v-charts/lib/line.common'

Vue.component(VeLine.name, VeLine)

Vue.use(BootstrapVue);
Vue.use(VCharts);
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zhTW'
})
Vue.use(VeeValidate, {
  events: 'input|blur', //這是為了讓使用者離開該欄位時觸發驗證
  i18n,
  dictionary: {
    zhTW
  }
})

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app');
