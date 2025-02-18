let productos = [
    { id: 1, nombre: "Camiseta", precio: 12, stock: 10 },
    { id: 2, nombre: "Zapatos", precio: 8, stock: 12 },
    { id: 3, nombre: "Gorra", precio: 2, stock: 8 },
    { id: 4, nombre: "Cuchillo obsidiana", precio: 25, stock: Infinity },
    { id: 5, nombre: "Escudo de pizza", precio: 5, stock: Infinity },
    { id: 6, nombre: "Monedas x10", precio: 1, stock: Infinity },
];

// Recuperar el carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let precioTotal = 0;

function agregarAlCarrito(id) {
    let producto = productos.find(p => p.id === id);

    if (producto.stock <= 0) {
        alert("No hay unidades disponibles de este producto.");
        return;
    }

    let productoEnCarrito = carrito.find(p => p.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.unidades += 1;
    } else {
        carrito.push({ ...producto, unidades: 1 });
    }

    if (producto.stock !== Infinity) {
        producto.stock -= 1;
    }

    actualizarCarrito();
    actualizarStock(id);
}

function actualizarCarrito() {
    precioTotal = carrito.reduce((total, producto) => total + (producto.precio * producto.unidades), 0);

    let cantidadCarrito = carrito.reduce((total, producto) => total + producto.unidades, 0);
    document.getElementById("cantidad-carrito").innerText = cantidadCarrito;
    document.getElementById("precio-total").innerText = precioTotal;

    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("precioTotal", precioTotal);
}

function actualizarStock(id) {
    let producto = productos.find(p => p.id === id);

    let unidadesElement = document.querySelector(`.unidades-${id}`);
    if (unidadesElement) {
        unidadesElement.innerText = producto.stock;
    }

    let boton = document.querySelector(`.boton-${id}`);
    if (boton && producto.stock <= 0) {
        boton.disabled = true;
        boton.innerText = "Agotado";
    }
}

function irAPagar() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Añade productos antes de pagar.");
        return;
    }
    window.location.href = "TiendaFIN.html";
}
function vaciarCarrito() {
    console.log("Iniciando vaciarCarrito...");
    console.log("Carrito antes de vaciar:", carrito);
    console.log("Productos antes de restaurar stock:", productos);

    // Restaurar stock de productos
    carrito.forEach(productoEnCarrito => {
        let producto = productos.find(p => p.id === productoEnCarrito.id);
        if (producto && producto.stock !== Infinity) {
            producto.stock += productoEnCarrito.unidades;
        }
    });

    console.log("Productos después de restaurar stock:", productos);

    carrito = [];
    precioTotal = 0;

    localStorage.removeItem("carrito");
    localStorage.removeItem("precioTotal");

    actualizarCarrito();
    productos.forEach(producto => actualizarStock(producto.id));

    alert("El carrito se ha vaciado correctamente.");

    window.location.href = "index.html"; // Redirige al usuario al index
}

// Al cargar la página, actualizar el carrito y el stock
window.onload = function() {
    actualizarCarrito();
    productos.forEach(producto => actualizarStock(producto.id));
};
