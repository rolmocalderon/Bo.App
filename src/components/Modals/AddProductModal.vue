<template>
    <Modal :headerMessage="headerMessage" :submitMessage="submitMessage" v-on:close="$emit('close')" v-on:submit="onSubmit" :modalColor="modalColor" :isSubmitActive="true">
        <input type="text" :value="currentProductName" name="productName" placeholder="Nombre del producto">
        <input type="number" :value="currentProductAmount" min="0" max="10000" name="productAmount" placeholder="Cantidad">
        <div class="measure-container">
            <input type="number" :value="currentProductWeight" name="productWeight" placeholder="Medida">
            <select name="measure">
                <option v-for="measure in measures" v-bind:key="measure.id" :value="measure.id" :selected="measure.id == currentTypeOfMeasure">{{ measure.type }}</option>
            </select>
        </div>
        <input type="hidden" v-if="selectedProduct" name="id" :value="selectedProduct.id"/>
    </Modal>
</template>

<script>
import Modal from '../Modal';
export default {
    name: "add-product-modal",
    props: ['modalType', 'selectedProduct'],
    components: { Modal },
    created(){
        this.init();
    },
    data: function(){
        return {
            submitMessage: '',
            headerMessage: '',
            currentProductName: '',
            currentProductAmount: '',
            currentProductWeight: '',
            currentProductType: '',
            currentTypeOfMeasure: '',
            measures: [],
            modalColor: 'dark-blue'
        }
    },
    methods:{
        init(){
            switch(this.modalType){
                case 'edit':
                    this.submitMessage = 'Modificar';
                    this.headerMessage = 'Modificando producto';
                    this.currentProductName = this.selectedProduct.productname;
                    this.currentProductAmount = this.selectedProduct.amount;
                    this.currentProductWeight = this.selectedProduct.weight;
                    this.currentProductType = this.selectedProduct.producttypeid;
                    this.currentTypeOfMeasure = this.selectedProduct.measureid;
                    this.modalColor = 'golden'
                    break;
                case 'add':
                    this.submitMessage = 'Añadir';
                    this.headerMessage = 'Añadiendo producto';
                    break;
            }
        },
        onSubmit(e){
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
        }
    }
}
</script>

<style>
.modal-body input:focus, .modal-body select:focus{
    outline: #4CAF50 solid 2px !important;
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

</style>