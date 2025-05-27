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
                    <tiny-form-item prop="userName" label="用户名">
                        <tiny-input 
                            v-model="loginForm.userName" 
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
                    <tiny-form-item prop="code" label="验证码">
                        <div class="captcha-container">
                            <tiny-input 
                                v-model="loginForm.code" 
                                placeholder="请输入验证码"
                                :validate-event="true"
                            >
                                <template #prefix>
                                    <KeyIcon />
                                </template>
                            </tiny-input>
                            <img 
                                :src="captchaUrl" 
                                alt="验证码" 
                                class="captcha-img"
                                @click="refreshCaptcha"
                            />
                        </div>
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
import { ref, reactive, onMounted } from 'vue'
import { 
    Input as TinyInput,
    Button as TinyButton,
    Checkbox as TinyCheckbox,
    Form as TinyForm,
    FormItem as TinyFormItem,
    Modal
} from '@opentiny/vue'
import { IconUser, IconLock, IconUnlock } from '@opentiny/vue-icon'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { login } from '@/api/user'
import { getCaptcha } from '@/api/common'
const UserIcon = IconUser()
const LockIcon = IconLock()
const KeyIcon = IconUnlock()

const loginFormRef = ref()
const captchaUrl = ref('')
const userStore = useUserStore()
const router = useRouter()

const loginForm = reactive({
    userName: '',
    password: '',
    remember: false,
    code: '',
    uuid: ''
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

const validateCaptcha = (rule: any, value: string, callback: Function) => {
    if (!value) {
        callback(new Error('请输入验证码'))
    } else {
        callback()
    }
}

const rules = {
    userName: [
        { validator: validateUsername, trigger: 'blur' }
    ],
    password: [
        { validator: validatePassword, trigger: 'blur' }
    ],
    code: [
        { validator: validateCaptcha, trigger: 'blur' }
    ]
}

const refreshCaptcha = async () => {
    const res = await getCaptcha()
    loginForm.uuid = res.data.uuid
    captchaUrl.value = `data:image/jpeg;base64,${res.data.img}`
}

onMounted(() => {
    refreshCaptcha()
})

const handleLogin = async () => {
    try {
        const valid = await loginFormRef.value.validate()
        if (valid) {
            const res = await login({
                userName: loginForm.userName,
                password: loginForm.password,
                code: loginForm.code,
                uuid: loginForm.uuid
            }) 
            
            userStore.setToken(res.data.token)
            Modal.message({ message: '登录成功', status: 'success' })
            router.push('/admin/dashboard')
        }
    } catch (error: any) {
        console.error('登录失败', error)
        refreshCaptcha()
        loginForm.code = ''
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

/* 添加验证码相关样式 */
.captcha-container {
    display: flex;
    gap: 10px;
    align-items: center;
}

.captcha-img {
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.3s;
}

.captcha-img:hover {
    opacity: 0.8;
}

/* 确保验证码输入框和图片在同一行 */
:deep(.tiny-form-item) {
    width: 100%;
}

:deep(.tiny-input) {
    flex: 1;
}
</style>