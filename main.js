let skip = 0;
const limit = 10;
let pagina = 1;
let filtros = {};

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("contenedor-productos")) {
        cargarCategorias();
        cargarProductos();
        activarBusqueda();
    }

    if (document.getElementById("nombre-producto")) {
        cargarMasDetallesProducto();
    }
});

/* =========================
   CARGAR PRODUCTOS
========================= */

function cargarProductos() {
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

    if (filtros.busqueda) {
        url = `https://dummyjson.com/products/search?q=${filtros.busqueda}`;
    }

    if (filtros.categoria) {
        url = `https://dummyjson.com/products/category/${filtros.categoria}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            mostrarProductos(data.products);
            document.getElementById("info-pagina").textContent =
                `Página ${pagina}`;
        })
        .catch(error => console.error(error));
}

/* =========================
   MOSTRAR PRODUCTOS
========================= */

function mostrarProductos(productos) {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("tarjeta-producto");

        card.innerHTML = `
            <img src="${producto.thumbnail}" alt="${producto.title}">
            <h3 class="titulo-producto">${producto.title}</h3>
            <p>$${producto.price}</p>

            <div class="acciones">
                <button onclick="editarProducto(${producto.id}, '${producto.title.replace(/'/g, "\\'")}', ${producto.price}, event)">
                    Editar
                </button>
                <button onclick="eliminarProducto(${producto.id}, event)">
                    Eliminar
                </button>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `mas-detalles.html?id=${producto.id}`;
        });

        contenedor.appendChild(card);
    });
}

/* =========================
   PAGINACIÓN
========================= */

function paginaSiguiente() {
    skip += limit;
    pagina++;
    cargarProductos();
}

function paginaAnterior() {
    if (skip > 0) {
        skip -= limit;
        pagina--;
        cargarProductos();
    }
}

/* =========================
   BÚSQUEDA
========================= */

function activarBusqueda() {
    const input = document.getElementById("input-busqueda");

    input.addEventListener("change", () => {
        filtros = { busqueda: input.value };
        skip = 0;
        pagina = 1;
        cargarProductos();
    });
}

/* =========================
   CATEGORÍAS
========================= */

function cargarCategorias() {
    fetch("https://dummyjson.com/products/category-list")
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("select-categoria");
            select.innerHTML = `<option value="">Todas las categorías</option>`;

            data.forEach(cat => {
                select.innerHTML += `<option value="${cat}">${cat}</option>`;
            });

            select.addEventListener("change", () => {
                filtros = select.value ? { categoria: select.value } : {};
                skip = 0;
                pagina = 1;
                cargarProductos();
            });
        });
}

/* =========================
   EDITAR PRODUCTO (PUT)
========================= */

function editarProducto(id, tituloActual, precioActual, e) {
    e.stopPropagation();

    const nuevoTitulo = prompt("Nuevo título:", tituloActual);
    if (!nuevoTitulo) return;

    const nuevoPrecio = prompt("Nuevo precio:", precioActual);
    if (!nuevoPrecio || isNaN(nuevoPrecio)) {
        alert("Precio inválido");
        return;
    }

    fetch(`https://dummyjson.com/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: nuevoTitulo,
            price: Number(nuevoPrecio)
        })
    })
        .then(res => res.json())
        .then(() => {
            alert("Producto actualizado correctamente (simulado)");
            cargarProductos();
        })
        .catch(error => {
            console.error(error);
            alert("Error al editar producto");
        });
}

/* =========================
   ELIMINAR PRODUCTO (DELETE)
========================= */

function eliminarProducto(id, e) {
    e.stopPropagation();

    if (!confirm("¿Eliminar producto?")) return;

    fetch(`https://dummyjson.com/products/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            alert("Producto eliminado (simulado)");
            cargarProductos();
        });
}

/* =========================
   MÁS DETALLES
========================= */

function cargarMasDetallesProducto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return;

    fetch(`https://dummyjson.com/products/${id}`)
        .then(res => res.json())
        .then(producto => {
            document.getElementById("nombre-producto").textContent = producto.title;
            document.getElementById("imagen-producto").src = producto.thumbnail;
            document.getElementById("descripcion-producto").textContent =
                `Descripción: ${producto.description}`;
            document.getElementById("marca-producto").textContent =
                `Marca: ${producto.brand}`;
        });
}
