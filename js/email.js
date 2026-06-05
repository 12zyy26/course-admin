// 初始化变量
let isEditing = false;
let originalData = {};
let currentSignature = null;

// DOM元素
const editBtn = document.getElementById('edit-btn');
const saveCancelButtons = document.getElementById('save-cancel-buttons');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const form = document.getElementById('email-form');
const inputs = document.querySelectorAll('.input-field, .text-field');
const signatureUploadArea = document.getElementById('signature-upload-area');
const signatureFileInput = document.getElementById('signature-file');
const uploadContent = document.getElementById('upload-content');
const previewContent = document.getElementById('preview-content');
const mailContent = document.getElementById('mail-content');
const charCounter = document.getElementById('char-counter');

// 密码切换功能
const passwordToggle = document.getElementById('password-toggle');
const passwordInput = document.getElementById('password');
const attachPasswordToggle = document.getElementById('attach-password-toggle');
const attachPasswordInput = document.getElementById('attach-password');

// 错误提示元素
const errorElements = {
    'mail-address': document.getElementById('mail-address-error'),
    'username': document.getElementById('username-error'),
    'password': document.getElementById('password-error'),
    'mail-title': document.getElementById('mail-title-error'),
    'mail-content': document.getElementById('mail-content-error'),
    'attach-folder': document.getElementById('attach-folder-error'),
    'signature': document.getElementById('signature-error')
};

// 保存原始数据
function saveOriginalData() {
    originalData = {};
    inputs.forEach(input => {
        if (input.id) {
            originalData[input.id] = input.value;
        }
    });
    originalData.signature = currentSignature;
}

// 恢复原始数据
function restoreOriginalData() {
    inputs.forEach(input => {
        if (input.id && originalData[input.id] !== undefined) {
            input.value = originalData[input.id];
        }
    });
    
    // 恢复签名
    if (originalData.signature) {
        currentSignature = originalData.signature;
        previewContent.style.backgroundImage = `url(${currentSignature})`;
        previewContent.style.display = 'flex';
        uploadContent.style.display = 'none';
        signatureUploadArea.classList.add('has-image');
    } else {
        currentSignature = null;
        previewContent.style.display = 'none';
        uploadContent.style.display = 'flex';
        signatureUploadArea.classList.remove('has-image');
    }
    
    // 更新字符计数器
    updateCharCounter();
    
    // 清除所有错误状态
    clearAllErrors();
}

// 切换编辑模式
function toggleEditMode() {
    isEditing = !isEditing;
    
    if (isEditing) {
        // 进入编辑模式
        editBtn.style.display = 'none';
        saveCancelButtons.style.display = 'flex';
        
        // 保存原始数据
        saveOriginalData();
        
        // 启用所有输入框
        inputs.forEach(input => {
            input.readOnly = false;
            input.classList.remove('success');
        });
        
        // 启用文件上传
        signatureUploadArea.style.cursor = 'pointer';
        
        // 初始化密码切换按钮
        initPasswordToggle();
    } else {
        // 退出编辑模式
        editBtn.style.display = 'block';
        saveCancelButtons.style.display = 'none';
        
        // 禁用所有输入框
        inputs.forEach(input => {
            input.readOnly = true;
        });
        
        // 禁用文件上传
        signatureUploadArea.style.cursor = 'default';
        
        // 清除所有错误状态
        clearAllErrors();
    }
}

// 初始化密码切换功能
function initPasswordToggle() {
    // 主密码切换
    if (passwordInput.value) {
        passwordToggle.classList.add('has-content');
    }
    
    passwordInput.addEventListener('input', function() {
        if (this.value) {
            passwordToggle.classList.add('has-content');
        } else {
            passwordToggle.classList.remove('has-content');
        }
    });
    
    passwordToggle.addEventListener('click', function() {
        const isVisible = passwordInput.type === 'text';
        passwordInput.type = isVisible ? 'password' : 'text';
        this.classList.toggle('visible', !isVisible);
    });
    
    // 附件密码切换
    if (attachPasswordInput.value) {
        attachPasswordToggle.classList.add('has-content');
    }
    
    attachPasswordInput.addEventListener('input', function() {
        if (this.value) {
            attachPasswordToggle.classList.add('has-content');
        } else {
            attachPasswordToggle.classList.remove('has-content');
        }
    });
    
    attachPasswordToggle.addEventListener('click', function() {
        const isVisible = attachPasswordInput.type === 'text';
        attachPasswordInput.type = isVisible ? 'password' : 'text';
        this.classList.toggle('visible', !isVisible);
    });
}

// 字符计数器更新
function updateCharCounter() {
    const length = mailContent.value.length;
    const maxLength = mailContent.maxLength;
    charCounter.textContent = `${length}/${maxLength}`;
    
    if (length >= maxLength * 0.9) {
        charCounter.classList.add('warning');
        charCounter.classList.remove('error');
    } else if (length >= maxLength) {
        charCounter.classList.remove('warning');
        charCounter.classList.add('error');
    } else {
        charCounter.classList.remove('warning', 'error');
    }
}

