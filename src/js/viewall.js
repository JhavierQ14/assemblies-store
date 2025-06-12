document.addEventListener('DOMContentLoaded', function () {
    const moreBtn = document.querySelector('.more-btn .btn');
    const boxContainer = document.querySelector('.products .box-container');

    const extraProducts = [
        {
            img: "uploaded_img/ram-2.png",
            cat: "Memoria RAM DDR4",
            name: "Kingston Fury 16GB 3200MHz",
            price: 85
        },
        {
            img: "uploaded_img/cpu-2.png",
            cat: "Procesador",
            name: "AMD Ryzen 7 5800X",
            price: 310
        },
        {
            img: "uploaded_img/gpu-2.png",
            cat: "Tarjeta Gráfica",
            name: "AMD Radeon RX 6800 XT",
            price: 800
        },
        {
            img: "uploaded_img/ssd-2.png",
            cat: "SSD",
            name: "WD Black SN850 1TB NVMe",
            price: 120
        },
        {
            img: "uploaded_img/psu-2.png",
            cat: "Fuente de Poder",
            name: "Corsair RM850x 850W Gold",
            price: 140
        },
        {
            img: "uploaded_img/motherboard-2.png",
            cat: "Placa Madre",
            name: "Gigabyte Z690 AORUS Elite",
            price: 350
        }
    ];

    let showingMore = false;
    let extraForms = [];

    moreBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!showingMore) {
            // Mostrar más productos
            extraForms = extraProducts.map(prod => {
                const form = document.createElement('form');
                form.className = 'box extra-product';
                form.method = 'post';
                form.innerHTML = `
                    <a href="quick_view.html" class="fas fa-eye"></a>
                    <button class="fas fa-shopping-cart" type="submit" name="add_to_cart"></button>
                    <img src="${prod.img}" alt="">
                    <a href="category.html" class="cat">${prod.cat}</a>
                    <div class="name">${prod.name}</div>
                    <div class="flex">
                        <div class="price"><span>$</span>${prod.price}<span>/-</span></div>
                        <input type="number" name="qty" class="qty" min="1" max="99" value="1" onkeypress="if(this.value.length == 2) return false;">
                    </div>
                `;
                boxContainer.appendChild(form);
                return form;
            });
            moreBtn.textContent = 'Ver menos';
            showingMore = true;
        } else {
            // Ocultar productos extra
            extraForms.forEach(form => boxContainer.removeChild(form));
            extraForms = [];
            moreBtn.textContent = 'Ver más';
            showingMore = false;
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
   const themeToggle = document.getElementById('theme-toggle');
   const themeIcon = themeToggle.querySelector('i');
   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   const savedTheme = localStorage.getItem('theme');

   function setTheme(dark) {
      if (dark) {
         document.body.classList.add('dark-mode');
         themeIcon.classList.remove('fa-moon');
         themeIcon.classList.add('fa-sun');
      } else {
         document.body.classList.remove('dark-mode');
         themeIcon.classList.remove('fa-sun');
         themeIcon.classList.add('fa-moon');
      }
   }

   // Inicializa el tema
   if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setTheme(true);
   } else {
      setTheme(false);
   }

   themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const isDark = document.body.classList.toggle('dark-mode');
      setTheme(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
   });
});