<template>
    <div class="current-session">
        <h3>Current session</h3>
        <el-button
            :disabled="!!currentSessionStart"
            type="primary"
            @click="startSession()"
        >
            Start
        </el-button>
        <span>{{ currentSessionTimeFormatted }}</span>
        <el-button
            type="success"
            :disabled="!currentSession"
            @click="stopSession()"
        >
            Stop
        </el-button>
        <el-input
            v-model="currentSessionName"
            placeholder="Name"
        />
        <el-button
            :disabled="!!currentSession || !currentSessionStart || !currentSessionName"
            @click="saveSession()"
        >
            Save
        </el-button>
        <el-button
            v-if="!!currentSessionStart"
            @click="discardCurrentSession()"
        >
            Cancel Session
        </el-button>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as moment from "moment";
import { differenceBetweenMoments } from "../utils/utils";
import { ISessionData } from "../../../schemas/session";
import { createSession } from "../api-requests/sessions";
import { isOfflineLoggedIn } from "../utils/authentication";
import { addLocalSession, getCurrentSessionStartLocal, clearCurrentSessionStartLocal, storeCurrentSessionStartLocal } from "../utils/sessions";
@Component({
    components: {}
})
export default class CurrentSession extends Vue {

    created() {
        const alreadyCreatedStart = getCurrentSessionStartLocal();
        if (alreadyCreatedStart) {
            this.currentSessionStart = alreadyCreatedStart;
            this.currentSessionEnd = Date.now();
            this.startCurrentSessionTimer();
        }
    }

    get currentSessionTimeFormatted() {
        const start = moment(this.currentSessionStart);
        const end = moment(this.currentSessionEnd);
        return differenceBetweenMoments(end, start);
    }

    discardCurrentSession() {
        this.currentSessionStart = 0;
        this.currentSessionEnd = 0;
        this.currentSessionName = "";
        if (this.currentSession) {
            window.clearInterval(this.currentSession);
            this.currentSession = 0;
            clearCurrentSessionStartLocal();
        }
    }

    stopSession() {
        this.currentSessionEnd = moment.utc().valueOf();
        window.clearInterval(this.currentSession);
        this.currentSession = 0;
        clearCurrentSessionStartLocal();
    }

    destroyed() {
        this.stopSession();
    }

    startSession() {
        this.currentSessionStart = moment.utc().valueOf();
        this.currentSessionEnd = moment.utc().valueOf();
        this.startCurrentSessionTimer();
        storeCurrentSessionStartLocal(this.currentSessionStart);
    }

    private startCurrentSessionTimer() {
        this.currentSession=window.setInterval(() => {
            this.currentSessionEnd=moment.utc().valueOf();
        },1000);
    }

    async saveSession() {
        const session: ISessionData = {
            name: this.currentSessionName,
            start: this.currentSessionStart,
            end: this.currentSessionEnd
        };
        try {
            const wasCreated = !isOfflineLoggedIn() ? await createSession(session) : addLocalSession(session);

            if (wasCreated) {
                this.discardCurrentSession();
                this.$emit("created", session);                
            } else {
                this.$notify({
                    title: "Error",
                    message: "Session was not added!"
                });
            }
        } catch (e) {
            this.$notify({
                title: "Error",
                message: "Unknown error"
            });
        }
    }

    currentSessionStart = 0;
    currentSessionEnd = 0;
    currentSession = 0;
    currentSessionName = "";
}


</script>
<style lang="less" scoped>
.current-session {
    margin: 10px auto;
    padding: 20px;
    width: 400px;
    border: solid gray 1px;
    > div.el-input {
        margin: 1rem 0;
    }
}
</style>
