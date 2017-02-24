**支持vue-router + webpack2 代码分割的路由进度显示**  
[![npm](https://img.shields.io/npm/v/vue-navigation-progress-plugin.svg?style=flat-square)](https://www.npmjs.com/package/vue-navigation-progress-plugin)
[![npm](https://img.shields.io/npm/dt/vue-navigation-progress-plugin.svg?style=flat-square)](https://www.npmjs.com/package/vue-navigation-progress-plugin)
[![license](https://img.shields.io/github/license/shmy/vue-navigation-progress-plugin.svg?style=flat-square)](https://github.com/shmy/vue-navigation-progress-plugin/blob/master/LICENSE.md)
[![GitHub stars](https://img.shields.io/github/stars/shmy/vue-navigation-progress-plugin.svg?style=social&label=Star)](https://github.com/shmy/vue-navigation-progress-plugin)  
![enter description here][1]  
![enter description here][2]  

### **Important**
- 如果使用代码分割,异步组件加载需使用 `Webpack2` 的`System.import()`

### **Installation**  

+ via **CDN**  
``` html
  <script src="https://unpkg.com/vue-navigation-progress-plugin/dist/vue-navigation-progress-plugin.min.js"></script>
```  
### simple example  
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://unpkg.com/vue/dist/vue.js"></script>
  <script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
  <script src="https://unpkg.com/vue-navigation-progress-plugin/dist/vue-navigation-progress-plugin.min.js"></script>
</head>

<body>
  <div id="app">
    <!-- 放置进度条组件  -->
    <router-progress></router-progress>
    <router-view></router-view>
  </div>
  <template id="index">
    <div>
      <h1>this is index page</h1>
      <router-link to="/list">go to list</router-link>
    </div>
  </template>
  <template id="list">
    <div>
      <h1>this is list page</h1>
      <router-link to="/">go to index</router-link>
    </div>
  </template>
  <script>
    Vue.use(VueRouter);
    var router = new VueRouter({
      routes: [{
        path: "/",
        component: { template: "#index" },
        meta: { title: "首页" }
      }, {
        path: "/list",
        component: { template: "#list" },
        meta: { title: "列表页" }
      }]
    });
    Vue.use(vueNavigationProgressPlugin, router);
    new Vue({
      el: "#app",
      router
    })
  </script>
</body>

</html>
````  

+ via **NPM**  
```bash
$ npm install vue-navigation-progress-plugin --save # Or
$ yarn add vue-navigation-progress-plugin
```

### simple example

```javascript
// main.js
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import vueNavigationProgressPlugin from "vue-navigation-progress-plugin";
Vue.use(VueRouter);
const router = new VueRouter({
  routes: [{
    path: "/",
    component:  () => System.import("components/index.vue") // 注意 必须使用System.import
  },{
    path: "/list",
    component:  () => System.import("components/list.vue")
  }]
});
Vue.use(vueNavigationProgressPlugin, router);
new Vue({
  el: "#app",
  router,
  render: h => h(App)
});

```

```html
 <!-- like App.vue -->
 <template>
  <div id="app">
   <!-- 放置进度条组件 -->
    <router-progress/>
    <router-view/>
  </div>
</template>

```


  [1]: ./img/p1.gif "p1.gif"
  [2]: ./img/p2.gif "p2.gif"