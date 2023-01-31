import Vue from 'vue';
import axios from "axios";
import cookies from "../services/cookies";

Vue.mixin({
    created(){
        this.navigation = JSON.parse(sessionStorage.getItem("currentPage"));
    },
    data(){
        return {
            user: {},
            currentPage: {}
        }
    },
	methods: {
        async getAll(endPoint, callback, params) {
            const token = this.getUser().token;
			axios({
				method: "get",
				url: process.env.VUE_APP_WEBAPI_URL + "/api/" + endPoint,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-Type": "application/json",
                    "x-access-token": token
				},
				params: params,
			}).then((response) => {
				callback(response.data);
			});
		},
        async doPost(endPoint, callback, params, errorCallback){
            this.doApiCall(endPoint, 'post', params, callback, errorCallback);
        },
        async doDelete(endPoint, callback, params, errorCallback){
            this.doApiCall(endPoint, 'delete', params, callback, errorCallback);
        },
        async doApiCall(endPoint, method, params, callback, errorCallback = function(){}){
            const token = this.getUser().token;
            axios({
                method: method,
                url: process.env.VUE_APP_WEBAPI_URL + "/api/" + endPoint,
                headers: {
                    "x-access-token": token
                },
                data: params
            }).then((response) => {
                callback(response);
            }).catch((response) =>{
                errorCallback(response);
            });
        },
        async doLogin(params){
            const headers = {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            };

            axios.post(process.env.VUE_APP_WEBAPI_URL + "/api/login", params, {headers})
            .then((response) => {
                if (response.data && response.data.token) {
                    this.updateValue(response.data);
                }
                this.loading = false;
            }).catch((error) => {
                this.loading = false;
                this.errorMessage = error.response.data;
            });
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
            this.getAll("cities", (res) => {
                let cities = this.user.cityid ? res.filter((c) => c.id === this.user.cityid) : res;
                this.updateLocalStorage('cities', cities);

                if(callback){
                    callback();
                }
            });
        },
        setUser(currentUser){
            this.user = {
                name: currentUser.name,
                category: currentUser.category,
                cityid: currentUser.cityid,
                token: currentUser.token
            };
        },
        navigate(page, params){
            this.navigation = {
                page,
                params
            };
            sessionStorage.setItem("currentPage", JSON.stringify(this.navigation));
        },
        getUser(){
            return cookies.getCookie("user");
        }
    }
});