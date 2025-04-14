const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const loginBtn = document.querySelector(".sign-in-btn");
const errorBox = document.getElementById("error");
const successBox = document.querySelector(".login-success");
const errorCloseBtn = document.getElementById("error-btn-close");
const remember = document.getElementById("remember");
const checkValue = document.getElementById("check");

function showError(messages) {
  errorBox.innerHTML = `
    <div class="error-head">
      <div class="left">
        <i class="minus fa-solid fa-minus"></i>
        <h4>Error</h4>
      </div>
      <i class="fa-solid fa-xmark close" id="error-btn-close"></i>
    </div>
  `;
  messages.forEach((msg) => {
    const p = document.createElement("p");
    p.textContent = msg;
    errorBox.appendChild(p);
  });
  errorBox.style.display = "block";
  timeoutId = setTimeout(() => {
    errorBox.style.display = "none";
    clearTimeout(timeoutId);
    errorBox.innerHTML = "";
  }, 3000);
  document.getElementById("error-btn-close").onclick = () => {
    errorBox.style.display = "none";
    clearTimeout(timeoutId);
  };
}

window.addEventListener("DOMContentLoaded", () => {
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  const rememberedPass = localStorage.getItem("rememberedPass");
  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    passwordInput.value = rememberedPass;
    remember.checked = true;
  }
});

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  errorBox.style.display = "none";
  successBox.style.display = "none";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const errors = [];

  if (email === "") {
    errors.push("Email không được bỏ trống");
  }
  if (password === "") {
    errors.push("Mật khẩu không được bỏ trống");
  }

  if (errors.length > 0) {
    showError(errors);
    return;
  }

  const savedUsers = JSON.parse(localStorage.getItem("user")) || [];

  const foundUser = savedUsers.find(
    (user) =>
      user.email.trim().toLowerCase() === email.toLowerCase() &&
      user.password === password
  );

  if (!foundUser) {
    showError(["Email hoặc mật khẩu không đúng"]);
    localStorage.removeItem("rememberedPass");
    return;
  }

  if (remember.checked) {
    localStorage.setItem("rememberedEmail", email);
    localStorage.setItem("rememberedPass", password);
  } else {
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPass");
  }
  successBox.style.display = "flex";
  const userFound = savedUsers.find((user) => user.email === emailInput.value);

  if (userFound) {
    let userNameLogin = userFound.name;
    localStorage.setItem("nameLogin", JSON.stringify(userNameLogin));
  }

  setTimeout(() => {
    window.location.href = "./pages/home.html";
  }, 1000);
});
