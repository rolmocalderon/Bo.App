import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAppleAlt,faPumpSoap,faUser,faLock, faArrowLeft,faCartPlus, faCheese,faCube, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faAppleAlt,faPumpSoap,faUser,faLock,faArrowLeft,faCartPlus,faCheese,faCube,faWindowClose);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
