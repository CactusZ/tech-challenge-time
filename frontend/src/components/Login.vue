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
        <el-form
            v-if="showForm"
            ref="credentialsForm"
            class="form"
            :model="credentials"
            :rules="rules"
        >
            <h2>{{ isSignupAction ? "Sign Up" : "Login" }}</h2>
            <el-form-item prop="username">
                <el-input
                    v-model="credentials.username"
                    placeholder="Username"
                    @input="validateForm()"
                />
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    v-model="credentials.password"
                    placeholder="Password"
                    show-password
                    @input="validateForm()"
                />
            </el-form-item>
            <el-button
                :disabled="!isValid"
                @click="makeRequest()"
            >
                Submit
            </el-button>
        </el-form>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { loginRequest } from "../api-requests/auth";
import { IUserCredentials } from "../../../schemas/user";
import { offlineLogIn } from "../utils/authentication";
/* eslint-disable @typescript-eslint/no-unused-vars */
import VueRouter from "vue-router";
import { Notification, Form } from "element-ui";
/* eslint-enable @typescript-eslint/no-unused-vars */
import {MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH} from "../../../settings/userCredentials";
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
    rules = {
        username: [
            {
                required: true,
                message: "Please input username",
                trigger: "blur",
            },
            {
                min: MIN_USERNAME_LENGTH,
                max: MAX_USERNAME_LENGTH,
                message: `Length should be ${MIN_USERNAME_LENGTH} to ${MAX_USERNAME_LENGTH}`,
                trigger: "blur",
            }
        ],
        password: [{
            required: true,
            message: "Please input password",
            trigger: "blur",
        },
        {
            min: MIN_PASSWORD_LENGTH,
            message: `Length should be at least ${MIN_USERNAME_LENGTH}`,
            trigger: "blur",
        }]
    };
    isValid = false;
    openLoginForm() {
        this.showForm = true;
        this.isSignupAction = false;
    }

    openSignUpForm() {
        this.showForm = true;
        this.isSignupAction = true;
    }
    
    async validateForm() {
        const form = this.$refs["credentialsForm"] as Form;
        let result: boolean;
        try {
            result = await form.validate();
        } catch (e) {
            result = false;
        }
        this.isValid = result;
    }

    async makeRequest() {
        try {
            const {
                result: requestSuccessful,
                description: errorDescription
            } = await loginRequest(this.credentials, this.isSignupAction);
            if (requestSuccessful) {
                this.$router.push("/home");
            } else {
                this.$notify({
                    title: "Error",
                    message: errorDescription || "Unknown error"
                });
            }
        } catch (e) {
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
