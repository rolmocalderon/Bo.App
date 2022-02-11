<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <form name="productModalForm" v-on:submit="formSubmitted">
                        <div class="'modal-header'" ref="modalHeader">
                            <div class="modal-header-message">
                                <span>{{ headerMessage }}</span>
                                <div class="close-icon" v-on:click="$emit('close')">
                                    <font-awesome-icon icon="window-close"/>
                                </div>
                            </div>
                        </div>

                        <div class="modal-body">
                            <slot name="body"></slot>
                        </div>

                        <div class="modal-footer">
                            <slot name="footer">
                            <button class="'modal-default-button'">
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
    name: 'default-modal',
    data(){
        return{
            submitMessage: 'Submit',
            headerMessage: 'Header'
        }
    },
    methods:{
        formSubmitted(e){
            e.preventDefault();
            console.log("Form submitted");
        }
    }
}
</script>

<style>

</style>