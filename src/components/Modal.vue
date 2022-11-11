<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <form name="productModalForm" v-on:submit="onSubmit($event)">
                        <div :class="'modal-header ' + modalColor">
                            <div class="modal-header-message">
                                <span>{{ headerMessage }}</span>
                                <div class="close-icon" v-on:click="$emit('close')">
                                    <font-awesome-icon icon="window-close"/>
                                </div>
                            </div>
                        </div>

                        <div class="modal-body">
                            <slot></slot>
                        </div>

                        <div class="modal-footer">
                            <slot name="footer">
                                <button class="modal-default-button" :class="{'disabled': !isSubmitActive, [modalColor]: modalColor }">
                                    {{ submitMessage }}
                                </button>
                            </slot>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'modal',
    props: ['headerMessage', 'submitMessage', 'modalColor', 'isSubmitActive'],
    methods:{
        onSubmit(e){
            e.preventDefault();
            this.$emit('submit', e);
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
    width: 85%;
    margin: 0px auto;
    padding: 1rem;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 33%);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    position: relative;
    font-size: 0.9rem;
}

.modal-header {
    top: 0;
    left: 0;
    position: absolute;
    background: #3E5985;
    height: 3rem;
    display: flex;
    align-items: center;
    color: white;
    width: 100%;
}

.modal-header-message{
    display: flex;
    width: 100%;
    justify-content: center;
    position: relative;
    height: 100%;
    align-items: center;
}

.modal-header-message span{
    flex: 1;
    margin-left: 1rem;
    font-size: 1rem;
}

.modal-body {
  margin: 3rem 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.modal-body select{
    width: 100%;
    box-shadow: 0 0 5px rgb(0 0 0 / 50%);
    border-radius: 2px;
    border: none;
    background: transparent;
}

.modal-body input{
    border: none;
    padding: 1rem 1rem;
    margin-bottom: 1rem;
    border-radius: 2px;
}

.modal-body input[type="text"], .modal-body input[type="number"]{
    box-shadow: 0 0 5px rgb(0 0 0 / 50%);
    width: 89%;
}

.modal-footer{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
}

.modal-default-button {
    color: white;
    font-weight: 400;
    padding: 0.8rem 2rem;
    border-radius: 3px;
    background-color: #3E5985;
}

.close-icon{
    font-size: 1.3rem;
    margin-right: 1rem;
}

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