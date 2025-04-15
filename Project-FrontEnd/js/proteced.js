const username = localStorage.getItem("nameLogin");
const btnSignOut = document.getElementById("sign-out");

if (!username) {
  window.location.href = "/";
}

btnSignOut.onclick = () => {
  localStorage.removeItem("nameLogin");
};
