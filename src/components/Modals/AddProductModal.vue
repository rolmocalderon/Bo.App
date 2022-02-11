<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <form name="productModalForm" v-on:submit="productModified">
                        <div :class="'modal-header ' + modalColor" ref="modalHeader">
                            <div class="modal-header-message">
                                <span>{{ headerMessage }}</span>
                                <div class="close-icon" v-on:click="$emit('close')">
                                    <font-awesome-icon icon="window-close"/>
                                </div>
                            </div>
                        </div>

                        <div class="modal-body">
                            <input type="text" :value="currentProductName" name="productName" placeholder="Nombre del producto">
                            <input type="number" :value="currentProductAmount" min="0" max="10000" name="productAmount" placeholder="Cantidad">
                            <div class="measure-container">
                                <input type="number" :value="currentProductWeight" name="productWeight" placeholder="Medida">
                                <select name="measure">
                                    <option v-for="measure in measures" v-bind:key="measure.id" :value="measure.id" :selected="measure.id == currentTypeOfMeasure">{{ measure.type }}</option>
                                </select>
                            </div>
                            <select name="productType">
                                <option v-for="type in productTypes" v-bind:key="type.id" :value="type.id" :selected="type.id == currentProductType">{{ type.type }}</option>
                            </select>
                            <input type="hidden" name="id" :value="currentProduct.id"/>
                        </div>

                        <div class="modal-footer">
                            <slot name="footer">
                            <button :class="'modal-default-button ' + modalColor">
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
import db from '../../services/db';
export default {
    name: "add-product-modal",
    props: ['modalType', 'selectedProduct'],
    created(){
        this.init();
    },
    data: function(){
        return {
            submitMessage: '',
            headerMessage: '',
            currentProduct: this.selectedProduct,
            currentProductName: '',
            currentProductAmount: '',
            currentProductWeight: '',
            currentProductType: '',
            currentTypeOfMeasure: '',
            measures: [],
            productTypes: [],
            modalColor: 'dark-blue'
        }
    },
    methods:{
        init(){
            this.getMeasures();
            this.getProductTypes();
            switch(this.modalType){
                case 'edit':
                    this.submitMessage = 'Modificar';
                    this.headerMessage = 'Modificando producto';
                    this.currentProductName = this.selectedProduct.productname;
                    this.currentProductAmount = this.selectedProduct.amount;
                    this.currentProductWeight = this.selectedProduct.weight;
                    this.currentProductType = this.selectedProduct.productTypeId;
                    this.currentTypeOfMeasure = this.selectedProduct.measureId;
                    this.modalColor = 'golden'
                    break;
                case 'add':
                    this.submitMessage = 'Añadir';
                    this.headerMessage = 'Añadiendo producto';
                    break;
            }
        },
        productModified(e){
            e.preventDefault();
            let inputs = Array.from(e.target.querySelectorAll('input'));
            if(this.validations(inputs)){
                if(this.modalType == 'add'){
                    this.$emit('productAdded', e.target);
                }else if(this.modalType == 'edit'){
                    this.$emit('productModified', e.target);
                }
            }
        },
        validations(inputs){
            inputs.forEach(x => x.classList.remove('not-validated'));
            let canSubmit = true;
            for(var input of inputs){
                if(input.value == "" && input.type != "hidden"){
                    canSubmit = false;
                    input.classList.add("not-validated");
                }
            }
            
            return canSubmit;
        },
        getMeasures(){
            let self = this;
            db.getAll("getMeasures", function (res) {
                self.measures = res;
            }, {});
        },
        getProductTypes(){
            let self = this;
            db.getAll('getProductTypes', function(res){
                self.productTypes = res;
            });
        }
    }
}
</script>

<style>
.close-icon{
    font-size: 1.3rem;
    margin-right: 1rem;
}
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

.not-validated{
    outline: 1px solid #ff7c7c;
}

.not-validated::placeholder{
    color: #ff7c7c;
}

.measure-container{
    display: flex;
    margin-bottom: 1rem;
}

.measure-container input{
    margin-bottom: 0;
}
.dark-blue{
    background: #3E5985 !important;
}
.garnet{
    background: #853e45 !important;
}
.golden{
    background: #ab9d00 !important;
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