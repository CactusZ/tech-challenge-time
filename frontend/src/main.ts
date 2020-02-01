import Vue from "vue";
import App from "./App.vue";
import VueRouter, { RouteConfig } from "vue-router";
import "element-ui/lib/theme-chalk/index.css";
import * as Element from "element-ui";
import * as VueCookies from "vue-cookies";
import { isLoggedIn, logOut } from "./utils/authentication";
import axios from "axios";

const Login = () => import("./components/Login.vue");
const Sessions = () => import("./components/Sessions.vue");

Vue.config.productionTip = false;
Vue.use(Element);
Vue.use(VueRouter);
Vue.use(VueCookies);

const routes: RouteConfig[] = [
    { path: "/login", component: Login },
    {
        path: "/home",
        component: Sessions,
        beforeEnter: (to, from, next) => {
            if (isLoggedIn()) {
                next();
            } else {
                next("/login");
            }
        }
    },
    { path: "*", redirect: "/home" }
];

const router = new VueRouter({
    routes
});

axios.interceptors.response.use((response) => {
    if (response.status === 401) {
        logOut();
        router.push("/login");
    }
    return response;
}, () => {
    logOut();
    router.push("/login");
});

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
