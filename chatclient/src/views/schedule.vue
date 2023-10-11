<template>
    <div class="schedule">
        <full-calendar
            :events="events"
            class="calendar"
            locale="zg-cn"
            @changeMonth="changeMonth"
            @eventClick="eventClick"
            @dayClick="dayClick"
            @moreClick="moreClick"
        >
            <template slot="fc-header-left">
                <div>
                    <p>日程管理</p>
                </div>
            </template>
        </full-calendar>
        <!-- 添加代办事项 -->
        <el-dialog title="添加代办事项" :visible.sync="dialogFormVisible">
            <el-form :model="eventForm" :rules="rules" ref="eventForm" label-width="100px">
                <el-form-item label="事项名称" prop="title">
                    <el-input v-model="eventForm.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="start">
                    <el-col>
                        <el-form-item>
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="eventForm.start"
                                style="width: 100%"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="结束时间" prop="end">
                    <el-col>
                        <el-form-item>
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="eventForm.end"
                                :picker-options="endOptions"
                                style="width: 100%"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="事项级别" class="matter-level">
                    <el-tag
                        class="item"
                        v-for="item in matterLevels"
                        :key="item.label"
                        :type="item.type"
                        :effect="eventForm.cssClass === item.type ? 'dark' : 'plain'"
                        @click="handleClick(item.type)"
                    >
                        {{ item.label }}
                    </el-tag>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddEvent">取 消</el-button>
                <el-button type="primary" @click="AddEvent">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    // import { formatTime } from '@/utils';
    import { FullCalendar } from 'vue-fullcalendar';
    import api from '../api/index';
    import { Message } from 'element-ui';

    export default {
        name: 'schedule',
        data() {
            return {
                events: [],
                eventForm: {
                    title: '',
                    start: '',
                    end: '',
                    cssClass: 'normal',
                    account: ''
                },
                dialogFormVisible: false,
                rules: {
                    title: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                    ],
                    start: [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ]
                },
                matterLevels: [
                    { type: 'danger', label: '紧急事项' },
                    { type: 'warning', label: '重要事项' },
                    { type: 'normal', label: '一般事项' },
                    { type: 'info', label: '不重要事项' }
                ]
            };
        },
        computed: {
            endOptions() {
                const that = this;
                return {
                    disabledDate(time) {
                        return time.getTime() < new Date(that.eventForm.start).getTime();
                    }
                };
            }
        },
        components: {
            'full-calendar': require('vue-fullcalendar')
        },
        created() {
            this.getEvent();
        },
        methods: {
            getEvent() {
                const account = JSON.parse(window.localStorage.getItem('userInfo')).name;
                console.log('account', account);
                const params = {
                    account: account
                };
                api.schedule.getEvent(params).then((res) => {
                    // console.log(res);
                    const events = res.data;
                    this.events = events;
                    console.log(this.events);
                    console.log('getEvent success');
                });
            },
            AddEvent() {
                this.$refs.eventForm.validate((valid) => {
                    if (valid) {
                        const account = JSON.parse(window.localStorage.getItem('userInfo')).name;
                        this.eventForm.account = account;

                        // console.log(account);
                        if (this.eventForm.end == '') {
                            this.eventForm.end = this.eventForm.start;
                        }

                        // 不知道后端怎么回事 估计时区问题 老减8小时 这里直接加8小时暴力抵消
                        const startDate = new Date(this.eventForm.start);
                        const endDate = new Date(this.eventForm.end);
                        // 获取时间戳
                        const startTimestamp = startDate.getTime();
                        const endTimestamp = endDate.getTime();
                        // 计算新的时间戳 加8小时的毫秒数
                        const newStartTimestamp = startTimestamp + 8 * 60 * 60 * 1000;
                        const newEndTimestamp = endTimestamp + 8 * 60 * 60 * 1000;
                        // 创建新的日期对象
                        this.eventForm.start = new Date(newStartTimestamp);
                        this.eventForm.end = new Date(newEndTimestamp);

                        console.log('eventForm', this.eventForm);
                        api.schedule.addEvent(this.eventForm).then((res) => {
                            console.log('res', res);
                            if (res.status == 200) {
                                Message({
                                    message: '日程添加成功',
                                    type: 'success'
                                });
                                this.getEvent();
                            }
                        });

                        this.eventForm.title = '';
                        this.eventForm.start = '';
                        this.eventForm.end = '';
                        this.eventForm.cssClass = 'normal';
                        this.eventForm.account = '';

                        this.dialogFormVisible = false;
                    } else {
                        console.log('表单校验失败');
                    }
                });
            },
            // 取消添加日程
            cancelAddEvent() {
                this.dialogFormVisible = false;
                this.eventForm.title = '';
                this.eventForm.start = '';
                this.eventForm.end = '';
                this.eventForm.cssClass = 'normal';
                this.eventForm.account = '';
            },

            // 选择月份
            changeMonth(start, end, current) {
                // console.log('changeMonth', start.format(), end.format(), current.format());
            },
            // 点击事件
            eventClick(event, jsEvent, pos) {
                console.log('eventClick', event, jsEvent, pos);
            },
            // 点击当天
            dayClick(day, jsEvent) {
                this.eventForm.start = day;
                this.dialogFormVisible = true;
                console.log('dayClick', day, jsEvent);
            },
            // 查看更多
            moreClick(day, events, jsEvent) {
                console.log('moreCLick', day, events, jsEvent);
            },
            // 标签
            handleClick(type) {
                this.eventForm.cssClass = type;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .schedule {
        width: 100%;
        height: 100vh;
        .calendar {
            width: 100%;
        }
        /deep/ .danger {
            background-color: #f56c6c !important;
            color: #ffffff !important;
        }
        /deep/ .warning {
            background-color: #e6a23c !important;
            color: #ffffff !important;
        }
        /deep/ .normal {
            background-color: #409eff !important;
            color: #ffffff !important;
        }
        /deep/ .info {
            background-color: #909399;
            color: #ffffff !important;
        }
        .comp-full-calendar {
            max-width: 100%;
            height: 100%;
            /deep/ .full-calendar-header {
                height: 4%;
            }
            /deep/ .full-calendar-header {
                .header-left {
                    p {
                        font-size: 20px;
                        font-weight: 600;
                    }
                }
            }

            /deep/ .full-calendar-body {
                height: 95%;
                .dates {
                    height: 95%;
                    .dates-bg {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        .week-row {
                            flex: 1;
                        }
                    }
                }
            }
        }

        /* /deep/ .full-calendar-body .dates .dates-events .events-week .events-day {
            min-height: 120px;
        } */
        /deep/ .el-dialog {
            display: flex;
            flex-direction: column;
            .el-dialog__footer {
                text-align: center;
                padding: 0 0 30px 0;
            }
        }
        .matter-level {
            float: left;
            .item {
                margin-right: 20px;
            }
        }
    }
</style>
