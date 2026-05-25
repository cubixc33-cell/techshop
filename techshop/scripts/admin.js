// admin.js - полная логика админ-панели (синхронизированная с catalog-products)

let productsData = [];
let usersData = [];
let ordersData = [];

// Базовые товары (синхронизированы с catalog-products.js)
function getDefaultProducts() {
    return [
        { id: 1, name: 'Игровой ноутбук ASUS ROG Strix G15', desc: 'Intel Core i7-11800H, RTX 3060, 16GB RAM, 512GB SSD, 15.6" 144Hz', price: 89999, category: 'laptops', brand: 'asus', image: './image/asus.jpg', stock: 10 },
        { id: 2, name: 'Игровой компьютер HYPERPC Gamer Pro', desc: 'Intel Core i7, RTX 4070, 32GB DDR5, 1TB SSD + 2TB HDD', price: 124999, category: 'computers', brand: 'hyperpc', image: './image/hyperpc.jpg', stock: 5 },
        { id: 3, name: 'Монитор Samsung Odyssey G5', desc: '27" 2K 144Hz, 1ms, изогнутый 1000R, AMD FreeSync', price: 34999, category: 'peripherals', brand: 'samsung', image: './image/monitor.jpg', stock: 15 },
        { id: 4, name: 'Ноутбук Lenovo IdeaPad 3', desc: 'AMD Ryzen 5, 8GB RAM, 256GB SSD, 15.6" Full HD', price: 45999, category: 'laptops', brand: 'lenovo', image: './image/lenovo.jpg', stock: 20 },
        { id: 5, name: 'Клавиатура Logitech G Pro Mechanical', desc: 'Механическая, GX Blue, RGB подсветка, TKL', price: 7999, category: 'peripherals', brand: 'logitech', image: './image/clava.jpg', stock: 25 },
        { id: 6, name: 'Мышь Razer DeathAdder V3', desc: 'Focus Pro 30K DPI, 59g, оптические переключатели', price: 5499, category: 'peripherals', brand: 'razer', image: './image/mouse.jpg', stock: 30 },
        { id: 7, name: 'Наушники HyperX Cloud II', desc: '7.1 виртуальный surround, съёмный микрофон, алюминиевая рама', price: 8999, category: 'peripherals', brand: 'hyperx', image: './image/head.jpg', stock: 18 },
        { id: 8, name: 'Процессор Intel Core i7-13700K', desc: '16 ядер, 24 потока, до 5.4 ГГц, LGA 1700', price: 34999, category: 'components', brand: 'intel', image: './image/corei7.jpg', stock: 8 },
        { id: 9, name: 'Видеокарта NVIDIA RTX 4070', desc: '12GB GDDR6X, DLSS 3, Ray Tracing', price: 69999, category: 'components', brand: 'nvidia', image: './image/4070.png', stock: 7 },
        { id: 10, name: 'SSD Samsung 980 Pro', desc: '1TB NVMe M.2, PCIe 4.0, 7000/5000 МБ/с', price: 8999, category: 'components', brand: 'samsung', image: './image/ssd.jpg', stock: 12 },
        { id: 11, name: 'Игровой ноутбук Acer Nitro 5', desc: 'Intel Core i5, RTX 3050, 16GB RAM, 512GB SSD, 15.6" 144Hz', price: 79999, category: 'laptops', brand: 'acer', image: './image/acernitro.jpg', stock: 6 },
        { id: 12, name: 'Ноутбук Dell XPS 13', desc: 'Intel Core i7, 16GB RAM, 1TB SSD, 13.4" 4K Touch', price: 149999, category: 'laptops', brand: 'dell', image: './image/dell.jpg', stock: 4 },
        { id: 13, name: 'Ноутбук HP Pavilion 15', desc: 'Intel Core i5, NVIDIA MX350, 8GB RAM, 512GB SSD', price: 67999, category: 'laptops', brand: 'hp', image: './image/hp%20pfv.png', stock: 9 },
        { id: 14, name: 'Игровой ноутбук MSI Katana', desc: 'Intel Core i7, RTX 4060, 16GB DDR5, 1TB SSD, 17.3" 144Hz', price: 129999, category: 'laptops', brand: 'msi', image: './image/msi.jpg', stock: 5 },
        { id: 15, name: 'Офисный компьютер Business Pro', desc: 'Intel Core i5, 16GB RAM, 512GB SSD, Windows 11 Pro', price: 54999, category: 'computers', brand: 'hp', image: './image/ofice.png', stock: 15 },
        { id: 16, name: 'Бюджетный компьютер Home Basic', desc: 'AMD Ryzen 3, 8GB RAM, 256GB SSD, Windows 11', price: 27999, category: 'computers', brand: 'amd', image: './image/cheep.png', stock: 20 },
        { id: 17, name: 'Игровой компьютер MSI Aegis', desc: 'AMD Ryzen 7, RTX 4060 Ti, 32GB DDR5, 2TB SSD', price: 149999, category: 'computers', brand: 'msi', image: './image/aegis.jpg', stock: 3 },
        { id: 18, name: 'Рабочая станция HP Z4', desc: 'Intel Xeon, RTX A4000, 64GB ECC, 2TB SSD', price: 289999, category: 'computers', brand: 'hp', image: './image/station.jpg', stock: 2 },
        { id: 19, name: 'Мини-ПК Compact Office', desc: 'Intel Core i3, 8GB RAM, 256GB SSD, Ultra Compact', price: 32999, category: 'computers', brand: 'intel', image: './image/mini.jpg', stock: 12 },
        { id: 20, name: 'Оперативная память Corsair Vengeance DDR5', desc: '32GB (2x16GB), 5600MHz, CL36', price: 15999, category: 'components', brand: 'corsair', image: './image/ddr5.jpg', stock: 15 },
        { id: 21, name: 'Материнская плата ASUS ROG Strix Z790', desc: 'LGA 1700, DDR5, PCIe 5.0, Wi-Fi 6E', price: 29999, category: 'components', brand: 'asus', image: './image/motherboard.jpg', stock: 8 },
        { id: 22, name: 'Блок питания Corsair RM850x', desc: '850W, 80 Plus Gold, полностью модульный', price: 12999, category: 'components', brand: 'corsair', image: './image/psu.jpg', stock: 10 },
        { id: 23, name: 'Веб-камера Logitech C920 Pro', desc: 'Full HD 1080p, автофокус, стереомикрофоны', price: 6499, category: 'peripherals', brand: 'logitech', image: './image/webcam.png', stock: 25 },
        { id: 24, name: 'Колонки Logitech Z623', desc: '2.1 система, 200W RMS, THX, сабвуфер', price: 12999, category: 'peripherals', brand: 'logitech', image: './image/speakers.png', stock: 10 }
    ];
}

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    loadProducts();
    loadUsers();
    loadOrders();
    loadStats();
    initProductModal();
});

