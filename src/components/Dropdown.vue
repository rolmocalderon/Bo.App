!
<template>
  <div class="dropdown" v-on:click="onClickedDropdown" :class="{'disabled': disabled}">
    <span>{{ shownMessage }}</span>
    <div class="dropdown-content" v-if="showDropdownContent">
      <p v-for="value in values" v-bind:key="value.id" :valueId="value.id" v-on:click="onChange">{{ value.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "dropdown",
  props: ["dropdownName", "values", "textMessage", "disabled"],
  created() {
    console.log("dropdown", this.dropdownName, this.values);
  },
  data(){
    return {
      showDropdownContent: false,
      shownMessage: this.textMessage
    }
  },
  methods: {
    onClickedDropdown(){
      this.showDropdownContent = true;
      window.removeEventListener('click', this.onWindowClicked);
      window.addEventListener('click', this.onWindowClicked);
    },
    onChange(e){
      e.stopPropagation();
      
      this.shownMessage = e.target.textContent;
      this.showDropdownContent = false;
      window.removeEventListener('click', this.onWindowClicked);
      let request = {
        'valueId': e.target.getAttribute('valueId'),
        'name': this.shownMessage
      }
      this.$emit("changeDropdown", request);
    },
    onWindowClicked(e){
      let element = e.target.classList.contains('dropdown') ? e.target : e.target.parentNode;
      this.showDropdownContent = element.classList.contains('dropdown') && !element.classList.contains('open');
      if(!this.showDropdownContent){
        window.removeEventListener('click', this.onWindowClicked);
        e.target.classList.remove('open')
      }
    }
  }
};
</script>

<style>
.open{
  background: red;
}
.dropdown {
  position: relative;
  border: 1px solid black;
  padding: 0.8rem 0;
  margin-bottom: 10px;
}

.dropdown-content {
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 20%);
  z-index: 1;
  top: 2.7rem;
  width: 100%;
}
</style>
