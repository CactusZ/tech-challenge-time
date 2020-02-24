<template>
    <div class="sessions-screen">
        <current-session @created="sessionCreated" />
        <div class="session-list">
            <div class="filters">
                <el-button
                    :type="selectedFilter === 'today' ? 'success' : ''"
                    @click="filterToday"
                >
                    Today
                </el-button>
                <el-button
                    :type="selectedFilter === 'week' ? 'success' : ''"
                    @click="filterWeek"
                >
                    This week
                </el-button>
                <el-button
                    :type="selectedFilter === 'month' ? 'success' : ''"
                    @click="filterMonth"
                >
                    This month
                </el-button>
            </div>
            <el-pagination
                layout="prev, pager, next"
                :total="totalCount"
                :size="pagination.pageSize"
                hide-on-single-page
                @current-change="pageChanged"
            />
            <el-table
                v-if="sessions.length"
                :data="sessions"
            >
                <el-table-column
                    prop="name"
                    label="Name"
                />
                <el-table-column
                    prop="startTime"
                    label="Start"
                >
                    <template slot-scope="scope">
                        {{ formatDate(scope.row.startTime) }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="endTime"
                    label="End"
                >
                    <template slot-scope="scope">
                        {{ formatDate(scope.row.endTime) }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="duration"
                    label="Duration"
                >
                    <template slot-scope="scope">
                        {{
                            differenceBetween(
                                scope.row.endTime,
                                scope.row.startTime
                            )
                        }}
                    </template>
                </el-table-column>
            </el-table>
            <div v-else>
                No sessions history
            </div>
        </div>
        <el-button
            class="log-out-button"
            @click="logOut"
        >
            Log out
        </el-button>
    </div>
</template>
<script lang="ts">
import * as moment from "moment";
import { Component, Vue } from "vue-property-decorator";
import { getSessionList } from "../api-requests/sessions";
import {
    ISessionFilter,
    IPagination,
    ISession
} from "../../../schemas/session";
import { logOut, isOfflineLoggedIn } from "../utils/authentication";
import { differenceBetweenMoments } from "../utils/utils";
import CurrentSession from "./CurrentSession.vue";
import { fetchLocalSessions } from "../utils/sessions";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import vueRouter from "vue-router/types/index";

@Component({
    components: {
        CurrentSession
    }
})
export default class Home extends Vue {
    sessions: IMappedSession[] = [];
    filter: ISessionFilter = {};
    pagination: IPagination = {
        page: 0,
        pageSize: 10,
        sortParam: "start",
        sortOrder: -1
    };
    totalCount = 0;
    selectedFilter = null;

    async created() {
        await this.fetchSessions();
    }
    private async fetchSessions() {
        const { elements: sessions, totalCount } = !isOfflineLoggedIn()
            ? await getSessionList(this.filter, this.pagination)
            : fetchLocalSessions(this.filter, this.pagination);
        this.mapSessions(sessions);
        this.totalCount = totalCount;
    }
    private mapSessions(sessions: ISession[]) {
        this.sessions = sessions.map(s => {
            return {
                name: s.name,
                endTime: moment.utc(s.end).valueOf(),
                startTime: moment.utc(s.start).valueOf(),
                duration: s.end - s.start
            } as IMappedSession;
        });
    }

    sessionCreated() {
        this.fetchSessions();
    }

    pageChanged(page: number) {
        this.pagination.page = page - 1;
        this.fetchSessions();
    }

    differenceBetween(end: number, start: number) {
        return differenceBetweenMoments(moment(end), moment(start));
    }

    logOut() {
        logOut();
        this.$router.push("/login");
    }

    formatDate(date: number) {
        return moment(moment.utc(date).toDate())
            .local()
            .format("YYYY/MM/DD hh:mm:ss");
    }

    resetFilter() {
        this.selectedFilter = null;
        this.filter = null;
    }

    async filterToday() {
        if (this.selectedFilter === "today") {
            this.resetFilter();
        } else {
            this.selectedFilter = "today";
            this.filter = {
                start: moment()
                    .startOf("day")
                    .utc()
                    .valueOf()
            };
        }
        this.fetchSessions();
    }

    async filterWeek() {
        if (this.selectedFilter === "week") {
            this.resetFilter();
        } else {
            this.selectedFilter = "week";
            this.filter = {
                start: moment()
                    .startOf("week")
                    .utc()
                    .valueOf()
            };
        }
        this.fetchSessions();
    }

    async filterMonth() {
        if (this.selectedFilter === "month") {
            this.resetFilter();
        } else {
            this.selectedFilter = "month";
            this.filter = {
                start: moment()
                    .startOf("month")
                    .utc()
                    .valueOf()
            };
        }
        this.fetchSessions();
    }
}

interface IMappedSession {
    startTime: number;
    endTime: number;
    duration: number;
    name: string;
}
</script>
<style lang="less">
.sessions-screen {
    width: 80%;
    min-width: 700px;
    margin: 3rem auto;
    text-align: center;

    .log-out-button {
        position: absolute;
        top: 5px;
        left: 5px;
    }

    .session-list {
        .filters {
            margin-bottom: 1rem;
        }
    }
}
</style>
