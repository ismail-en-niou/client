const bar = document.getElementById("bar");
let nav = document.getElementById("navbar");
let close =document.getElementById("close")
    bar.addEventListener('click', () => {
        nav.classList.add('active');
        close.style.display = "initial" 
       /// Check your class name here
    });
    close.addEventListener('click', () => {
        nav.classList.remove('active'); // Check your class name here
    });


// add products
