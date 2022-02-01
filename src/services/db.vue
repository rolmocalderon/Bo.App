<script>
    import axios from "axios";

    export default {
        insert, getAll
    }

    async function insert(endPoint, callback, params){
        axios({
            method: "post",
            url: process.env.VUE_APP_WEBAPI_URL + "/" + endPoint,
                params: params,
        }).then((response) => {
            callback(response.data.data);
        })
    }
    async function getAll(endPoint, callback, params) {
        axios({
            method: "get",
            url: process.env.VUE_APP_WEBAPI_URL + "/" + endPoint,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            params: params,
        })
        .then((response) => { callback(response.data.data); });
    }
</script>