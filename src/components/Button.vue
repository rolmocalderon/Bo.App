<template>
  <div class="button-container row">
      <button class="background-blue form-input input-submit">{{ value }}</button>
  </div>
</template>

<script>
export default {
    name: 'button',
    props: ["value"]
}
</script>

<style>
    .button-container{
        margin-right: 0.5rem;
    }
</style>