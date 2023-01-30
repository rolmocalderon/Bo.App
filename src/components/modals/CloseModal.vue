<template>
	<Modal :headerMessage="'Eliminando...'" v-on:close="$emit('close')">
		<div>
			<span>¿Estás seguro que deseas eliminar?</span>
			<button class="accept-button" v-on:click="$emit('delete')">Eliminar</button>
			<button class="cancel-button" v-on:click="$emit('close')">No eliminar</button>
		</div>
    </Modal>
</template>

<script>
import Modal from '../../components/Modal';

export default {
    name: 'close-modal',
    components: { Modal }
}
</script>
<style scoped>
.config-item-close{
	position: absolute;
    right: 0;
    top: 0;
    color: rgb(51 51 51 / 41%);
    height: 100%;
    width: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.accept-button{
	background-color: #be0000;
    color: white;
    margin: 1rem 0.5rem;
}

.cancel-button{
	background-color: green;
    color: white;
    margin: 1rem 0.5rem;
}
</style>