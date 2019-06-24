<template >
  <div class="wel">
      <transition enter-active-class="zoomInUp" :duration="{ enter:1000}">
        <div v-show="isShow" class="animated">Welcome</div>      
      </transition>
  </div>
</template>
<script>
export default {
    created() {
        window.setInterval(()=>{
            this.isShow=true
        },1000)
    },
  data() {
    return {
        isShow:false
    }
  }
}
</script>
<style lang = 'less'>
/* .v-enter,.v-leave-to {
    opacity: 0;
    transform: translate(-200px,-200px)
}
.v-enter-active,.v-leave-active {
    transition: all 1s linear;
} */
.wel {
  opacity: 0.5;
  height: 100%;
  background: url(../assets/img/bg.jpg) no-repeat;
  background-size: cover;
  position: relative;
  div.animated {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: 100px;
    color: #fff;
  }
}
</style>
