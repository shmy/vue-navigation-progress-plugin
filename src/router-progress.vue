<template>
  <div class="router-progress" :style="{
    'width': percent+'%',
    'background-color': canSuccess? color : failedColor,
    'box-shadow': '0 0 10px ' + shadowColor,
    'opacity': show ? 1 : 0
    }"></div>
</template>

<script>
  export default {
    name: "router-progress",
    created () {
      !this.$root.$progress && (this.$root.$progress = this);
    },
    props: {
      color: {
        type: String,
        default: "#77b6ff"
      },
      shadowColor: {
        type: String,
        default: "rgba(119,182,255,0.7)"
      },
      failedColor: {
        type: String,
        default: "red"
      }
    },
    data () {
      return {
        percent: 0,
        show: false,
        canSuccess: true,
        duration: 5000
      };
    },
    methods: {
      start () {
        this.show = true;
        this.canSuccess = true;
        if (this._timer) {
          clearInterval(this._timer);
          this.percent = 0;
        }
        this._cut = 10000 / Math.floor(this.duration);
        this._timer = setInterval(() => {
          this.increase(this._cut * Math.random());
          if (this.percent > 90) {
            this.pause();
          }
        }, 100);
        return this;
      },
      set (num) {
        this.show = true;
        this.canSuccess = true;
        this.percent = Math.floor(num);
        return this;
      },
      get () {
        return Math.floor(this.percent);
      },
      increase (num) {
        this.percent = this.percent + Math.floor(num);
        return this;
      },
      decrease (num) {
        this.percent = this.percent - Math.floor(num);
        return this;
      },
      finish () {
        this.percent = 100;
        this.hide();
        return this;
      },
      pause () {
        clearInterval(this._timer);
        return this;
      },
      hide () {
        clearInterval(this._timer);
        this._timer = null;
        setTimeout(() => {
          this.show = false;
          this.$nextTick(() => {
            setTimeout(() => {
              this.percent = 0;
            }, 200);
          });
        }, 500);
        return this;
      },
      fail () {
        this.canSuccess = false;
        return this;
      }
    }
  };
</script>

<style scoped lang="stylus">
  .router-progress 
    position: fixed
    top: 0px
    left: 0px
    right: 0px
    height: 2px
    transition: width .2s, opacity .2s
    z-index: 999998
</style>
