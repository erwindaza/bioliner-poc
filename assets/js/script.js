// --- INICIALIZACIÓN DE AOS (ANIMATE ON SCROLL) ---
// Esto activa las animaciones cuando los elementos entran en la pantalla.
AOS.init({
    duration: 800, // Duración de la animación en milisegundos
    once: true,    // La animación solo ocurre una vez
});


// --- LÓGICA DEL FORMULARIO DE CONTACTO ---
document.addEventListener('DOMContentLoaded', function() {
    
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenimos el envío tradicional del formulario

            // --- Validación simple del lado del cliente ---
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === '' || email === '' || message === '') {
                showStatusMessage('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showStatusMessage('Por favor, introduce un email válido.', 'error');
                return;
            }

            // --- Envío con Fetch API (método moderno AJAX) ---
            const formData = new FormData(this);
            const originalButtonText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Enviando...';
            submitBtn.disabled = true;

            fetch('https://formspree.io/f/mpwjraow', { // <-- ¡¡¡IMPORTANTE!!!
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    showStatusMessage('¡Mensaje enviado con éxito! Gracias por contactarnos.', 'success');
                    contactForm.reset(); // Limpiamos el formulario
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                             showStatusMessage(data["errors"].map(error => error["message"]).join(", "), 'error');
                        } else {
                             showStatusMessage('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
                        }
                    })
                }
            }).catch(error => {
                showStatusMessage('Hubo un problema de red. Por favor, revisa tu conexión.', 'error');
            }).finally(() => {
                submitBtn.innerHTML = originalButtonText;
                submitBtn.disabled = false;
            });
        });
    }

    // --- Función para mostrar mensajes de estado ---
    function showStatusMessage(message, type) {
        formStatus.innerHTML = message;
        formStatus.className = type === 'success' ? 'status-success' : 'status-error';

        // El mensaje desaparece después de 5 segundos
        setTimeout(() => {
            formStatus.innerHTML = '';
            formStatus.className = '';
        }, 5000);
    }

    // --- Función de ayuda para validar email ---
    function isValidEmail(email) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }
});
