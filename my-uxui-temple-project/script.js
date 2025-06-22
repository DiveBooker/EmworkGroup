document.addEventListener('DOMContentLoaded', () => {
    const columnSelector = document.getElementById('column-selector');
    const autoplayToggle = document.getElementById('autoplay-toggle');
    const watthaiContainer = document.getElementById('watthai');
    const items = watthaiContainer.querySelectorAll('.item');
    const dotsContainer = document.querySelector('.navigation-dots');

    let currentVisiblePageIndex = 0;
    let autoplayInterval;
    const slideDuration = 3000;

    const updateColumnLayout = () => {
        const selectedCols = columnSelector.value;
        watthaiContainer.classList.remove('cols-2', 'cols-3', 'cols-4');
        watthaiContainer.classList.add(`cols-${selectedCols}`);
        currentVisiblePageIndex = 0;
        updateDots();
        resetAutoplay();
    };

    const createAndRenderDots = () => {
        dotsContainer.innerHTML = '';

        const numCols = parseInt(columnSelector.value);
        const totalItems = items.length;
        const numPages = Math.ceil(totalItems / numCols);

        if (numPages <= 1) {
            dotsContainer.style.display = 'none';
            return;
        } else {
            dotsContainer.style.display = 'flex';
        }

        for (let i = 0; i < numPages; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.pageIndex = i;
            if (i === currentVisiblePageIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentVisiblePageIndex = i;
                scrollToPage(currentVisiblePageIndex);
                updateDots();
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        }
    };

    const updateDots = () => {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentVisiblePageIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const scrollToPage = (pageIndex) => {
        const numCols = parseInt(columnSelector.value);
        const itemsPerPage = numCols;
        const firstItemIndexOnPage = pageIndex * itemsPerPage;

        if (items[firstItemIndexOnPage]) {
            items[firstItemIndexOnPage].scrollIntoView({
                behavior: 'smooth',
                inline: 'start',
                block: 'nearest'
            });
        }
    };

    const nextSlide = () => {
        const numCols = parseInt(columnSelector.value);
        const totalItems = items.length;
        const numPages = Math.ceil(totalItems / numCols);

        currentVisiblePageIndex = (currentVisiblePageIndex + 1) % numPages;
        scrollToPage(currentVisiblePageIndex);
        updateDots();
    };

    const startAutoplay = () => {
        if (!autoplayInterval) {
            autoplayInterval = setInterval(nextSlide, slideDuration);
        }
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    };

    const resetAutoplay = () => {
        stopAutoplay();
        if (autoplayToggle.checked) {
            startAutoplay();
        }
    };

    columnSelector.addEventListener('change', () => {
        updateColumnLayout();
        createAndRenderDots();
        resetAutoplay();
    });

    autoplayToggle.addEventListener('change', () => {
        if (autoplayToggle.checked) {
            startAutoplay();
        } else {
            stopAutoplay();
        }
    });

    updateColumnLayout();
    createAndRenderDots();
    if (autoplayToggle.checked) {
        startAutoplay();
    }
});