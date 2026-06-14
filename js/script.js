let cart = [];
let orders = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Hamburger Menu Toggle
function toggleMenu() {
    const menu = document.querySelector('.menu');
    const hamburger = document.querySelector('.hamburger');
    
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close menu when clicking on a link
document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.menu li a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.menu').classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        });
    });
});

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// Statistics Counter Animation
document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const animateStats = () => {
        if (hasAnimated) return;
        hasAnimated = true;
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const increment = target / 50;
            let current = 0;
            
            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                stat.textContent = Math.floor(current).toLocaleString();
            }, 30);
        });
    };
    
    // Trigger animation when section is visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(statsSection);
    }
});

// Card press/click neon effect
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.products .card');
    const buyButtons = document.querySelectorAll('.products .card button.buy-btn');
    
    cards.forEach(card => {
        // Neon effect on card click
        card.addEventListener('click', (e) => {
            // If it's the button that was clicked, don't activate neon
            if (e.target.classList.contains('card') && e.target.tagName === 'BUTTON') {
                return;
            }
            
            // Remove active from all cards
            cards.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked card
            card.classList.add('active');
            
            // Remove after animation completes
            setTimeout(() => {
                card.classList.remove('active');
            }, 1200);
        });

        // Initialize heart icons with wishlist state
        const productTitle = card.querySelector('h2')?.innerText;
        const heart = card.querySelector('.heart');
        if (heart && wishlist.includes(productTitle)) {
            heart.classList.add('active');
            heart.style.color = '#ef4444';
        }

        // Add heart click functionality
        if (heart) {
            heart.addEventListener('click', (e) => {
                e.stopPropagation();
                const title = card.querySelector('h2')?.innerText;
                
                if (heart.classList.contains('active')) {
                    heart.classList.remove('active');
                    heart.style.color = '';
                    wishlist = wishlist.filter(item => item !== title);
                } else {
                    heart.classList.add('active');
                    heart.style.color = '#ef4444';
                    if (!wishlist.includes(title)) {
                        wishlist.push(title);
                    }
                }
                
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
            });
        }
    });

    // Buy button click to open modal
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.card');
            if (card) {
                // Get product data
                const category = card.querySelector('.category')?.innerText || '';
                const title = button.dataset.name || card.querySelector('h2')?.innerText || '';
                const priceText = button.dataset.price ? `$${button.dataset.price}` : card.querySelector('.price')?.innerText || '$0';
                let description = 'Premium quality product crafted with excellence. Perfect for everyday use with modern design and superior comfort.';
                
                if (title.includes('Shirt') || category.includes('Clothing')) {
                    description = 'Premium quality shirt made from fine cotton blend. Perfect for both casual and formal occasions. Features modern design with superior comfort and durability.';
                } else if (title.includes('Shoes') || category.includes('Footwear')) {
                    description = 'High-quality premium shoes crafted for comfort and style. Features ergonomic design for all-day wear. Perfect for any occasion. Durable construction with premium materials.';
                } else if (title.includes('Watch') || category.includes('Accessories')) {
                    description = 'Luxury timepiece combining elegance and functionality. Features precision movement and premium craftsmanship. Water-resistant design with long-lasting battery.';
                } else if (title.includes('Glasses')) {
                    description = 'Stylish glasses with premium UV protection. Features durable frame and scratch-resistant lenses. Perfect for outdoor and everyday use. Lightweight design for all-day comfort.';
                } else if (title.includes('Backpack') || category.includes('Bags')) {
                    description = 'Durable travel backpack with spacious compartments. Perfect for business, school, or travel. Features premium materials and comfortable straps. Water-resistant design protects your items.';
                } else if (title.includes('Headphone') || category.includes('Electronics')) {
                    description = 'Premium wireless headphones with crystal-clear sound. Features noise cancellation and long battery life. Perfect for music, calls, and gaming. Comfortable ear-cup design for extended wear.';
                }
                
                document.getElementById('modalProductDescription').innerText = description;
                openProductModal(card);
            }
        });
    });
    
    // Close modal when clicking outside
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProductModal();
            }
        });
    }
});

