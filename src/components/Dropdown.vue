<template>
  <div class="dropdown date-box" v-on:click="onClickedDropdown" :class="{'disabled': disabled}">
    <span>{{ shownMessage }}</span>
    <div class="dropdown-content" v-if="showDropdownContent">
      <p v-for="value in values" v-bind:key="value.id" :valueId="value.id" v-on:click="onChange">{{ value.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "dropdown",
  props: ["values", "textMessage", "disabled", "isDropdownContentShown"],
  data(){
    return {
      shownMessage: this.textMessage,
      showDropdownContent: this.isDropdownContentShown
    }
  },
  methods: {
    onClickedDropdown(){
      this.showDropdownContent = !this.showDropdownContent;
      window.removeEventListener('click', this.onWindowClicked);
      window.addEventListener('click', this.onWindowClicked);
      this.$emit("dropDownShown", true);
    },
    onChange(e){
      e.stopPropagation();
      
      this.shownMessage = e.target.textContent;
      this.$emit("dropDownShown", false);
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
        e.target.classList.remove('open');
      }
    }
  }
};
</script>

<style>
.open{
  background: red;
  z-index: 100;
}
.dropdown {
  position: relative;
  padding: 0.8rem 0;
  margin-bottom: 10px;
  font-size: 1rem;
  border-radius: 4px;
}

.dropdown-content {
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 20%);
  z-index: 100;
  top: 2.7rem;
  width: 100%;
}
</style>
