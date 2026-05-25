// catalog-products.js - загрузка и отображение товаров в каталоге (динамическая версия)

let allProductsData = [];

// ========== БАЗОВЫЕ ТОВАРЫ (24 товара) ==========
function getDefaultProducts() {
    return [
        { id: 1, name: 'Игровой ноутбук ASUS ROG Strix G15', desc: 'Intel Core i7-11800H, RTX 3060, 16GB RAM, 512GB SSD, 15.6" 144Hz', price: 89999, category: 'laptops', brand: 'asus', image: './image/asus.jpg', stock: 10 },
        { id: 2, name: 'Игровой компьютер HYPERPC Gamer Pro', desc: 'Intel Core i7, RTX 4070, 32GB DDR5, 1TB SSD + 2TB HDD', price: 124999, category: 'computers', brand: 'hyperpc', image: './image/hyperpc.jpg', stock: 5 },
        { id: 3, name: 'Монитор Samsung Odyssey G5', desc: '27" 2K 144Hz, 1ms, изогнутый 1000R, AMD FreeSync', price: 34999, category: 'peripherals', brand: 'samsung', image: './image/monitor.jpg', stock: 15 },
        { id: 4, name: 'Ноутбук Lenovo IdeaPad 3', desc: 'AMD Ryzen 5, 8GB RAM, 256GB SSD, 15.6" Full HD', price: 45999, category: 'laptops', brand: 'lenovo', image: './image/lenovo.jpg', stock: 20 },
        { id: 5, name: 'Клавиатура Logitech G Pro Mechanical', desc: 'Механическая, GX Blue, RGB подсветка, TKL', price: 7999, category: 'peripherals', brand: 'logitech', image: '../image/clava.jpg', stock: 25 },
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

// ========== ЗАГРУЗКА ТОВАРОВ ==========
function loadProductsData() {
    let savedProducts = localStorage.getItem('techshop_products');

    if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        // Проверяем, есть ли у нас все 24 товара
        if (parsed.length >= 24) {
            allProductsData = parsed;
        } else {
            // Если товаров меньше 24, добавляем недостающие из дефолтных
            const defaultProducts = getDefaultProducts();
            const existingIds = new Set(parsed.map(p => p.id));
            const missingProducts = defaultProducts.filter(p => !existingIds.has(p.id));
            allProductsData = [...parsed, ...missingProducts];
            localStorage.setItem('techshop_products', JSON.stringify(allProductsData));
        }
    } else {
        allProductsData = getDefaultProducts();
        localStorage.setItem('techshop_products', JSON.stringify(allProductsData));
    }

    console.log('Загружено товаров в каталог:', allProductsData.length);
    return allProductsData;
}

// ========== ПОЛУЧИТЬ ТОВАР ПО ID ==========
function getProductById(id) {
    return allProductsData.find(p => p.id == id);
}

// ========== ОТОБРАЖЕНИЕ ТОВАРОВ В КАТАЛОГЕ ==========
function renderProducts(products, container) {
    if (!container) {
        console.error('Контейнер productsGrid не найден');
        return;
    }

    if (!products || products.length === 0) {
        container.innerHTML = '<div class="empty-products"><div class="empty-icon">🔍</div><h3>Товары не найдены</h3><p>Попробуйте изменить параметры фильтрации</p></div>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product" data-product-id="${product.id}" data-category="${product.category || ''}" data-brand="${product.brand || ''}" data-price="${product.price || 0}">
            <a href="product.html?id=${product.id}" class="product-link">
                <img src="${product.image || './image/placeholder.jpg'}" alt="${escapeHtml(product.name)}" onerror="this.src='./image/placeholder.jpg'">
                <div class="product-info">
                    <h3>${escapeHtml(product.name)}</h3>
                    <p>${escapeHtml((product.desc || 'Описание отсутствует').substring(0, 80))}${(product.desc || '').length > 80 ? '...' : ''}</p>
                    <div class="price">${(product.price || 0).toLocaleString()} ₽</div>
                    <div class="stock-info ${(product.stock || 0) > 0 ? 'in-stock' : 'out-stock'}">${(product.stock || 0) > 0 ? '✅ В наличии' : '❌ Нет в наличии'}</div>
                </div>
            </a>
            <div class="product-buttons">
                <a href="#" class="btn add-to-cart" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${product.price}" data-image="${product.image || ''}">В корзину</a>
                <button class="btn-wishlist" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${product.price || 0}" data-image="${product.image || ''}">🤍 В избранное</button>
            </div>
        </div>
    `).join('');

    // Переинициализируем кнопки
    setTimeout(function() {
        if (typeof cart !== 'undefined' && cart.initAddToCartButtons) {
            cart.initAddToCartButtons();
        }
        if (typeof initWishlistButtons === 'function') {
            initWishlistButtons();
        }
        // Обновляем статус кнопок избранного для авторизованных пользователей
        updateWishlistButtonsStatus();
    }, 100);
}

// Обновление статуса кнопок избранного
function updateWishlistButtonsStatus() {
    const userData = localStorage.getItem('techshop_current_user');
    if (!userData) return;

    const user = JSON.parse(userData);
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
    const wishlistIds = new Set(wishlist.map(item => item.id));

    document.querySelectorAll('.btn-wishlist').forEach(btn => {
        const productId = btn.dataset.id;
        if (wishlistIds.has(parseInt(productId))) {
            btn.classList.add('active');
            btn.innerHTML = '❤️ В избранном';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '🤍 В избранное';
        }
    });
}

// ========== ФИЛЬТРАЦИЯ ==========
function applyFiltersAndRender() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Получаем выбранные категории
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
    const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);

    // Получаем выбранные бренды
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]:checked');
    const selectedBrands = Array.from(brandCheckboxes).map(cb => cb.value);

    // Получаем максимальную цену
    const priceRange = document.getElementById('priceRange');
    const maxPrice = priceRange ? parseInt(priceRange.value) : 300000;

    // Получаем сортировку
    const sortSelect = document.getElementById('sortSelect');
    const sortBy = sortSelect ? sortSelect.value : 'popular';

    // Фильтруем товары
    let filtered = [...allProductsData];

    if (selectedCategories.length > 0) {
        filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }

    if (selectedBrands.length > 0) {
        filtered = filtered.filter(product => selectedBrands.includes(product.brand));
    }

    filtered = filtered.filter(product => product.price <= maxPrice);

    // Сортировка
    if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered, productsGrid);
    updateCategoryCounters();

    const count = filtered.length;
    if (count === 0) {
        showNotification('Товаров не найдено', 'warning');
    }
}

// Обновление счетчиков категорий
function updateCategoryCounters() {
    const categories = ['laptops', 'computers', 'components', 'peripherals'];
    categories.forEach(cat => {
        const count = allProductsData.filter(p => p.category === cat).length;
        const label = document.querySelector(`input[name="category"][value="${cat}"]`)?.closest('label');
        if (label) {
            const span = label.querySelector('.category-count');
            if (span) {
                span.textContent = `(${count})`;
            } else {
                label.innerHTML = label.innerHTML.replace('</label>', ` <span class="category-count">(${count})</span></label>`);
            }
        }
    });
}

// ========== СБРОС ФИЛЬТРОВ ==========
function resetAllFilters() {
    document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="brand"]').forEach(cb => cb.checked = false);

    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    if (priceRange) {
        priceRange.value = priceRange.max || 300000;
        if (priceValue) priceValue.textContent = parseInt(priceRange.value).toLocaleString() + ' ₽';
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'popular';

    applyFiltersAndRender();
    showNotification('Все фильтры сброшены', 'success');
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function showNotification(message, type = 'success') {
    const existingNotif = document.querySelector('.dynamic-notification');
    if (existingNotif) existingNotif.remove();

    const notification = document.createElement('div');
    notification.className = 'dynamic-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'warning' ? '#e67e22' : '#e74c3c'};
        color: white; padding: 12px 24px;
        border-radius: 10px; z-index: 1000;
        font-size: 14px; font-weight: 500;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
}

function updateHeaderUser() {
    const userData = localStorage.getItem('techshop_current_user');
    const userNameSpan = document.getElementById('userNameShort');
    const headerAvatar = document.getElementById('headerAvatar');
    const adminLinks = document.querySelectorAll('.admin-link');

    if (userData && userNameSpan) {
        const user = JSON.parse(userData);
        userNameSpan.textContent = user.name || user.email.split('@')[0];
        const savedAvatar = localStorage.getItem(`user_avatar_${user.id}`);
        if (savedAvatar && headerAvatar) headerAvatar.src = savedAvatar;

        // Показываем админку, если пользователь админ
        if (user.role === 'admin') {
            adminLinks.forEach(link => { if (link) link.style.display = 'inline-block'; });
        } else {
            adminLinks.forEach(link => { if (link) link.style.display = 'none'; });
        }
    } else if (userNameSpan) {
        userNameSpan.textContent = 'Войти';
        if (headerAvatar) headerAvatar.src = '../image/avatars/avatar1.jpg';
        adminLinks.forEach(link => { if (link) link.style.display = 'none'; });
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('catalog-products.js загружен');

    // Загружаем товары
    loadProductsData();

    // Отображаем все товары
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        renderProducts(allProductsData, productsGrid);
        console.log('Отображено товаров:', allProductsData.length);
    } else {
        console.error('productsGrid не найден при инициализации');
    }

    // Обновляем шапку
    updateHeaderUser();

    // Обновляем счетчики категорий
    updateCategoryCounters();

    // Тоггл фильтров
    const toggleBtn = document.getElementById('filterToggleBtn');
    const filterContainer = document.getElementById('filterContainer');
    if (toggleBtn && filterContainer) {
        toggleBtn.addEventListener('click', function() {
            filterContainer.classList.toggle('show');
            this.innerHTML = filterContainer.classList.contains('show') ? '✕ Скрыть фильтры' : '🔍 Показать фильтры';
        });
    }

    // Применяем фильтры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const checkbox = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
        if (checkbox) {
            checkbox.checked = true;
            const filterContainerEl = document.getElementById('filterContainer');
            const toggleBtnEl = document.getElementById('filterToggleBtn');
            if (filterContainerEl && toggleBtnEl && !filterContainerEl.classList.contains('show')) {
                filterContainerEl.classList.add('show');
                toggleBtnEl.innerHTML = '✕ Скрыть фильтры';
            }
            setTimeout(() => applyFiltersAndRender(), 100);
        }
    }

    // Добавляем стили для отображения статуса наличия
    const style = document.createElement('style');
    style.textContent = `
        .stock-info {
            font-size: 12px;
            margin-top: 8px;
            padding: 4px 8px;
            border-radius: 20px;
            display: inline-block;
        }
        .stock-info.in-stock {
            background: #d4edda;
            color: #155724;
        }
        .stock-info.out-stock {
            background: #f8d7da;
            color: #721c24;
        }
        .category-count {
            font-size: 11px;
            color: #7f8c8d;
            margin-left: 4px;
        }
        .empty-products {
            text-align: center;
            padding: 60px 20px;
        }
        .empty-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});

// Делаем функции глобальными
window.applyFiltersAndRender = applyFiltersAndRender;
window.resetAllFilters = resetAllFilters;
window.getProductById = getProductById;
window.allProductsData = allProductsData;
window.updateWishlistButtonsStatus = updateWishlistButtonsStatus;

// Слушаем изменения в localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'techshop_current_user') {
        updateHeaderUser();
        updateWishlistButtonsStatus();
    } else if (e.key === 'techshop_products') {
        loadProductsData();
        applyFiltersAndRender();
    }
});