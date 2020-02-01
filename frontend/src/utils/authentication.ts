import Vue from "vue";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import VueCookies from "vue-cookies";
import { clearLocalSessions } from "./sessions";

export function isOfflineLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

export function isLoggedIn() {
    return (
        Vue.$cookies.isKey("auth-token") ||
        isOfflineLoggedIn()
    );
}

export function logOut() {
    Vue.$cookies.remove("auth-token");
    localStorage.removeItem("isLoggedIn");
    clearLocalSessions();
}

export function offlineLogIn() {
    localStorage.setItem("isLoggedIn", "true");
}