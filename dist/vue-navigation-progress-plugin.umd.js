(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.vueNavigationProgressPlugin = factory());
}(this, (function () { 'use strict';

var routerProgress = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:([_vm.cssObj, _vm.style])})},
staticRenderFns: [],
    name: "router-progress",
    computed: {
      style: function style () {
        return {
          width: this.percent + "%",
          backgroundColor: this.canSuccess ? this.color : this.failedColor,
          boxShadow: "0 0 10px " + this.shadowColor,
          opacity: this.show ? 1 : 0
        };
      }
    },
    created: function created () {
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
    data: function data () {
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
      start: function start() {
        var this$1 = this;

        this.show = true;
        this.canSuccess = true;
        if (this._timer) {
          clearInterval(this._timer);
          this.percent = 0;
        }
        this._cut = 10000 / Math.floor(this.duration);
        this._timer = setInterval(function () {
          this$1.increase(this$1._cut * Math.random());
          if (this$1.percent > 90) {
            this$1.pause();
          }
        }, 100);
      },
      set: function set(num) {
        this.show = true;
        this.canSuccess = true;
        this.percent = Math.floor(num);
      },
      get: function get() {
        return Math.floor(this.percent);
      },
      increase: function increase(num) {
        this.percent = this.percent + Math.floor(num);
      },
      decrease: function decrease(num) {
        this.percent = this.percent - Math.floor(num);
      },
      finish: function finish() {
        this.percent = 100;
        this.hide();
      },
      pause: function pause() {
        clearInterval(this._timer);
      },
      hide: function hide() {
        var this$1 = this;

        clearInterval(this._timer);
        this._timer = null;
        setTimeout(function () {
          this$1.show = false;
          this$1.$nextTick(function () {
            setTimeout(function () {
              this$1.percent = 0;
            }, 200);
          });
        }, 500);
      },
      fail: function fail() {
        this.canSuccess = false;
      }
    }
  };

// reference self https://nuxtjs.org
var flatMapComponents = function (route, fn) {
  return Array.prototype.concat.apply([], route.matched.map(function (m, index) {
    return Object.keys(m.components).map(function (key) {
      return fn(m.components[key], m, key, index);
    });
  }));
};
var loadAsyncComponents = function (to, from, next, Vue, router) {
  var $progress = router.app && router.app.$root.$progress;
  var resolveComponents = flatMapComponents(to, function (Component, match, key) {
    if (typeof Component === "function" && !Component.options) {
      return new Promise(function (resolve, reject) {
        var _resolve = function (Component) {
          if (!Component.options) {
            Component = Vue.extend(Component); // fix issue #6
            Component._Ctor = Component;
          } else {
            Component._Ctor = Component;
            Component.extendOptions = Component.options;
          }
          match.components[key] = Component;
          resolve(Component);
        };
        Component().then(_resolve).catch(reject);
      });
    }
    return Component;
  });
  var fromPath = from.fullPath.split("#")[0];
  var toPath = to.fullPath.split("#")[0];
  if (!(fromPath === toPath)) {
    $progress && $progress.start();
  }
  Promise.all(resolveComponents).then(function () {
    $progress && $progress.finish();
    next();
  }, function () {
    $progress && $progress.fail();
    $progress && $progress.finish();
    next(false);
  });
};

var index = {
  install: function install (Vue, router) {
    Vue.component(routerProgress.name, routerProgress);
    router.beforeEach(function (to, from, next) { return loadAsyncComponents(to, from, next, Vue, router); });
  }
};

return index;

})));
//# sourceMappingURL=vue-navigation-progress-plugin.umd.js.map
