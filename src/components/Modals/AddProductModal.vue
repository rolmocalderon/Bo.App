<template>
    <Modal :headerMessage="headerMessage" :submitMessage="submitMessage" v-on:close="$emit('close')" v-on:submit="onSubmit" :modalColor="'dark-blue'" :isSubmitActive="true">
        <input type="text" name="productName" placeholder="Nombre del producto" class="date-box">
        <input type="number" min="0" max="10000" name="productAmount" placeholder="Cantidad" class="date-box">
        <div class="measure-container">
            <select name="measure">
                <option v-for="measure in measures" v-bind:key="measure.id" :value="measure.id" :selected="measure.id == currentTypeOfMeasure" v-on:change="currentTypeOfMeasure = measure.type">{{ measure.type }}</option>
            </select>
        </div>
        <input type="hidden" name="measuretype" :value="currentTypeOfMeasure"/>
    </Modal>
</template>

<script>
import Modal from '../Modal';
export default {
    name: "add-product-modal",
    props: ['selectedProduct'],
    components: { Modal },
    created(){
        this.init();
    },
    data: function(){
        return {
            submitMessage: '',
            headerMessage: '',
            currentTypeOfMeasure: '',
            measures: []
        }
    },
    methods:{
        init(){
            this.submitMessage = 'Añadir';
            this.headerMessage = 'Añadiendo producto';
            this.getMeasures();
        },
        onSubmit(e){
            let inputs = Array.from(e.target.querySelectorAll('input'));
            if(this.validations(inputs)){
                this.$emit('productAdded', e.target);
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
            let measures = this.getFromLocalStorage('measures');
            this.currentTypeOfMeasure = measures[0].type;
            this.measures = measures;
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
    width: 100%;
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
.product-input{
    padding: 15px 0;
}
</style>