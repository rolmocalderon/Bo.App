import Vue from 'vue';
import axios from "axios";

Vue.mixin({
    data(){
        return {

        }
    },
	methods: {
        serializeForm (form) {
			var obj = {};
			var formData = new FormData(form);
			for (var key of formData.keys()) {
				obj[key] = formData.get(key);
			}
			return obj;
		},
        async insert(endPoint, callback, params){
            axios({
                method: "post",
                url: process.env.VUE_APP_WEBAPI_URL + "/" + endPoint,
                data: params
            }).then((response) => {
                callback(response);
            })
        },
        initLocalStorage(){
            localStorage.data = '';
        },
        updateLocalStorage(key, value){
            localStorage[key] = JSON.stringify(value);
        },
        getFromLocalStorage(key){
            var data = localStorage[key];
            return data === 'object' ? JSON.parse(data) : '';
        }
    }
});