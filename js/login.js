/**
 * 登录页面脚本
 * 功能：表单验证、密码显示/隐藏、登录按钮状态控制
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM元素引用 - 使用见名知意的变量名
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const usernameErrorMsg = document.getElementById('usernameErrorMessage');
    const passwordErrorMsg = document.getElementById('passwordErrorMessage');
    const loginBtn = document.getElementById('loginBtn');
    const passwordToggleBtn = document.getElementById('passwordToggleBtn');
    
    let isPasswordVisible = false;

    /**
     * 验证邮箱格式
     * @param {string} email - 邮箱地址
     * @returns {boolean} 是否有效
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * 验证手机号格式（中国手机号）
     * @param {string} phone - 手机号
     * @returns {boolean} 是否有效
     */
    function isValidPhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }

    /**
     * 验证账号（邮箱或手机号）
     * @param {string} username - 用户输入的账号
     * @returns {string} 错误信息，空字符串表示验证通过
     */
    function validateUsername(username) {
        const trimmedUsername = username.trim();
        
        if (!trimmedUsername) {
            return '账号不能为空';
        }
        
        if (!isValidEmail(trimmedUsername) && !isValidPhone(trimmedUsername)) {
            return '请输入有效的邮箱或手机号';
        }
        
        return '';
    }

    /**
     * 验证密码强度
     * @param {string} password - 用户输入的密码
     * @returns {string} 错误信息，空字符串表示验证通过
     */
    function validatePassword(password) {
        if (!password) {
            return '密码不能为空';
        }
        
        // 长度检查
        if (password.length < 8 || password.length > 20) {
            return '密码长度应为8-20位';
        }
        
        // 字符类型检查
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        // 计算字符类型数量
        const typesCount = [hasLetter, hasNumber, hasSpecialChar].filter(Boolean).length;
        
        if (typesCount < 2) {
            return '密码应包含字母、数字、特殊字符中的至少两种';
        }
        
        return '';
    }

    /**
     * 显示输入错误状态
     * @param {HTMLElement} inputElement - 输入框元素
     * @param {HTMLElement} errorElement - 错误信息元素
     * @param {string} message - 错误信息
     */
    function showInputError(inputElement, errorElement, message) {
        inputElement.classList.remove('success');
        inputElement.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        updateLoginButtonState();
    }

    /**
     * 显示输入成功状态
     * @param {HTMLElement} inputElement - 输入框元素
     * @param {HTMLElement} errorElement - 错误信息元素
     */
    function showInputSuccess(inputElement, errorElement) {
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
        errorElement.classList.remove('show');
        updateLoginButtonState();
    }

    /**
     * 更新密码切换按钮显示状态
     * 注意：仅在密码框有内容时显示眼睛图标
     */
    function updatePasswordToggleState() {
        const hasPassword = passwordInput.value.length > 0;
        
        if (hasPassword) {
            passwordToggleBtn.classList.add('has-content');
            // 确保初始状态显示闭眼（密码隐藏）
            if (!isPasswordVisible) {
                passwordToggleBtn.classList.remove('visible');
            }
        } else {
            // 没有密码内容时重置所有状态
            passwordToggleBtn.classList.remove('has-content', 'visible');
            isPasswordVisible = false;
            passwordInput.type = 'password';
        }
    }

    /**
     * 更新登录按钮状态
     * 注意：仅在账号和密码都通过验证时启用按钮
     */
    function updateLoginButtonState() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const usernameValidationError = validateUsername(username);
        const passwordValidationError = validatePassword(password);
        
        const canLogin = username && password && !usernameValidationError && !passwordValidationError;
        
        if (canLogin) {
            loginBtn.disabled = false;
            loginBtn.classList.add('enabled');
        } else {
            loginBtn.disabled = true;
            loginBtn.classList.remove('enabled');
        }
    }

    // 实时验证账号
    usernameInput.addEventListener('input', function() {
        const validationError = validateUsername(this.value);
        
        if (validationError) {
            showInputError(this, usernameErrorMsg, validationError);
        } else {
            showInputSuccess(this, usernameErrorMsg);
        }
    });

    // 实时验证密码并更新眼睛图标
    passwordInput.addEventListener('input', function() {
        updatePasswordToggleState();
        
        const validationError = validatePassword(this.value);
        
        if (validationError) {
            showInputError(this, passwordErrorMsg, validationError);
        } else {
            showInputSuccess(this, passwordErrorMsg);
        }
    });

    // 失去焦点时验证（空值检查）
    usernameInput.addEventListener('blur', function() {
        if (!this.value.trim()) {
            showInputError(this, usernameErrorMsg, '账号不能为空');
        }
    });

    passwordInput.addEventListener('blur', function() {
        if (!this.value) {
            showInputError(this, passwordErrorMsg, '密码不能为空');
        }
    });

    /**
     * 密码显示/隐藏切换
     * 注意：点击眼睛图标时切换密码可见性，并更新图标状态
     */
    passwordToggleBtn.addEventListener('click', function(event) {
        event.stopPropagation(); // 防止事件冒泡
        
        const hasPassword = passwordInput.value.length > 0;
        if (!hasPassword) return; // 没有密码内容时不执行切换
        
        isPasswordVisible = !isPasswordVisible;
        
        if (isPasswordVisible) {
            passwordInput.type = 'text';
            this.classList.add('visible');
            this.title = '隐藏密码';
        } else {
            passwordInput.type = 'password';
            this.classList.remove('visible');
            this.title = '显示密码';
        }
    });

    // 表单提交验证
    loginForm.addEventListener('submit', function(event) {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        const usernameValidationError = validateUsername(username);
        const passwordValidationError = validatePassword(password);
        
        let hasError = false;
        
        // 验证账号
        if (usernameValidationError) {
            showInputError(usernameInput, usernameErrorMsg, usernameValidationError);
            hasError = true;
        }
        
        // 验证密码
        if (passwordValidationError) {
            showInputError(passwordInput, passwordErrorMsg, passwordValidationError);
            hasError = true;
        }
        
        if (hasError) {
            event.preventDefault();
            return;
        }
        
        // 验证通过，执行登录逻辑
        console.log('登录信息验证通过，准备提交:', {
            username: username,
            password: password
        });
        
        // 实际项目中这里应该是AJAX请求
        // 如果使用AJAX，需要 event.preventDefault();
        // 并在此处发送登录请求
    });

    // 初始化页面状态
    updatePasswordToggleState();
    updateLoginButtonState();
});