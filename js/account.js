// 账户数据
const accountData = [
    {
        id: 1,
        name: '苏强',
        role: '老师',
        phone: '13851746205',
        email: '605213740@qq.com',
        password: '********',
        remark: ''
    },
    {
        id: 2,
        name: '盛翔',
        role: '老师',
        phone: '13951865445',
        email: 'rsheng81@163.com',
        password: '********',
        remark: ''
    },
    {
        id: 3,
        name: '王秀芸',
        role: '老师',
        phone: '',
        email: '40456393@qq.com',
        password: '********',
        remark: ''
    },
    {
        id: 4,
        name: '徐新宇',
        role: '老师',
        phone: '',
        email: 'morse-xu@hotmail.com',
        password: '********',
        remark: ''
    },
    {
        id: 5,
        name: '李老师',
        role: '老师',
        phone: '1399651815',
        email: 'xiaozhi9527cy@outlook.com',
        password: '********',
        remark: ''
    },
    {
        id: 6,
        name: 'jiahao',
        role: '老师',
        phone: '19936640357',
        email: '3183718649@qq.com',
        password: '********',
        remark: ''
    },
    {
        id: 7,
        name: '张老师',
        role: '管理员',
        phone: '13800138000',
        email: 'admin@hes.com',
        password: '********',
        remark: '系统管理员'
    },
    {
        id: 8,
        name: '刘老师',
        role: '老师',
        phone: '13912345678',
        email: 'liu@hes.com',
        password: '********',
        remark: '数学老师'
    },
    {
        id: 9,
        name: '陈老师',
        role: '老师',
        phone: '13787654321',
        email: 'chen@hes.com',
        password: '********',
        remark: '英语老师'
    },
    {
        id: 10,
        name: '王老师',
        role: '老师',
        phone: '13611223344',
        email: 'wang@hes.com',
        password: '********',
        remark: '物理老师'
    },
    {
        id: 11,
        name: '赵老师',
        role: '老师',
        phone: '13555667788',
        email: 'zhao@hes.com',
        password: '********',
        remark: '化学老师'
    },
    {
        id: 12,
        name: '孙老师',
        role: '老师',
        phone: '13444555666',
        email: 'sun@hes.com',
        password: '********',
        remark: '生物老师'
    },
    {
        id: 13,
        name: '周老师',
        role: '老师',
        phone: '13333444555',
        email: 'zhou@hes.com',
        password: '********',
        remark: '历史老师'
    },
    {
        id: 14,
        name: '吴老师',
        role: '老师',
        phone: '13222333444',
        email: 'wu@hes.com',
        password: '********',
        remark: '地理老师'
    },
    {
        id: 15,
        name: '郑老师',
        role: '老师',
        phone: '13111222333',
        email: 'zheng@hes.com',
        password: '********',
        remark: '政治老师'
    },
    {
        id: 16,
        name: '钱老师',
        role: '老师',
        phone: '13000111222',
        email: 'qian@hes.com',
        password: '********',
        remark: '音乐老师'
    }
];

// 全局变量
let currentPage = 1;
let pageSize = 6;
let totalPages = 1;
let selectedAccounts = new Set();
let currentEditId = null;
let filteredAccountData = [...accountData];
let deleteAccountId = null;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderAccountTable();
    updatePagination();
    updateNoDataTip();
});

