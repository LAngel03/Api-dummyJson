const urlApi = "https://dummyjson.com/products?limit=30";


document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("contenedor-productos")) {
        cargarProductos();
        activarBusqueda();
    }

    if (document.getElementById("titulo-detalle")) {
        cargarDetalleProducto();
    }
});

let productosOriginales = [];

const cargarProductos = () => {
    fetch(urlApi)
        .then(res => res.json())
        .then(data => {
            productosOriginales = data.products;
            mostrarProductos(productosOriginales);
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
        });
};

const mostrarProductos = (productos) => {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("tarjeta-producto");

        card.innerHTML = `
            <img src="${producto.thumbnail}" alt="${producto.title}">
            <h3 class="titulo-producto">${producto.title}</h3>
        `;

        card.addEventListener("click", () => {
            window.location.href = `detalle.html?id=${producto.id}`;
        });

        contenedor.appendChild(card);
    });
};

const activarBusqueda = () => {
    const input = document.getElementById("input-busqueda");
    if (!input) return;

    input.addEventListener("input", () => {
        const texto = input.value.toLowerCase();
        const filtrados = productosOriginales.filter(p =>
            p.title.toLowerCase().includes(texto)
        );
        mostrarProductos(filtrados);
    });
};

const cargarDetalleProducto = () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return;

    fetch(`https://dummyjson.com/products/${id}`)
        .then(res => res.json())
        .then(producto => {
            document.getElementById("titulo-detalle").textContent = producto.title;
            document.getElementById("imagen-detalle").src = producto.thumbnail;
            document.getElementById("categoria-detalle").textContent =
                `Categoría: ${producto.category}`;
            document.getElementById("precio-detalle").textContent =
                `Precio: $${producto.price}`;
            document.getElementById("rating-detalle").textContent =
                `Rating: ${producto.rating}`;
        })

        .catch(error => {
            console.error("Error al cargar detalle:", error);
        });
};
const activarBotonMasDetalles = () => {
    const btn = document.getElementById("btn-mas-detalles");
    if (!btn) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    btn.addEventListener("click", () => {
        window.location.href = `mas-detalles.html?id=${id}`;
    });
};

const cargarMasDetallesProducto = () => {
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

            const listaOpiniones = document.getElementById("opiniones-producto");
            listaOpiniones.innerHTML = "";

            if (producto.reviews && producto.reviews.length > 0) {
                producto.reviews.forEach(review => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <strong>${review.reviewerName}</strong>: 
                        ${review.comment}
                        `;
                    listaOpiniones.appendChild(li);
                });
            } else {
                const li = document.createElement("li");
                li.textContent = "Este producto no tiene opiniones.";
                listaOpiniones.appendChild(li);
            }
        })
        .catch(error => {
            console.error("Error al cargar los detalles del producto:", error);
        });
};


if (document.getElementById("btn-mas-detalles")) {
    activarBotonMasDetalles();
}

if (document.getElementById("nombre-producto")) {
    cargarMasDetallesProducto();
}


