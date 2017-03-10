<template>
  <div :style="style" class="router-progress"></div>
</template>

<script>
  export default {
    name: "router-progress",
    computed: {
      style () {
        return {
          transform: `translate3d(${this.percent - 100}%, 0, 0)`,
          backgroundColor: this.canSuccess ? this.color : this.failedColor,
          opacity: this.show ? 1 : 0
        };
      }
    },
    created () {
      !this.$root.$progress && (this.$root.$progress = this);
    },
    props: {
      duration: {
        type: Number,
        default: 3000
      },
      color: {
        type: String,
        default: "#77b6ff"
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
        canSuccess: true
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
      },
      set (num) {
        this.show = true;
        this.canSuccess = true;
        this.percent = Math.floor(num);
      },
      get () {
        return Math.floor(this.percent);
      },
      increase (num) {
        this.percent = this.percent + Math.floor(num);
      },
      decrease (num) {
        this.percent = this.percent - Math.floor(num);
      },
      finish () {
        this.percent = 100;
        this.hide();
      },
      pause () {
        clearInterval(this._timer);
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
      },
      fail () {
        this.canSuccess = false;
      }
    }
  };

</script>

<style>
  .router-progress
    position:fixed
    top:0
    left:0
    right:0
    height:2px
    width:100%
    transition:transform 0.3s ease-out,opacity 0.3s ease-out
    box-shadow: rgba(119,182,255,0.7)
    z-index:9999
</style>
