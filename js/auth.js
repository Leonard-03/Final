function toggleLogin() {
  document.getElementById("loginDropdown").classList.toggle("active");
  document.getElementById("modalOverlay").classList.toggle("active");
  document.getElementById("registerDropdown").classList.remove("active");
}

function toggleRegister() {
  document.getElementById("registerDropdown").classList.toggle("active");
  document.getElementById("modalOverlay").classList.toggle("active");
  document.getElementById("loginDropdown").classList.remove("active");
}

function switchToRegister() {
  document.getElementById("loginDropdown").classList.remove("active");
  document.getElementById("registerDropdown").classList.add("active");
}

function switchToLogin() {
  document.getElementById("registerDropdown").classList.remove("active");
  document.getElementById("loginDropdown").classList.add("active");
}

document.getElementById("modalOverlay").addEventListener("click", function () {
  document.getElementById("loginDropdown").classList.remove("active");
  document.getElementById("registerDropdown").classList.remove("active");
  this.classList.remove("active");
});

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("regUser").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPass").value;

  if (pass.length < 6) {
    alert("Password should be at least 6 characters");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userExists = users.some(u => u.username === user || u.email === email);

  if (userExists) {
    alert("Username or email already exists");
    return;
  }

  users.push({
    username: user,
    email: email,
    password: pass
  });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully! Please log in.");
  this.reset();
  switchToLogin();
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputUser = document.getElementById("loginUser").value.trim();
  const inputPass = document.getElementById("loginPass").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u =>
    u.username === inputUser || u.email === inputUser
  );

  if (user && user.password === inputPass) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", user.username);

    document.getElementById("loginDropdown").classList.remove("active");
    document.getElementById("modalOverlay").classList.remove("active");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username/email or password. Please try again.");
  }
});

document.addEventListener("click", function (event) {
  const loginDropdown = document.getElementById("loginDropdown");
  const registerDropdown = document.getElementById("registerDropdown");
  const modalOverlay = document.getElementById("modalOverlay");
  const userLinks = document.querySelector(".user-links");

  if (
    !loginDropdown.contains(event.target) &&
    !registerDropdown.contains(event.target) &&
    !userLinks.contains(event.target) &&
    modalOverlay.classList.contains("active")
  ) {
    loginDropdown.classList.remove("active");
    registerDropdown.classList.remove("active");
    modalOverlay.classList.remove("active");
  }
});