// 初始化事件监听器
function initEventListeners() {
    // 全选复选框
    document.getElementById('selectAllCheckbox').addEventListener('change', toggleSelectAll);
    
    // 新增按钮
    document.getElementById('addAccountBtn').addEventListener('click', showAddModal);
    
    // 删除选中按钮
    document.getElementById('deleteSelectedBtn').addEventListener('click', deleteSelectedAccounts);
    
    // 查询按钮
    document.getElementById('searchBtn').addEventListener('click', searchAccounts);
    
    // 分页按钮
    document.getElementById('prevPageBtn').addEventListener('click', goToPrevPage);
    document.getElementById('nextPageBtn').addEventListener('click', goToNextPage);
    
    // 页数选择
    document.getElementById('pageSizeSelect').addEventListener('change', function() {
        pageSize = parseInt(this.value);
        currentPage = 1;
        renderAccountTable();
        updatePagination();
    });
    
    // 跳转页面
    document.getElementById('pageJumpInput').addEventListener('change', function() {
        const page = parseInt(this.value);
        if (page >= 1 && page <= totalPages) {
            goToPage(page);
        }
    });
    
    // 输入框回车键搜索
    document.getElementById('searchName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchAccounts();
    });
    
    document.getElementById('searchPhone').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchAccounts();
    });
    
    document.getElementById('searchEmail').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchAccounts();
    });
    
    // 模态框关闭按钮
    document.getElementById('modalCloseBtn').addEventListener('click', hideAccountModal);
    document.getElementById('modalCancelBtn').addEventListener('click', hideAccountModal);
    document.getElementById('viewModalCloseBtn').addEventListener('click', hideViewModal);
    document.getElementById('viewModalCloseBtn2').addEventListener('click', hideViewModal);
    document.getElementById('confirmModalCloseBtn').addEventListener('click', hideConfirmModal);
    document.getElementById('confirmCancelBtn').addEventListener('click', hideConfirmModal);
    
    // 确认按钮
    document.getElementById('modalConfirmBtn').addEventListener('click', saveAccount);
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteAccount);
    
    // 点击模态框背景关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                if (this.id === 'accountModal') hideAccountModal();
                if (this.id === 'viewModal') hideViewModal();
                if (this.id === 'confirmModal') hideConfirmModal();
            }
        });
    });
    
    // 初始化表单验证事件
    initFormValidationEvents();
}

// 初始化表单验证事件
function initFormValidationEvents() {
    // 账户名称验证
    const accountNameInput = document.getElementById('accountName');
    if (accountNameInput) {
        accountNameInput.addEventListener('input', function() {
            validateAccountName(this.value);
        });
        accountNameInput.addEventListener('blur', function() {
            validateAccountName(this.value);
        });
    }
    
    // 电话验证
    const accountPhoneInput = document.getElementById('accountPhone');
    if (accountPhoneInput) {
        accountPhoneInput.addEventListener('input', function() {
            validatePhone(this.value);
        });
        accountPhoneInput.addEventListener('blur', function() {
            validatePhone(this.value);
        });
    }
    
    // 邮箱验证
    const accountEmailInput = document.getElementById('accountEmail');
    if (accountEmailInput) {
        accountEmailInput.addEventListener('input', function() {
            validateEmail(this.value);
        });
        accountEmailInput.addEventListener('blur', function() {
            validateEmail(this.value);
        });
    }
    
    // 账户角色验证
    const accountRoleSelect = document.getElementById('accountRole');
    if (accountRoleSelect) {
        accountRoleSelect.addEventListener('change', function() {
            validateRole(this.value);
        });
    }
    
    // 密码验证
    const accountPasswordInput = document.getElementById('accountPassword');
    if (accountPasswordInput) {
        accountPasswordInput.addEventListener('input', function() {
            validatePassword(this.value);
            updatePasswordToggleVisibility(this.value);
        });
        accountPasswordInput.addEventListener('blur', function() {
            validatePassword(this.value);
        });
    }
    
    // 备注字数统计
    const accountRemarkInput = document.getElementById('accountRemark');
    if (accountRemarkInput) {
        accountRemarkInput.addEventListener('input', function() {
            updateRemainingChars(this.value);
        });
    }
    
    // 密码显示/隐藏切换
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            togglePasswordVisibility();
        });
    }
}

// 搜索账户
function searchAccounts() {
    const name = document.getElementById('searchName').value.trim().toLowerCase();
    const phone = document.getElementById('searchPhone').value.trim().toLowerCase();
    const email = document.getElementById('searchEmail').value.trim().toLowerCase();
    
    // 过滤数据
    filteredAccountData = accountData.filter(account => {
        const nameMatch = name === '' || account.name.toLowerCase().includes(name);
        const phoneMatch = phone === '' || (account.phone && account.phone.includes(phone));
        const emailMatch = email === '' || account.email.toLowerCase().includes(email);
        
        return nameMatch && phoneMatch && emailMatch;
    });
    
    // 重置当前页和选中状态
    currentPage = 1;
    selectedAccounts.clear();
    document.getElementById('selectAllCheckbox').checked = false;
    document.getElementById('selectAllCheckbox').indeterminate = false;
    
    // 重新渲染表格和分页
    renderAccountTable();
    updatePagination();
    updateNoDataTip();
}

