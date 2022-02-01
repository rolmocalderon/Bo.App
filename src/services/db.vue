<script>
    import axios from "axios";

    export default {
        insert, getAll
    }

    async function insert(endPoint, callback, params){
        axios({
            method: "post",
            url: "http://192.168.1.38:3000/" + endPoint,
                params: params,
        }).then((response) => {
            callback(response.data.data);
        })
    }
    async function getAll(endPoint, callback, params) {
        axios({
            method: "get",
            url: "http://192.168.1.38:3000/" + endPoint,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            params: params,
        })
        .then((response) => { callback(response.data.data); });
    }
</script>