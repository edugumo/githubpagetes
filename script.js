document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    
    if (name && email && message) {
        document.getElementById("success-message").classList.remove("hidden");
        this.reset();
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

let map;
let marker;
let routePath;
let isOpen = false;

function initMap() {
    // Ubicación inicial del coffee truck
    let defaultLocation = { lat: 18.847063064575195, lng: -97.10971069335938 }; // Alameda Cri Cri, Orizaba, Veracruz

    // Inicializar el mapa
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: defaultLocation,
    });

    // Crear el marcador del coffee truck
    marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: "Beetle Caffe",
    });

    // Intentar obtener la ubicación en tiempo real
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            function (position) {
                let newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Mover marcador y centrar mapa
                marker.setPosition(newLocation);
                map.setCenter(newLocation);
            },
            function () {
                alert("No se pudo obtener la ubicación en tiempo real.");
            }
        );
    }

    // Evento para mostrar la ruta
    document.getElementById("show-route").addEventListener("click", showRoute);

    // Evento para cambiar disponibilidad
    document.getElementById("toggle-status").addEventListener("click", toggleStatus);
}

// Función para mostrar la ruta del coffee truck
function showRoute() {
    let routeCoordinates = [
        { lat: 18.847298, lng: -97.1089 }, // Punto 1 = Cerro del Borrego
        { lat: 18.859563, lng: -97.067444 }, // Punto 2 = Ixtac
    ];

    // Si ya existe una ruta, la eliminamos
    if (routePath) {
        routePath.setMap(null);
    }

    // Dibujar la ruta en el mapa
    routePath = new google.maps.Polyline({
        path: routeCoordinates,
        geodesic: true,
        strokeColor: "#FF5733",
        strokeOpacity: 1.0,
        strokeWeight: 4,
    });

    routePath.setMap(map);
}

// Función para cambiar el estado del coffee truck
function toggleStatus() {
    isOpen = !isOpen;
    let statusMessage = document.getElementById("status-message");
    let toggleButton = document.getElementById("toggle-status");

    if (isOpen) {
        statusMessage.innerHTML = "El Beetle Caffe está <strong>Abierto</strong>";
        toggleButton.textContent = "Estado: Abierto";
        toggleButton.style.backgroundColor = "#4CAF50";
    } else {
        statusMessage.innerHTML = "El Beetle Caffe está <strong>Cerrado</strong>";
        toggleButton.textContent = "Estado: Cerrado";
        toggleButton.style.backgroundColor = "#8b5a2b";
    }
}

let cart = [];
let totalPrice = 0;

// Agregar producto al carrito
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function () {
        let itemName = this.parentElement.getAttribute("data-name");
        let itemPrice = parseFloat(this.parentElement.getAttribute("data-price"));

        cart.push({ name: itemName, price: itemPrice });
        totalPrice += itemPrice;
        updateCart();
    });
});

// Actualizar el carrito de compras
function updateCart() {
    let cartList = document.getElementById("cart-items");
    let totalElement = document.getElementById("total-price");
    
    cartList.innerHTML = "";
    cart.forEach((item, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        
        let removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.style.marginLeft = "10px";
        removeButton.onclick = function () {
            cart.splice(index, 1);
            totalPrice -= item.price;
            updateCart();
        };

        listItem.appendChild(removeButton);
        cartList.appendChild(listItem);
    });

    totalElement.textContent = totalPrice.toFixed(2);
}

// Mostrar formulario de pedido
document.getElementById("checkout-btn").addEventListener("click", function () {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    document.getElementById("order-form").classList.remove("hidden");
});

// Enviar pedido
function sendOrderToWhatsApp(name, phone, cart) {
    let phoneNumber = "522721866887"; // Reemplazar con el número del coffee truck (con código de país, sin "+")
    let message = `¡Hola! Soy ${name} y quiero hacer un pedido:\n\n`;

    cart.forEach(item => {
        message += `- ${item.name}: $${item.price.toFixed(2)}\n`;
    });

    message += `\nTotal: $${totalPrice.toFixed(2)}\n`;
    message += `Teléfono de contacto: ${phone}\n`;
    
    // Codificar el mensaje para URL
    let encodedMessage = encodeURIComponent(message);
    let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Redirigir a WhatsApp
    window.open(whatsappURL, "_blank");
}

// Enviar pedido por WhatsApp al confirmar
document.getElementById("order").addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.getElementById("customer-name").value;
    let phone = document.getElementById("customer-phone").value;

    if (name && phone && cart.length > 0) {
        sendOrderToWhatsApp(name, phone, cart);

        document.getElementById("order-success").classList.remove("hidden");
        cart = [];
        totalPrice = 0;
        updateCart();
        this.reset();
    } else {
        alert("Por favor, completa todos los campos y agrega productos al carrito.");
    }
});



