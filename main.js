document.addEventListener('DOMContentLoaded', () => {
    // Accordion Logic for FAQ
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');

            // Close all open accordions (optional, but gives a cleaner feel)
            document.querySelectorAll('.accordion-header').forEach(otherHeader => {
                otherHeader.classList.remove('active');
                otherHeader.nextElementSibling.style.maxHeight = null;
            });

            // If the clicked one wasn't active, open it
            if (!isActive) {
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Optional: Add simple header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Cart Logic for WhatsApp
    const cart = {};
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    const bottomOrderBtn = document.querySelector('.btn-order-bottom');
    const tooltip = document.querySelector('.whatsapp-tooltip');
    const basePhone = "5491158427814";
    const cartFloatingBtn = document.getElementById('cart-floating');
    const cartBadgeCount = document.getElementById('cart-badge-count');

    // Cart Modal Elements
    const cartModal = document.getElementById('cart-modal');
    const cartModalClose = document.getElementById('cart-modal-close');
    const cartModalOverlay = document.getElementById('cart-modal-overlay');
    const modalItemsContainer = document.getElementById('cart-modal-items');
    const modalTotalPrice = document.getElementById('cart-modal-total-price');
    const modalCheckoutBtn = document.getElementById('cart-modal-checkout');

    function updateWhatsappLink() {
        let hasItems = false;
        let itemsText = "";
        let total = 0;
        let index = 1;
        let totalQty = 0;

        // Render modal items container
        if (modalItemsContainer) {
            modalItemsContainer.innerHTML = '';
        }

        for (const [product, data] of Object.entries(cart)) {
            if (data.quantity > 0) {
                const subtotal = data.quantity * data.price;
                itemsText += `\n    ${index}. ${data.quantity}x ${product} - $${subtotal.toLocaleString('es-AR')}`;
                total += subtotal;
                totalQty += data.quantity;
                index++;
                hasItems = true;

                // Add to modal UI
                if (modalItemsContainer) {
                    const itemRow = document.createElement('div');
                    itemRow.className = 'cart-item-row';
                    itemRow.innerHTML = `
                        ${data.image ? `<img src="${data.image}" alt="${product}" class="cart-modal-item-img">` : ''}
                        <div class="cart-modal-item-info">
                            <div class="cart-modal-item-name">${product}</div>
                            <div class="cart-modal-item-price-unit">$${data.price.toLocaleString('es-AR')} c/u</div>
                        </div>
                        <div class="cart-modal-qty-container">
                            <div class="modal-qty-controller">
                                <button class="modal-qty-btn minus" data-product="${product}">-</button>
                                <span class="modal-qty-display">${data.quantity}</span>
                                <button class="modal-qty-btn plus" data-product="${product}">+</button>
                            </div>
                        </div>
                        <div class="cart-modal-item-total-price">
                            $${subtotal.toLocaleString('es-AR')}
                        </div>
                        <button class="cart-modal-item-delete" data-product="${product}" aria-label="Eliminar del carrito">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64L32 128zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/>
                            </svg>
                        </button>
                    `;
                    modalItemsContainer.appendChild(itemRow);
                }
            }
        }

        let message = "¡Hola vittoria focaccería! 🥖 Quiero realizar el siguiente pedido:";
        if (hasItems) {
            message += `\n${itemsText}\n\n    Total estimado: $${total.toLocaleString('es-AR')}\n\n    ¿Para qué día puedo coordinar el retiro?`;
        } else {
            message = "¡Hola vittoria focaccería! 🥖 Quiero realizar un pedido.";
        }

        const finalUrl = `https://wa.me/${basePhone}?text=${encodeURIComponent(message)}`;
        if (whatsappBtn) whatsappBtn.href = finalUrl;
        if (bottomOrderBtn) bottomOrderBtn.href = finalUrl;
        if (modalCheckoutBtn) modalCheckoutBtn.href = finalUrl;

        if (modalTotalPrice) {
            modalTotalPrice.innerText = `$${total.toLocaleString('es-AR')}`;
        }

        // Toggle floating cart button and badge
        if (cartFloatingBtn) {
            if (totalQty > 0) {
                cartFloatingBtn.classList.add('visible');
                if (cartBadgeCount) {
                    cartBadgeCount.innerText = totalQty;
                }
            } else {
                cartFloatingBtn.classList.remove('visible');
                closeModal(); // Close modal if cart is empty
            }
        }
    }

    // Modal Events
    function openModal(e) {
        if (e) e.preventDefault();
        if (cartModal) {
            cartModal.classList.add('open');
        }
    }

    function closeModal() {
        if (cartModal) {
            cartModal.classList.remove('open');
        }
    }

    if (cartFloatingBtn) {
        cartFloatingBtn.addEventListener('click', openModal);
    }
    if (cartModalClose) {
        cartModalClose.addEventListener('click', closeModal);
    }
    if (cartModalOverlay) {
        cartModalOverlay.addEventListener('click', closeModal);
    }
    if (modalCheckoutBtn) {
        modalCheckoutBtn.addEventListener('click', closeModal);
    }

    // Helper to get cart title
    function getCartTitle(card) {
        const baseTitle = card.querySelector('.card-title').innerText;
        const sizeSelector = card.querySelector('.size-selector');
        const sizeLabel = sizeSelector ? (sizeSelector.value === 'entera' ? 'Entera' : 'Mitad') : '';
        return sizeLabel ? `${baseTitle} (${sizeLabel})` : baseTitle;
    }

    // Size Selection Logic
    const sizeSelectors = document.querySelectorAll('.size-selector');
    sizeSelectors.forEach(select => {
        select.addEventListener('change', (e) => {
            const card = e.target.closest('.card-content');
            if (!card) return;

            const selectedOption = e.target.options[e.target.selectedIndex];

            // Update price
            const price = selectedOption.getAttribute('data-price');
            const priceElement = card.querySelector('.card-price');
            priceElement.innerText = `$${parseInt(price).toLocaleString('es-AR')}`;

            // Update quantity display
            const title = getCartTitle(card);
            const qtyDisplay = card.querySelector('.qty-display');
            const qty = cart[title] ? cart[title].quantity : 0;
            if (qtyDisplay) {
                qtyDisplay.innerText = qty;
            }

            // Sync visibility
            const addBtn = card.querySelector('.btn-add-to-cart');
            const qtyController = card.querySelector('.qty-controller');
            if (qty === 0) {
                if (addBtn) addBtn.classList.remove('hidden');
                if (qtyController) qtyController.classList.add('hidden');
            } else {
                if (addBtn) addBtn.classList.add('hidden');
                if (qtyController) qtyController.classList.remove('hidden');
            }
        });
    });

    // Add to Cart Button Logic
    const addButtons = document.querySelectorAll('.btn-add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.card-content');
            if (!card) return;

            const title = getCartTitle(card);
            const priceStr = card.querySelector('.card-price').innerText;
            const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;

            const menuCard = card.closest('.menu-card');
            const imgSrc = menuCard ? menuCard.querySelector('.card-img').getAttribute('src') : '';
            
            // Set initial quantity to 1
            cart[title] = { quantity: 1, price: priceNum, image: imgSrc };

            // Update page display
            const qtyDisplay = card.querySelector('.qty-display');
            if (qtyDisplay) {
                qtyDisplay.innerText = 1;
            }

            // Switch button to selector
            const addBtn = card.querySelector('.btn-add-to-cart');
            const qtyController = card.querySelector('.qty-controller');
            if (addBtn) addBtn.classList.add('hidden');
            if (qtyController) qtyController.classList.remove('hidden');

            updateWhatsappLink();

            // Visual feedback on tooltip
            if (tooltip) {
                tooltip.innerText = "¡Agregado!";
                setTimeout(() => {
                    tooltip.innerText = "¡Hacé tu pedido!";
                }, 2000);
            }
        });
    });

    // Quantity buttons logic
    const qtyButtons = document.querySelectorAll('.qty-btn');
    qtyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.card-content');
            if (!card) return;

            const title = getCartTitle(card);
            const priceStr = card.querySelector('.card-price').innerText;
            const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;

            if (!cart[title]) {
                const menuCard = card.closest('.menu-card');
                const imgSrc = menuCard ? menuCard.querySelector('.card-img').getAttribute('src') : '';
                cart[title] = { quantity: 0, price: priceNum, image: imgSrc };
            }

            if (e.target.classList.contains('plus')) {
                cart[title].quantity++;
            } else if (e.target.classList.contains('minus')) {
                if (cart[title].quantity > 0) {
                    cart[title].quantity--;
                }
            }

            // Update display
            const qtyDisplay = card.querySelector('.qty-display');
            if (qtyDisplay) {
                qtyDisplay.innerText = cart[title].quantity;
            }

            // Toggle button/selector visibility
            const addBtn = card.querySelector('.btn-add-to-cart');
            const qtyController = card.querySelector('.qty-controller');
            if (cart[title].quantity === 0) {
                if (addBtn) addBtn.classList.remove('hidden');
                if (qtyController) qtyController.classList.add('hidden');
            } else {
                if (addBtn) addBtn.classList.add('hidden');
                if (qtyController) qtyController.classList.remove('hidden');
            }

            updateWhatsappLink();

            // Visual feedback on tooltip if added
            if (e.target.classList.contains('plus') && tooltip) {
                tooltip.innerText = "¡Agregado!";
                setTimeout(() => {
                    tooltip.innerText = "¡Hacé tu pedido!";
                }, 2000);
            }
        });
    });

    // Event delegation for quantity control and item deletion in cart modal
    if (modalItemsContainer) {
        modalItemsContainer.addEventListener('click', (e) => {
            // Check if quantity button clicked
            const qtyBtn = e.target.closest('.modal-qty-btn');
            if (qtyBtn) {
                const productKey = qtyBtn.getAttribute('data-product');
                if (!cart[productKey]) return;

                if (qtyBtn.classList.contains('plus')) {
                    cart[productKey].quantity++;
                } else if (qtyBtn.classList.contains('minus')) {
                    if (cart[productKey].quantity > 0) {
                        cart[productKey].quantity--;
                    }
                }

                // Sync quantity to the main page display
                syncQuantityToPage(productKey, cart[productKey].quantity);

                // Update links and reload modal content
                updateWhatsappLink();
                return;
            }

            // Check if delete button clicked
            const deleteBtn = e.target.closest('.cart-modal-item-delete');
            if (deleteBtn) {
                const productKey = deleteBtn.getAttribute('data-product');
                if (cart[productKey]) {
                    cart[productKey].quantity = 0; // reset quantity to 0

                    // Sync quantity to the main page display
                    syncQuantityToPage(productKey, 0);

                    // Update links and reload modal content
                    updateWhatsappLink();
                }
            }
        });
    }

    function syncQuantityToPage(productKey, newQty) {
        const cards = document.querySelectorAll('.card-content');
        cards.forEach(card => {
            const title = getCartTitle(card);
            if (title === productKey) {
                const qtyDisplay = card.querySelector('.qty-display');
                if (qtyDisplay) {
                    qtyDisplay.innerText = newQty;
                }

                const addBtn = card.querySelector('.btn-add-to-cart');
                const qtyController = card.querySelector('.qty-controller');
                if (newQty === 0) {
                    if (addBtn) addBtn.classList.remove('hidden');
                    if (qtyController) qtyController.classList.add('hidden');
                } else {
                    if (addBtn) addBtn.classList.add('hidden');
                    if (qtyController) qtyController.classList.remove('hidden');
                }
            }
        });
    }
});
