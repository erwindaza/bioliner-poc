// assets/js/script.js - Este es el código que corre en el navegador del visitante

document.addEventListener('DOMContentLoaded', () => {

    AOS.init({ duration: 800, once: true });

    // --- LÓGICA DEL ASISTENTE DE IA ---
    const generateBtn = document.getElementById('generate-btn');
    const projectIdea = document.getElementById('project-idea');
    const resultContainer = document.getElementById('ai-result-container');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const userIdea = projectIdea.value;
            if (!userIdea) {
                alert('Por favor, describe tu idea de proyecto.');
                return;
            }

            resultContainer.innerHTML = '<div class="loading-spinner"></div>';
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generando...';
            
            try {
                // Ahora llamamos a nuestro "puente seguro" en Vercel
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userIdea: userIdea }),
                });

                if (!response.ok) {
                    throw new Error('La respuesta del servidor no fue exitosa.');
                }

                const result = await response.json();
                
                if (result.text) {
                    resultContainer.innerHTML = `<div class="ai-result-box">${result.text.replace(/\n/g, '<br>')}</div>`;
                } else {
                    throw new Error('No se recibió texto de la IA.');
                }

            } catch (error) {
                console.error('Error al llamar al puente seguro:', error);
                resultContainer.innerHTML = `<div class="status-error">Hubo un problema al generar la descripción. Por favor, inténtalo de nuevo.</div>`;
            } finally {
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generar Descripción';
            }
        });
    }

    // --- LÓGICA DEL FORMULARIO DE CONTACTO ---
    const contactForm = document.getElementById('contact-form');
    // ... (El resto del código del formulario sigue igual y funciona perfecto)
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
                    formStatus.innerHTML = `<div class="status-success">¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</div>`;
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                         formStatus.innerHTML = `<div class="status-error">${data["errors"].map(error => error["message"]).join(", ")}</div>`
                    } else {
                        throw new Error(data.error || 'Hubo un error en el servidor.');
                    }
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                formStatus.innerHTML = `<div class="status-error">No se pudo enviar el mensaje. Por favor, inténtalo de nuevo.</div>`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
            }
        });
    }
});