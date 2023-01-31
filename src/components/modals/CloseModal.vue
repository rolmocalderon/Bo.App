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