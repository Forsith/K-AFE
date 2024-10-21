document.addEventListener("DOMContentLoaded", () => {
  // Cargar el carrito y el total desde localStorage
  const carrito = JSON.parse(localStorage.getItem("carrito"));
  const totalCarrito = localStorage.getItem("totalCarrito");

  // Mostrar los productos en la lista del checkout
  const listaCarrito = document.getElementById("lista-carrito");
  carrito.forEach((producto) => {
    const li = document.createElement("li");
    li.innerText = `${producto.nombre} x${producto.cantidad} - $${(
      producto.precio * producto.cantidad
    ).toFixed(2)}`;
    listaCarrito.appendChild(li);
  });

  /*AGREGAR BOTONES DE ELIMINAR PEDIDOS EN CASO DE QUE EL CLIENTE QUIERA QUITAR ALGO */

  // Mostrar el total
  document.getElementById("total-checkout").innerText = `$${parseFloat(
    totalCarrito
  ).toFixed(2)}`;

  // Manejar la validación y el envío del formulario de checkout
  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Obtener los valores del formulario
    const nombre = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const direccion = document.getElementById("address").value;
    const numeroTarjeta = document.getElementById("card-number").value;
    const fechaExpiracion = document.getElementById("expiration-date").value;
    const cvv = document.getElementById("cvv").value;

    // Validar los campos
    if (nombre === "" || email === "" || direccion === "") {
      Swal.fire({
        icon: "error",
        title: "Campos incorrectos",
        text: "Por favor, completa todos los campos de forma correcta.",
      });
      return;
    }

    // Simular un procesamiento de pago
    Swal.fire({
      title: "Procesando Pago...",
      text: "Por favor, espera un momento.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.close(); // Cerrar el mensaje de carga

      // Limpiar el carrito y eliminarlo del localStorage
      localStorage.removeItem("carrito");
      localStorage.removeItem("totalCarrito");

      // Redirigir a la página de inicio o mostrar un mensaje final
      window.location.href = "index.html"; // Puedes redirigir a la página principal o alguna otra
    }, 2000); // Simulación de espera de 2 segundos para el proceso de pago
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Compra Realizada",
        text: "Tu pedido ha sido procesado con éxito. ¡Gracias por tu compra!",
      });
    }, 3000);
  });
});
