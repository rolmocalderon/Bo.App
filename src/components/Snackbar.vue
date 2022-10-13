<template>
    <div class="snackbar-container" :class="{ 'fadeinout': canShowSnackbar}">
        <div class="snackbar-content">
            <span class="snackbar-text">
                <font-awesome-icon icon="check-circle" class="snackbar-icon"/>
                <span>Añadido correctamente</span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'snackbar',
    props: ['snackbarText','icon', 'canShowSnackbar']
}
</script>

<style scoped>
    .snackbar-container {
        width: 60%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 5%;
        opacity: 0;
    }

    .snackbar-content {
        width: 100%;
        background-color: #7ed17e;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 5px;
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
        animation: fadeinout 4s linear forwards;
    }

    @keyframes fadeinout {
        from { opacity: 0; }
        20%, 70% { opacity: 1; }
        to { opacity: 0; }
    }
</style>