// Add product with smart cart
function buyNow(name, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name && item.price === price);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
        showToast(`✅ ${name} quantity updated to ${existingItem.quantity}`);
    } else {
        cart.push({ name, price, quantity: 1 });
        showToast(`✨ ${name} added to cart!`);
    }
    
    updateCart();
    openCart();
}

// Toast notification system
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #a855f7, #ec4899);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(168, 85, 247, 0.4);
        font-weight: 600;
        z-index: 10000;
        animation: slideInUp 0.4s ease;
        font-family: 'Poppins', sans-serif;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// Add toast animations
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyle);

// Update cart with quantities
function updateCart() {
    let items = document.getElementById("cart-items");
    let total = 0;

    if (!items) return;
    
    items.innerHTML = "";

    if (cart.length === 0) {
        items.innerHTML = '<div style="text-align: center; padding: 30px; color: #94a3b8;">🛒 Your cart is empty</div>';
    } else {
        cart.forEach((item, i) => {
            const qty = item.quantity || 1;
            const itemTotal = item.price * qty;
            total += itemTotal;

            items.innerHTML += `
                <div class="cart-item">
                    <div style="flex: 1; text-align: left;">
                        <strong style="color: #e0f2fe;">${item.name}</strong><br>
                        <span style="color: #a78bfa;">$${item.price} x ${qty}</span>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button onclick="updateQuantity(${i}, -1)" style="width: 28px; height: 28px; padding: 0; border-radius: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 14px;">−</button>
                        <span style="width: 20px; text-align: center; color: #cbd5e1;">${qty}</span>
                        <button onclick="updateQuantity(${i}, 1)" style="width: 28px; height: 28px; padding: 0; border-radius: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 14px;">+</button>
                        <button onclick="removeItem(${i})" style="margin-left: 8px; padding: 6px 10px; border-radius: 6px; background: rgba(255,0,0,0.2); border: 1px solid rgba(255,0,0,0.4); color: #ff6b6b; cursor: pointer;">❌</button>
                    </div>
                </div>
            `;
        });
    }

    document.getElementById("total").innerText = total;
    document.getElementById("chekout-total").innerText = total;
    document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    if (email) {
        alert(`✅ Thank you for subscribing with: ${email}\nYou'll receive exclusive offers soon!`);
        event.target.reset();
    }
}

// Search Functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.classList.remove('active');
            return;
        }
        
        const products = Array.from(document.querySelectorAll('.products .card')).map(card => {
            const title = card.querySelector('h2')?.innerText || '';
            const category = card.querySelector('.category')?.innerText || '';
            const price = card.querySelector('.price')?.innerText || '';
            return { title, category, price, element: card };
        });
        
        const filtered = products.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query) ||
            p.price.toLowerCase().includes(query)
        );
        
        if (filtered.length > 0) {
            searchResults.innerHTML = filtered.slice(0, 8).map(p => `
                <div class="search-result-item" onclick="(function(){ const card = Array.from(document.querySelectorAll('.products .card')).find(c => c.querySelector('h2')?.innerText.trim() === '${p.title}'); card?.querySelector('button.buy-btn')?.click(); document.getElementById('searchResults').classList.remove('active'); })();">
                    <div>
                        <strong>${p.title}</strong><br>
                        <small>${p.category} • ${p.price}</small>
                    </div>
                    <span>→</span>
                </div>
            `).join('');
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '<div class="search-result-item">No products found</div>';
            searchResults.classList.add('active');
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            searchResults.classList.remove('active');
        }
    });
});

