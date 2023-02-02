import Vue from 'vue';

Vue.mixin({
    methods: {
        prepend(value, array) {
            var newArray = array.slice();
            newArray.unshift(value);
            return newArray;
        },

    }
});