// 渲染账户表格
function renderAccountTable() {
    const tableBody = document.getElementById('accountTableBody');
    const noDataTip = document.getElementById('noDataTip');
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 计算分页数据
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredAccountData.length);
    const currentPageData = filteredAccountData.slice(startIndex, endIndex);
    
    if (currentPageData.length === 0) {
        tableBody.style.display = 'none';
        noDataTip.style.display = 'block';
        return;
    }
    
    tableBody.style.display = 'block';
    noDataTip.style.display = 'none';
    
    // 渲染每行数据
    currentPageData.forEach((account, index) => {
        const row = document.createElement('div');
        row.className = `account-row ${index % 2 === 1 ? 'alternate' : ''}`;
        
        row.innerHTML = `
            <div class="checkbox-col">
                <input type="checkbox" class="account-checkbox" data-id="${account.id}" 
                       ${selectedAccounts.has(account.id) ? 'checked' : ''}>
            </div>
            <div class="account-name-col">${account.name}</div>
            <div class="account-role-col">${account.role}</div>
            <div class="phone-col">${account.phone || '-'}</div>
            <div class="email-col" title="${account.email}">
                ${account.email.length > 25 ? account.email.substring(0, 25) + '...' : account.email}
            </div>
            <div class="remark-col">${account.remark || '-'}</div>
            <div class="operation-col">
                <button class="view-btn" data-id="${account.id}">查看</button>
                <button class="edit-btn" data-id="${account.id}">修改</button>
                <button class="delete-row-btn" data-id="${account.id}">删除</button>
            </div>
        `;
        
        tableBody.appendChild(row);
        
        // 绑定行内事件
        const checkbox = row.querySelector('.account-checkbox');
        checkbox.addEventListener('change', function() {
            toggleAccountSelection(account.id, this.checked);
        });
        
        row.querySelector('.view-btn').addEventListener('click', () => showViewModal(account.id));
        row.querySelector('.edit-btn').addEventListener('click', () => showEditModal(account.id));
        row.querySelector('.delete-row-btn').addEventListener('click', () => showDeleteConfirm(account.id, account.name));
    });
    
    // 更新全选状态
    updateSelectAllCheckbox();
}

// 更新无数据提示
function updateNoDataTip() {
    const noDataTip = document.getElementById('noDataTip');
    const hasData = filteredAccountData.length > 0;
    
    noDataTip.style.display = hasData ? 'none' : 'block';
    document.getElementById('accountTableBody').style.display = hasData ? 'block' : 'none';
}

// 更新分页信息
function updatePagination() {
    const totalAccounts = filteredAccountData.length;
    totalPages = Math.ceil(totalAccounts / pageSize);
    
    document.getElementById('totalAccounts').textContent = totalAccounts;
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    
    // 更新分页按钮状态
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
    
    // 更新跳转输入框
    const jumpInput = document.getElementById('pageJumpInput');
    jumpInput.value = currentPage;
    jumpInput.max = totalPages;
}

// 切换全选/反选状态 - 真正的反选功能
function toggleSelectAll() {
    const accountCheckboxes = document.querySelectorAll('.account-checkbox');
    
    // 反转所有复选框的状态
    accountCheckboxes.forEach(checkbox => {
        const accountId = parseInt(checkbox.dataset.id);
        const newCheckedState = !checkbox.checked;
        
        checkbox.checked = newCheckedState;
        
        if (newCheckedState) {
            selectedAccounts.add(accountId);
        } else {
            selectedAccounts.delete(accountId);
        }
    });
    
    // 更新全选复选框状态
    updateSelectAllCheckbox();
}

// 切换单个账户选择状态
function toggleAccountSelection(accountId, isChecked) {
    if (isChecked) {
        selectedAccounts.add(accountId);
    } else {
        selectedAccounts.delete(accountId);
    }
    
    updateSelectAllCheckbox();
}

