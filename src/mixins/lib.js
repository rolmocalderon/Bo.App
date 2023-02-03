import Vue from 'vue';

Vue.mixin({
    data(){
        return {
            isSnackbarError: false
        }
    },
    methods: {
        prepend(value, array) {
            var newArray = array.slice();
            newArray.unshift(value);
            return newArray;
        },
        showSnackbar(isError){
            this.isSnackbarError = isError;
            this.canShowSnackbar = true;
            setTimeout(() => {
                this.canShowSnackbar = false;
            }, 5000);
        }
    }
});