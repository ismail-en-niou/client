async function fetchProducts() {
    try {
        if (!localStorage.getItem("sells")) {
            localStorage.setItem("sells", null);
        }
        const response1 = await fetch("https://electro-api.robixe.online/products/TV", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const response2 = await fetch("https://electro-api.robixe.online/products/RF", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Check if both responses are OK
        if (!response1.ok) {
            throw new Error(`HTTP error! Status: ${response1.status}`);
        }
        if (!response2.ok) {
            throw new Error(`HTTP error! Status: ${response2.status}`);
        }

        // Parse JSON data from both responses
        const data1 = await response1.json();
        const data2 = await response2.json();

        // Check if the products exist in the responses
        if (data1.products && data1.products.length > 0) {
            displayProducts(data1.products, 'pro-container1');
        } else {
            console.error("No products found in the first API response.");
        }

        if (data2.products && data2.products.length > 0) {
            displayProducts(data2.products, 'pro-container2');
        } else {
            console.error("No products found in the second API response.");
        }

    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Function to create star elements
function createStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += "<i class='bx bxs-star'></i>";
        } else {
            stars += "<i class='bx bx-star'></i>";
        }
    }
    return stars;
}

// Function to create a product element
function createProduct(product) {
    return `
<div class="pro">
    <a href="/spro/sproduct.html?id=${product.id}" style="text-decoration: none;">
        <img src="https://electro-api.robixe.online/image/${product.img}" alt="${product.name}">
        <div class="des">
            <span>${product.company}</span>
            <h4>${product.name}</h4>
            <p>${product.description}</p>
            <div class="star">
                ${createStars(product.stars)}
            </div>
            <h4>${product.price}0Dh</h4>
        </div>
    </a>
    <a href="#"><i class='bx bxs-shopping-bag-alt cart'></i></a>
</div>
`;
}

// Function to display products in a specific container
function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = ''; // Clear previous content
        products.forEach(product => {
            container.innerHTML += createProduct(product);
        });
    } else {
        console.error(`Container with ID '${containerId}' not found.`);
    }
}

async function fetchallProducts() {
    try {
        // Fetch products from both API endpoints
        const response1 = await fetch("https://electro-api.robixe.online/products", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Check if both responses are OK
        if (!response1.ok) {
            throw new Error(`HTTP error! Status: ${response1.status}`);
        }


        // Parse JSON data from both responses
        const data1 = await response1.json();
        localStorage.setItem("allproduct", JSON.stringify(data1));
        // Check if the products exist in the responses
        if (data1.products && data1.products.length > 0) {
            displayProducts(data1.products, 'pro-container1');
        } else {
            console.error("No products found in the first API response.");
        }

    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

fetchallProducts();
window.onload = fetchProducts;