// 显示错误信息
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = errorElements[fieldId];
    
    if (input && errorElement) {
        input.classList.remove('success');
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// 显示成功状态
function showSuccess(fieldId) {
    const input = document.getElementById(fieldId);
    const errorElement = errorElements[fieldId];
    
    if (input && errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.classList.remove('show');
    }
}

// 清除所有错误状态
function clearAllErrors() {
    Object.keys(errorElements).forEach(fieldId => {
        const input = document.getElementById(fieldId);
        const errorElement = errorElements[fieldId];
        
        if (input && errorElement) {
            input.classList.remove('error', 'success');
            errorElement.classList.remove('show');
        }
    });
}

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 验证手机号格式
function isValidPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// 验证用户名（邮箱或手机号）
function isValidUsername(username) {
    return isValidEmail(username) || isValidPhone(username);
}

// 验证密码强度
function isValidPassword(password) {
    // 长度检查
    if (password.length < 8 || password.length > 20) {
        return false;
    }
    
    // 字符类型检查
    let hasLetter = /[a-zA-Z]/.test(password);
    let hasDigit = /\d/.test(password);
    let hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // 至少两种字符类型
    const typesCount = [hasLetter, hasDigit, hasSpecial].filter(Boolean).length;
    return typesCount >= 2;
}

// 验证文件夹格式
function isValidFolderPath(path) {
    const folderRegex = /^(\/[a-zA-Z0-9_-]+)+$/;
    return folderRegex.test(path);
}

// 表单验证
function validateForm() {
    let isValid = true;
    
    // 验证邮件发送地址
    const mailAddress = document.getElementById('mail-address').value.trim();
    if (!mailAddress) {
        showError('mail-address', '邮件发送地址不能为空');
        isValid = false;
    } else if (!isValidEmail(mailAddress)) {
        showError('mail-address', '请输入有效的邮箱地址');
        isValid = false;
    } else {
        showSuccess('mail-address');
    }
    
    // 验证用户名
    const username = document.getElementById('username').value.trim();
    if (!username) {
        showError('username', '用户名不能为空');
        isValid = false;
    } else if (!isValidUsername(username)) {
        showError('username', '请输入有效的邮箱或手机号');
        isValid = false;
    } else {
        showSuccess('username');
    }
    
    // 验证密码
    const password = document.getElementById('password').value;
    if (!password) {
        showError('password', '密码不能为空');
        isValid = false;
    } else if (!isValidPassword(password)) {
        showError('password', '密码必须为8-20位，且包含字母、数字、特殊字符至少两种');
        isValid = false;
    } else {
        showSuccess('password');
    }
    
    // 验证邮件标题格式
    const mailTitle = document.getElementById('mail-title').value.trim();
    if (!mailTitle) {
        showError('mail-title', '邮件标题格式不能为空');
        isValid = false;
    } else {
        showSuccess('mail-title');
    }
    
    // 验证邮件内容
    const mailContentValue = mailContent.value.trim();
    if (!mailContentValue) {
        showError('mail-content', '邮件内容不能为空');
        isValid = false;
    } else if (mailContentValue.length > 255) {
        showError('mail-content', '邮件内容不能超过255个字符');
        isValid = false;
    } else {
        showSuccess('mail-content');
    }
    
    // 验证附件归档文件夹
    const attachFolder = document.getElementById('attach-folder').value.trim();
    if (!attachFolder) {
        showError('attach-folder', '附件归档文件夹不能为空');
        isValid = false;
    } else if (!isValidFolderPath(attachFolder)) {
        showError('attach-folder', '请输入有效的文件夹路径（如：/file/pdf）');
        isValid = false;
    } else {
        showSuccess('attach-folder');
    }
    
    // 验证附件电子签名
    if (!currentSignature) {
        showError('signature', '请上传附件电子签名');
        isValid = false;
    } else {
        showSuccess('signature');
    }
    
    return isValid;
}

// 文件上传处理
function handleFileUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentSignature = e.target.result;
        previewContent.style.backgroundImage = `url(${currentSignature})`;
        previewContent.style.display = 'flex';
        uploadContent.style.display = 'none';
        signatureUploadArea.classList.add('has-image');
        
        // 清除签名错误
        showSuccess('signature');
    };
    reader.readAsDataURL(file);
}

// 事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 保存原始数据
    saveOriginalData();
    
    // 编辑按钮点击事件
    editBtn.addEventListener('click', toggleEditMode);
    
    // 取消按钮点击事件
    cancelBtn.addEventListener('click', function() {
        restoreOriginalData();
        toggleEditMode();
    });
    
    // 保存按钮点击事件
    saveBtn.addEventListener('click', function() {
        if (validateForm()) {
            // 这里可以添加保存数据的逻辑，比如发送到服务器
            alert('保存成功！');
            saveOriginalData(); // 保存新的数据作为原始数据
            toggleEditMode();
        }
    });
    
    // 邮件内容输入事件
    mailContent.addEventListener('input', updateCharCounter);
    
    // 签名上传区域点击事件
    signatureUploadArea.addEventListener('click', function() {
        if (isEditing) {
            signatureFileInput.click();
        }
    });
    
    // 文件选择变化事件
    signatureFileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            handleFileUpload(this.files[0]);
        }
    });
    
    // 初始化字符计数器
    updateCharCounter();
    
    // 实时验证（可选）
    if (isEditing) {
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                // 这里可以添加实时验证逻辑
            });
        });
    }
});