// 更新全选复选框状态 - 三态逻辑
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const accountCheckboxes = document.querySelectorAll('.account-checkbox');
    
    if (accountCheckboxes.length === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
        return;
    }
    
    const checkedCount = document.querySelectorAll('.account-checkbox:checked').length;
    const totalCount = accountCheckboxes.length;
    
    // 更新三态选择状态
    if (checkedCount === 0) {
        // 全未选中
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === totalCount) {
        // 全选中
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        // 部分选中
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

// 显示新增模态框
function showAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = '创建账户/角色';
    document.getElementById('accountForm').reset();
    
    // 重置所有验证状态
    resetFormValidation();
    
    // 更新字数统计
    updateRemainingChars('');
    
    // 重置密码显示/隐藏
    const passwordInput = document.getElementById('accountPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    passwordInput.type = 'password';
    if (passwordToggle) {
        passwordToggle.classList.remove('visible');
        passwordToggle.classList.remove('has-content');
    }
    
    document.getElementById('accountModal').classList.add('show');
    
    // 设置密码为必填
    document.getElementById('accountPassword').placeholder = '请输入密码(8-20位，字母、数字、特殊字符至少两种)';
}

// 显示修改模态框
function showEditModal(accountId) {
    currentEditId = accountId;
    const account = accountData.find(acc => acc.id === accountId);
    
    if (account) {
        document.getElementById('modalTitle').textContent = '修改账户/角色';
        document.getElementById('accountName').value = account.name;
        document.getElementById('accountPhone').value = account.phone || '';
        document.getElementById('accountEmail').value = account.email;
        document.getElementById('accountRole').value = account.role === '管理员' ? 'admin' : 'teacher';
        document.getElementById('accountPassword').value = '';
        document.getElementById('accountPassword').placeholder = '如需修改密码请输入新密码，否则留空';
        document.getElementById('accountRemark').value = account.remark || '';
        
        // 更新字数统计
        updateRemainingChars(account.remark || '');
        
        // 重置所有验证状态（修改模式密码可为空）
        resetFormValidation();
        
        // 密码显示/隐藏重置
        const passwordInput = document.getElementById('accountPassword');
        const passwordToggle = document.getElementById('passwordToggle');
        passwordInput.type = 'password';
        if (passwordToggle) {
            passwordToggle.classList.remove('visible');
            passwordToggle.classList.remove('has-content');
        }
        
        document.getElementById('accountModal').classList.add('show');
    }
}

// 显示查看模态框
function showViewModal(accountId) {
    const account = accountData.find(acc => acc.id === accountId);
    
    if (account) {
        document.getElementById('viewAccountName').textContent = account.name;
        document.getElementById('viewAccountEmail').textContent = account.email;
        document.getElementById('viewAccountPhone').textContent = account.phone || '-';
        document.getElementById('viewAccountRole').textContent = account.role;
        document.getElementById('viewAccountRemark').textContent = account.remark || '-';
        
        document.getElementById('viewModal').classList.add('show');
    }
}

// 显示删除确认模态框
function showDeleteConfirm(accountId, accountName) {
    deleteAccountId = accountId;
    const message = accountName 
        ? `确定要删除账户 "${accountName}" 吗？` 
        : '确定要删除选中的账户吗？';
    
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').classList.add('show');
}

// 隐藏账户模态框
function hideAccountModal() {
    document.getElementById('accountModal').classList.remove('show');
    document.getElementById('accountForm').reset();
    resetFormValidation();
    currentEditId = null;
}

// 隐藏查看模态框
function hideViewModal() {
    document.getElementById('viewModal').classList.remove('show');
}

// 隐藏确认模态框
function hideConfirmModal() {
    document.getElementById('confirmModal').classList.remove('show');
    deleteAccountId = null;
}

// 重置表单验证状态
function resetFormValidation() {
    // 清除所有错误提示
    document.querySelectorAll('.error-tip').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    // 清除所有输入框的错误状态
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
        el.classList.remove('error', 'success');
    });
}

// 验证账户名称
function validateAccountName(value) {
    const errorTip = document.getElementById('accountNameError');
    const input = document.getElementById('accountName');
    
    if (!value.trim()) {
        errorTip.textContent = '账户名称不能为空';
        errorTip.classList.add('show');
        input.classList.add('error');
        input.classList.remove('success');
        return false;
    }
    
    errorTip.classList.remove('show');
    input.classList.remove('error');
    input.classList.add('success');
    return true;
}

// 验证电话
function validatePhone(value) {
    const errorTip = document.getElementById('accountPhoneError');
    const input = document.getElementById('accountPhone');
    
    if (!value.trim()) {
        errorTip.textContent = '电话不能为空';
        errorTip.classList.add('show');
        input.classList.add('error');
        input.classList.remove('success');
        return false;
    }
    
    // 手机号验证：1开头，11位数字
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
        errorTip.textContent = '请输入有效的11位手机号码';
        errorTip.classList.add('show');
        input.classList.add('error');
        input.classList.remove('success');
        return false;
    }
    
    errorTip.classList.remove('show');
    input.classList.remove('error');
    input.classList.add('success');
    return true;
}

