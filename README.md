# **Proyecto Bioliner \- Prueba de Concepto (PoC)**

Este repositorio contiene el código fuente y la documentación para la prueba de concepto del sitio web de **Bioliner**, una empresa especializada en soluciones de geosintéticos e ingeniería ambiental.

El sitio fue desarrollado siguiendo un flujo de trabajo moderno, priorizando la velocidad de carga, una experiencia de usuario profesional (UI/UX) y la integración de tecnologías de inteligencia artificial.

## **🚀 Tecnologías y Servicios Utilizados (Tech Stack)**

Este proyecto no es un sitio web estático simple; es una aplicación web moderna construida con las siguientes herramientas:

* **Frontend:**  
  * **HTML5:** Para la estructura semántica del contenido.  
  * **CSS3:** Para el diseño visual, con un enfoque en la adaptabilidad a cualquier dispositivo (diseño responsivo).  
  * **JavaScript (ES6+):** Para la interactividad, validación de formularios y la comunicación con APIs.  
* **Backend & Despliegue (CI/CD):**  
  * **Vercel Serverless Functions:** Se utiliza una función segura (api/generate.js) que se ejecuta en el servidor para llamar a la API de Gemini, protegiendo la clave de API.  
  * **Git y GitHub:** Para el control de versiones y como gatillo para el despliegue automático.  
  * **Vercel:** Plataforma de hosting y despliegue continuo. Se conecta directamente a GitHub para automatizar la publicación del sitio.  
* **APIs y Servicios de Terceros:**  
  * **Formspree:** Servicio que gestiona el envío de los formularios de contacto sin necesidad de un backend propio.  
  * **Google Gemini API:** Se utiliza para la funcionalidad del "Asistente de Proyectos IA".  
* **Librerías y Animaciones:**  
  * **AOS (Animate On Scroll):** Para añadir animaciones sutiles a los elementos.

## **📂 Estructura del Proyecto**

El proyecto está organizado de una manera limpia y escalable:

/  
├── api/  
│   └── generate.js       \# Función "Serverless" segura para la IA.  
├── assets/  
│   ├── css/  
│   │   └── style.css     \# Hoja de estilos principal.  
│   ├── js/  
│   │   └── script.js     \# Lógica del frontend.  
│   └── images/  
│       └── (imágenes)    \# Recursos gráficos.  
├── index.html            \# Archivo principal HTML.  
├── package.json          \# Configuración del proyecto para Vercel.  
└── README.md             \# Esta documentación.

\#\# ⚙️ Flujo de Trabajo: Desarrollo y Producción

Para garantizar la estabilidad del sitio en producción (bioliner.cl), utilizamos un flujo de trabajo basado en ramas de Git:

1. **Rama main (Producción):** Refleja el sitio en vivo. **Nunca se trabaja directamente sobre ella.**  
2. **Ramas de Desarrollo (ej. dev-nueva-seccion):** Se crea una nueva rama para cada cambio.  
3. **Despliegues de Vista Previa (Preview):** Al subir una rama de desarrollo a GitHub, Vercel crea automáticamente un entorno de pruebas con una URL única.  
4. **Pull Request (PR):** Una vez aprobados los cambios, se crea un "Pull Request" en GitHub para fusionar los cambios a main.  
5. **Merge a Producción:** Al aceptar el "merge", Vercel despliega automáticamente la nueva versión en el dominio de producción.

## **🔧 Mantenimiento y Actualizaciones**

Para hacer cualquier cambio futuro, sigue estos pasos desde la terminal:

1. **Sincroniza tu rama main local:**  
   git checkout main  
   git pull origin main

2. **Crea una nueva rama para tus cambios:**  
   git checkout \-b dev-nombre-del-cambio

3. **Realiza tus modificaciones** en los archivos.  
4. **Guarda y sube tus cambios** a la nueva rama:  
   git add .  
   git commit \-m "feat: Describo el cambio que hice"  
   git push origin dev-nombre-del-cambio  
