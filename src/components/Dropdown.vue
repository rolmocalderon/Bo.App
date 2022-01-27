!
<template>
  <select :name="dropdownName" v-on:change="onChange" class="dropdown">
    <option value="">-- Selecciona una opción --</option>
    <option
      v-for="value in values"
      v-bind:key="value.id"
      :value="value.id"
      v-bind:date="value.date"
    >
      {{ value.name }} {{ value.date }}
    </option>
  </select>
</template>

<script>
export default {
  name: "dropdown",
  props: ["dropdownName", "values"],
  methods: {
      created(){
          console.log(this.dropdownName, "dropdown");
      },
      onChange(e){
          this.$emit("changeDropdown", e);
      }
  }
};
</script>

<style></style>
