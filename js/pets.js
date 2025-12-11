document.addEventListener('DOMContentLoaded', function () {
    const filterForm = document.getElementById('filterForm');
    const items = document.querySelectorAll('.pet-item');
    const itemsPerPage = 8;
    let currentPage = 1;

    // Simplified mapping for the Select values to Data Attributes
    const getValue = (id) => document.getElementById(id).value;

    function filterItems() {
        const type = getValue('petType');
        const gender = getValue('petGender');
        const age = getValue('petAge');

        let visibleCount = 0;

        items.forEach(item => {
            const itemType = item.getAttribute('data-type');
            const itemGender = item.getAttribute('data-gender');
            const itemAge = item.getAttribute('data-age');

            let matchesType = (type === 'All Types') || (type === itemType);
            let matchesGender = (gender === 'Any Gender') || (gender === itemGender);

            // Age matching logic needs to handle the formatted strings
            let matchesAge = false;
            if (age === 'Any Age') {
                matchesAge = true;
            } else if (age.includes(itemAge)) {
                // Simple substring match for "Puppy" in "Puppy/Kitten (< 1 yr)" etc
                // Wait, my values in HTML select are "Puppy/Kitten (< 1 yr)"
                // My data attributes are "Puppy/Kitten", "Young", "Adult"
                // So I need to check if the Select Value *contains* the Data Attribute
                // Or simplifying:
                if (age.includes('Puppy') && itemAge === 'Puppy/Kitten') matchesAge = true;
                if (age.includes('Young') && itemAge === 'Young') matchesAge = true;
                if (age.includes('Adult') && itemAge === 'Adult') matchesAge = true;
                if (age.includes('Senior') && itemAge === 'Senior') matchesAge = true;
            }

            if (matchesType && matchesGender && matchesAge) {
                item.classList.remove('d-none');
                item.classList.add('visible-item');
                visibleCount++;
            } else {
                item.classList.add('d-none');
                item.classList.remove('visible-item');
            }
        });

        updatePagination();
    }

    function updatePagination() {
        const visibleItems = document.querySelectorAll('.visible-item');
        const totalPages = Math.ceil(visibleItems.length / itemsPerPage);

        // Reset to page 1 if current page is out of bounds
        if (currentPage > totalPages) currentPage = 1;
        if (totalPages === 0) currentPage = 1;

        // Show/Hide items based on page
        visibleItems.forEach((item, index) => {
            if (index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage) {
                item.classList.remove('d-none');
            } else {
                item.classList.add('d-none');
            }
        });

        renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
        const paginationNav = document.querySelector('.pagination');
        paginationNav.innerHTML = '';

        if (totalPages <= 1) return;

        // Prev
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link border-0 rounded-circle mx-1" href="#" role="button" onclick="changePage(${currentPage - 1})">Prev</a>`;
        paginationNav.appendChild(prevLi);

        // Numbers
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            // Special styling for active vs non-active
            const linkMethod = `onclick="changePage(${i})"`;
            const bgClass = i === currentPage ? 'bg-success text-white' : 'text-dark';
            li.innerHTML = `<a class="page-link border-0 rounded-circle mx-1 ${bgClass}" href="#" role="button" ${linkMethod}>${i}</a>`;
            paginationNav.appendChild(li);
        }

        // Next
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link border-0 rounded-circle mx-1 text-dark" href="#" role="button" onclick="changePage(${currentPage + 1})">Next</a>`;
        paginationNav.appendChild(nextLi);
    }

    // Global scope for onclick
    window.changePage = function (page) {
        currentPage = page;
        updatePagination(); // Only re-slice, don't re-filter
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    filterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        currentPage = 1;
        filterItems();
    });

    // Initial Load
    items.forEach(item => item.classList.add('visible-item')); // Mark all as visible initially
    filterItems(); // Run once to set initial state/pagination
});
