// assets/js/script.js - Este es el código que corre en el navegador (Versión a Prueba de Balas)

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 800, once: true });

    // --- LÓGICA DEL ASISTENTE DE IA ---
    const generateBtn = document.getElementById('generate-btn');
    const projectIdea = document.getElementById('project-idea');
    const resultContainer = document.getElementById('ai-result-container');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const userIdea = projectIdea.value.trim();
            if (!userIdea) {
                alert('Por favor, describe tu idea de proyecto.');
                return;
            }

            resultContainer.innerHTML = '<div class="loading-spinner"></div>';
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generando...';
            
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userIdea: userIdea }),
                });
                
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Hubo un problema desconocido en el servidor.');
                }
                
                if (result.text) {
                    resultContainer.innerHTML = `<div class="ai-result-box">${result.text.replace(/\n/g, '<br>')}</div>`;
                } else {
                    throw new Error('No se recibió texto de la IA.');
                }

            } catch (error) {
                console.error('Error al llamar al endpoint /api/generate:', error);
                // Ahora mostramos el error específico que nos envió el servidor
                resultContainer.innerHTML = `<div class="status-error">Error: ${error.message}</div>`;
            } finally {
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generar Descripción';
            }
        });
    }

    // --- LÓGICA DEL FORMULARIO DE CONTACTO ---
    const contactForm = document.getElementById('contact-form');
    // ... El resto del código del formulario que ya funciona perfecto ...
    // ... (Lo he omitido aquí para no hacer el texto tan largo, pero tu código del form sigue igual)
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formspreeEndpoint = 'https://formspree.io/f/mpwjraow'; 
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            formStatus.innerHTML = '';
            const formData = new FormData(contactForm);
            try {
                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    formStatus.innerHTML = `<div class="status-success">¡Mensaje enviado con éxito!</div>`;
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                         formStatus.innerHTML = `<div class="status-error">${data["errors"].map(error => error["message"]).join(", ")}</div>`
                    } else {
                        throw new Error(data.error || 'Error en el servidor.');
                    }
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                formStatus.innerHTML = `<div class="status-error">No se pudo enviar el mensaje.</div>`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
            }
        });
    }
});