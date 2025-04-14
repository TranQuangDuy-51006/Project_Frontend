const email = document.getElementById("email");
const userName = document.getElementById("user-name");
const pass = document.getElementById("password");
const btn = document.getElementById("btn-register");
const errorBox = document.getElementById("error");
const successBox = document.querySelector(".login-success");
const errorCloseBtn = document.getElementById("error-btn-close");

let user = JSON.parse(localStorage.getItem("user")) || [];

btn.addEventListener("click", function (e) {
  e.preventDefault();

  errorBox.style.display = "none";
  successBox.style.display = "none";
  errorBox.querySelectorAll("p").forEach((p) => p.remove());

  let isValid = true;

  if (email.value.trim() === "") {
    appendError("Email không được bỏ trống");
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    appendError("Email không đúng định dạng");
    isValid = false;
  } else if (!email.value.endsWith("@gmail.com")) {
    appendError("Email phải có định dạng @gmail.com");
    isValid = false;
  } else {
    if (user.some((u) => u.email === email.value)) {
      appendError("Email này đã được đăng ký!");
      isValid = false;
    }
  }

  if (userName.value.trim() === "") {
    appendError("Tên người dùng không được bỏ trống");
    isValid = false;
  }
  let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  if (pass.value.trim() === "") {
    appendError("Mật khẩu không được bỏ trống");
    isValid = false;
  } else if (pass.value.length < 8) {
    appendError("Mật khẩu phải có ít nhất 8 ký tự");
    isValid = false;
  } else if (!regex.test(pass.value)) {
    appendError(
      "Mật khẩu phải ít nhất 1 chữ Hoa, 1 chữ số, 1 chữ thường và 1 ký tự đặc biệt"
    );
    isValid = false;
    console.log(pass.value);
  }

  if (!isValid) {
    errorBox.style.display = "block";
    timeoutId = setTimeout(() => {
      errorBox.style.display = "none";
    }, 3000);
    return;
  }

  successBox.style.display = "flex";

  let push = {
    id: user.length + 1,
    name: userName.value,
    email: email.value,
    password: pass.value,
  };
  user.push(push);
  localStorage.setItem("user", JSON.stringify(user));

  setTimeout(() => {
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPass");
    window.location.href = "index.html";
  }, 1000);
});

errorCloseBtn.addEventListener("click", () => {
  errorBox.style.display = "none";
});

function appendError(message) {
  const p = document.createElement("p");
  p.textContent = message;
  errorBox.appendChild(p);
}
