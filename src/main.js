import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser,faLock,faArrowLeft,faCube,faWindowClose,faCalendarPlus, faCheckCircle, faPlusCircle, faMinusCircle, faSync, faChevronDown, faChevronUp, faPlus, faEdit, faMars, faVenus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import "@/mixins/Connections";

library.add(faUser,faLock,faArrowLeft,faCube,faWindowClose,faCalendarPlus,faCheckCircle,faPlusCircle,faMinusCircle,faSync,faChevronDown,faChevronUp,faPlus,faEdit, faMars, faVenus, faTimes);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

const eventBus = new Vue({
  render: h => h(App),
}).$mount('#app');

export default eventBus;