function initTabs() {
    const tabs = document.querySelectorAll('.admin-menu a');
    const tabContents = document.querySelectorAll('.admin-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            const activeTab = document.getElementById(tabId + 'Tab');
            if (activeTab) activeTab.classList.add('active');

            if (tabId === 'products') loadProducts();
            if (tabId === 'users') loadUsers();
            if (tabId === 'orders') loadOrders();
            if (tabId === 'stats') loadStats();
        });
    });
}

// ========== СТАТИСТИКА ==========
function loadStats() {
    const users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
    let totalOrders = 0;
    let totalSales = 0;
    let totalBonuses = 0;

    users.forEach(user => {
        const orders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
        totalOrders += orders.length;
        orders.forEach(order => {
            totalSales += order.total;
            totalBonuses += order.bonusEarned || 0;
        });
    });

    const totalUsers = document.getElementById('totalUsers');
    const totalOrdersSpan = document.getElementById('totalOrders');
    const totalSalesSpan = document.getElementById('totalSales');
    const totalBonusesSpan = document.getElementById('totalBonuses');

    if (totalUsers) totalUsers.textContent = users.filter(u => u.role !== 'admin').length;
    if (totalOrdersSpan) totalOrdersSpan.textContent = totalOrders;
    if (totalSalesSpan) totalSalesSpan.textContent = totalSales.toLocaleString() + ' ₽';
    if (totalBonusesSpan) totalBonusesSpan.textContent = totalBonuses.toLocaleString() + ' ₽';
}

