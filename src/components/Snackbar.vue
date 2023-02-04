<template>
    <div class="snackbar-container" :class="{ 'fadeinout': canShow, 'snackbar-error': isError, 'snackbar-success': !isError }">
        <div class="snackbar-content">
            <span class="snackbar-text">
                <font-awesome-icon v-if="!isError" icon="check-circle" class="snackbar-icon"/>
                <font-awesome-icon v-if="isError" icon="check-circle" class="snackbar-icon"/>
                <span v-if="!isError">{{isDeleting ? removedSuccessMessage : addedSuccessMessage}}</span>
                <span v-if="isError">Ha ocurrido un error</span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'snackbar',
    props: ['snackbarText','icon', 'isError', 'canShow', 'isDeleting'],
    data(){
        return{
            addedSuccessMessage: 'Añadido correctamente',
            removedSuccessMessage: 'Eliminado correctamente',
        }
    },
    watch: {
        isDeletingSnackbar(value){
            console.log(value)
        }
    }
}
</script>

<style scoped>
    .snackbar-container {
        width: 70%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 5%;
        opacity: 0;
        z-index: 1000;
    }

    .snackbar-content {
        width: 100%;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 5px;
    }

    .snackbar-success{
        background-color: #7ed17e;
    }

    .snackbar-error{
        background-color: #a61919;
        color: white;
    }

    .snackbar-icon {
        font-size: 1.7rem;
        margin-right: 0.5rem;
    }
    .snackbar-text {
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 700;
    }

    .fadeinout{
        animation: fadeinout 5s linear forwards;
    }

    @keyframes fadeinout {
        from { opacity: 0; }
        20%, 70% { opacity: 1; }
        100% { opacity: 0; }
    }
</style>