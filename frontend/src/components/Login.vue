<template>
    <div class="login">
        <div class="header">
            <h1>Welcome to test task app!</h1>
        </div>
        <div class="buttons">
            <el-button
                type="primary"
                @click="openLoginForm()"
            >
                Login
            </el-button>
            <el-button @click="openSignUpForm()">
                Sign Up
            </el-button>
            <el-button
                type="danger"
                @click="offline()"
            >
                Offline usage
            </el-button>
        </div>
        <div
            v-if="showForm"
            class="form"
        >
            <h2>{{ isSignupAction ? "Sign Up" : "Login" }}</h2>
            <el-input
                v-model="credentials.username"
                placeholder="Username"
            />
            <el-input
                v-model="credentials.password"
                placeholder="Password"
                show-password
            />
            <el-button @click="makeRequest()">
                Submit
            </el-button>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { loginRequest } from "../api-requests/auth";
import { IUserCredentials } from "../../../schemas/user";
import { offlineLogIn } from "../utils/authentication";
/* eslint-disable @typescript-eslint/no-unused-vars */
import VueRouter from "vue-router";
import { Notification } from "element-ui";
/* eslint-enable @typescript-eslint/no-unused-vars */
@Component({
    components: {}
})
export default class Login extends Vue {
    showForm = false;
    isSignupAction = false;
    credentials: IUserCredentials = {
        username: "",
        password: ""
    };
    openLoginForm() {
        this.showForm = true;
        this.isSignupAction = false;
    }
    openSignUpForm() {
        this.showForm = true;
        this.isSignupAction = true;
    }
    async makeRequest() {
        try {
            const {result: requestSuccessful, description: errorDescription } = await loginRequest(this.credentials, this.isSignupAction);
            if (requestSuccessful) {
                this.$router.push("/home");
            } else {
                this.$notify({
                    title: "Error",
                    message: errorDescription || "Unknown error"
                });
            }
        } catch(e) {
            this.$notify({
                title: "Error",
                message: "Unknown error"
            });
        }
    }
    offline() {
        offlineLogIn();
        this.$router.push("/home");
    }
}
</script>
<style lang="less">
.login {
    text-align: center;

    .header {
        margin-top: 5rem;
        font-size: 1.5rem;
    }
    .form {
        > div:not(:last-child) {
            margin-bottom: 1rem;
        }
        width: 400px;
        margin: 3rem auto;
    }
}
</style>
