<template>
    <div class="login-container">
        <div class="login-left">
            <div class="welcome-text">
                <h1>欢迎使用</h1>
                <p>海风学社管理系统</p>
            </div>
        </div>
        <div class="login-right">
            <div class="login-form">
                <h2>用户登录</h2>
                <tiny-form
                    ref="loginFormRef"
                    :model="loginForm"
                    :rules="rules"
                    :validate-on-rule-change="false"
                    label-position="top"
                    @submit.prevent="handleLogin"
                >
                    <tiny-form-item prop="username" label="用户名">
                        <tiny-input 
                            v-model="loginForm.username" 
                            placeholder="请输入用户名(学号)"
                            :validate-event="true"
                        >
                            <template #prefix>
                                <UserIcon />
                            </template>
                        </tiny-input>
                    </tiny-form-item>
                    <tiny-form-item prop="password" label="密码">
                        <tiny-input 
                            v-model="loginForm.password" 
                            type="password" 
                            placeholder="请输入密码"
                            show-password
                            :validate-event="true"
                        >
                            <template #prefix>
                                <LockIcon />
                            </template>
                        </tiny-input>
                    </tiny-form-item>
                    <div class="remember-row">
                        <tiny-checkbox v-model="loginForm.remember">记住密码</tiny-checkbox>
                    </div>
                    <tiny-form-item>
                        <tiny-button type="primary" class="login-button" native-type="submit">
                            登录
                        </tiny-button>
                    </tiny-form-item>
                    <div class="privacy-link">
                        登录即表示同意
                        <router-link to="/privacy">《用户隐私协议》</router-link>
                    </div>
                </tiny-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { 
    Input as TinyInput,
    Button as TinyButton,
    Checkbox as TinyCheckbox,
    Form as TinyForm,
    FormItem as TinyFormItem,
    Modal
} from '@opentiny/vue'
import { IconUser, IconLock } from '@opentiny/vue-icon'

const UserIcon = IconUser()
const LockIcon = IconLock()

const loginFormRef = ref()

const loginForm = reactive({
    username: '',
    password: '',
    remember: false
})

const validateUsername = (rule: any, value: string, callback: Function) => {
    if (!value) {
        callback(new Error('请输入学号'))
    } else if (value.length < 3 || value.length > 20) {
        callback(new Error('用户名长度应在3-20个字符之间'))
    } else {
        callback()
    }
}

const validatePassword = (rule: any, value: string, callback: Function) => {
    if (!value) {
        callback(new Error('请输入密码'))
    } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码长度应在6-20个字符之间'))
    } else {
        callback()
    }
}

const rules = {
    username: [
        { validator: validateUsername, trigger: 'blur' }
    ],
    password: [
        { validator: validatePassword, trigger: 'blur' }
    ]
}

const handleLogin = async () => {
    try {
        const valid = await loginFormRef.value.validate()
        if (valid) {
            // TODO: 实现登录逻辑
            console.log('登录表单', loginForm)
            Modal.message({ message: '登录成功', status: 'success' })
        }
    } catch (error) {
        console.error('表单验证失败', error)
        Modal.message({ message: '请检查表单填写是否正确', status: 'error' })
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    height: 100vh;
    background-color: #f5f5f5;
}

.login-left {
    flex: 1;
    background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: slideInLeft 1s ease-out;
}

.login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: slideInRight 1s ease-out;
}

.welcome-text {
    color: white;
    text-align: center;
}

.welcome-text h1 {
    font-size: 48px;
    margin-bottom: 20px;
}

.welcome-text p {
    font-size: 24px;
}

.login-form {
    width: 400px;
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.login-form h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    width: 100%;
}

.remember-row {
    margin-bottom: 20px;
    width: 100%;
}

.login-button {
    width: 100%;
}

.privacy-link {
    text-align: center;
    margin-top: 20px;
    color: #666;
    font-size: 14px;
    width: 100%;
}

.privacy-link a {
    color: #1890ff;
    text-decoration: none;
}

@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.form-item {
    width: 100%;
    margin-bottom: 20px;
}

.form-item:last-child {
    margin-bottom: 0;
}

/* 添加表单验证样式 */
.form-item.error input {
    border-color: #f56c6c;
}

.form-item .error-message {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 4px;
}

/* 确保输入框占满容器 */
:deep(.tiny-input) {
    width: 100%;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
    .login-container {
        flex-direction: column;
    }

    .login-left {
        display: none;
    }

    .login-right {
        flex: 1;
        padding: 20px;
    }

    .login-form {
        width: 100%;
        max-width: 400px;
        padding: 20px;
    }

    .welcome-text h1 {
        font-size: 32px;
    }

    .welcome-text p {
        font-size: 18px;
    }
}

/* 小屏幕手机适配 */
@media screen and (max-width: 375px) {
    .login-form {
        padding: 15px;
    }

    .login-form h2 {
        font-size: 20px;
        margin-bottom: 20px;
    }

    :deep(.tiny-input) {
        font-size: 14px;
    }

    .privacy-link {
        font-size: 12px;
    }
}
</style>