// ========== ТОВАРЫ ==========
function loadProducts() {
    const saved = localStorage.getItem('techshop_products');
    if (saved) {
        productsData = JSON.parse(saved);
        if (!productsData.every(p => p && typeof p === 'object' && p.id && p.name)) {
            productsData = getDefaultProducts();
            localStorage.setItem('techshop_products', JSON.stringify(productsData));
        }
    } else {
        productsData = getDefaultProducts();
        localStorage.setItem('techshop_products', JSON.stringify(productsData));
    }
    renderProductsTable();
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    tbody.innerHTML = productsData.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image || './image/placeholder.jpg'}" class="product-img" onerror="this.src='./image/placeholder.jpg'" style="width:50px; height:50px; object-fit:cover; border-radius:8px;"></td>
            <td>${escapeHtml(product.name)}</td>
            <td>${escapeHtml(product.category)}</td>
            <td>${product.price.toLocaleString()} ₽}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${product.id})">✏️ Ред.</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">🗑️ Удал.</button>
            </td>
        </tr>
    `).join('');
}

function saveProductsToStorage() {
    localStorage.setItem('techshop_products', JSON.stringify(productsData));
    if (typeof window.allProductsData !== 'undefined') {
        window.allProductsData = productsData;
    }
    window.dispatchEvent(new StorageEvent('storage', { key: 'techshop_products' }));
}

function addProduct(product) {
    const maxId = Math.max(...productsData.map(p => p.id), 0);
    const newProduct = {
        id: maxId + 1,
        name: product.name || 'Новый товар',
        desc: product.desc || 'Описание отсутствует',
        price: product.price || 0,
        category: product.category || 'peripherals',
        brand: product.brand || 'other',
        image: product.image || './image/placeholder.jpg',
        stock: product.stock || 10
    };
    productsData.push(newProduct);
    saveProductsToStorage();
    renderProductsTable();
    showNotification('Товар добавлен!', 'success');
}

function updateProduct(id, updatedData) {
    const index = productsData.findIndex(p => p.id == id);
    if (index !== -1) {
        productsData[index] = { ...productsData[index], ...updatedData };
        saveProductsToStorage();
        renderProductsTable();
        showNotification('Товар обновлён!', 'success');
    }
}

function deleteProduct(id) {
    if (confirm('Удалить товар?')) {
        productsData = productsData.filter(p => p.id != id);
        saveProductsToStorage();
        renderProductsTable();
        showNotification('Товар удалён!', 'success');
    }
}

function editProduct(id) {
    const product = productsData.find(p => p.id == id);
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDesc').value = product.desc || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productBrand').value = product.brand || '';
        document.getElementById('productImage').value = product.image || '';
        document.getElementById('productStock').value = product.stock || 10;
        document.getElementById('productModalTitle').textContent = 'Редактировать товар';
        document.getElementById('productModal').classList.add('active');
    }
}

function initProductModal() {
    const modal = document.getElementById('productModal');
    const addBtn = document.getElementById('addProductBtn');
    const closeBtn = document.getElementById('closeProductModal');
    const cancelBtn = document.getElementById('cancelProductBtn');
    const form = document.getElementById('productForm');

    const formGroup = document.querySelector('#productForm .form-group:last-child');
    if (formGroup && !document.getElementById('productStock')) {
        const stockField = document.createElement('div');
        stockField.className = 'form-group';
        stockField.innerHTML = '<label>Количество на складе</label><input type="number" id="productStock" min="0" value="10">';
        form.insertBefore(stockField, formGroup);
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('productForm').reset();
            document.getElementById('productId').value = '';
            document.getElementById('productModalTitle').textContent = 'Добавить товар';
            document.getElementById('productImage').value = './image/placeholder.jpg';
            if (document.getElementById('productStock')) document.getElementById('productStock').value = 10;
            modal.classList.add('active');
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('active'));

    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('productId').value;
            const product = {
                name: document.getElementById('productName').value,
                desc: document.getElementById('productDesc').value,
                price: parseInt(document.getElementById('productPrice').value),
                category: document.getElementById('productCategory').value,
                brand: document.getElementById('productBrand').value,
                image: document.getElementById('productImage').value,
                stock: parseInt(document.getElementById('productStock')?.value || 10)
            };
            if (id) updateProduct(id, product);
            else addProduct(product);
            modal.classList.remove('active');
        });
    }
}

// ========== ПОЛЬЗОВАТЕЛИ ==========
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
    usersData = users.filter(u => u.role !== 'admin');
    renderUsersTable();
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = usersData.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${escapeHtml(user.name)}</td>
            <td>${user.email}</td>
            <td><span class="status-badge status-new">Пользователь</span></td>
            <td>${(user.bonus || 0).toLocaleString()} ₽}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td><button class="btn-refund" onclick="refundBonus(${user.id}, '${escapeHtml(user.name)}')">🎁 Вернуть бонусы</button></td>
        </tr>
    `).join('');
}

