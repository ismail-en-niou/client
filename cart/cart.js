        // Function to populate the cart table
        function populateCartTable(cartItems, allProducts) {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = ''; // Clear existing rows
            let result = 0;
            
            // Combine quantities for products with the same ID
            const combinedItems = cartItems.reduce((acc, item) => {
            if (acc[item.productId]) {
                acc[item.productId] += parseInt(item.productQuantity);
            } else {
                acc[item.productId] = parseInt(item.productQuantity);
            }
            return acc;
            }, {});
            
            Object.keys(combinedItems).forEach(key => {
            const productId = parseInt(key);
            const quantity = combinedItems[key];
            
            // Find the product by id in the products array
            const product = allProducts.products.find(p => p.id === productId);
            
            if (product) {
                const total = (product.price * quantity).toFixed(2);
                result += parseFloat(total);
            
                tbody.innerHTML += `
                    <tr id="row-${productId}">
                        <td><i class='bx bx-x-circle remove-icon' id="${productId}"></i></td>
                        <td><img src="https://electro-api.robixe.online/image/${product.img}" alt=""></td>
                        <td>${product.name}</td>
                        <td>${(product.price * 10).toFixed(2)}Dh</td>
                        <td><input type="number" value="${quantity}" id="quantity-${productId}"></td>
                        <td>${(total * 10).toFixed(2)}Dh</td>
                    </tr>
                `;
            } else {
                console.warn(`Product with ID ${productId} not found in allProducts`);
                console.log("Product ID:", productId);
                console.log("All Products:", allProducts);
            }
            });
            
            document.getElementById("subtotal").innerHTML = `
            <h3>Cart Total</h3>
            <table>
                <tr>
                    <td>Cart subtotal</td>
                    <td>${(result * 10).toFixed(2)} Dh</td>
                </tr>
                <tr>
                    <td>Shipping</td>
                    <td>Free</td>
                </tr>
                <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>${(result * 10).toFixed(2)} Dh</strong></td>
                </tr>
            </table>
            <button class="normal" id="btn">
                Proceed to checkout
            </button>
            `;
            
            // Add event listeners for the remove buttons
            document.querySelectorAll('.remove-icon').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const productIdToRemove = event.target.id;
                const confirmation = confirm("Are you sure you want to remove this product?");
                if (confirmation) removeProductFromCart(productIdToRemove);
            });
            });
            }
            
            // Function to handle cart data
            function handleCartData(cartItems) {
            const allProducts = JSON.parse(localStorage.getItem('allproduct'));
            
            if (!allProducts || !allProducts.products) {
            console.error('No valid allProducts found in localStorage');
            return;
            }
            
            populateCartTable(cartItems, allProducts);
            }
            
            // Function to remove product from cart
            function removeProductFromCart(productId) {
            let sells = JSON.parse(localStorage.getItem("sells")) || [];
            
            // Filter out the product with the matching productId
            sells = sells.filter(product => product.productId !== productId);
            
            // Update localStorage with the new array
            localStorage.setItem("sells", JSON.stringify(sells));
            
            // Remove the row from the table
            document.getElementById(`row-${productId}`).remove();
            const token = localStorage.getItem("token");
            if (token) {
            async function tary(){
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
            tary();
            }
            console.log(`Product ID: ${productId} removed from the cart`);
            }
            
            // Fetch the cart information
            const token = localStorage.getItem("token");
            
            if (!token) {
            // Use localStorage data if no token is present
            const cartItems = JSON.parse(localStorage.getItem('sells')) || [];
            handleCartData(cartItems);
            } 
            else
            {
            // Fetch cart data from API
            const profileResponse = fetch('https://electro-api.robixe.online/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
            })
            })
            .then(response => response.json())
            .then(data => {
                let cartItems = data.cart;
                console.log(data);
                if (cartItems)
                    handleCartData(cartItems);
                else{
                    const cartItems = JSON.parse(localStorage.getItem('sells')) || [];
                    handleCartData(cartItems);
                }
            })
            .catch(error => console.error('Error fetching cart:', error));
            }
            
            // Event listener for quantity changes
            document.addEventListener('change', (event) => {
            if (event.target.matches('input[type="number"]') && event.target.value < 100 && event.target.value > 0) 
            {
            const productId = event.target.id.split('-')[1];
            const newQuantity = event.target.value;
            
            if (token) {
                // Update the cart on the server
                console.log(`Updating cart on the server: Product ID: ${productId}, New Quantity: ${newQuantity}`);
                // Add server update logic here
            } else {
                // Update the cart in localStorage
                let sells = JSON.parse(localStorage.getItem("sells")) || [];
                const productIndex = sells.findIndex(item => item.productId === productId);
                if (productIndex !== -1) {
                    sells[productIndex].productQuantity = newQuantity;
                } else {
                    sells.push({ productId, productQuantity: newQuantity });
                }
                localStorage.setItem("sells", JSON.stringify(sells));
                console.log(`Product ID: ${productId}, New Quantity: ${newQuantity}`);
            }
            }
            window.location.reload();
            });
            const btn = document.getElementById("btn");
            btn.addEventListener("click", async function () {
                    const productQuantity = document.querySelector('input[type="number"]').value;
                    const token = localStorage.getItem("token");
                    const conf = confirm("you want to Proceed to checkout");
                    if (!token && conf) {
                        window.location.href = '/login';
                        return;
                    }
            });
            
            