// 验证邮箱
function validateEmail(value) {
    const errorTip = document.getElementById('accountEmailError');
    const input = document.getElementById('accountEmail');
    
    if (!value.trim()) {
        errorTip.textContent = '邮箱不能为空';
        errorTip.classList.add('show');
        input.classList.add('error');
        input.classList.remove('success');
        return false;
    }
    
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        errorTip.textContent = '请输入有效的邮箱地址';
        errorTip.classList.add('show');
        input.classList.add('error');
        input.classList.remove('success');
        return false;
    }
    
    errorTip.classList.remove('show');
    input.classList.remove('error');
    input.classList.add('success');
    return true;
}

// 验证角色
function validateRole(value) {
    const errorTip = document.getElementById('accountRoleError');
    const input = document.getElementById('accountRole');
    
    if (!value) {
        errorTip.textContent = '请选择账户角色';
        errorTip.classList.add('show');
        input.classList.add('error');
        input.classList.remove('success');
        return false;
    }
    
    errorTip.classList.remove('show');
    input.classList.remove('error');
    input.classList.add('success');
    return true;
}

// 验证密码
function validatePassword(value) {
    const errorTip = document.getElementById('accountPasswordError');
    const input = document.getElementById('accountPassword');
    
    // 如果是修改模式且密码为空，则跳过验证（允许不修改密码）
    if (currentEditId !== null && !value.trim()) {
        errorTip.classList.remove('show');
        input.classList.remove('error');
        input.classList.remove('success');
        return true;
    }
    
    // 新增模式或修改模式下输入了密码，都需要验证
    if (!value.trim()) {
        errorTip.textContent = '密码不能为空';
        errorTip.classList.add('show');
        input.classList.add('error');
        input.classList.remove('success');
        return false;
    }
    
    // 密码长度验证
    if (value.length < 8 || value.length > 20) {
        errorTip.textContent = '密码长度应为8-20位';
        errorTip.classList.add('show');
        input.classList.add('error');
        input.classList.remove('success');
        return false;
    }
    
    // 密码复杂度验证：字母、数字、特殊字符至少两种
    let hasLetter = /[a-zA-Z]/.test(value);
    let hasNumber = /\d/.test(value);
    let hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    
    const complexityCount = [hasLetter, hasNumber, hasSpecialChar].filter(Boolean).length;
    
    if (complexityCount < 2) {
        errorTip.textContent = '密码需包含字母、数字、特殊字符至少两种';
        errorTip.classList.add('show');
        input.classList.add('error');
        input.classList.remove('success');
        return false;
    }
    
    errorTip.classList.remove('show');
    input.classList.remove('error');
    input.classList.add('success');
    return true;
}

// 更新密码显示/隐藏按钮的可见性
function updatePasswordToggleVisibility(value) {
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        if (value.trim()) {
            passwordToggle.classList.add('has-content');
        } else {
            passwordToggle.classList.remove('has-content');
            passwordToggle.classList.remove('visible');
        }
    }
}

// 切换密码可见性
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('accountPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.classList.add('visible');
    } else {
        passwordInput.type = 'password';
        passwordToggle.classList.remove('visible');
    }
}

// 更新剩余字符数
function updateRemainingChars(value) {
    const counter = document.getElementById('remarkCounter');
    const remaining = 255 - value.length;
    
    counter.textContent = `${value.length}/255`;
    
    // 根据剩余字符数更新样式
    counter.classList.remove('warning', 'error');
    if (remaining <= 50 && remaining > 10) {
        counter.classList.add('warning');
    } else if (remaining <= 10) {
        counter.classList.add('error');
    }
}

// 保存账户（新增或修改）
function saveAccount() {
    const name = document.getElementById('accountName').value.trim();
    const phone = document.getElementById('accountPhone').value.trim();
    const email = document.getElementById('accountEmail').value.trim();
    const role = document.getElementById('accountRole').value;
    const password = document.getElementById('accountPassword').value.trim();
    const remark = document.getElementById('accountRemark').value.trim();
    
    // 验证所有字段
    const isNameValid = validateAccountName(name);
    const isPhoneValid = validatePhone(phone);
    const isEmailValid = validateEmail(email);
    const isRoleValid = validateRole(role);
    const isPasswordValid = validatePassword(password);
    
    if (!isNameValid || !isPhoneValid || !isEmailValid || !isRoleValid || !isPasswordValid) {
        alert('请检查表单中的错误信息！');
        return;
    }
    
    if (currentEditId === null) {
        // 新增账户
        const newAccount = {
            id: accountData.length > 0 ? Math.max(...accountData.map(acc => acc.id)) + 1 : 1,
            name,
            role: role === 'admin' ? '管理员' : '老师',
            phone,
            email,
            password: '********',
            remark
        };
        
        accountData.push(newAccount);
        alert('账户创建成功！');
    } else {
        // 修改账户
        const accountIndex = accountData.findIndex(acc => acc.id === currentEditId);
        if (accountIndex !== -1) {
            accountData[accountIndex] = {
                ...accountData[accountIndex],
                name,
                role: role === 'admin' ? '管理员' : '老师',
                phone,
                email,
                remark
            };
            
            // 如果输入了新密码，则更新密码
            if (password) {
                accountData[accountIndex].password = '********';
            }
            
            alert('账户修改成功！');
        }
    }
    
    // 更新筛选后的数据
    searchAccounts();
    
    // 重新渲染表格和分页
    renderAccountTable();
    updatePagination();
    updateNoDataTip();
    hideAccountModal();
}

