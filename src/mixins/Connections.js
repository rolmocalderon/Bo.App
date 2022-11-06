import Vue from 'vue';
import axios from "axios";

Vue.mixin({
    data(){
        return {
            user: {}
        }
    },
	methods: {
        async getAll(endPoint, callback, params) {
			axios({
				method: "get",
				url: process.env.VUE_APP_WEBAPI_URL + "/" + endPoint,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-Type": "application/json",
				},
				params: params,
			}).then((response) => {
				callback(response.data.data);
			});
		},
        async insert(endPoint, callback, params, errorCallback = function(){}){
            axios({
                method: "post",
                url: process.env.VUE_APP_WEBAPI_URL + "/" + endPoint,
                data: params
            }).then((response) => {
                callback(response);
            }).catch((response) =>{
                errorCallback(response);
            })
        },
        serializeForm (form) {
			var obj = {};
			var formData = new FormData(form);
			for (var key of formData.keys()) {
				obj[key] = formData.get(key);
			}
			return obj;
		},
        initLocalStorage(){
            localStorage.data = '';
        },
        updateLocalStorage(key, value){
            localStorage[key] = value === '' ? value : JSON.stringify(value);
        },
        getFromLocalStorage(key){
            var data = localStorage[key];
            try{
                data = JSON.parse(data);
            }catch(e){
                return "";
            }

            return data;
        },
        groupBy(xs, key) {
			return xs.reduce(function(rv, x) {
				(rv[x[key]] = rv[x[key]] || []).push(x);
				return rv;
			}, {});
		},
        getCities(callback){
            let self = this;
            this.getAll("getCities", function (res) {
              let cities = self.user.cityid ? res.filter((c) => c.id === self.user.cityid) : res;
              self.updateLocalStorage('cities', cities);

              if(callback){
                callback();
              }
            });
        },
        setUser(value){
            this.user = {
                name: value[0].name,
                category: value[0].category,
                cityid: value[0].cityid,
            };
        }
    }
});