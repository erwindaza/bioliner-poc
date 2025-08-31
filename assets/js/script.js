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
                showStatusMessage('Por favor, completa todos los campos requeridos.', 'error', formStatus);
                return;
            }

            if (!isValidEmail(email)) {
                showStatusMessage('Por favor, introduce un email válido.', 'error', formStatus);
                return;
            }

            // --- Envío con Fetch API (método moderno AJAX) ---
            const formData = new FormData(this);
            const originalButtonText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Enviando...';
            submitBtn.disabled = true;

            fetch('https://formspree.io/f/TU_ENDPOINT_AQUI', { // <-- ¡¡¡IMPORTANTE!!!
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    showStatusMessage('¡Mensaje enviado con éxito! Gracias por contactarnos.', 'success', formStatus);
                    contactForm.reset(); // Limpiamos el formulario
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                             showStatusMessage(data["errors"].map(error => error["message"]).join(", "), 'error', formStatus);
                        } else {
                             showStatusMessage('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error', formStatus);
                        }
                    })
                }
            }).catch(error => {
                showStatusMessage('Hubo un problema de red. Por favor, revisa tu conexión.', 'error', formStatus);
            }).finally(() => {
                submitBtn.innerHTML = originalButtonText;
                submitBtn.disabled = false;
            });
        });
    }

    // --- LÓGICA DEL ASISTENTE CON GEMINI API ---
    const generateBtn = document.getElementById('generate-btn');
    const projectIdeaInput = document.getElementById('project-idea');
    const aiResultContainer = document.getElementById('ai-result-container');

    if (generateBtn) {
        generateBtn.addEventListener('click', async function() {
            const userPrompt = projectIdeaInput.value.trim();
            if (userPrompt === '') {
                showStatusMessage('Por favor, describe tu idea de proyecto.', 'error', aiResultContainer);
                return;
            }

            aiResultContainer.innerHTML = '<div class="loading-spinner"></div>';
            const originalButtonText = generateBtn.innerHTML;
            generateBtn.innerHTML = 'Generando...';
            generateBtn.disabled = true;

            const apiKey = ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            const systemPrompt = "Actúa como un ingeniero experto en geosintéticos de la empresa Bioliner. Responde de forma concisa y profesional en un párrafo. El usuario te dará una idea de proyecto, y tú debes generar un breve párrafo describiendo el alcance o las consideraciones técnicas clave para ese proyecto en Chile, usando un lenguaje técnico pero comprensible.";

            const payload = {
                contents: [{ parts: [{ text: userPrompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) { throw new Error(`Error en la API: ${response.statusText}`); }

                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    const generatedText = candidate.content.parts[0].text;
                    aiResultContainer.innerHTML = `<div class="ai-result-box"><p>${generatedText.replace(/\n/g, '<br>')}</p></div>`;
                } else {
                    throw new Error('No se recibió una respuesta válida de la IA.');
                }

            } catch (error) {
                console.error("Error al llamar a la API de Gemini:", error);
                showStatusMessage('Hubo un error al contactar al asistente de IA. Por favor, inténtalo más tarde.', 'error', aiResultContainer);
            } finally {
                generateBtn.innerHTML = originalButtonText;
                generateBtn.disabled = false;
            }
        });
    }

    function showStatusMessage(message, type, container) {
        if (!container) return;
        container.innerHTML = `<div class="${type === 'success' ? 'status-success' : 'status-error'}">${message}</div>`;
        setTimeout(() => {
            if (container.firstChild && container.firstChild.classList.contains(`status-${type}`)) {
                 container.innerHTML = '';
            }
        }, 5000);
    }
    
    function isValidEmail(email) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }
});

