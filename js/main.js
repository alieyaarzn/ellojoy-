/* =========================
   NAV (MOBILE)
========================= */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu after clicking a link (mobile)
  navMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================
   YEAR
========================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================
   REVEAL ON SCROLL
========================= */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("in-view");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

/* =========================
   PRODUCTS DATA
========================= */
const products = {
  flavour: [
    ["Strawberry","Manis masam segar","39","STRAWBERRY.png"],
    ["Soya","Lemak ringan","39","SOYA BEAN.png"],
    ["Pineapple","Tropika masam manis","39","PINEAPPLE.png"],
    ["Watermelon","Ringan & segar","39","WATERMELON.png"],
    ["Teh O Ais Limau","Teh klasik","39","TEH O AIS LIMAU.png"],
    ["Lychee","Manis wangi","39","LYCHEE.png"],
    ["Mango","Mangga berkrim","39","MANGO.png"],
    ["Grape","Manis anggur","39","GRAPE.png"],
    ["Guava","Jambu segar","39","PINK GUAVA.png"],
    ["Honey Lemon","Masam manis","39","HONEY LEMON.png"],
    ["Limau Ais","Asam menyegarkan","39","LIMAU AIS.png"],
    ["Peach","Fruity lembut","39","PEACH.png"],
    ["Apple","Epal segar","39","APPLE.png"],
    ["Honeydew","Manis melon","39","HONEYDEW.png"],
    ["Caribbean Coffee","Aroma kopi tropika","39","CARIBBEAN COFFEE.png"],
    ["Cola Soda","Soda klasik","39","COLA SODA.png"]
  ],
  monkfruit: [["Monk Fruit Extract","Manis semula jadi","39","MONK FRUIT.png"]],
  sucralose: [["Original","Manis neutral tanpa kalori","39","SUCRALOSE.png"]],
  fury: [
    ["Original","Tenaga bersih","39","zg fury original.png"],
    ["Mango Strawberry","Masam manis bertenaga","39","zg fury mangostrawberry.png"],
    ["Blackcurrant","Berry masam","39","zg fury blackcurrant.png"],
    ["Apple Asam Boi","Masam unik","39","zg fury asamboi.png"]
  ],
  coffee: [
    ["Black Stallion Coffee","Kopi lelaki","39","black stallion.png"],
    ["Rose Mare Coffee","Kopi wanita","39","rose mare.png"],
    ["Ener Choc","Coklat tenaga","39","ener choc.png"]
  ],
  aromedix: [["Minyak Aromedix","Herba semula jadi","39","aromedix.JPG"]]
};

function cardHTML(p){
  return `
    <div class="product-card">
      <img src="img/${p[3]}" alt="${p[0]}">
      <h3>${p[0]}</h3>
      <span class="price">RM ${p[2]}</span>
      <p>${p[1]}</p>
    </div>
  `;
}

/* =========================
   HOME SLIDER (index.html only)
========================= */
const track = document.getElementById("sliderTrack");
const dots = document.getElementById("sliderDots");
const nextBtn = document.querySelector(".slider-btn.next");
const prevBtn = document.querySelector(".slider-btn.prev");
const categoryBtns = document.querySelectorAll(".product-category button");

let currentCat = "flavour";
let index = 0;
let autoSlide = null;

function getStepPx(){
  // step = card width + gap
  const card = track?.querySelector(".product-card");
  if (!card) return 278;
  const gap = 18;
  return card.getBoundingClientRect().width + gap;
}

function renderDots(total){
  if (!dots) return;
  dots.innerHTML = "";
  for (let i=0; i<total; i++){
    const d = document.createElement("span");
    d.className = "dot" + (i===0 ? " active" : "");
    d.addEventListener("click", () => {
      index = i;
      updateSlide();
      restartAuto();
    });
    dots.appendChild(d);
  }
}

function updateSlide(){
  if (!track) return;
  const step = getStepPx();
  track.style.transform = `translateX(-${index * step}px)`;

  if (dots){
    [...dots.children].forEach(d => d.classList.remove("active"));
    if (dots.children[index]) dots.children[index].classList.add("active");
  }
}

function loadProducts(cat){
  if (!track) return;
  currentCat = cat;
  track.innerHTML = "";
  index = 0;

  products[cat].forEach(p => track.insertAdjacentHTML("beforeend", cardHTML(p)));
  renderDots(products[cat].length);

  updateSlide();
  restartAuto();
}

function nextSlide(){
  if (!track) return;
  const total = track.children.length || 1;
  index = (index + 1) % total;
  updateSlide();
}

function prevSlide(){
  if (!track) return;
  const total = track.children.length || 1;
  index = (index - 1 + total) % total;
  updateSlide();
}

function restartAuto(){
  clearInterval(autoSlide);
  autoSlide = setInterval(nextSlide, 4000);
}

if (track && dots) {
  loadProducts("flavour");

  nextBtn?.addEventListener("click", () => { nextSlide(); restartAuto(); });
  prevBtn?.addEventListener("click", () => { prevSlide(); restartAuto(); });

  // pause on hover
  const sliderContainer = document.querySelector(".slider-container");
  sliderContainer?.addEventListener("mouseenter", () => clearInterval(autoSlide));
  sliderContainer?.addEventListener("mouseleave", () => restartAuto());

  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".product-category .active")?.classList.remove("active");
      btn.classList.add("active");
      loadProducts(btn.dataset.cat);
    });
  });

  // resize fix
  window.addEventListener("resize", () => updateSlide());
}

/* =========================
   PRODUCTS PAGE GRID (products.html only)
========================= */
const grid = document.getElementById("productGrid");
const filterBtns = document.querySelectorAll(".pill");

function flattenProducts(){
  const all = [];
  Object.keys(products).forEach(cat => {
    products[cat].forEach(p => all.push({ cat, p }));
  });
  return all;
}

function renderGrid(filter){
  if (!grid) return;
  grid.innerHTML = "";

  const all = flattenProducts();
  const show = filter === "all" ? all : all.filter(x => x.cat === filter);

  show.forEach(x => {
    const wrap = document.createElement("div");
    wrap.innerHTML = cardHTML(x.p);
    grid.appendChild(wrap.firstElementChild);
  });

  // reveal items (optional)
  grid.querySelectorAll(".product-card").forEach(el => {
    el.classList.add("reveal", "fade-up");
    io.observe(el);
  });
}

if (grid) {
  renderGrid("all");

  filterBtns.forEach(b => {
    b.addEventListener("click", () => {
      document.querySelector(".pill.active")?.classList.remove("active");
      b.classList.add("active");
      renderGrid(b.dataset.filter);
    });
  });
}
