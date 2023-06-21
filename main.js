let productos = [
    {id:1, nombre:'Micropolar Alaskan', tipo:'Buzo', actividad:'Trekking', stock: 7, precio: 20000, tec:'BearTech',},
    {id:2, nombre:'Rompevientos North-wind', tipo:'Campera', actividad:'Trekking', stock: 4, precio: 25000, tec:'NoMoreWind',},
    {id:3, nombre:'Carpa StarRiver 2P', tipo:'Carpa', actividad:'Camping', stock: 5, precio: 150000, tec:'AquaOut',},
    {id:4, nombre:'Campera Survival', tipo:'Campera', actividad:'Trekking', stock: 2, precio: 80000, tec:'AquaOut',},
    {id:5, nombre:'Crampones Irvix FlexLock', tipo:'Crampones', actividad:'Escalada', stock: 1, precio: 93000, tec:'SteelFlex',},
    {id:6, nombre:'Bolsa de Dormir Finland', tipo:'Bolsa de dormir', actividad:'Camping', stock: 10, precio: 30000, tec:'BearTech',},
    {id:7, nombre:'Bastones ErgonomyOk', tipo:'Bastones', actividad:'Trekking', stock: 2, precio: 50000, tec:'AntiShock',},
    {id:8, nombre:'Botas Cruzader', tipo:'Botas', actividad:'Trekking', stock: 2, precio: 65000, tec:'HardGrip',},
]
let carrito = []
let continuarEjecucion = true;
let nombreUsuario = prompt ("Ingrese su nombre")
alert ("Bienvenido " +nombreUsuario+ "! En que puedo ayudarte?")


while (continuarEjecucion) {
    let opcionMenu = parseInt(prompt("Ingrese una opción:\n1) Ver Catálogo completo\n2) Filtrar por Categorías\n3) Buscar Producto por nombre\n4) Ir al Carrito\n5) Salir"));
    switch (opcionMenu) {
      case 1:
        listarCatalogo();
        break;
  
      case 2:
        filtrarProductos();
        break;
  
      case 3:
        buscarProducto();
        break;
  
      case 4:
        pagar();
        break;
  
      case 5:
        continuarEjecucion = false;
        break;
  
      default:
        alert("Ha ingresado una opción no válida");
        break;
    }
  }

alert("Gracias por usar nuestro servicio de compra. ¡Que tenga buen día!");

function listarCatalogo(){
    let catalogo = []
    productos.forEach (producto => {
            catalogo = catalogo + producto.id + " - " + producto.nombre + " - " + producto.precio + " pesos\n";
        })
    alert(catalogo)
    adquirirProducto() 
}
//PREGUNTAR A FRAN
function filtrarProductos(){
    let opcionFiltrar = parseInt(prompt ("Ingrese la categoría por la que quiere filtrar:\n1)Tipo\n2)Actividad\n3)Precio\n4)Tecnología"))
            switch (opcionFiltrar){
                case 1:{
                    let keyWord = prompt("Ingrese tipo de producto que busca").toLowerCase()
                    let productosFiltrados = productos.filter((producto) => producto.tipo.toLowerCase().includes(keyWord))
                    mostrarFiltro(productosFiltrados)
                    break;
                }
                
                case 2:{
                    let keyWord = prompt("Ingrese la actividad que le interesa").toLowerCase()
                    let productosFiltrados = productos.filter((producto) => producto.actividad.toLowerCase().includes(keyWord))
                    mostrarFiltro(productosFiltrados)
                    break;
                }
                
                case 3:{
                    let precioMin = parseInt(prompt("Ingrese el límite inferior de precio"))
                    let precioMax = parseInt(prompt("Ingresela el límite superior de precio"))
                    let productosFiltrados = productos.filter((producto) => producto.precio > precioMin && producto.precio < precioMax)
                    mostrarFiltro(productosFiltrados)
                    break;
                }
                
                case 4:{
                    let keyWord = prompt("Ingrese el tipo de tecnología que busca").toLowerCase()
                    let productosFiltrados = productos.filter((producto) => producto.tec.toLowerCase().includes(keyWord))
                    mostrarFiltro(productosFiltrados)
                    break;
                }
            
                default:
                    break;
            }
            adquirirProducto() 
}

function mostrarFiltro(productosFiltrados){
    let filtro = ""
    productosFiltrados.forEach (producto => {
        filtro = filtro + producto.id + " - " + producto.nombre + " - " + producto.precio + " pesos\n";
    })
    alert(filtro)
}

function adquirirProducto(){
     let accionCarrito = confirm('Desea adquirir alguno de estos productos?')
            if (accionCarrito){
                let idProducto = parseInt(prompt('Ingrese el ID del producto deseado'))
                let cantidad = parseInt(prompt ('Ingrese la cantidad deseada'))
                let productoAgregado = agregarCarrito(idProducto,cantidad);
                if (productoAgregado === null){
                    alert ("Lo lamentamos, no tenemos suficiente stock de este producto")
                }else{
                    carrito.push(productoAgregado)
                } 
            } 
            continuar = parseInt(prompt('Que desea hacer a continuación? :\n1)Volver al menú inicial\n2)Agregar nuevo producto al Carrito\n3)Ir a pagar'))
            switch (continuar){
                case 1:
                    break;
        
                case 2:
                    adquirirProducto()
                    break;
                
                case 3:
                    pagar()
                    break;

                default:
                    alert("La opción ingresada no es válida. Lo enviaremos al menu inicial.")
                    break;
            }
}

function agregarCarrito(idProducto,cantidad) {
  let productoEncontrado = productos.find(producto => producto.id === idProducto)
  if(productoEncontrado.stock >= cantidad){
    indice = productos.findIndex(producto => producto.id === idProducto)
    productos[indice].stock -= cantidad
    let productoReducido = {
        nombre: productoEncontrado.nombre,
        precio: productoEncontrado.precio,
        cantidad: cantidad,
    }
    return productoReducido
  }else{
    return null
  }
  
}

function buscarProducto(){
    let keyWord = prompt("Ingrese el nombre del producto buscado").toLowerCase()
    let productoBuscado = productos.find((producto) => producto.nombre.toLowerCase() === keyWord)
        if (productoBuscado === undefined){
            alert ("No se encuentran coincidencias")
            menuInteractivo()
        }else{
            console.log(productoBuscado)
        }
        adquirirProducto()
}

function pagar(){
    console.log('Su carrito tiene los siguientes productos')
                    console.log(carrito)
                    let comprar = confirm('Desea ir a pagar?')
                    if (comprar){
                        alert('El total a pagar es' + ' ' + carrito.reduce ((acum,producto) => acum + producto.precio * producto.cantidad , 0))
                    }else{
                        alert("Lo enviaremos al menú principal")
                    }

}