function refundBonus(userId, userName) {
    const user = usersData.find(u => u.id == userId);
    if (!user) return;

    document.getElementById('refundInfo').innerHTML = `<p>Пользователь: <strong>${userName}</strong></p><p>Текущий баланс: <strong>${(user.bonus || 0).toLocaleString()} ₽</strong></p>`;
    document.getElementById('refundAmount').value = '';
    document.getElementById('refundReason').value = '';
    document.getElementById('refundModal').classList.add('active');
    document.getElementById('refundModal').dataset.userId = userId;

    const confirmBtn = document.getElementById('confirmRefundBtn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', () => {
        const amount = parseInt(document.getElementById('refundAmount').value);
        const reason = document.getElementById('refundReason').value || 'Возврат бонусов администратором';
        if (!amount || amount <= 0) {
            alert('Введите сумму возврата');
            return;
        }

        const userId = parseInt(document.getElementById('refundModal').dataset.userId);
        let users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
        const userIndex = users.findIndex(u => u.id == userId);

        if (userIndex !== -1) {
            users[userIndex].bonus = (users[userIndex].bonus || 0) + amount;
            localStorage.setItem('techshop_users', JSON.stringify(users));

            const history = JSON.parse(localStorage.getItem(`bonus_history_${userId}`) || '[]');
            history.unshift({ amount: amount, description: reason, date: new Date().toLocaleString() });
            localStorage.setItem(`bonus_history_${userId}`, JSON.stringify(history));

            if (localStorage.getItem('techshop_current_user')) {
                const currentUser = JSON.parse(localStorage.getItem('techshop_current_user'));
                if (currentUser.id == userId) {
                    currentUser.bonus = users[userIndex].bonus;
                    localStorage.setItem('techshop_current_user', JSON.stringify(currentUser));
                }
            }

            alert(`✅ Начислено ${amount} бонусов пользователю ${users[userIndex].name}`);
            document.getElementById('refundModal').classList.remove('active');
            loadUsers();
            loadStats();
        }
    });

    const closeModal = () => document.getElementById('refundModal').classList.remove('active');
    document.getElementById('closeRefundModal').onclick = closeModal;
    document.getElementById('cancelRefundBtn').onclick = closeModal;
}

// ========== ЗАКАЗЫ ==========
function loadOrders() {
    const users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
    ordersData = [];

    users.forEach(user => {
        const orders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
        orders.forEach(order => {
            ordersData.push({ ...order, userName: user.name || user.email, userId: user.id });
        });
    });

    ordersData.sort((a, b) => b.id - a.id);
    renderOrdersTable();
}

function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    tbody.innerHTML = ordersData.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${escapeHtml(order.userName)}</td>
            <td>${order.items.slice(0, 2).map(i => `${i.name} × ${i.quantity}`).join(', ')}${order.items.length > 2 ? '...' : ''}</td>
            <td>${order.total.toLocaleString()} ₽}</td>
            <td>${order.bonusUsed ? order.bonusUsed.toLocaleString() + ' ₽' : '—'}</td>
            <td>${order.bonusEarned ? order.bonusEarned.toLocaleString() + ' ₽' : '—'}</td>
            <td>
                <select class="status-select" data-order-id="${order.id}" data-user-id="${order.userId}">
                    <option value="new" ${order.status === 'new' ? 'selected' : ''}>🆕 Новый</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>⏳ В обработке</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>✅ Доставлен</option>
                </select>
            </td>
            <td><button class="btn-refund" onclick="refundOrderBonus(${order.id}, ${order.userId})">🎁 Вернуть бонусы</button></td>
        </tr>
    `).join('');

    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            const orderId = parseInt(this.dataset.orderId);
            const userId = parseInt(this.dataset.userId);
            updateOrderStatus(orderId, userId, this.value);
        });
    });
}

function updateOrderStatus(orderId, userId, newStatus) {
    const orders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
    const orderIndex = orders.findIndex(o => o.id == orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));
        loadOrders();
        showNotification('Статус заказа обновлён!', 'success');
    }
}

function refundOrderBonus(orderId, userId) {
    const orders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
    const order = orders.find(o => o.id == orderId);
    if (!order) return;

    const bonusAmount = order.bonusUsed || 0;
    if (bonusAmount <= 0) {
        alert('По этому заказу не было списано бонусов');
        return;
    }

    if (confirm(`Вернуть ${bonusAmount} бонусов по заказу №${orderId}?`)) {
        let users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
        const userIndex = users.findIndex(u => u.id == userId);

        if (userIndex !== -1) {
            users[userIndex].bonus = (users[userIndex].bonus || 0) + bonusAmount;
            localStorage.setItem('techshop_users', JSON.stringify(users));

            const history = JSON.parse(localStorage.getItem(`bonus_history_${userId}`) || '[]');
            history.unshift({ amount: bonusAmount, description: `Возврат бонусов по заказу №${orderId}`, date: new Date().toLocaleString() });
            localStorage.setItem(`bonus_history_${userId}`, JSON.stringify(history));

            if (localStorage.getItem('techshop_current_user')) {
                const currentUser = JSON.parse(localStorage.getItem('techshop_current_user'));
                if (currentUser.id == userId) {
                    currentUser.bonus = users[userIndex].bonus;
                    localStorage.setItem('techshop_current_user', JSON.stringify(currentUser));
                }
            }

            alert(`✅ Возвращено ${bonusAmount} бонусов`);
            loadUsers();
            loadStats();
        }
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white; padding: 12px 24px;
        border-radius: 10px; z-index: 1000;
        font-size: 14px;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
}

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.refundBonus = refundBonus;
window.refundOrderBonus = refundOrderBonus;