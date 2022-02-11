<template>
  <div class="info-box">
    <div class="back-arrow-container" v-on:click="backSelected">
      <font-awesome-icon icon="arrow-left" />
    </div>
    <div class="info">
      <span v-if="title != ''">{{ title }}</span>
      <span v-if="subtitle != ''">{{ subtitle }}</span>
    </div>
    <div class="add-product-icon" v-on:click="added" v-show="user.category === 'admin'">
      <font-awesome-icon :icon="icon" />
      <span>{{ iconSubtitle }}</span>
    </div>
  </div>
</template>

<script>
export default {
    name: 'header-bar',
    props: ['title', 'subtitle', 'icon', 'iconSubtitle', 'user'],
    methods: {
        backSelected(){
            this.$emit('backSelected');
        },
        added(){
            this.$emit('added');
        },
        created(){
          console.log(this.title, this.subtitle, this.icon, this.iconSubtitle, this.user)
        }
    }
};
</script>

<style scoped>
.info-box{
  height: 3.5rem;
  background: #5d85c5;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.info{
  display: flex;
  flex-direction: column;
  line-height: 23px;
  font-size: 1.2rem;
  font-weight: 400;
  flex: 1;
  margin-left: 2rem;
  color: white;
}
.add-product-icon{
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 1.6rem;
  margin-right: 1.2rem;
}
.add-product-icon  span{
  font-size: 0.7rem;
  margin-top: 2px;
}
</style>