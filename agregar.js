const crearproducto = () => {
    const titulo = document.getElementById("titulo").value;
    const precio = document.getElementById("precio").value;
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("Descripción").value;
    const mensaje = document.getElementById("mensaje");
    //validar que no esten vacíos los campos
    if (titulo || precio || categoria || descripcion === "") {
        alert("Por favor complete todos los campos");
        return;
    }
    //creamos el objeto que se va a enviar
    const producto = {
        title: titulo,
        price: precio,
        category: categoria,
        description: descripcion,
        thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg" + titulo
    };

    //hacemos la peticion fetch con el metodo post
    fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Producto agregado:", data);
            mensaje.style.display = "block";
            mensaje.innerText = `
            <strong>Producto agregado con éxito:</strong>
            <br>Título: ${data.title}
            <br>Precio: ${data.price}
            <br>Categoría: ${data.category}
            <br>Descripción: ${data.description}
            `;
        })
        .catch(error => {
            console.error("Error al agregar producto:", error);
            alert("Error al agregar producto");
        });
}