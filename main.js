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

    function updateWhatsappLink() {
        let hasItems = false;
        let itemsText = "";
        let total = 0;
        let index = 1;

        for (const [product, data] of Object.entries(cart)) {
            if (data.quantity > 0) {
                const subtotal = data.quantity * data.price;
                itemsText += `\n    ${index}. ${data.quantity}x ${product} - $${subtotal.toLocaleString('es-AR')}`;
                total += subtotal;
                index++;
                hasItems = true;
            }
        }

        let message = "¡Hola victoria focaccería! 🥖 Quiero realizar el siguiente pedido:";
        if (hasItems) {
            message += `\n${itemsText}\n\n    Total estimado: $${total.toLocaleString('es-AR')}\n\n    ¿Para qué día puedo coordinar el retiro?`;
        } else {
            message = "¡Hola vittoria focaccería! 🥖 Quiero realizar un pedido.";
        }

        const finalUrl = `https://wa.me/${basePhone}?text=${encodeURIComponent(message)}`;
        if (whatsappBtn) whatsappBtn.href = finalUrl;
        if (bottomOrderBtn) bottomOrderBtn.href = finalUrl;
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
            if (qtyDisplay) {
                qtyDisplay.innerText = cart[title] ? cart[title].quantity : 0;
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
                cart[title] = { quantity: 0, price: priceNum };
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
});
