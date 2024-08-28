document.addEventListener('DOMContentLoaded', () => {
 // Elements
 const switchCtn = document.querySelector("#switch-cnt");
 const switchC1 = document.querySelector("#switch-c1");
 const switchC2 = document.querySelector("#switch-c2");
 const switchCircle = document.querySelectorAll(".switch__circle");
 const switchBtn = document.querySelectorAll(".switch-btn");
 const aContainer = document.querySelector("#a-container");
 const bContainer = document.querySelector("#b-container");
 const allButtons = document.querySelectorAll(".submit");

 // Handle button click to prevent default behavior
 const getButtons = (e) => e.preventDefault();

 // Handle form switching
 const changeForm = (e) => {
     switchCtn.classList.add("is-gx");
     setTimeout(() => {
         switchCtn.classList.remove("is-gx");
     }, 1500);

     switchCtn.classList.toggle("is-txr");
     switchCircle.forEach(circle => circle.classList.toggle("is-txr"));

     switchC1.classList.toggle("is-hidden");
     switchC2.classList.toggle("is-hidden");
     aContainer.classList.toggle("is-txl");
     bContainer.classList.toggle("is-txl");
     bContainer.classList.toggle("is-z200");
 };

 // Attach event listeners to form buttons
 allButtons.forEach(button => button.addEventListener("click", getButtons));
 switchBtn.forEach(button => button.addEventListener("click", changeForm));

 // Function to handle sign-up
 async function handleSignUp(event) {
 event.preventDefault();

 const email = document.getElementById('signupEmail').value;
 const password = document.getElementById('signupPassword').value;
 const user = document.getElementById("signupUser").value;

 try {
     const response = await fetch('https://electro-api.robixe.online/sgin-in', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
             user: user,
             email: email,
             pass: password
         }),
     });

     if (response.status === 200) { // Check for a successful status code
         alert('Sign up successful!');
         console.log('Sign up response:', data);
     } else if (response.status === 400) {
         // Handle specific status code for bad requests
         const data = await response.json();
         alert('Sign up failed: ' + (data.message || 'Bad request'));
         console.log('Sign up error:', data);
     } else {
         // Handle other status codes
         alert('Sign up failed: ' + response.statusText);
         console.log('Sign up error:', response.statusText);
     }
 } catch (error) {
     // Handle network errors and other exceptions
     console.error('Error during sign up:', error);
 }
}



 // Function to handle login
 async function handleLogin(event) {
     event.preventDefault();

     const email = document.getElementById('loginEmail').value;
     const password = document.getElementById('loginPassword').value;

     try {
         const response = await fetch('https://electro-api.robixe.online/log-in', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({ 
                 email: email,
                 pass: password
             }),
         });

         const data = await response.json();

         if (response.ok) {
             alert('Login successful!');
             console.log('Login response:', data);
             localStorage.setItem('token', data.token);
             window.location.href = "../cart/cart.html";
         } else {
             alert('Login failed: ' + data.message);
             console.log('Login error:', data);
         }
     } catch (error) {
         console.error('Error during login:', error);
     }
 }

 // Attach event listeners to forms
 document.getElementById('signupForm').addEventListener('submit', handleSignUp);
 document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

