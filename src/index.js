import routerProgress from "./router-progress.vue";
// reference self https://nuxtjs.org
const flatMapComponents = (route, fn) => {
  return Array.prototype.concat.apply([], route.matched.map(function (m, index) {
    return Object.keys(m.components).map(function (key) {
      return fn(m.components[key], m, key, index);
    });
  }));
};
const loadAsyncComponents = (to, from, next, Vue, router) => {
  const $progress = router.app && router.app.$root.$progress;
  const resolveComponents = flatMapComponents(to, (Component, match, key) => {
    if (typeof Component === "function" && !Component.options) {
      return new Promise((resolve, reject) => {
        const _resolve = (Component) => {
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
  const fromPath = from.fullPath.split("#")[0];
  const toPath = to.fullPath.split("#")[0];
  if (!(fromPath === toPath)) {
    $progress && $progress.start();
  }
  Promise.all(resolveComponents).then(() => {
    $progress && $progress.finish();
    next();
  }, () => {
    $progress && $progress.fail();
    $progress && $progress.finish();
    next(false);
  });
};

export default {
  install (Vue, router) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = `\ndiv[data-v-123456]{position:fixed;top:0;left:0;right:0;height:2px;width:100%;transition:transform 0.3s ease-out,opacity 0.3s ease-out;z-index:9999}\n`;
    document.head.appendChild(style);
    Vue.component(routerProgress.name, routerProgress);
    router.beforeEach((to, from, next) => loadAsyncComponents(to, from, next, Vue, router));
  }
};


