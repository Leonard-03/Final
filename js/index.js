window.addEventListener("click", function (e) {
  if (!e.target.closest(".dropdown-form") && !e.target.closest(".user-links")) {
    document.getElementById("loginDropdown").classList.remove("active");
    document.getElementById("registerDropdown").classList.remove("active");
  }
});
window.addEventListener("click", function (e) {
  if (!e.target.closest(".dropdown-form") && !e.target.closest(".user-links")) {
    document.getElementById("loginDropdown").classList.remove("active");
    document.getElementById("registerDropdown").classList.remove("active");
  }
});