// Category Filter Functionality
function filterProducts(category) {
    const cards = document.querySelectorAll('.products .card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter products
    cards.forEach(card => {
        const productCategory = card.querySelector('.category')?.innerText.trim();
        
        if (category === 'All' || productCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.4s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add fade-in animation for filtered products
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Product Modal Functionality
function openProductModal(card) {
    // Get product data from card elements
    const titleEl = card.querySelector('h2');
    const priceEl = card.querySelector('.price');
    const categoryEl = card.querySelector('.category');
    const ratingEl = card.querySelector('.rating');
    const imgEl = card.querySelector('.img-box img');
    
    const title = titleEl ? titleEl.innerText.trim() : 'Premium Product';
    const priceText = priceEl ? priceEl.innerText.trim() : '$0';
    const priceNum = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
    const category = categoryEl ? categoryEl.innerText.trim() : 'Product';
    const rating = ratingEl ? ratingEl.innerText.trim() : '⭐ 4.5 (100 reviews)';
    const img = imgEl ? imgEl.src : 'images/default.jpg';
    
    // Populate modal with actual product data
    document.getElementById('modalProductTitle').innerText = title;
    document.getElementById('modalProductPrice').innerText = priceText;
    document.getElementById('modalProductCategory').innerText = category;
    document.getElementById('modalProductRating').innerText = rating;
    document.getElementById('modalProductImage').src = img;
    document.getElementById('quantityInput').value = 1;
    
    // Store product data for later use
    window.currentProduct = {
        title: title,
        price: priceNum,
        priceText: priceText,
        card: card
    };
    
    // Show modal
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function buyFromModal() {
    const quantity = parseInt(document.getElementById('quantityInput').value) || 1;
    const product = window.currentProduct;
    
    if (product && product.price > 0) {
        for (let i = 0; i < quantity; i++) {
            cart.push({ name: product.title, price: product.price });
        }
        updateCart();
        closeProductModal();
        openCart();
        alert(`✅ Added ${quantity} item(s) to cart!\nTotal: $${product.price * quantity}`);
    } else if (!product) {
        alert('❌ Error: Product not found');
    } else {
        alert('❌ Error: Invalid price');
    }
}

function addToWishlistFromModal() {
    const product = window.currentProduct;
    if (product) {
        const heart = product.card.querySelector('.heart');
        if (!heart.classList.contains('active')) {
            heart.click();
            alert('❤ Added to Wishlist!');
        } else {
            alert('Already in Wishlist!');
        }
    }
}


// Update item quantity
function updateQuantity(i, change) {
    if (cart[i]) {
        const currentQty = cart[i].quantity || 1;
        const newQty = currentQty + change;
        
        if (newQty <= 0) {
            removeItem(i);
        } else {
            cart[i].quantity = newQty;
            updateCart();
        }
    }
}

// Remove item
function removeItem(i) {
    const itemName = cart[i]?.name || 'Item';
    cart.splice(i, 1);
    showToast(`🗑️ ${itemName} removed from cart`);
    updateCart();
}

// Open cart
function openCart() {
    document.getElementById("cartPanel").classList.add("active");
}

// Close cart
function closeCart() {
    document.getElementById("cartPanel").classList.remove("active");
}


// 🟢 Place Order (MAIN FEATURE)


    // Product editor, unique backgrounds, persistence, and auto-description
    (function () {
        const STORAGE_KEY = 'ms_products_v1';

        const gradients = [
            'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)',
            'linear-gradient(135deg,#f97316 0%,#f43f5e 100%)',
            'linear-gradient(135deg,#06b6d4 0%,#7c3aed 100%)',
            'linear-gradient(135deg,#34d399 0%,#06b6d4 100%)',
            'linear-gradient(135deg,#f472b6 0%,#fb923c 100%)'
        ];

        let products = [];

        document.addEventListener('DOMContentLoaded', () => {
            loadProducts();
        });

        function rndGradient() {
            return gradients[Math.floor(Math.random() * gradients.length)];
        }

        function loadProducts() {
            const raw = localStorage.getItem(STORAGE_KEY);
            const cardEls = Array.from(document.querySelectorAll('.products .card'));

            if (raw) {
                try {
                    products = JSON.parse(raw);
                } catch (e) { products = []; }
            }

            // If no saved products, build from DOM
            if (!products || products.length !== cardEls.length) {
                products = cardEls.map((card, i) => {
                    const id = card.dataset.pid || `p-${i}`;
                    card.dataset.pid = id;

                    const titleEl = card.querySelector('h2');
                    const priceEl = card.querySelector('.price');
                    const catEl = card.querySelector('.category');
                    const imgEl = card.querySelector('.img-box img');
                    const descEl = card.querySelector('.card-desc');

                    const title = titleEl ? titleEl.innerText.trim() : `Product ${i+1}`;
                    const price = priceEl ? parseFloat((priceEl.innerText||'').replace(/[^0-9.]/g, '')) || 0 : 0;
                    const category = catEl ? catEl.innerText.trim() : '';
                    const image = imgEl ? imgEl.getAttribute('src') : '';
                    const description = descEl ? descEl.innerText.trim() : '';

                    return { id, title, price, category, image, description, bg: rndGradient() };
                });
                saveProducts();
            }

            // Render into DOM
            products.forEach(p => {
                const card = document.querySelector(`.products .card[data-pid="${p.id}"]`) || document.querySelector(`.products .card[data-pid="${p.id}"]`);
                if (card) renderProduct(card, p);
            });
        }

        function saveProducts() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        }

        function renderProduct(card, p) {
            card.style.background = p.bg || rndGradient();
            const img = card.querySelector('.img-box img');
            if (img && p.image) img.src = p.image;

            const titleEl = card.querySelector('h2');
            if (titleEl) titleEl.innerText = p.title;

            const priceEl = card.querySelector('.price');
            if (priceEl) priceEl.innerText = `$${p.price}`;

            const catEl = card.querySelector('.category');
            if (catEl) catEl.innerText = p.category;

            let descEl = card.querySelector('.card-desc');
            if (!descEl) {
                descEl = document.createElement('p');
                descEl.className = 'card-desc muted';
                const inner = card.querySelector('.card-inner') || card;
                inner.appendChild(descEl);
            }
            descEl.innerText = p.description || '';
        }

    })();



// ================= 3D CARD EFFECT =================
document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = (y - rect.height / 2) / 20;
        const rotateY = (x - rect.width / 2) / -20;

        card.querySelector(".card-inner").style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.querySelector(".card-inner").style.transform =
            "rotateX(0) rotateY(0)";
    });

});





// Close checkout
function closeCheckout() {
    closeCart();
}

// Confirm order
function confirmOrder() {

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    if (!name || !phone || !address) {
        alert("Fill all fields ❌");
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price, 0);

    // 🧾 Product list তৈরি
    let productList = "";
    cart.forEach(item => {
        productList += `- ${item.name} ($${item.price})\n`;
    });

    // 📱 WhatsApp message
    let message = `🛒 *New Order!*\n
👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}

📦 Products:
${productList}

💰 Total: $${total}
`;

    // encode
    let url = `https://wa.me/${'+8801993627956'}?text=${encodeURIComponent(message)}`;

    // open WhatsApp
    window.open(url, "_blank");

    // clear cart
    // persist order locally
    loadOrders();
    const order = { name, phone, address, products: cart.slice(), total, ts: Date.now() };
    orders.push(order);
    localStorage.setItem('ms_orders_v1', JSON.stringify(orders));

    cart = [];
    updateCart();

    closeCheckout();
    closeCart();
}

// Orders persistence
function loadOrders() {
    try {
        const raw = localStorage.getItem('ms_orders_v1');
        orders = raw ? JSON.parse(raw) : [];
    } catch (e) { orders = []; }
}

