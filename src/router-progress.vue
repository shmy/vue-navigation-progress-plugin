<template>
  <div :style="[cssObj, style]"></div>
</template>

<script>
  export default {
    name: "router-progress",
    computed: {
      style () {
        return {
          width: this.percent + "%",
          backgroundColor: this.canSuccess ? this.color : this.failedColor,
          boxShadow: "0 0 10px " + this.shadowColor,
          opacity: this.show ? 1 : 0
        };
      }
    },
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
        duration: 5000,
        cssObj: {
          position: "fixed",
          top: "0px",
          left: "0px",
          right: "0px",
          height: "2px",
          transition: "width .2s, opacity .2s",
          zIndex: "999998"
        }
      };
    },
    methods: {
      start() {
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
      set(num) {
        this.show = true;
        this.canSuccess = true;
        this.percent = Math.floor(num);
      },
      get() {
        return Math.floor(this.percent);
      },
      increase(num) {
        this.percent = this.percent + Math.floor(num);
      },
      decrease(num) {
        this.percent = this.percent - Math.floor(num);
      },
      finish() {
        this.percent = 100;
        this.hide();
      },
      pause() {
        clearInterval(this._timer);
      },
      hide() {
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
      fail() {
        this.canSuccess = false;
      }
    }
  };

</script>
