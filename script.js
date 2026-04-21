// Firebase se carga mediante CDN en el HTML (versión compatible)
// Las funciones están disponibles globalmente a través de firebase

// 2. Tu configuración (Pega aquí lo que copiaste de la consola)
const firebaseConfig = {
    apiKey: "AIzaSyB96rLiwmmMzz_874PLEiBfyNifZy31F6o",
    authDomain: "mega-game318.firebaseapp.com",
    projectId: "mega-game318",
    storageBucket: "mega-game318.firebasestorage.app",
    messagingSenderId: "244006968737",
    appId: "1:244006968737:web:f71b9fe1e3437a6930bfe0"
    /*
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "...",
    appId: "..."
    */
};

// 3. Inicializar Firebase y los servicios (versión compatible)
let app, db, storage;
try {
    app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    storage = firebase.storage();
    console.log("Firebase inicializado correctamente");
} catch (error) {
    console.error("Error al inicializar Firebase:", error);
    // Continuar sin Firebase para que las tarjetas de juegos se muestren
}



let paqueteSeleccionado = null;

let metodoSeleccionado = null;
const juegos = [
    {
        id: "ff",
        nombre: "Free Fire",
        descripcion: "Consigue diamantes para comprar el Pase Élite, aspectos de armas y personajes exclusivos.",
        imagen: "img/ff.png",
        categoria: "Popular",
        paquetes: [
            { cant: 100, precio: 1.20 },
            { cant: 310, precio: 3.50 },
            { cant: 520, precio: 5.80 },
            { cant: 100, precio: 1.20 },
            { cant: 310, precio: 3.50 },
            { cant: 520, precio: 5.80 }
        ]
    },
    {
        id: "mlbb",
        nombre: "Mobile Legends",
        descripcion: "Consigue diamantes para comprar el Pase Élite, aspectos de armas y personajes exclusivos.",
        imagen: "img/mlbb.png",
        categoria: "Popular",
        /*color: '#f3ae1a', */
        /*requiereZona: true, */
        paquetes: [
            { cant: 50, precio: 1.10 },
            { cant: 50, precio: 1.10 },
            { cant: 100, precio: 1.20 },
            { cant: 310, precio: 3.50 },
            { cant: 520, precio: 5.80 }
        ]
    },
    {
        id: "genshin",
        nombre: "Genshin Impact",
        descripcion: "Consigue diamantes para comprar el Pase Élite, aspectos de armas y personajes exclusivos.",
        imagen: "img/gs.png",
        categoria: "Popular",
        paquetes: [
            { cant: 100, precio: 1.20 },
            { cant: 310, precio: 3.50 },
            { cant: 520, precio: 5.80 },
            { cant: 100, precio: 1.20 },
            { cant: 310, precio: 3.50 },
            { cant: 520, precio: 5.80 }
        ]
    }
    // ... otros juegos,
    /*
    { 
        nombre: "Mobile Legends", 
        id: "mlbb", 
        imagen: "img/ml.png", // <--- O USAS UN LINK DIRECTO
        categoria: "Popular" 
    },
   
    {
        nombre: "Genshin Impact",
        id: "genshin",
        imagen: "img/gs.png",
        categoria: "Popular"
    }
    */
];

function filterGames() {
    let input = document.getElementById('gameSearch').value.toLowerCase();
    let suggestions = document.getElementById('searchSuggestions');
    suggestions.innerHTML = "";

    if (input.length > 0) {
        const filtered = juegos.filter(j => j.nombre.toLowerCase().startsWith(input));
        filtered.forEach(j => {
            let div = document.createElement("div");
            div.innerHTML = j.nombre;
            div.onclick = () => irAlJuego(j.id);
            suggestions.appendChild(div);
        });
        suggestions.style.display = "block";
    } else {
        suggestions.style.display = "none";
    }
}

/* codigo para el grid de juegos */
function renderizarJuegos() {
    console.log("Iniciando renderizado de juegos...");
    const contenedor = document.getElementById("gamesGrid");
    console.log("Contenedor gamesGrid:", contenedor);
    
    if (!contenedor) {
        console.error("No se encontró el elemento gamesGrid");
        return;
    }

    contenedor.innerHTML = ""; // Limpiamos antes de empezar
    console.log("Juegos disponibles:", juegos.length);

    juegos.forEach((juego, index) => {
        console.log(`Creando tarjeta ${index + 1}: ${juego.nombre}`);
        try {
            const card = document.createElement("div");
            card.className = "game-card"; // Esta clase ya tiene el CSS de resplandor

            card.innerHTML = `
                <img src="${juego.imagen}" alt="${juego.nombre}">
                <div class="game-info">
                    <h3>${juego.nombre}</h3>
                </div>
            `;

            // Al hacer clic, enviamos al usuario al formulario de ese juego
            card.onclick = () => abrirFormulario(juego.id);

            contenedor.appendChild(card);
            console.log(`Tarjeta ${juego.nombre} agregada exitosamente`);
        } catch (error) {
            console.error(`Error al crear tarjeta para ${juego.nombre}:`, error);
        }
    });
    
    console.log("Renderizado completado");
}

// Ejecutar cuando la página cargue
document.addEventListener("DOMContentLoaded", renderizarJuegos);


/* codigo para el carrusel */
let currentSlide = 0;

function moveSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const container = document.querySelector('.slides-container');
    const totalSlides = slides.length;

    currentSlide += direction;

    // Loop infinito
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;

    // El truco del movimiento: desplazamos el contenedor en porcentaje
    container.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Movimiento automático cada 5 segundos
