"use strict";
const $ = (s) => document.querySelector(s);

// 1. Menú responsive
const menu = $("#menu"), btnMenu = $("#btnMenu");
btnMenu.addEventListener("click", () => {
  const abierto = menu.classList.toggle("abierto");
  btnMenu.setAttribute("aria-expanded", abierto);
});
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.classList.remove("abierto")));

// 2. Tema claro/oscuro (se recuerda la elección)
const btnTema = $("#btnTema");
function aplicarTema(t) {
  document.documentElement.dataset.theme = t;
  btnTema.textContent = t === "dark" ? "☀️" : "🌙";
}
aplicarTema(localStorage.getItem("tema") || "light");
btnTema.addEventListener("click", () => {
  const nuevo = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("tema", nuevo);
  aplicarTema(nuevo);
});

// 3. Reloj y estado abierto/cerrado
function actualizarReloj() {
  const ahora = new Date(), dia = ahora.getDay(), h = ahora.getHours();
  $("#reloj").textContent = ahora.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
  const abierto = dia === 0 ? h >= 8 && h < 14 : h >= 7 && h < 19;
  $("#estado").textContent = abierto ? "Abierto ahora" : "Cerrado ahora";
}
actualizarReloj();
setInterval(actualizarReloj, 30000);

// 4. Buscador de productos
$("#buscador").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  let visibles = 0;
  document.querySelectorAll(".producto").forEach((p) => {
    const ok = (p.dataset.nombre + " " + p.textContent).toLowerCase().includes(q);
    p.hidden = !ok;
    if (ok) visibles++;
  });
  $("#sinResultados").hidden = visibles > 0;
});

// 5. Galería interactiva
const visor = $("#visor");
document.querySelectorAll(".item").forEach((it) => it.addEventListener("click", () => {
  $("#visorImg").innerHTML = it.innerHTML;
  $("#visorTxt").textContent = it.dataset.desc;
  visor.hidden = false;
}));
$("#cerrarVisor").addEventListener("click", () => (visor.hidden = true));
visor.addEventListener("click", (e) => { if (e.target === visor) visor.hidden = true; });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") visor.hidden = true; });

// 6. Preguntas frecuentes desplegables
document.querySelectorAll(".faq-q").forEach((q) => q.addEventListener("click", () => {
  const resp = q.nextElementSibling, abrir = resp.hidden;
  resp.hidden = !abrir;
  q.setAttribute("aria-expanded", abrir);
}));

// 7. Botón volver arriba
const arriba = $("#btnArriba");
window.addEventListener("scroll", () => (arriba.hidden = window.scrollY < 400));
arriba.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// 8. Contador de visitas simulado
const visitas = Number(localStorage.getItem("visitas") || 0) + 1;
localStorage.setItem("visitas", visitas);
$("#visitas").textContent = visitas;

// 9. Validación del formulario
$("#formContacto").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = $("#nombre").value.trim(), correo = $("#correo").value.trim(), msg = $("#mensaje").value.trim();
  const errores = {
    errNombre: nombre.length < 3 ? "Escribe tu nombre (mínimo 3 letras)." : "",
    errCorreo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ? "" : "Escribe un correo válido.",
    errMensaje: msg.length < 10 ? "El mensaje debe tener al menos 10 caracteres." : "",
  };
  Object.entries(errores).forEach(([id, t]) => ($("#" + id).textContent = t));
  const ok = Object.values(errores).every((t) => !t);
  $("#exito").hidden = !ok;
  if (ok) e.target.reset();
});
