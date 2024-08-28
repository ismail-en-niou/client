document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.error("Product ID is missing.");
        return;
    }

    try {
        // Fetch all products from the API
        const response = await fetch('https://electro-api.robixe.online/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const products = data.products || [];

        // Find the product with the matching ID
        const product = products.find(p => p.id === Number(productId));

        if (!product) {
            console.error("Product not found.");
            return;
        }

        // Update HTML with product data
        document.getElementById('MainImage').src = `https://electro-api.robixe.online/image/${product.img}`;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `${product.price}0Dh`;
        document.getElementById('breadcrumb').textContent = `${product.company}`;
        document.getElementById('product-description').textContent += product.description;
        const token = localStorage.getItem("token");

        const btn = document.getElementById("normal");
        const num = document.querySelector('input[type="number"]');
        btn.addEventListener("click", async function () {
            const conf = confirm(`you want to add that product ${product.name}`);
            if (num <0)
            {
                const conf1 = confirm(`you want to add that product ${product.name}`);
                if (conf1)
                    return;
            }
            if (conf) {
                const productQuantity = document.querySelector('input[type="number"]').value;
                
                num.value = 1;
                let sells = JSON.parse(localStorage.getItem("sells")) || [];

                const data = {
                    productId: productId,
                    productQuantity: productQuantity
                };
                sells.push(data);
                localStorage.setItem("sells", JSON.stringify(sells));
            }

            if (token) {
                try {
                    // Retrieve and parse the sells data from localStorage
                    let sells = JSON.parse(localStorage.getItem("sells")) || [];
            
                    // Transform the array into an object with productId as keys and productQuantity as values
                    const cart = sells.reduce((acc, item) => {
                        acc[item.productId] = Number(item.productQuantity);
                        return acc;
                    }, {});
            
                    // Send the transformed data to the API
                    const response = await fetch('https://electro-api.robixe.online/cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: token,
                            cart: cart
                        })
                    });
            
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);

                    }
                } catch (error) {
                    console.error("Error adding product to cart:", error);
                }
            }
            
        });
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
});