let autoPlay = setInterval(() => moveSlide(1), 5000);

// Detener el auto-movimiento si el usuario hace clic manualmente
function manualMove(dir) {
    clearInterval(autoPlay); // Detenemos el reloj
    moveSlide(dir);
    autoPlay = setInterval(() => moveSlide(1), 5000); // Lo reiniciamos
}


/* codigo para el menu burger */
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');

    // Alternar clase active
    menu.classList.toggle('active');
    overlay.classList.toggle('active');

    // Bloquear scroll del body cuando el menú esté abierto
    if (menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

/* funcion para el buscador */
// Asegúrate de que tu array de juegos esté definido arriba
const inputBusqueda = document.getElementById('gameSearch');
const panelSugerencias = document.getElementById('searchSuggestions');

inputBusqueda.addEventListener('input', () => {
    const texto = inputBusqueda.value.toLowerCase().trim();

    // 1. Limpiar panel si no hay texto
    if (texto.length === 0) {
        panelSugerencias.style.display = 'none';
        return;
    }

    // 2. Filtrar juegos que coincidan
    const coincidencias = juegos.filter(juego =>
        juego.nombre.toLowerCase().includes(texto)
    );

    // 3. Renderizar resultados
    if (coincidencias.length > 0) {
        panelSugerencias.innerHTML = coincidencias.map(juego => `
            <div class="suggestion-item" onclick="seleccionarJuego('${juego.id}')">
                <img src="${juego.imagen}" alt="${juego.nombre}">
                <span>${juego.nombre}</span>
            </div>
        `).join('');
        panelSugerencias.style.display = 'block';
    } else {
        panelSugerencias.innerHTML = `<div class="no-results">No se encontraron juegos</div>`;
        panelSugerencias.style.display = 'block';
    }
});

/*
// Función para manejar el clic en una sugerencia
function seleccionarJuego(id) {
    console.log("Navegando al juego:", id);
    inputBusqueda.value = ""; // Limpiar buscador
    panelSugerencias.style.display = 'none';
    abrirFormulario(id); // La función que diseñaremos para los paquetes
}
*/

function seleccionarJuego(id) {
    console.log("Navegando al juego:", id);
    inputBusqueda.value = "";
    panelSugerencias.style.display = 'none';

    // Guardamos el nombre del juego globalmente para las validaciones
    juegoSeleccionado = id;

    // 1. Resetear visibilidad (Ocultar ambos primero)
    document.getElementById('extra-ml').classList.add('hidden');
    document.getElementById('extra-genshin').classList.add('hidden');

    // 2. Mostrar según el juego seleccionado
    if (id === "mlbb") {
        document.getElementById('extra-ml').classList.remove('hidden');
    } else if (id === "genshin") {
        document.getElementById('extra-genshin').classList.remove('hidden');
    }

    abrirFormulario(id);
}

// Cerrar sugerencias si haces clic fuera del buscador
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
        panelSugerencias.style.display = 'none';
    }
});


/*logica para los modales*/
const contenidosModales = {
    'modal-tutorial': `
        <h2 style="color:var(--accent)">📖 ¿Cómo recargar?</h2>
        <br>
        <p>1. Selecciona tu juego favorito desde el inicio.</p>
        <p>2. Ingresa tu ID de jugador (revisa que sea correcto).</p>
        <p>3. Elige el paquete de diamantes o créditos.</p>
        <p>4. Selecciona tu método de pago (QR o Tigo Money).</p>
        <p>5. Sube tu comprobante y ¡listo! Procesamos en 5-15 min.</p>
    `,
    'modal-terminos': `
        <h2 style="color:var(--accent)">⚖️ Términos y Condiciones</h2>
        <br>
        <p>Al usar Elite Games, aceptas que:</p>
        <ul>
            <li>No nos hacemos responsables por IDs mal ingresados.</li>
            <li>Las recargas son finales y no admiten reembolsos una vez procesadas.</li>
            <li>El tiempo de entrega puede variar según la saturación del servidor.</li>
        </ul>
    `
};

function openModal(tipo) {
    const container = document.getElementById('modal-container');
    const body = document.getElementById('modal-body');

    body.innerHTML = contenidosModales[tipo] || "Contenido no encontrado";
    container.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Bloquear scroll
}

