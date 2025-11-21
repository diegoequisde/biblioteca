document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "/api/libros/";

    const searchInput = document.getElementById("searchInput");
    const generoSelect = document.getElementById("generoSelect");
    const minPag = document.getElementById("minPag");
    const maxPag = document.getElementById("maxPag");
    const minPagValue = document.getElementById("minPagValue");
    const maxPagValue = document.getElementById("maxPagValue");
    const form = document.getElementById("form-libro");

    let editandoId = null;
    const csrfToken = getCSRFToken();

    // Inicialización
    cargarGeneros();
    actualizarRango();
    cargarLibros();

    // Listeners
    searchInput.addEventListener("input", cargarLibros);
    generoSelect.addEventListener("change", cargarLibros);
    minPag.addEventListener("input", actualizarRango);
    maxPag.addEventListener("input", actualizarRango);
    form.addEventListener("submit", async e => {
        e.preventDefault();
        await guardarLibro();
    });
    


    // ================= Funciones =================

    function getCSRFToken() {
        return document.cookie.split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
    }

    function actualizarRango() {
        let min = parseInt(minPag.value) || 1;
        let max = parseInt(maxPag.value) || 1500;

        if (min > max) [min, max] = [max, min];
        minPagValue.textContent = min;
        maxPagValue.textContent = max;

        cargarLibros(); // llamar a la función que hace el fetch
}

    async function cargarLibros() {
        let min = parseInt(minPag.value) || 1;
        let max = parseInt(maxPag.value) || 1500;

        let url = API_URL + "?";

        if (searchInput.value) url += `search=${encodeURIComponent(searchInput.value)}&`;
        if (generoSelect.value) url += `genero=${encodeURIComponent(generoSelect.value)}&`;
        url += `paginas__gte=${encodeURIComponent(min)}&`;
        url += `paginas__lte=${encodeURIComponent(max)}&`;

        console.log("Fetch URL:", url);

        try {
            console.log("URL final de fetch:", url);
            // depurar
            const res = await fetch(url);
            if (!res.ok) throw new Error("Error al cargar los libros");
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
        } catch (error) {
            console.error(error);
        }
    }

    async function cargarGeneros() {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Error al cargar géneros");
            const libros = await res.json();

            const generosSet = new Set(libros.map(l => l.genero));
            generoSelect.querySelectorAll("option:not([value=''])").forEach(o => o.remove());
            generosSet.forEach(g => {
                const option = document.createElement("option");
                option.value = g;
                option.textContent = g;
                generoSelect.appendChild(option);
            });
        } catch (error) {
            console.error(error);
        }
    }

    function activarBotones() {
        document.querySelectorAll(".editar").forEach(btn => {
            btn.onclick = async () => {
                try {
                    const res = await fetch(API_URL + btn.dataset.id + "/");
                    if (!res.ok) throw new Error("Error al cargar libro");
                    const libro = await res.json();

                    document.getElementById("titulo").value = libro.titulo;
                    document.getElementById("autor_nombre").value = libro.autor_nombre;
                    document.getElementById("autor_apellidos").value = libro.autor_apellidos;
                    document.getElementById("genero").value = libro.genero;
                    document.getElementById("paginas").value = libro.paginas;

                    editandoId = btn.dataset.id;
                } catch (error) {
                    console.error(error);
                }
            };
        });

        document.querySelectorAll(".eliminar").forEach(btn => {
            btn.onclick = async () => {
                try {
                    const res = await fetch(API_URL + btn.dataset.id + "/", {
                        method: "DELETE",
                        headers: { "X-CSRFToken": csrfToken },
                    });
                    if (!res.ok) throw new Error("Error al eliminar libro");
                    cargarLibros();
                } catch (error) {
                    console.error(error);
                }
            };
        });
    }

    async function guardarLibro() {
        const datos = {
            titulo: document.getElementById("titulo").value.trim(),
            autor_nombre: document.getElementById("autor_nombre").value.trim(),
            autor_apellidos: document.getElementById("autor_apellidos").value.trim(),
            genero: document.getElementById("genero").value.trim(),
            paginas: parseInt(document.getElementById("paginas").value) || 0
        };

        try {
            let res;
            if (editandoId) {
                res = await fetch(API_URL + editandoId + "/", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken },
                    body: JSON.stringify(datos)
                });
                editandoId = null;
            } else {
                res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken },
                    body: JSON.stringify(datos)
                });
            }

            if (!res.ok) throw new Error("Error al guardar libro");
            form.reset();
            cargarLibros();
        } catch (error) {
            console.error(error);
        }
    }
});