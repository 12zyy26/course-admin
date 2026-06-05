// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // ==================== 顶部用户菜单功能 ====================
    const userMenu = document.getElementById('userMenu');
    const userDropdown = document.getElementById('userDropdown');
    const changePasswordBtn = document.getElementById('changePassword');
    const logoutBtn = document.getElementById('logout');
    const passwordModal = document.getElementById('passwordModal');
    const modalClose = document.getElementById('modalClose');
    const cancelPassword = document.getElementById('cancelPassword');
    const passwordForm = document.getElementById('passwordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitPasswordBtn = document.getElementById('submitPassword');
    
    // 从本地存储获取用户名
    const loggedInUser = localStorage.getItem('loggedInUser') || 'admin';
    document.getElementById('usernameLabel').textContent = loggedInUser;
    
    // 显示/隐藏用户下拉菜单
    userMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = userDropdown.style.display === 'block';
        userDropdown.style.display = isVisible ? 'none' : 'block';
    });
    
    // 点击页面其他地方时关闭下拉菜单
    document.addEventListener('click', function() {
        userDropdown.style.display = 'none';
    });
    
    // 阻止下拉菜单内部的点击事件冒泡
    userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // 显示修改密码弹窗
    changePasswordBtn.addEventListener('click', function() {
        passwordModal.style.display = 'flex';
        userDropdown.style.display = 'none';
        passwordForm.reset();
        clearErrors();
        updateSubmitButton();
        newPasswordInput.focus();
        
        // 重置密码显示状态
        resetAllPasswordToggles();
    });
    
    // 关闭弹窗
    function closeModal() {
        passwordModal.style.display = 'none';
        passwordForm.reset();
        clearErrors();
        resetAllPasswordToggles();
    }
    
    // 关闭弹窗事件
    modalClose.addEventListener('click', closeModal);
    cancelPassword.addEventListener('click', closeModal);
    
    // 点击弹窗背景关闭
    passwordModal.addEventListener('click', function(e) {
        if (e.target === passwordModal) {
            closeModal();
        }
    });
    
    // 退出登录功能
    logoutBtn.addEventListener('click', function() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('loggedInUser');
            window.location.href = '../html/login.html';
        }
        userDropdown.style.display = 'none';
    });
    
    // 验证密码格式
    function validatePassword(password) {
        if (!password) {
            return '密码不能为空';
        }
        
        if (password.length < 8 || password.length > 20) {
            return '密码长度应为8-20位';
        }
        
        let typesCount = 0;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (hasLetter) typesCount++;
        if (hasNumber) typesCount++;
        if (hasSpecialChar) typesCount++;
        
        if (typesCount < 2) {
            return '密码应包含字母、数字、特殊字符中的至少两种';
        }
        
        return '';
    }
    
    // 显示错误
    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    // 清除错误
    function clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    // 清除所有错误
    function clearErrors() {
        const errorTips = document.querySelectorAll('.error-tip');
        const inputs = document.querySelectorAll('input');
        
        errorTips.forEach(tip => {
            tip.textContent = '';
            tip.classList.remove('show');
        });
        
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }
    
    // 更新提交按钮状态
    function updateSubmitButton() {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        const newPasswordError = validatePassword(newPassword);
        const confirmPasswordError = confirmPassword !== newPassword ? '两次输入的密码不一致' : '';
        
        const hasError = newPasswordError || confirmPasswordError;
        const hasEmptyField = !newPassword || !confirmPassword;
        
        submitPasswordBtn.disabled = hasError || hasEmptyField;
    }
    
    // 实时验证
    newPasswordInput.addEventListener('input', function() {
        const error = validatePassword(this.value);
        const errorElement = document.getElementById('newPasswordError');
        
        if (error) {
            showError(this, errorElement, error);
        } else {
            clearError(this, errorElement);
        }
        
        const confirmErrorElement = document.getElementById('confirmPasswordError');
        if (confirmPasswordInput.value && confirmPasswordInput.value !== this.value) {
            showError(confirmPasswordInput, confirmErrorElement, '两次输入的密码不一致');
        } else if (confirmPasswordInput.value) {
            clearError(confirmPasswordInput, confirmErrorElement);
        }
        
        updatePasswordToggleVisibility('newPassword', 'newPasswordToggle');
        updateSubmitButton();
    });
    
    confirmPasswordInput.addEventListener('input', function() {
        const error = this.value !== newPasswordInput.value ? '两次输入的密码不一致' : '';
        const errorElement = document.getElementById('confirmPasswordError');
        
        if (error) {
            showError(this, errorElement, error);
        } else {
            clearError(this, errorElement);
        }
        
        updatePasswordToggleVisibility('confirmPassword', 'confirmPasswordToggle');
        updateSubmitButton();
    });
    
    // 表单提交
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        const newPasswordError = validatePassword(newPassword);
        const confirmPasswordError = confirmPassword !== newPassword ? '两次输入的密码不一致' : '';
        
        if (newPasswordError) {
            showError(newPasswordInput, document.getElementById('newPasswordError'), newPasswordError);
        }
        
        if (confirmPasswordError) {
            showError(confirmPasswordInput, document.getElementById('confirmPasswordError'), confirmPasswordError);
        }
        
        if (!newPasswordError && !confirmPasswordError) {
            submitPasswordBtn.disabled = true;
            submitPasswordBtn.textContent = '修改中...';
            
            setTimeout(() => {
                alert('密码修改成功！');
                closeModal();
                submitPasswordBtn.disabled = false;
                submitPasswordBtn.textContent = '确认修改';
            }, 1000);
        }
    });
    
    // ==================== 密码显示/隐藏功能 ====================
    function updatePasswordToggleVisibility(inputId, toggleId) {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(toggleId);
        
        if (!input || !toggle) return;
        
        if (input.value.trim()) {
            toggle.classList.add('has-content');
        } else {
            toggle.classList.remove('has-content');
            toggle.classList.remove('visible');
        }
    }
    
    // 切换密码可见性
    function togglePasswordVisibility(inputId, toggleId) {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(toggleId);
        
        if (!input || !toggle) return;
        
        if (input.type === 'password') {
            input.type = 'text';
            toggle.classList.add('visible');
        } else {
            input.type = 'password';
            toggle.classList.remove('visible');
        }
    }
    
    // 重置所有密码显示状态
    function resetAllPasswordToggles() {
        const toggleIds = ['newPasswordToggle', 'confirmPasswordToggle'];
        const inputIds = ['newPassword', 'confirmPassword'];
        
        toggleIds.forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.classList.remove('visible');
                toggle.classList.remove('has-content');
            }
        });
        
        inputIds.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.type = 'password';
            }
        });
    }
    
    // 初始化密码切换按钮
    function initPasswordToggles() {
        const toggleIds = ['newPasswordToggle', 'confirmPasswordToggle'];
        const inputIds = ['newPassword', 'confirmPassword'];
        
        toggleIds.forEach((toggleId, index) => {
            const toggle = document.getElementById(toggleId);
            const input = document.getElementById(inputIds[index]);
            
            if (toggle && input) {
                // 输入时更新按钮可见性
                input.addEventListener('input', function() {
                    updatePasswordToggleVisibility(inputIds[index], toggleId);
                });
                
                // 点击切换密码可见性
                toggle.addEventListener('click', function() {
                    togglePasswordVisibility(inputIds[index], toggleId);
                });
                
                // 初始状态
                updatePasswordToggleVisibility(inputIds[index], toggleId);
            }
        });
    }
    
    // ==================== 侧边栏导航交互功能 ====================
    
    // 获取当前iframe的src
    function getCurrentIframeSrc() {
        const iframe = document.getElementById('rightiframe');
        if (!iframe) return '';
        const src = iframe.src;
        if (!src) return '';
        return src.split('/').pop();
    }
    
    // 初始化：为有子菜单的项添加标记
    function initMenuMarkers() {
        const menuItems = document.querySelectorAll('.admin .body .left .navTools li');
        menuItems.forEach(item => {
            const downmenu = item.querySelector('.downmenu');
            if (downmenu) {
                const menuSpan = item.querySelector('.menuLi span');
                if (menuSpan) {
                    menuSpan.classList.add('has-submenu');
                }
            }
        });
    }
    
    // 移除所有激活状态
    function removeAllActiveStates() {
        document.querySelectorAll('.admin .body .left .navTools li span').forEach(span => {
            span.classList.remove('active');
        });
        
        document.querySelectorAll('.admin .body .left .navTools a').forEach(link => {
            link.classList.remove('active');
        });
    }
    
    // 激活当前页面对应的导航项
    function activateCurrentPage() {
        const currentPage = getCurrentIframeSrc();
        
        removeAllActiveStates();
        
        const allLinks = document.querySelectorAll('.admin .body .left .navTools a');
        let found = false;
        
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPage && href.includes(currentPage)) {
                link.classList.add('active');
                
                const parentLi = link.closest('li');
                if (parentLi) {
                    const menuLiSpan = parentLi.closest('li').querySelector('.menuLi span');
                    const downmenu = parentLi.closest('li').querySelector('.downmenu');
                    
                    if (menuLiSpan && downmenu) {
                        menuLiSpan.classList.add('menu-expanded');
                        downmenu.classList.add('show');
                    } else {
                        const parentSpan = parentLi.querySelector('span');
                        if (parentSpan && !parentSpan.classList.contains('has-submenu')) {
                            parentSpan.classList.add('active');
                        }
                    }
                }
                
                found = true;
            }
        });
        
        if (!found || !currentPage) {
            const homeSpan = document.querySelector('.indexLink span');
            if (homeSpan) {
                homeSpan.classList.add('active');
                homeSpan.querySelector('a')?.classList.add('active');
            }
        }
    }
    
    // 处理无子菜单的菜单项点击
    function handleSimpleMenuItem(span) {
        removeAllActiveStates();
        span.classList.add('active');
        
        const link = span.querySelector('a');
        if (link) {
            link.classList.add('active');
            const iframe = document.getElementById('rightiframe');
            if (iframe && link.getAttribute('href')) {
                iframe.src = link.getAttribute('href');
            }
        }
    }
    
    // 处理有子菜单的菜单项点击
    function handleSubmenuItem(span) {
        const downmenu = span.closest('li').querySelector('.downmenu');
        if (!downmenu) return;
        
        const isExpanded = span.classList.contains('menu-expanded');
        
        document.querySelectorAll('.menuLi span').forEach(otherSpan => {
            if (otherSpan !== span) {
                otherSpan.classList.remove('menu-expanded');
                otherSpan.classList.remove('active');
                const otherMenu = otherSpan.closest('li').querySelector('.downmenu');
                if (otherMenu) otherMenu.classList.remove('show');
            }
        });
        
        document.querySelectorAll('.admin .body .left .navTools a').forEach(link => {
            link.classList.remove('active');
        });
        
        if (!isExpanded) {
            span.classList.add('menu-expanded');
            span.classList.remove('active');
            downmenu.classList.add('show');
        } else {
            span.classList.remove('menu-expanded');
            span.classList.remove('active');
            downmenu.classList.remove('show');
        }
    }
    
    // 处理子菜单项点击
    function handleSubmenuLink(link) {
        removeAllActiveStates();
        link.classList.add('active');
        
        const parentLi = link.closest('li');
        if (parentLi) {
            const menuLiSpan = parentLi.closest('li').querySelector('.menuLi span');
            const downmenu = parentLi.closest('li').querySelector('.downmenu');
            
            if (menuLiSpan && downmenu) {
                menuLiSpan.classList.add('menu-expanded');
                downmenu.classList.add('show');
            }
        }
        
        const iframe = document.getElementById('rightiframe');
        if (iframe && link.getAttribute('href')) {
            iframe.src = link.getAttribute('href');
        }
    }
    
    // ==================== iframe高度自适应功能 ====================
    
    // 调整iframe高度
    function adjustIframeHeight() {
        const iframe = document.getElementById('rightiframe');
        if (!iframe) return;
        
        try {
            iframe.style.height = '100vh';
        } catch (e) {
            console.log('调整iframe高度时遇到限制:', e);
        }
    }
    
    // 监听iframe加载完成
    const rightIframe = document.getElementById('rightiframe');
    if (rightIframe) {
        rightIframe.addEventListener('load', function() {
            adjustIframeHeight();
            activateCurrentPage();
        });
    }
    
    // 窗口大小变化时重新调整iframe高度
    window.addEventListener('resize', function() {
        adjustIframeHeight();
    });
    
    // ==================== 菜单初始化 ====================
    
    // 初始化菜单标记
    initMenuMarkers();
    
    // 初始化页面激活状态
    setTimeout(activateCurrentPage, 100);
    
    // 为所有菜单项span添加点击事件
    document.querySelectorAll('.admin .body .left .navTools li span').forEach(span => {
        span.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            const downmenu = this.closest('li').querySelector('.downmenu');
            
            if (downmenu) {
                handleSubmenuItem(this);
            } else {
                handleSimpleMenuItem(this);
            }
        });
    });
    
    // 为所有菜单项链接添加点击事件
    document.querySelectorAll('.admin .body .left .navTools li span a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const span = this.parentElement;
            const downmenu = span.closest('li').querySelector('.downmenu');
            
            if (downmenu) {
                handleSubmenuItem(span);
            } else {
                handleSimpleMenuItem(span);
            }
        });
    });
    
    // 为子菜单中的链接添加点击事件
    document.querySelectorAll('.admin .body .left .navTools .downmenu dd a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleSubmenuLink(this);
        });
    });
    
    // ==================== 初始化所有功能 ====================
    initPasswordToggles();
});