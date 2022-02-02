<template>
    <transition name="modal">
        <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">

                <div class="modal-header">
                    <div class="modal-header-message">
                        <span>Añadiendo producto</span>
                    </div>
                </div>

                <div class="modal-body">
                    <input type="text" value="" name="productName" placeholder="Nombre del producto">
                    <input type="text" value="" name="productAmount" placeholder="Cantidad">
                    <select name="productType">
                        <option value="food">Comida</option>
                        <option value="sanity">Productos de higiene</option>
                    </select>
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                    <button class="modal-default-button" @click="$emit('close')">
                        {{ submitMessage }}
                    </button>
                    </slot>
                </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "modal",
    props: ['modalType'],
    data: function(){
        return {
            submitMessage: this.getSubmitMessage()
        }
    },
    methods:{
        getSubmitMessage(){
            let message = 'Test';
            switch(this.modalType){
                case 'edit':
                    message = 'Modificar';
                    break;
                case 'add':
                    message = 'Añadir';
                    break;
            }

            return message;
        }
    }
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    position: relative;
}

.modal-header {
    top: 0;
    left: 0;
    position: absolute;
    background: #4CAF50;
    height: 3rem;
    display: flex;
    align-items: center;
    color: white;
    width: 100%;
}

.modal-header-message{
    flex: 1;
}

.modal-body {
  margin: 3rem 0;
}

.modal-default-button {
    background: #4CAF50;
    color: white;
    font-weight: 400;
    padding: 0.8rem 2rem;
    border-radius: 3px;
}

.modal-footer{
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-body input{
    border: none;
    padding: 1rem 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 0 5px rgb(0 0 0 / 50%);
    border-radius: 2px;
    width: 89%;
}
.modal-body input:focus, .modal-body select:focus{
    outline: #4CAF50 solid 2px;
}

.modal-body select{
    width: 100%;
    box-shadow: 0 0 5px rgb(0 0 0 / 50%);
    border-radius: 2px;
    border: none;
    background: transparent;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>