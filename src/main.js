import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAppleAlt,faPumpSoap,faUser,faLock, faArrowLeft,faCartPlus, faCheese,faCube, faWindowClose,faCalendarPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import "@/mixins/Connections";

library.add(faAppleAlt,faPumpSoap,faUser,faLock,faArrowLeft,faCartPlus,faCheese,faCube,faWindowClose,faCalendarPlus,faCheckCircle);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
