// main.js - Основной JavaScript файл
document.addEventListener('DOMContentLoaded', function() {
    // Меняем цвет заголовка при загрузке страницы
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.color = '#2c3e50';
    });

    // Простая анимация при прокрутке
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
});