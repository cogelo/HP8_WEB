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
  validateConfirmPassword(); // cập nhật nếu đang nhập lại
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

// Theo dõi Enter để nhảy input tiếp theo
document.querySelectorAll("#registerForm input").forEach((input, index, arr) => {
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      const next = arr[index + 1];
      if (next) {
        next.focus();
      }
    }
  });
});

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

// ================= Tooltip khi focus input =================
const tooltips = {
  fullname: "Nhập đầy đủ họ và tên của bạn.",
  email: "Ví dụ: abc@gmail.com",
  password: "Mật khẩu ít nhất 6 ký tự, nên có chữ hoa, số và ký tự đặc biệt.",
  confirmPassword: "Nhập lại đúng mật khẩu ở trên."
};

// Tạo tooltip cho mỗi input có rule
Object.keys(tooltips).forEach((id) => {
  const input = document.getElementById(id);
  if (!input) return;

  // Tạo element tooltip
  const tooltipEl = document.createElement("div");
  tooltipEl.className = "tooltip";
  tooltipEl.textContent = tooltips[id];
  input.parentElement.appendChild(tooltipEl);

  // Khi focus -> show tooltip
  input.addEventListener("focus", () => {
    tooltipEl.style.display = "block";
  });

  // Khi blur -> hide tooltip
  input.addEventListener("blur", () => {
    tooltipEl.style.display = "none";
  });
});
