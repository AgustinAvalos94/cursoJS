let productos = []

//Cargo los productos mediante FETCH
cargarProductos()
    .then(data => {
        productos = data;
        console.log(productos)
        renderizar(productos)

        //Creo botones para filtrar luego por actividad
        let actividades = []
        productos.forEach(producto => {
            if (!actividades.includes(producto.actividad)) {
                actividades.push(producto.actividad)
            }
        })
        let actividadesContainer = document.createElement("div");
        actividadesContainer.className = "d-inline-flex justify-content-around"
        let main = document.querySelector(".actions");
        main.appendChild(actividadesContainer);
        for (const actividad of actividades) {
            actividadesContainer.innerHTML += `<button class="botonFiltro me-2 btn btn-primary" value="${actividad}">${actividad}</button>`
        }
        //Capturo los botones de filtro
        let botonesFiltro = document.getElementsByClassName("botonFiltro")
        //Evento de click de botones filtro
        for (const boton of botonesFiltro) {
            boton.addEventListener("click", filtrarActividad)
        }
    })
    .catch(error => {
        console.error('Error al cargar los productos:', error);
    });

//Defino Carrito y verifico si hay carrito en local Storage
console.log(productos)
let carrito = []
let carritoJSON = JSON.parse(localStorage.getItem("carrito"))
if (carritoJSON) {
    carrito = carritoJSON
}






//Los elementos que Capturo
let input = document.getElementById("buscadorInput")
let button = document.getElementById("buscadorButton")
let mostrarCarrito = document.getElementById("carritoButton")



//Los eventos


carritoButton.addEventListener("click", () => {
    renderizarCarrito(carrito);
    mostrarOcultarBotonesCarrito();
});
button.addEventListener("click", () => filtrarYRenderizar(productos, input.value.toLowerCase()))

renderizar(productos)

//Función filtrar x actividad mediante boton
function filtrarActividad(e) {
    let productosFiltrados = productos.filter(producto => producto.actividad === e.target.value)
    console.log(productosFiltrados)
    renderizar(productosFiltrados)
}


//FUNCION PARA FILTRAR DE ACUERDO A UNA PALABRA CLAVE
function filtrarYRenderizar(productos, keyWord) {
    let productosFiltrados = productos.filter((producto) => {
        return (
            producto.nombre.toLowerCase().includes(keyWord) ||
            producto.tipo.toLowerCase().includes(keyWord) ||
            producto.actividad.toLowerCase().includes(keyWord)
        );
    });

    renderizar(productosFiltrados);
}

//Render de productos filtrados
function renderizar(arrayElementos) {
    let contenedorPrincipal = document.getElementById("contenedorPrincipal")
    contenedorPrincipal.innerHTML = ""

    arrayElementos.forEach(producto => {
        let contenedorProducto = document.createElement("div")
        contenedorProducto.className = "col-12 col-md-6 col-lg-4"

        let tarjetaProducto = document.createElement("figure")
        tarjetaProducto.className = "d-flex col text-align-center align-self-center"
        tarjetaProducto.innerHTML = `
            <figcaption>${producto.nombre}</figcaption>
            <img src=img/${producto.rutaImagen}>
            <div class="w-75 m-auto flex-column justify-content-center align-items-center text-center"><p>${"Detalles"}</p>
            <h3>Precio: $ ${producto.precio}</h3>
            <h4>Unidades disponibles: ${producto.stock}</h4>
            </div>
            <button id=${producto.id}>${"Agregar al carrito"}</button>
        `
        contenedorPrincipal.appendChild(contenedorProducto)
        contenedorProducto.appendChild(tarjetaProducto)
        let botonCarrito = document.getElementById(producto.id)
        botonCarrito.addEventListener("click", agregarCarrito)
    })

}

//Función que agrega un producto al carrito, o aumenta en 1 la cantidad de un producto existente
function agregarCarrito(e) {
    let productoBuscado = productos.find(producto => producto.id === Number(e.target.id))
    if (productoBuscado.stock != 0) {
        let indice = productos.findIndex(producto => producto.id === Number(e.target.id))
        productos[indice].stock -= 1
        localStorage.setItem("productos", JSON.stringify(productos))
        const productoExistente = carrito.find(producto => producto.id === productoBuscado.id);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push({
                id: productoBuscado.id,
                nombre: productoBuscado.nombre,
                precio: productoBuscado.precio,
                rutaImagen: productoBuscado.rutaImagen,
                cantidad: 1
            });
        }

        //ACTUALIZO EL STOCK DE PRODUCTOS MEDIANTE FETCH
        fetch('productos.json', {
            method: 'PUT',
            body: JSON.stringify(productos),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud no fue exitosa al actualizar el stock');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error al actualizar el stock:', error);
            });

        const tarjetaProducto = e.target.parentElement;
        const unidadesDisponibles = tarjetaProducto.querySelector("h4");
        if (unidadesDisponibles) {
            unidadesDisponibles.textContent = `Unidades disponibles: ${productoBuscado.stock}`;
            if (productoBuscado.stock === 0) {
                unidadesDisponibles.textContent = "Sin stock";
            }
        }
    } else {
        Toastify.error("Lo sentimos, no tenemos más stock de este producto", {
            position: "center",
            duration: 3000 // 3 segundos
        });
    }


}

