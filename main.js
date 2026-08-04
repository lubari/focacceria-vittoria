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
    const tooltip = document.querySelector('.whatsapp-tooltip');
    const basePhone = "5491158427814";
    
    function updateWhatsappLink() {
        let message = "Hola! quiero realizar un pedido:";
        let hasItems = false;
        
        for (const [product, quantity] of Object.entries(cart)) {
            if (quantity > 0) {
                message += `\n- ${quantity}x ${product}`;
                hasItems = true;
            }
        }
        
        if (!hasItems) {
            message = "Hola! quiero realizar un pedido.";
        }
        
        whatsappBtn.href = `https://wa.me/${basePhone}?text=${encodeURIComponent(message)}`;
    }

    const addButtons = document.querySelectorAll('.btn-outline');
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.card-content');
            const title = card.querySelector('.card-title').innerText;
            
            if (!cart[title]) {
                cart[title] = 0;
            }
            cart[title]++;
            
            // Visual feedback on button
            e.target.innerText = `Agregar (${cart[title]})`;
            e.target.style.backgroundColor = 'var(--color-rojo)';
            e.target.style.color = 'var(--color-white)';
            
            setTimeout(() => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--color-rojo)';
            }, 300);
            
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
});
