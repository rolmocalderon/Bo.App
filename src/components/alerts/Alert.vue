<template>
  <div class="alert-container">
    <span>{{ message }}</span>
  </div>
</template>

<script>
export default {
    name: 'alert',
    props: ['message']
}
</script>

<style>
    .alert-container{
        background-color: rgb(79 159 79);
        color: white;
        padding: 0.5rem;
    }
</style>