//Render de los productos que están en el carrito al apretar boton de carrito
function renderizarCarrito(arrayElementos) {
    let contenedorPrincipal = document.getElementById("contenedorPrincipal");
    contenedorPrincipal.innerHTML = "";

    arrayElementos.forEach((producto) => {
        let contenedorCarrito = document.createElement("div");
        contenedorCarrito.className = "col-12 col-md-6 col-lg-4";

        let tarjetaCarrito = document.createElement("figure");
        tarjetaCarrito.innerHTML = `
            <figcaption>${producto.nombre}</figcaption>
            <img src=img/${producto.rutaImagen}>
            <div class="w-75 m-auto flex-column justify-content-center align-items-center text-center">
                <h3>Precio: $ ${producto.precio}</h3>
                <h4>Cantidad: ${producto.cantidad}</h4>
                <div class="d-flex justify-content-around">
                <button class="btn btn-success btn-agregar" data-producto-id="${producto.id}">Agregar</button>
                <button class="ms-3 btn btn-danger btn-quitar" data-producto-id="${producto.id}">Quitar</button>
                </div>
            </div>
        `;
        contenedorPrincipal.appendChild(contenedorCarrito);
        contenedorCarrito.appendChild(tarjetaCarrito);

        // Agregar eventos a los botones de agregar y quitar
        let botonAgregar = tarjetaCarrito.querySelector(".btn-agregar");
        let botonQuitar = tarjetaCarrito.querySelector(".btn-quitar");

        botonAgregar.addEventListener("click", () => agregarUnidad(producto.id));
        botonQuitar.addEventListener("click", () => quitarUnidad(producto.id));
    });
}

// FUNCIONES RELACIONADAS A QUITAR O AGREGAR UNIDADES DESDE LAS TARJETAS DEL CARRITO
function agregarUnidad(id) {
    let productoEnCarrito = carrito.find((producto) => producto.id === id);
    let productoEnLista = productos.find((producto) => producto.id === id);

    if (productoEnCarrito && productoEnLista && productoEnLista.stock > 0) {
        productoEnCarrito.cantidad += 1;
        productoEnLista.stock -= 1;
    }

    actualizarCarritoYRenderizar();
}

function quitarUnidad(id) {
    let productoEnCarrito = carrito.find((producto) => producto.id === id);
    let productoEnLista = productos.find((producto) => producto.id === id);

    if (productoEnCarrito && productoEnLista && productoEnCarrito.cantidad > 1) {
        productoEnCarrito.cantidad -= 1;
        productoEnLista.stock += 1;
    }

    actualizarCarritoYRenderizar();
}

// Función para actualizar el carrito en LocalStorage y volver a renderizar
function actualizarCarritoYRenderizar() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito(carrito);
}



//FUNCIONES RELACIONADAS A LOS BOTONES DE VACIAR CARRITO Y COMPRAR CARRITO
function mostrarOcultarBotonesCarrito() {
    let botonesCarrito = document.getElementById("botonesCarrito");
    if (carrito.length > 0) {
        botonesCarrito.classList.remove("d-none");
    } else {
        botonesCarrito.classList.add("d-none");
    }
}

// Agregar eventos a los botones para vaciar el carrito y comprar el carrito
document.getElementById("vaciarCarrito").addEventListener("click", vaciarCarrito);
document.getElementById("comprarCarrito").addEventListener("click", comprarCarrito);

// Función para vaciar el carrito y restaurar los productos en el stock original
function vaciarCarrito() {
    carrito.forEach((productoEnCarrito) => {
        let productoEnLista = productos.find((producto) => producto.id === productoEnCarrito.id);
        if (productoEnLista) {
            productoEnLista.stock += productoEnCarrito.cantidad;
        }
    });

    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("productos", JSON.stringify(productos));

    renderizarCarrito(carrito);
    renderizar(productos);
}

// Función para comprar el carrito y mostrar el total a pagar
function comprarCarrito() {
    let totalAPagar = 0;

    carrito.forEach((productoEnCarrito) => {
        let productoEnLista = productos.find((producto) => producto.id === productoEnCarrito.id);
        if (productoEnLista) {
            totalAPagar += productoEnCarrito.cantidad * productoEnLista.precio;
        }
    });

    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));

    renderizarCarrito(carrito);
    Toastify.success(`¡Compra realizada! Total a pagar: $${totalAPagar}`, { position: "center" });
}


//FUNCION RELACIONADA A CARGAR DATOS DE PRODUCTOS 

function cargarProductos() {
    return fetch('productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud no fue exitosa');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error al obtener los datos de productos:', error);
            throw error;
        });
}