function closeModal(event) {
    // Cerrar si hace clic en la X o fuera del cuadro blanco
    if (!event || event.target.id === 'modal-container') {
        document.getElementById('modal-container').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

//funcion para abrir el formulrio paquetes
function abrirFormulario(idJuego) {
    console.log("abrirFormulario llamado con idJuego:", idJuego);
    
    // 1. Resetear visibilidad de campos adicionales
    document.getElementById('id-zona').classList.add('hidden');
    document.getElementById('region-genshin').classList.add('hidden');

    // 2. Mostrar campos según el juego seleccionado
    if (idJuego === "mlbb") {
        document.getElementById('id-zona').classList.remove('hidden');
    } else if (idJuego === "genshin") {
        document.getElementById('region-genshin').classList.remove('hidden');
    }

    // 3. Buscar datos
    const juegoEncontrado = juegos.find(j => j.id === idJuego);
    console.log("Juego encontrado:", juegoEncontrado);
    if (!juegoEncontrado) {
        console.error("No se encontró el juego con id:", idJuego);
        return;
    }

    // 4. Llenar el formulario
    document.getElementById("img-juego-checkout").src = juegoEncontrado.imagen;
    document.getElementById("nombre-juego-checkout").innerText = juegoEncontrado.nombre;
    document.getElementById("desc-juego-checkout").innerText = juegoEncontrado.descripcion;

    // 3. Generar paquetes
    const contenedorPaquetes = document.getElementById("grid-paquetes");
    contenedorPaquetes.innerHTML = "";
    juegoEncontrado.paquetes.forEach(pack => {
        const div = document.createElement("div");
        div.className = "package-item";
        div.innerHTML = `
            <div class="pack-icon"><i class="fas fa-gem"></i></div>
            <div class="pack-amount">${pack.cant} Diamantes</div>
            <div class="pack-price">$${pack.precio.toFixed(2)}</div>
        `;
        div.onclick = () => seleccionarPack(div, pack.cant, pack.precio);
        contenedorPaquetes.appendChild(div);
    });

    // 4. EL INTERCAMBIO (La clave del éxito)
    console.log("Cambiando vistas: ocultando vista-inicio, mostrando vista-paquetes");
    document.getElementById("vista-inicio").classList.add("hidden");
    document.getElementById("vista-paquetes").classList.remove("hidden");
    console.log("Vistas cambiadas");

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function volverAlInicio() {
    document.getElementById("vista-paquetes").classList.add("hidden");
    document.getElementById("vista-inicio").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


/*
function abrirFormulario(idJuego) {
    // 1. Buscamos el juego
    const juegoEncontrado = juegos.find(j => j.id === idJuego);
    if (!juegoEncontrado) return;

    // 2. Referencias a las secciones (Asegúrate de que estos IDs existan en tu HTML)
    const vistaInicio = document.getElementById("vista-inicio");
    const vistaPaquetes = document.getElementById("vista-paquetes");

    if (vistaInicio && vistaPaquetes) {
        // ACTUALIZAMOS DATOS
        document.getElementById("img-juego-checkout").src = juegoEncontrado.imagen;
        document.getElementById("nombre-juego-checkout").innerText = juegoEncontrado.nombre;
        document.getElementById("desc-juego-checkout").innerText = juegoEncontrado.descripcion;

        // GENERAMOS PAQUETES
        const contenedorPaquetes = document.getElementById("grid-paquetes");
        contenedorPaquetes.innerHTML = ""; 

        juegoEncontrado.paquetes.forEach(pack => {
            const div = document.createElement("div");
            div.className = "package-item";
            div.innerHTML = `
                <div class="pack-icon"><i class="fas fa-gem"></i></div>
                <div class="pack-amount">${pack.cant} Diamantes</div>
                <div class="pack-price">$${pack.precio.toFixed(2)}</div>
            `;
            div.onclick = () => seleccionarPack(div, pack.cant, pack.precio);
            contenedorPaquetes.appendChild(div);
        });

        // INTERCAMBIO VISUAL (Solo estas dos líneas son necesarias)
        vistaInicio.classList.add("hidden");    // Esconde banner y cards
        vistaPaquetes.classList.remove("hidden"); // Muestra el formulario de compra
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error("Error: Revisa que tengas id='vista-inicio' e id='vista-paquetes' en tu HTML");
    }
}
*/

/*
//funcion para abrir el formulrio paquetes
function abrirFormulario(idJuego) {
    // 1. Buscar los datos del juego por su ID
    const juegoEncontrado = juegos.find(j => j.id === idJuego);
    if (!juegoEncontrado) return;

    // 2. Actualizar la parte visual (Sidebar Izquierda)
    document.getElementById("img-juego-checkout").src = juegoEncontrado.imagen;
    document.getElementById("nombre-juego-checkout").innerText = juegoEncontrado.nombre;
    document.getElementById("desc-juego-checkout").innerText = juegoEncontrado.descripcion;


// 3. EL INTERCAMBIO VISUAL (Aquí es donde fallaba)
    const inicio = document.getElementById("vista-inicio");
    const checkout = document.getElementById("vista-paquetes");

    if (inicio && checkout) {
        inicio.classList.add("hidden");    // Apaga los juegos
        checkout.classList.remove("hidden"); // Enciende el formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error("No se encontraron los IDs de las secciones en el HTML");
    }


    // 3. Generar los paquetes (Grid Derecha)
    const contenedorPaquetes = document.getElementById("grid-paquetes");
    contenedorPaquetes.innerHTML = ""; // Limpiar paquetes anteriores

    juegoEncontrado.paquetes.forEach(pack => {
        const div = document.createElement("div");
        div.className = "package-item";
        div.innerHTML = `
            <div class="pack-icon"><i class="fas fa-gem"></i></div>
            <div class="pack-amount">${pack.cant} Diamantes</div>
            <div class="pack-price">$${pack.precio.toFixed(2)}</div>
        `;
        
        // Evento al hacer clic en el paquete
        div.onclick = () => seleccionarPack(div, pack.cant, pack.precio);
        
        contenedorPaquetes.appendChild(div);
    });

    // 4. Cambiar de vista (Ocultar inicio, mostrar checkout)
    document.querySelector(".content-wrapper").classList.add("hidden");
    document.getElementById("vista-paquetes").classList.remove("hidden");
    
    // Hacer scroll al inicio automáticamente
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
*/

//Finalmente, necesitamos que el usuario sepa qué paquete eligió y que el total se actualice en tiempo real.
//let paqueteSeleccionado = null;

function seleccionarPack(elemento, cantidad, precio) {
    // Quitar clase 'selected' de todos los paquetes
    const todos = document.querySelectorAll('.package-item');
    todos.forEach(p => p.classList.remove('selected'));

    // Añadir clase al seleccionado
    elemento.classList.add('selected');

    // Guardar datos en una variable global para el pago final
    paqueteSeleccionado = { cantidad, precio };

    // Actualizar el texto del total
    document.getElementById("total-pago").innerText = `$${precio.toFixed(2)}`;
}
//funcion para volver al inicio
function volverAlInicio() {
    // Proceso inverso: Escondemos formulario, mostramos inicio
    document.getElementById("vista-paquetes").classList.add("hidden");
    document.getElementById("vista-inicio").classList.remove("hidden");

    // Resetear el scroll para que aparezca arriba de todo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

//Lógica de Interacción (JS)

//let metodoSeleccionado = null;

function seleccionarMetodo(metodo) {
    metodoSeleccionado = metodo;

    // 1. Manejo visual de las tarjetas (Selección)
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('selected-method');
    });

    // Usamos event para marcar la tarjeta actual
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('selected-method');
    }

    // 2. Referencias a los contenedores
    const details = document.getElementById('payment-details');
    // Ya no buscamos 'receipt-upload' aquí para evitar errores si lo borraste del HTML

    if (details) {
        details.classList.remove('hidden');

        if (metodo === 'qr') {
            details.innerHTML = `
                <p>Escanea el código para pagar <strong>$${paqueteSeleccionado.precio.toFixed(2)}</strong></p>
                <div class="qr-wrapper">
                    <a href="img/qr.png" 
                       download="Pago_EliteGames.png" 
                       id="btn-descargar-qr"
                       onclick="feedbackDescarga()"
                       class="btn-qr-download">
                        <i class="fas fa-download" style="pointer-events: none;"></i>
                    </a>
                    <img src="img/qr.png" class="qr-image">
                </div>
                <p style="font-size: 0.9rem; color: gray; margin-top: 10px;">Titular: Elite Games S.R.L</p>
            `;
        } else if (metodo === 'tigo') {
            details.innerHTML = `
                <p>Transfiere a nuestra cuenta Tigo Money: <strong>$${paqueteSeleccionado.precio.toFixed(2)}</strong></p>
                <div class="copy-container">
                    <h3 id="num-tigo" style="color: var(--accent); margin: 0;">78914558</h3>
                    <button id="btn-copiar-tigo" onclick="copiarTexto('78914558')" class="btn-copy">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                </div>
                <p style="font-size: 0.9rem; color: gray; margin-top: 10px;">Titular: Elite Games S.R.L</p>
                <div class="input-group" style="margin-top: 15px;">
                    <input type="number" id="telefono-tigo-cliente" placeholder="Tu número de Tigo Money" style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                </div>
            `;
        }
    }
}


/* funciona
function seleccionarMetodo(metodo) {
    metodoSeleccionado = metodo;

    // Quitar clase selected de todas las tarjetas de método
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('selected-method');
    });

    // Añadir clase a la seleccionada (usamos event.currentTarget para capturar el div)
    const cardElegida = event.currentTarget;
    cardElegida.classList.add('selected-method');

    // ... (resto de tu lógica para mostrar QR o Tigo Money) ...
    const details = document.getElementById('payment-details');
    const receipt = document.getElementById('receipt-upload');

    details.classList.remove('hidden');
    receipt.classList.remove('hidden');

    if (metodo === 'qr') {
        details.innerHTML = `
        <p>Escanea el código para pagar <strong>$${paqueteSeleccionado.precio}</strong></p>
        <div class="qr-wrapper">
            <a href="img/qr.png" 
               download="Pago_EliteGames.png" 
               id="btn-descargar-qr"
               onclick="feedbackDescarga()"
               class="btn-qr-download">
                <i class="fas fa-download" style="pointer-events: none;"></i>
            </a>
            <img src="img/qr.png" class="qr-image">
        </div>
        <p style="font-size: 0.9rem; color: gray;">Titular: Elite Games S.R.L</p>
    `;
    } else if (metodo === 'tigo') {
        details.innerHTML = `
        <p>Transfiere a nuestra cuenta Tigo Money: <strong>$${paqueteSeleccionado.precio}</strong></p>
        <div class="copy-container">
            <h3 id="num-tigo" style="color: var(--accent); margin: 0;">78914558</h3>
            <button id="btn-copiar-tigo" onclick="copiarTexto('78914558')" class="btn-copy">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            </button>
        </div>
        <p style="font-size: 0.9rem; color: gray;">Titular: Elite Games S.R.L</p>

        
    `;
    }
}
*/

/*
//Esta función maneja qué mostrar según el botón que presione el usuario.
function seleccionarMetodo(metodo) {
    const details = document.getElementById('payment-details');
    const receipt = document.getElementById('receipt-upload');
    
    details.classList.remove('hidden');
    receipt.classList.remove('hidden');

    if (metodo === 'qr') {
        details.innerHTML = `
            <p>Escanea el código para pagar <strong>$${paqueteSeleccionado.precio}</strong></p>
            <img src="img/qr.png" class="qr-image" alt="QR de Pago">
            <p style="font-size: 0.8rem; color: gray;">Titular: Elite Games S.R.L</p>
        `;
    } else if (metodo === 'tigo') {
        details.innerHTML = `
            <p>Transfiere a nuestra cuenta Tigo Money:</p>
            <h3 style="color: var(--accent); margin: 10px 0;">78914558</h3>

            <div class="input-group">
                <input type="number" id="telefono-tigo" placeholder="Tu número de Tigo Money">
            </div>

            //nuevo que yo lo quite , respaldo
            <div class="input-group" style="margin-top: 15px;">
            <input type="number" id="telefono-tigo" placeholder="Tu número de Tigo Money">               
        </div>
        `;
    }
}
*/

// Para mostrar el nombre del archivo seleccionado
function validarArchivo(input) {
    const fileName = input.files[0] ? input.files[0].name : "Seleccionar imagen";
    document.getElementById('file-name').innerText = fileName;
}


// fincion detalle de compra

async function procesarPedidoFinal() {
    console.log("Iniciando procesarPedidoFinal...");
    const btnConfirmar = document.querySelector('.btn-primario');
    const fileInput = document.getElementById('comprobante'); 
    
    // Validación de seguridad: Verificar si hay imagen
    if (!fileInput || !fileInput.files[0]) {
        console.error("No se encontró archivo de comprobante");
        alert("Por favor, sube la captura de tu comprobante de pago.");
        return;
    }

    // Configuración de tu nuevo Bot (Entorno V3)
    const NUEVO_TOKEN = "TU_NUEVO_TOKEN_AQUI"; 
    const NUEVO_CHAT_ID = "TU_CHAT_ID_AQUI"; 

    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    btnConfirmar.disabled = true;

    try {
        const imagen = fileInput.files[0];
        const idJugador = document.getElementById('id-jugador').value;
        const nick = document.getElementById('nick-jugador').value || "No indicado";
        const juego = document.getElementById('nombre-juego-checkout').innerText;
        const paquete = paqueteSeleccionado.cantidad + " Diamantes";
        const metodo = metodoSeleccionado === 'qr' ? "Simple QR" : "Tigo Money";
        const total = document.getElementById('total-pago').innerText;
        
        // Datos extras para juegos específicos
        const zonaML = document.getElementById('id-zona').value;
        const regionGenshin = document.getElementById('region-genshin').value;

        // --- PASO 1: SUBIR IMAGEN A FIREBASE STORAGE ---
        console.log("Iniciando subida a Storage...");
        const nombreArchivo = `${Date.now()}_${idJugador}.jpg`;
        console.log("Nombre de archivo:", nombreArchivo);
        
        if (!storage) {
            console.error("Storage no está inicializado");
            throw new Error("Storage no disponible");
        }
        
        const storageRef = storage.ref('comprobantes/' + nombreArchivo);
        console.log("Referencia de Storage creada");
        
        const snapshot = await storageRef.put(imagen);
        console.log("Imagen subida a Storage");
        
        const urlImagen = await snapshot.ref.getDownloadURL();
        console.log("URL de imagen obtenida:", urlImagen);

        // --- PASO 2: GUARDAR DATOS EN FIRESTORE ---
        console.log("Iniciando guardado en Firestore...");
        
        if (!db) {
            console.error("Firestore no está inicializado");
            throw new Error("Firestore no disponible");
        }
        
        const pedidoData = {
            juego: juego,
            idJugador: idJugador,
            zona: zonaML || null,
            region: regionGenshin || null,
            nick: nick,
            paquete: paquete,
            metodo: metodo,
            total: total,
            comprobanteUrl: urlImagen,
            estado: "Pendiente",
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        console.log("Datos a guardar:", pedidoData);

        const docRef = await db.collection("pedidos").add(pedidoData);
        console.log("Guardado en Firestore con ID:", docRef.id);

        // --- PASO 3: ENVIAR A TELEGRAM ---
        let mensaje = `🚀 *PEDIDO V3 - ELITE GAMES* 🚀\n\n`;
        mensaje += `🎮 *Juego:* ${juego}\n`;
        mensaje += `🆔 *ID:* \`${idJugador}\`\n`;
        if (zonaML) mensaje += `🌐 *Zona:* ${zonaML}\n`;
        if (regionGenshin) mensaje += `📍 *Región:* ${regionGenshin}\n`;
        mensaje += `👤 *Nick:* ${nick}\n`;
        mensaje += `💎 *Paquete:* ${paquete}\n`;
        mensaje += `💳 *Pago:* ${metodo}\n`;
        mensaje += `💰 *Total:* ${total}\n\n`;
        mensaje += `🔗 [Ver Comprobante en la Nube](${urlImagen})`;

        const formData = new FormData();
        formData.append('chat_id', NUEVO_CHAT_ID);
        formData.append('photo', imagen);
        formData.append('caption', mensaje);
        formData.append('parse_mode', 'Markdown');

        const responseTelegram = await fetch(`https://api.telegram.org/bot${NUEVO_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });

        if (!responseTelegram.ok) throw new Error("Error al enviar a Telegram");

        // --- PASO 4: CAMBIO VISUAL A "ÉXITO" ---
        document.getElementById('confirm-titulo').innerText = "¡Pedido Recibido!";
        const box = document.getElementById('status-box');
        box.className = "status-box success";
        
        // Ajuste para tus IDs de iconos específicos
        const icono = document.getElementById('status-icon');
        if(icono) icono.className = "fas fa-check-circle";
        
        const texto = document.getElementById('status-text');
        if(texto) texto.innerText = "Su recarga ha sido registrada en nuestra base de datos y enviada al soporte.";

        document.getElementById('confirm-buttons').innerHTML = `
            <button class="btn-secundario" onclick="otraRecarga()">Otra Recarga</button>
            <button class="btn-primario" onclick="finalizarTodo()">Finalizar</button>
        `;

    } catch (error) {
        console.error("Error completo:", error);
        alert("Hubo un error al procesar el pedido. Por favor, verifica tu conexión o el comprobante.");
        btnConfirmar.innerHTML = "Confirmar y Enviar";
        btnConfirmar.disabled = false;
    }
}


/*
async function procesarPedidoFinal() {
    const btnConfirmar = document.querySelector('.btn-primario');
    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnConfirmar.disabled = true;

    try {
        // 1. Aquí iría tu lógica de Firebase (Storage + Firestore)
        // await subirPedidoAFirebase(datosGlobales);

        // 2. Aquí llamarías a tu bot de Telegram
        // await enviarATelegram(datosGlobales);

        // 3. CAMBIO VISUAL A "ÉXITO"
        document.getElementById('confirm-titulo').innerText = "¡Pedido Recibido!";

        const box = document.getElementById('status-box');
        box.className = "status-box success";
        document.getElementById('status-icon').className = "fas fa-check-circle";
        document.getElementById('status-text').innerText = "Su recarga ha sido registrada. En breve será procesada.";

        // 4. CAMBIO DE BOTONES
        document.getElementById('confirm-buttons').innerHTML = `
            <button class="btn-secundario" onclick="otraRecarga()">Otra Recarga</button>
            <button class="btn-primario" onclick="finalizarTodo()">Finalizar</button>
        `;

    } catch (error) {
        alert("Hubo un error al procesar. Reintente.");
        btnConfirmar.disabled = false;
    }
}
*/
function otraRecarga() {
    closeModal(); // Cierra el modal de éxito
    // El usuario ya está en vista-paquetes, solo limpiamos los inputs
    document.getElementById('id-jugador').value = "";
    document.getElementById('nick-jugador').value = "";
}

function finalizarTodo() {
    closeModal();
    volverAlInicio(); // La función que creamos antes para regresar a los juegos
}

//funcion continuar pago

function continuarAPago() {
    const id = document.getElementById('id-jugador').value;
    if (!id) return alert("❌ Ingresa tu ID");
    if (!paqueteSeleccionado) return alert("❌ Selecciona un paquete");
    if (!metodoSeleccionado) return alert("❌ Selecciona un método de pago");

    // Llenar datos de texto en el modal...
    document.getElementById('conf-juego').innerText = document.getElementById('nombre-juego-checkout').innerText;
    document.getElementById('conf-id').innerText = id;
    document.getElementById('conf-nick').innerText = document.getElementById('nick-jugador').value || "No indicado";
    document.getElementById('conf-pack').innerText = paqueteSeleccionado.cantidad + " Diamantes";
    document.getElementById('conf-metodo').innerText = metodoSeleccionado === 'qr' ? "Simple QR" : "Tigo Money";
    document.getElementById('conf-total').innerText = document.getElementById('total-pago').innerText;

    // INYECTAR EL COMPROBANTE CON ESTILO DENTRO DEL STATUS-BOX
    const statusBox = document.getElementById('status-box');
    statusBox.className = "status-box-upload"; // Nueva clase para el modal
    statusBox.innerHTML = `
        <div class="receipt-modal-wrapper">
            <p class="upload-title">Paso Final: Sube tu comprobante</p>
            <label class="file-upload-styled">
                <input type="file" id="comprobante" accept="image/*" onchange="actualizarNombreArchivo(this)">
                <i class="fas fa-cloud-upload-alt"></i>
                <span id="file-name-modal">Seleccionar captura de pago</span>
            </label>
        </div>
    `;

    openModal();
}

// Función para que el nombre del archivo se vea en el modal
function actualizarNombreArchivo(input) {
    const fileName = input.files[0] ? input.files[0].name : "Seleccionar captura de pago";
    document.getElementById('file-name-modal').innerText = fileName;
}


/*funciona
function continuarAPago() {
    const id = document.getElementById('id-jugador').value;

    // Validaciones
    if (!id) return alert("❌ Por favor, ingresa tu ID de jugador.");
    if (!paqueteSeleccionado) return alert("❌ Selecciona un paquete de diamantes.");
    if (!metodoSeleccionado) return alert("❌ Elige un método de pago.");

    // 1. Obtener el texto legible del método
    let nombreMetodo = "";
    if (metodoSeleccionado === 'qr') nombreMetodo = "Simple QR";
    if (metodoSeleccionado === 'tigo') nombreMetodo = "Tigo Money";

    // 2. Insertarlo en el modal de confirmación
    document.getElementById('conf-metodo').innerText = nombreMetodo;


    // Llenar datos en el modal de confirmación
    document.getElementById('conf-juego').innerText = document.getElementById('nombre-juego-checkout').innerText;
    document.getElementById('conf-id').innerText = id;
    document.getElementById('conf-nick').innerText = document.getElementById('nick-jugador').value || "No indicado";
    document.getElementById('conf-pack').innerText = paqueteSeleccionado.cantidad + " Diamantes";
    document.getElementById('conf-metodo').innerText = metodoSeleccionado === 'qr' ? "Simple QR" : "Tigo Money";
    document.getElementById('conf-total').innerText = document.getElementById('total-pago').innerText;


    // MOVER SUBIDA DE COMPROBANTE AL MODAL
    const statusBox = document.getElementById('status-box');
    statusBox.innerHTML = `
        <div class="receipt-upload-modal">
            <p><i class="fas fa-file-upload"></i> Sube tu comprobante de pago:</p>
            <input type="file" id="comprobante-final" accept="image/*" class="custom-file-input">
        </div>
    `;
    statusBox.className = "status-box-simple"; // Quitamos el estilo de advertencia

    openModal();
}
*/

function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        // Buscamos el botón por su ID
        const btn = document.getElementById('btn-copiar-tigo');

        if (btn) {
            const originalHTML = btn.innerHTML;

            // Feedback visual
            btn.innerHTML = '<i class="fas fa-check" style="color: #22c55e;"></i>';
            btn.style.borderColor = "#22c55e";

            // Volver al estado original
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.borderColor = "rgba(251, 191, 36, 0.3)";
            }, 2000);
        }

        console.log("Número copiado: " + texto);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

function feedbackDescarga() {
    const btn = document.getElementById('btn-descargar-qr');

    if (btn) {
        const originalHTML = btn.innerHTML;

        // Cambio visual a check verde
        btn.innerHTML = '<i class="fas fa-check" style="color: #000;"></i>';
        btn.style.background = "#22c55e"; // Cambiamos el fondo a verde éxito

        // Volver al estado original (Dorado)
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = "#fbbf24";
        }, 2000);
    }
}

/*
//boton confirmar y enviar
async function procesarPedidoFinal() {
    const btnConfirmar = document.querySelector('#confirm-buttons .btn-primario');
    const fileInput = document.getElementById('comprobante'); // El que inyectamos en el modal
    
    // 1. Validación: ¿Subió la foto?
    if (!fileInput || !fileInput.files[0]) {
        alert("❌ Por favor, sube la captura de tu comprobante de pago antes de continuar.");
        return;
    }

    // 2. Efecto de carga en el botón
    const textoOriginal = btnConfirmar.innerHTML;
    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnConfirmar.disabled = true;

    try {
        // --- AQUÍ CONECTAREMOS FIREBASE Y TELEGRAM LUEGO ---
        // Por ahora, simulamos una espera de 2 segundos
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. CAMBIO VISUAL A ÉXITO
        document.getElementById('confirm-titulo').innerText = "¡Pedido Recibido!";
        
        const box = document.getElementById('status-box');
        box.className = "status-box success"; // Clase que definimos antes
        box.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p><strong>¡Tu recarga está en camino!</strong><br>
                Hemos recibido tus datos. En unos minutos verás el cambio en tu historial.</p>
            </div>
        `;

        // 4. CAMBIO DE BOTONES FINAL
        document.getElementById('confirm-buttons').innerHTML = `
            <button class="btn-secundario" onclick="otraRecarga()">Nueva Recarga</button>
            <button class="btn-primario" onclick="finalizarTodo()">Finalizar</button>
        `;

    } catch (error) {
        console.error("Error detallado:", error);
        alert("Hubo un error al procesar. Reintente.");
        btnConfirmar.innerHTML = textoOriginal;
        btnConfirmar.disabled = false;
    }
}
*/

/*
async function procesarPedidoFinal() {
    const btnConfirmar = document.querySelector('#confirm-buttons .btn-primario');
    const fileInput = document.getElementById('comprobante'); 
    
    // 1. Validación de imagen
    if (!fileInput || !fileInput.files[0]) {
        alert("❌ Por favor, sube la captura de tu comprobante de pago.");
        return;
    }

    // Datos para el Bot (AISLAMIENTO TOTAL)
    const NUEVO_TOKEN = "8731862768:AAFMlGF49gkDmOqUy-nlKbHnFfSk2owVIbI"; // El que acabas de crear
    const NUEVO_CHAT_ID = "8730026280";    // Tu ID de Telegram

    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnConfirmar.disabled = true;

    try {
        const imagen = fileInput.files[0];
        
        // Recolectar datos actuales
        const idJugador = document.getElementById('id-jugador').value;
        const nick = document.getElementById('nick-jugador').value || "No indicado";
        const juego = document.getElementById('nombre-juego-checkout').innerText;
        const paquete = paqueteSeleccionado.cantidad + " Diamantes";
        const metodo = metodoSeleccionado === 'qr' ? "Simple QR" : "Tigo Money";
        const total = document.getElementById('total-pago').innerText;

        // Formatear mensaje (El ID se copia con un toque en el celular)
        let mensaje = `🚀 *PEDIDO V3 - ELITE GAMES* 🚀\n\n`;
        mensaje += `🎮 *Juego:* ${juego}\n`;
        mensaje += `🆔 *ID:* \`${idJugador}\`\n`;
        mensaje += `👤 *Nick:* ${nick}\n`;
        mensaje += `💎 *Paquete:* ${paquete}\n`;
        mensaje += `💳 *Pago:* ${metodo}\n`;
        mensaje += `💰 *Total:* ${total}\n\n`;
        mensaje += `⚡ _Este pedido fue enviado desde el entorno de pruebas V3_`;

        // Preparar FormData para Telegram
        const formData = new FormData();
        formData.append('chat_id', NUEVO_CHAT_ID);
        formData.append('photo', imagen);
        formData.append('caption', mensaje);
        formData.append('parse_mode', 'Markdown');

        // Envío
        const response = await fetch(`https://api.telegram.org/bot${NUEVO_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error("Error en la API de Telegram");

        // 2. CAMBIO VISUAL A ÉXITO (Lo que ya tenías)
        document.getElementById('confirm-titulo').innerText = "¡Pedido Recibido!";
        const box = document.getElementById('status-box');
        box.className = "status-box success";
        box.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p><strong>¡Tu recarga está en camino!</strong><br>
                Revisa tu nuevo Bot de Telegram para ver el pedido.</p>
            </div>
        `;

        document.getElementById('confirm-buttons').innerHTML = `
            <button class="btn-secundario" onclick="otraRecarga()">Nueva Recarga</button>
            <button class="btn-primario" onclick="finalizarTodo()">Finalizar</button>
        `;

    } catch (error) {
        console.error(error);
        alert("Hubo un error al enviar al nuevo Bot. Verifica el Token.");
        btnConfirmar.innerHTML = "Confirmar y Enviar";
        btnConfirmar.disabled = false;
    }
}
*/

async function procesarPedidoFinal() {
    console.log("Iniciando procesarPedidoFinal...");
    const btnConfirmar = document.querySelector('#confirm-buttons .btn-primario');
    const fileInput = document.getElementById('comprobante');

    if (!fileInput || !fileInput.files[0]) {
        console.error("No se encontró archivo de comprobante");
        alert("Por favor, sube la captura de tu comprobante de pago.");
        return;
    }

    const NUEVO_TOKEN = "8731862768:AAFMlGF49gkDmOqUy-nlKbHnFfSk2owVIbI"; // El que acabas de crear
    const NUEVO_CHAT_ID = "8730026280";    // Tu ID de Telegram 

    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnConfirmar.disabled = true;

    try {
        console.log("Iniciando proceso de Firebase y Telegram...");
        const imagen = fileInput.files[0];

        const idJugador = document.getElementById('id-jugador').value;
        const nick = document.getElementById('nick-jugador').value || "No indicado";
        const juego = document.getElementById('nombre-juego-checkout').innerText;
        const paquete = paqueteSeleccionado.cantidad + " Diamantes";
        const metodo = metodoSeleccionado === 'qr' ? "Simple QR" : "Tigo Money";
        const total = document.getElementById('total-pago').innerText;

        // --- CAPTURA DE DATOS EXTRAS ---
        const zonaML = document.getElementById('id-zona').value;
        const regionGenshin = document.getElementById('region-genshin').value;

        // --- PASO 1: SUBIR IMAGEN A FIREBASE STORAGE ---
        console.log("Iniciando subida a Storage...");
        const nombreArchivo = `${Date.now()}_${idJugador}.jpg`;
        console.log("Nombre de archivo:", nombreArchivo);
        
        if (!storage) {
            console.error("Storage no está inicializado");
            throw new Error("Storage no disponible");
        }
        
        const storageRef = storage.ref('comprobantes/' + nombreArchivo);
        console.log("Referencia de Storage creada");
        
        const snapshot = await storageRef.put(imagen);
        console.log("Imagen subida a Storage");
        
        const urlImagen = await snapshot.ref.getDownloadURL();
        console.log("URL de imagen obtenida:", urlImagen);

        // --- PASO 2: GUARDAR DATOS EN FIRESTORE ---
        console.log("Iniciando guardado en Firestore...");
        
        if (!db) {
            console.error("Firestore no está inicializado");
            throw new Error("Firestore no disponible");
        }
        
        const pedidoData = {
            juego: juego,
            idJugador: idJugador,
            zona: zonaML || null,
            region: regionGenshin || null,
            nick: nick,
            paquete: paquete,
            metodo: metodo,
            total: total,
            comprobanteUrl: urlImagen,
            estado: "Pendiente",
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        console.log("Datos a guardar:", pedidoData);

        const docRef = await db.collection("pedidos").add(pedidoData);
        console.log("Guardado en Firestore con ID:", docRef.id);

        // Formatear mensaje
        let mensaje = `🚀 *PEDIDO V3 - ELITE GAMES* 🚀\n\n`;
        mensaje += `🎮 *Juego:* ${juego}\n`;
        mensaje += `🆔 *ID:* \`${idJugador}\`\n`;

        // SI ES MOBILE LEGENDS, AÑADIR ZONA
        if (juego === "Mobile Legends" && zonaML) {
            mensaje += `🌐 *Zona:* ${zonaML}\n`;
        }
        // SI ES GENSHIN, AÑADIR REGIÓN
        if (juego === "Genshin Impact" && regionGenshin) {
            mensaje += `📍 *Región:* ${regionGenshin}\n`;
        }

        mensaje += `👤 *Nick:* ${nick}\n`;
        mensaje += `💎 *Paquete:* ${paquete}\n`;
        mensaje += `💳 *Pago:* ${metodo}\n`;
        mensaje += `💰 *Total:* ${total}\n\n`;
        mensaje += `⚡ _Este pedido fue enviado desde el entorno de pruebas V3_`;

        const formData = new FormData();
        formData.append('chat_id', NUEVO_CHAT_ID);
        formData.append('photo', imagen);
        formData.append('caption', mensaje);
        formData.append('parse_mode', 'Markdown');

        const response = await fetch(`https://api.telegram.org/bot${NUEVO_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error("Error en la API de Telegram");

        document.getElementById('confirm-titulo').innerText = "¡Pedido Recibido!";
        const box = document.getElementById('status-box');
        box.className = "status-box success";
        box.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p><strong>¡Tu recarga está en camino!</strong><br>
                Revisa tu nuevo Bot de Telegram para ver el pedido.</p>
            </div>
        `;

        document.getElementById('confirm-buttons').innerHTML = `
            <button class="btn-secundario" onclick="otraRecarga()">Nueva Recarga</button>
            <button class="btn-primario" onclick="finalizarTodo()">Finalizar</button>
        `;

    } catch (error) {
        console.error(error);
        alert("Hubo un error al enviar al nuevo Bot. Verifica el Token.");
        btnConfirmar.innerHTML = "Confirmar y Enviar";
        btnConfirmar.disabled = false;
    }
}
