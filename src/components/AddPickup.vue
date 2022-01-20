<template>
  <div class="add-pickup">
    <div class="row almost-full-width">
        <button v-on:click="addPickup" class="background-blue form-input input-submit">Añadir punto de recogida</button>
    </div>
    <div class="add-pickup-form-container" v-if="showPickupForm">
        <div class="add-pickup-form">
        <form action="#">
            <div class="row">
                <label>Nombre del lugar</label>
                <input type="text" v-model="placeName" name="placeName" class="form-input">
            </div>
            <div class="row">
                <label>Fecha</label>
                <input type="date" v-model="date" name="date" class="form-input" pattern="\d{2}/\d{2}-\d{4}">
            </div>
            <div class="row">
                <input type="submit" value="Añadir" class="form-input input-submit" v-on:click="submit">
            </div>
        </form>
        </div>
    </div>
    </div>
</template>

<script>
export default {
    name: "add-pickup",
    data: function(){
        return {
            showPickupForm: false,
            placeName: "",
            date: ""
        }
    },
    methods:{
        submit(event) {
            event.preventDefault();
            var self = this;
            if(this.placeName && this.date){
                var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                var formattedDate = new Date(this.date)
                    .toLocaleDateString('es', options)
                    .replace(/ /g,'/')
                    .replace('.','')
                    .replace(/-([a-z])/, function (x) {return '/' + x[1].toUpperCase()});

                var existingPickup = Array.from(this.pickups).find(pickup => pickup.name.toLowerCase() == this.placeName.toLowerCase() && pickup.date == formattedDate);
                if(!existingPickup){
                    let params = {
                        'placeName': this.placeName,
                        'date': formattedDate
                    }
                    this.insert('insertPickup', function(){
                        self.showPickupForm = false;
                        self.getPickups();
                    }, params);
                }else{
                    console.log('Already exists');
                }
            }else{
                console.log("Missing data");
            }
        },
        addPickup(){
            this.showPickupForm = !this.showPickupForm;
        },
        addProduct(){
            console.log('productAdded')
        }
    }
}
</script>

<style>

</style>