// URL del endpoint que creamos en Django
const API_URL = "/api/libros/";

async function cargarLibros() {
    const respuesta = await fetch(API_URL);
    const datos = await respuesta.json();  
}

// Obtener CSRF (necesario para POST, PUT, DELETE en Django)
const csrfToken = getCSRFToken();

function getCSRFToken() {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
}

let editandoId = null; // Si es null → creamos; si tiene valor → editamos


// CAPTURAR EL FORMULARIO

const form = document.getElementById("form-libro");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
        titulo: document.getElementById("titulo").value,
        autor_nombre: document.getElementById("autor_nombre").value,
        autor_apellidos: document.getElementById("autor_apellidos").value,
        genero: document.getElementById("genero").value,
        paginas: document.getElementById("paginas").value,
    };

    // Si estamos editando un libro existente
    if (editandoId !== null) {
        await actualizarLibro(editandoId, datos);
        editandoId = null;
    } else {
        await crearLibro(datos);
    }

    form.reset();
    cargarLibros();
});


// =============================
// FUNCIONES CRUD
// =============================

// CREATE
async function crearLibro(datos) {
    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(datos),
    });
}

// UPDATE
async function actualizarLibro(id, datos) {
    await fetch(API_URL + id + "/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(datos),
    });
}

// DELETE
async function eliminarLibro(id) {
    await fetch(API_URL + id + "/", {
        method: "DELETE",
        headers: {
            "X-CSRFToken": csrfToken,
        },
    });

    cargarLibros();
}


// LISTAR Y MOSTRAR EN TABLA

async function cargarLibros() {
    const res = await fetch(API_URL);
    const libros = await res.json();

    const tbody = document.querySelector("#tabla-libros tbody");
    tbody.innerHTML = "";

    libros.forEach(libro => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.autor_nombre} ${libro.autor_apellidos}</td>
            <td>${libro.genero}</td>
            <td>${libro.paginas}</td>
            <td>
                <button class="editar" data-id="${libro.id}">Editar</button>
                <button class="eliminar" data-id="${libro.id}">Eliminar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    activarBotones();
}


// BOTONES EDITAR / ELIMINAR

function activarBotones() {
    document.querySelectorAll(".editar").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const res = await fetch(API_URL + id + "/");
            const libro = await res.json();

            // Cargar datos en el formulario
            document.getElementById("titulo").value = libro.titulo;
            document.getElementById("autor_nombre").value = libro.autor_nombre;
            document.getElementById("autor_apellidos").value = libro.autor_apellidos;
            document.getElementById("genero").value = libro.genero;
            document.getElementById("paginas").value = libro.paginas;

            editandoId = id;
        });
    });

    document.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            eliminarLibro(id);
        });
    });
}

// Ejecutar al cargar la página
cargarLibros();
