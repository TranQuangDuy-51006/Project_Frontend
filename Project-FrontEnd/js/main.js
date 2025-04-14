// menu
let btnOpenNav = document.getElementById("btn-open-nav");
let btnCloseNav = document.getElementById("btn-close-nav");
let menu = document.getElementById("menu");
let nav = document.getElementById("nav");
let userName = document.getElementById("userName");

btnOpenNav.onclick = () => {
  menu.classList.add("show-menu");
  nav.classList.add("on-menu-nav");
  btnOpenNav.style.display = "none";
  btnCloseNav.style.display = "block";
};

btnCloseNav.onclick = () => {
  menu.classList.remove("show-menu");
  nav.classList.remove("on-menu-nav");
  btnOpenNav.style.display = "block";
  btnCloseNav.style.display = "none";
};

const nameLogin = JSON.parse(localStorage.getItem("nameLogin")) || "";

console.log(nameLogin);

userName.innerText = nameLogin;
