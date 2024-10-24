document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetElement = document.querySelector(this.getAttribute("href"));

    // Desplazamiento suave hacia la sección objetivo
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: "smooth",
    });
  });
});

const nav = document.querySelector("#nav");
const abrir = document.querySelector("#open");
const cerrar = document.querySelector("#close");

abrir.addEventListener("click",()=>{
    nav.classList.add("visible");
})

cerrar.addEventListener
("click",()=>{
    nav.classList.remove("visible");
})

let productos = [];
let count = 0;
let carrito = [];
let totalCarrito = 0;
let total = 0; //Almacenar el total acumulado

function cargarLocalStorage() {
  const carritoguardado = localStorage.getItem("carrito");
  const countGuardado = localStorage.getItem("count");

  if (carritoguardado) {
    carrito = JSON.parse(carritoguardado);
    count = parseInt(countGuardado) || 0;
    actualizarCarrito();
    document.getElementById("carrito-count").innerText = count;
  }
}

async function cargarProductosJSON() {
  try {
    const response = await fetch("./productos.json"); // Cargar archivos JSON
    productos = await response.json();
    cargarProductos();
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
  }
}

// Función para cargar productos en el DOM
function cargarProductos() {
  // Seleccionar contenedores para cada tipo de café
  const hotCoffeeContainer = document.getElementById("hot-coffee");
  const coldCoffeeContainer = document.getElementById("cold-coffee");
  const specialCoffeeContainer = document.getElementById("special-coffee");
  const sweetBakeryContainer = document.getElementById("sweet-products");
  const saladBakeryContainer = document.getElementById("salad-products");

  // Limpiar los contenedores antes de agregar productos
  hotCoffeeContainer.innerHTML = "";
  coldCoffeeContainer.innerHTML = "";
  specialCoffeeContainer.innerHTML = "";
  sweetBakeryContainer.innerHTML = "";
  saladBakeryContainer.innerHTML = "";

  // Recorrer el array de productos
  productos.forEach((producto) => {
    // Crear un elemento para el producto
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("producto-item"); // Añadir una clase para estilizar

    // Generar el contenido HTML del producto
    productoDiv.innerHTML = `
            <img src="${producto.img}" alt="Café Caliente 1">
            <h4>${producto.nombre}</h4> 
            <div class="infoprod">
              <p>Precio: $${producto.precio.toFixed(
              2
            )}</p> <!-- Formato de precio -->
            <button class="buy-btn"><i class="fa-solid fa-plus"></i></button>
            </div>
        `;

    // Insertar el producto en el contenedor correspondiente
    if (producto.sección === "cafeteria") {
      if (producto.tipo === "calientes") {
        hotCoffeeContainer.appendChild(productoDiv);
      } else if (producto.tipo === "frios") {
        coldCoffeeContainer.appendChild(productoDiv);
      } else if (producto.tipo === "especiales") {
        specialCoffeeContainer.appendChild(productoDiv);
      }
    } else if (producto.sección === "bakery") {
      if (producto.tipo === "dulces") {
        sweetBakeryContainer.appendChild(productoDiv);
      } else if (producto.tipo === "salados") {
        saladBakeryContainer.appendChild(productoDiv);
      }
    }

    // Incrementar el contador de carrito al hacer clic en comprar
    productoDiv.querySelector(".buy-btn").addEventListener("click", () => {

      count +=1;
      document.getElementById("carrito-count").innerText = count; 

      // Crear un objeto con la cantidad y el producto
      const productoCarrito = { ...producto, cantidad:1 }; // Clonar el producto con la cantidad seleccionada

      // Agregar producto al carrito
      carrito.push(productoCarrito);
      actualizarCarrito();

      //Guardar carrito y contador en localStorage
      guardarLocalStorage();

      // Mostrar alerta con SweetAlert
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: ` ${producto.nombre}(s) agregado(s) al carro`,
        showConfirmButton: false,
        timer: 800,
      });
    });
  });
}
// Función para actualizar el listado de productos en el carrito
function actualizarCarrito() {
  const listaProductos = document.getElementById("lista-productos");
  listaProductos.innerHTML = ""; // Limpiar la lista

  total = 0;

  carrito.forEach((producto, index) => {
    const li = document.createElement("li");
    const btnEliminar = document.createElement("button");
    let precioProd = producto.precio * producto.cantidad;

    // Mostrar el nombre, cantidad y precio total del producto
    li.innerText = `${producto.nombre} x${
      producto.cantidad
    } - $${precioProd.toFixed(2)}`;

    // Calcular el total acumulado

    total += precioProd;

    // Crear botón de eliminar

    btnEliminar.innerText = "X"; // Texto del botón
    btnEliminar.classList.add("btn-eliminar"); // Añadir clase para estilos
    btnEliminar.addEventListener("click", (e) => {
      e.stopPropagation();
      eliminarProducto(index);
    });

    li.appendChild(btnEliminar); // Añadir botón al li
    listaProductos.appendChild(li);

    document.getElementById(
      "carrito-total"
    ).innerText = `Total a pagar: $${total.toFixed(2)}`;
  });

  // Si el carro tiene productos, mostrar el boton " Comprar".

  if (carrito.length > 0) {
    const pagarBtn = document.createElement("button");
    pagarBtn.innerText = "Pagar";
    pagarBtn.id = "pagar-btn"; // Darle un ID para el evento
    pagarBtn.addEventListener("click", mostrarFormularioCheckout);

    listaProductos.appendChild(pagarBtn); // Añadir el botón al final del carrito
  }
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
  const productoEliminado = carrito[index]; // Obtenemos el producto que vamos a eliminar

  total -= productoEliminado.precio * productoEliminado.cantidad;

  // Eliminar el producto del carrito usando su índice
  carrito.splice(index, 1); // Eliminar el producto de la lista

  // Actualizar el contador del carrito (número de productos)
  count -= productoEliminado.cantidad;
  document.getElementById("carrito-count").innerText = count; // Actualizamos el contador en el DOM

  // Si el carrito está vacío, mostrar total en 0
  if (carrito.length === 0) {
    total = 0; // Reiniciar el total si ya no hay productos
  }

  // Actualizamos el total visualmente en el DOM
  document.getElementById("carrito-total").innerText = `Total a pagar: $${total.toFixed(2)}`;

  // Actualizar la visualización del carrito
  actualizarCarrito(); // Vuelve a generar la lista de productos del carrito en el DOM

  // Guardar los cambios en localStorage
  guardarLocalStorage();

}

function guardarLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("count", count.toString());
  localStorage.setItem("totalCarrito", JSON.stringify(total));
}
// Evento para mostrar/ocultar el carrito al hacer clic en el icono
document.getElementById("carrito-icono").addEventListener("click", () => {
  const carritoLista = document.getElementById("carrito-lista");
  carritoLista.style.display =
    carritoLista.style.display === "none" ? "block" : "none";
});

function mostrarFormularioCheckout() {
  // Almacenar el carrito y el total en localStorage para acceder desde la página de checkout
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("totalCarrito", total);

  // Redirigir a la página de checkout
  window.location.href = "pages/checkout.html";
}



let currentIndex = 0;

function cambiarProductoDestacado() {
  const producto = productosDestacados[currentIndex];

  // Actualizar contenido de la sección
  document.querySelector(".descripcion-producto h1").innerText =
    producto.nombre;
  document.querySelector(".descripcion-producto p").innerText =
    producto.descripcion;
  document.querySelector(".imagen-producto-destacado img").src =
    producto.imagen;

  // Incrementar el índice para el siguiente producto
  currentIndex = (currentIndex + 1) % productosDestacados.length;
}

// Cambiar producto cada 5 segundos
//setInterval(cambiarProductoDestacado, 000);

// Llamar a la función para cargar los productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  //cambiarProductoDestacado();
  cargarProductosJSON();
  cargarLocalStorage();
});

