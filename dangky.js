// Lấy các phần tử cần dùng
const form = document.getElementById("registerForm");
const fullname = document.getElementById("fullname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const agreeCheckbox = document.getElementById("agree");
const submitBtn = document.getElementById("submitBtn");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const agreeError = document.getElementById("agreeError");
const errorMessages = document.getElementById("errorMessages");
const strengthText = document.getElementById("passwordStrength");

// Ẩn/hiện mật khẩu
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const input = document.querySelector(icon.getAttribute("toggle"));
    const type = input.type === "password" ? "text" : "password";
    input.type = type;
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });
});

// Cập nhật trạng thái nút
function updateSubmitState() {
  submitBtn.disabled = !agreeCheckbox.checked;
  submitBtn.style.opacity = agreeCheckbox.checked ? "1" : "0.6";
}
agreeCheckbox.addEventListener("change", updateSubmitState);
updateSubmitState();

// Kiểm tra độ mạnh mật khẩu theo thời gian thực
password.addEventListener("input", () => {
  const strength = evaluatePasswordStrength(password.value);
  strengthText.textContent = `🔒 ${strength.text}`;
  strengthText.style.color = strength.color;
  validatePassword();
  validateConfirmPassword(); // để cập nhật nếu đang nhập lại
});

// Đánh giá mật khẩu
function evaluatePasswordStrength(pw) {
  const length = pw.length;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);

  let score = 0;
  if (length >= 8) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  if (pw === "") {
    return { text: "", color: "gray" };
  } else if (score >= 5) {
    return { text: "Mật khẩu mạnh", color: "green" };
  } else if (score >= 3) {
    return { text: "Mật khẩu trung bình", color: "orange" };
  } else {
    return { text: "Mật khẩu yếu", color: "red" };
  }
}

// Kiểm tra email real-time
email.addEventListener("input", validateEmail);
function validateEmail() {
  const val = email.value.trim();
  if (val === "") {
    emailError.textContent = "Email không được để trống.";
    return false;
  } else if (!/^\S+@\S+\.\S+$/.test(val)) {
    emailError.textContent = "Email không hợp lệ.";
    return false;
  } else {
    emailError.textContent = "";
    return true;
  }
}

// Kiểm tra mật khẩu real-time
function validatePassword() {
  const val = password.value.trim();
  if (val === "") {
    passwordError.textContent = "Mật khẩu không được để trống.";
    return false;
  } else if (val.length < 6) {
    passwordError.textContent = "Mật khẩu quá ngắn (tối thiểu 6 ký tự).";
    return false;
  } else {
    passwordError.textContent = "";
    return true;
  }
}

// Kiểm tra xác nhận mật khẩu real-time
confirmPassword.addEventListener("input", validateConfirmPassword);
function validateConfirmPassword() {
  if (confirmPassword.value !== password.value) {
    confirmPasswordError.textContent = "Mật khẩu xác nhận không khớp.";
    return false;
  } else {
    confirmPasswordError.textContent = "";
    return true;
  }
}

// Xử lý submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorMessages.textContent = "";
  agreeError.textContent = "";

  const isFullname = fullname.value.trim() !== "";
  const isValidEmail = validateEmail();
  const isValidPassword = validatePassword();
  const isValidConfirm = validateConfirmPassword();
  const isAgreed = agreeCheckbox.checked;

  if (!isFullname) {
    errorMessages.textContent = "Vui lòng nhập họ và tên.";
  }

  if (!isAgreed) {
    agreeError.textContent = "Bạn phải đồng ý với điều khoản.";
  }

  if (isFullname && isValidEmail && isValidPassword && isValidConfirm && isAgreed) {
    alert("Đăng ký thành công!");
    form.reset();
    strengthText.textContent = "";
    updateSubmitState();
  }
});
