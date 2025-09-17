document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');

    async function loadProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error(`Failed to fetch products. Status: ${response.status}`);
            }
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error loading products:', error);
            if (productGrid) {
                productGrid.innerHTML = '<p>Could not load products. Please try again later.</p>';
            }
        }
    }

    function renderProducts(products) {
        if (!productGrid) return;
        productGrid.innerHTML = ''; // Clear existing content
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            // The entire card is a link to the product page
            productCard.innerHTML = `
                <a href="product.html?id=${product.id}">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <h3>${product.name}</h3>
                </a>
                <div class="price-container">
                    <span class="price">$${product.price.toFixed(2)}</span>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // Ensure the product grid exists on the page before trying to load products
    if (productGrid) {
        loadProducts();
    }
});