// 删除单个账户
function deleteAccount() {
    if (deleteAccountId) {
        const accountIndex = accountData.findIndex(acc => acc.id === deleteAccountId);
        if (accountIndex !== -1) {
            accountData.splice(accountIndex, 1);
            
            // 更新筛选后的数据
            const name = document.getElementById('searchName').value.trim().toLowerCase();
            const phone = document.getElementById('searchPhone').value.trim().toLowerCase();
            const email = document.getElementById('searchEmail').value.trim().toLowerCase();
            
            filteredAccountData = accountData.filter(account => {
                const nameMatch = name === '' || account.name.toLowerCase().includes(name);
                const phoneMatch = phone === '' || (account.phone && account.phone.includes(phone));
                const emailMatch = email === '' || account.email.toLowerCase().includes(email);
                
                return nameMatch && phoneMatch && emailMatch;
            });
            
            // 重新计算当前页
            const newTotalPages = Math.ceil(filteredAccountData.length / pageSize);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                currentPage = newTotalPages;
            } else if (newTotalPages === 0) {
                currentPage = 1;
            }
            
            // 重新渲染
            renderAccountTable();
            updatePagination();
            updateNoDataTip();
            alert('账户删除成功！');
        }
    }
    
    hideConfirmModal();
}

// 删除选中的账户 - 修复只删除当前页勾选的账户
function deleteSelectedAccounts() {
    // 获取当前页所有被选中的复选框
    const checkedCheckboxes = document.querySelectorAll('.account-checkbox:checked');
    
    if (checkedCheckboxes.length === 0) {
        alert('请先选择要删除的账户！');
        return;
    }
    
    const message = `确定要删除选中的 ${checkedCheckboxes.length} 个账户吗？`;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').classList.add('show');
    
    // 修改确认按钮的事件处理
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const originalHandler = confirmDeleteBtn.onclick;
    
    confirmDeleteBtn.onclick = function() {
        // 删除当前页选中的账户
        const delIds = Array.from(checkedCheckboxes).map(cb => parseInt(cb.dataset.id));
        
        // 从原始数据中删除
        for (let i = accountData.length - 1; i >= 0; i--) {
            if (delIds.includes(accountData[i].id)) {
                accountData.splice(i, 1);
            }
        }
        
        // 清空选中状态
        selectedAccounts.clear();
        document.getElementById('selectAllCheckbox').checked = false;
        document.getElementById('selectAllCheckbox').indeterminate = false;
        
        // 更新筛选后的数据
        const name = document.getElementById('searchName').value.trim().toLowerCase();
        const phone = document.getElementById('searchPhone').value.trim().toLowerCase();
        const email = document.getElementById('searchEmail').value.trim().toLowerCase();
        
        filteredAccountData = accountData.filter(account => {
            const nameMatch = name === '' || account.name.toLowerCase().includes(name);
            const phoneMatch = phone === '' || (account.phone && account.phone.includes(phone));
            const emailMatch = email === '' || account.email.toLowerCase().includes(email);
            
            return nameMatch && phoneMatch && emailMatch;
        });
        
        // 重新计算当前页
        const newTotalPages = Math.ceil(filteredAccountData.length / pageSize);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            currentPage = newTotalPages;
        } else if (newTotalPages === 0) {
            currentPage = 1;
        }
        
        // 重新渲染
        renderAccountTable();
        updatePagination();
        updateNoDataTip();
        alert('账户删除成功！');
        
        hideConfirmModal();
        
        // 恢复原始事件处理程序
        confirmDeleteBtn.onclick = originalHandler;
    };
}

// 分页导航函数
function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderAccountTable();
        updatePagination();
    }
}

function goToPrevPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

function goToNextPage() {
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}