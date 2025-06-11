let shoppingCart = document.querySelector(".shopping-cart");

document.querySelector("#cart-btn").onclick = () => {
  shoppingCart.classList.toggle("active");
  loginForm.classList.remove("active");
  navbar.classList.remove("active");
};

let loginForm = document.querySelector(".login-form");

document.querySelector("#login-btn").onclick = () => {
  loginForm.classList.toggle("active");
  shoppingCart.classList.remove("active");
  navbar.classList.remove("active");
};

let navbar = document.querySelector(".navbar");

document.querySelector("#menu-btn").onclick = () => {
  navbar.classList.toggle("active");
  shoppingCart.classList.remove("active");
  loginForm.classList.remove("active");
};

window.onscroll = () => {
  shoppingCart.classList.remove("active");
  loginForm.classList.remove("active");
  navbar.classList.remove("active");
};

var swiper = new Swiper(".product-slider", {
  loop: true,
  spaceBetween: 20,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1020: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".review-slider", {
  loop: true,
  spaceBetween: 20,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1020: {
      slidesPerView: 3,
    },
  },
});

// Function to show notification popup
function showNotification(message, isError = false) {
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  
  // Set message and style
  notificationMessage.textContent = message;
  notification.className = 'notification-popup';
  notification.classList.add(isError ? 'error' : 'success');
  
  // Add icon
  const icon = document.createElement('i');
  icon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  notification.prepend(icon);
  
  // Show notification
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Function to show the popup with a custom message
function showPopup(message) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  popupMessage.textContent = message;
  popup.classList.remove("hidden");
}

// Function to close the popup
function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("hidden");
}

// Check if user is logged in from localStorage
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Function to update UI based on login state
function updateUI(loggedIn) {
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminOnlyTabs = document.querySelectorAll('.admin-only');
  
  if (loggedIn) {
    // Admin view - show all tabs
    loginForm.style.display = 'none';
    logoutBtn.style.display = 'block';
    adminOnlyTabs.forEach(tab => {
      tab.style.display = 'block';
    });
    // Show first tab
    const firstTab = document.querySelector('#adminTabs .tab-link');
    if (firstTab) {
      openTab({currentTarget: firstTab}, firstTab.getAttribute('onclick').match(/'([^']+)'/)[1]);
    }
  } else {
    // Guest view - show only 'Thêm ảnh nhận diện' tab
    loginForm.style.display = 'block';
    logoutBtn.style.display = 'none';
    adminOnlyTabs.forEach(tab => {
      tab.style.display = 'none';
    });
    // Show 'Thêm ảnh nhận diện' tab
    const guestTab = document.querySelector('#adminTabs .tab-link:not(.admin-only)');
    if (guestTab) {
      openTab({currentTarget: guestTab}, guestTab.getAttribute('onclick').match(/'([^']+)'/)[1]);
    }
  }
}

// Initialize UI based on login state
document.addEventListener('DOMContentLoaded', function() {
  updateUI(isLoggedIn);
});

// Toggle user dropdown menu or login form
document.querySelector('#login-btn').addEventListener('click', function(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('logout-dropdown');
  const loginForm = document.querySelector('.login-form');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn) {
    // Toggle dropdown for logged-in users
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    // Ensure login form is hidden
    loginForm.style.display = 'none';
  } else {
    // Toggle login form for guests
    loginForm.style.display = loginForm.style.display === 'block' ? 'none' : 'block';
    // Ensure dropdown is hidden
    dropdown.style.display = 'none';
  }
});

// Close dropdown and login form when clicking outside
document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('logout-dropdown');
  const loginForm = document.querySelector('.login-form');
  const loginBtn = document.getElementById('login-btn');
  
  // Close dropdown when clicking outside
  if (dropdown && !dropdown.contains(e.target) && e.target !== loginBtn && !loginBtn.contains(e.target)) {
    dropdown.style.display = 'none';
  }
  
  // Close login form when clicking outside
  if (loginForm && !loginForm.contains(e.target) && e.target !== loginBtn && !loginBtn.contains(e.target)) {
    loginForm.style.display = 'none';
  }
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginForm = this;
  
  // Simple validation
  if (!username || !password) {
    showNotification('Vui lòng điền đầy đủ thông tin!', true);
    return;
  }
  
  // Simulate API call with timeout
  setTimeout(() => {
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isLoggedIn', 'true');
      updateUI(true);
      loginForm.reset();
      loginForm.style.display = 'none';
      showNotification('Đăng nhập thành công!');
    } else {
      showNotification('Tên đăng nhập hoặc mật khẩu không đúng!', true);
      // Shake animation for wrong credentials
      loginForm.style.animation = 'shake 0.5s';
      setTimeout(() => {
        loginForm.style.animation = '';
      }, 500);
    }
  }, 500);
});

// Logout function
window.logout = function() {
  // Show loading state
  const dropdown = document.getElementById('logout-dropdown');
  const logoutBtn = dropdown.querySelector('.logout-btn');
  const originalText = logoutBtn.innerHTML;
  
  logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đăng xuất...';
  logoutBtn.disabled = true;
  
  // Simulate API call with timeout
  setTimeout(() => {
    localStorage.setItem('isLoggedIn', 'false');
    updateUI(false);
    dropdown.style.display = 'none';
    showNotification('Đã đăng xuất thành công!');
    
    // Reset button state
    logoutBtn.innerHTML = originalText;
    logoutBtn.disabled = false;
  }, 500);
};

// Add shake animation for wrong login attempts
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
  }
`;
document.head.appendChild(style);

// Update UI based on login state
function updateUI(isLoggedIn) {
  const loginBtn = document.getElementById('login-btn');
  const adminTabs = document.querySelectorAll('.admin-only');
  
  if (isLoggedIn) {
    // Update UI for logged-in user
    loginBtn.classList.add('logged-in');
    adminTabs.forEach(tab => tab.style.display = 'block');
  } else {
    // Update UI for guest
    loginBtn.classList.remove('logged-in');
    adminTabs.forEach(tab => tab.style.display = 'none');
    
    // Show the default tab for guests
    const defaultTab = document.querySelector('.tab-link:not(.admin-only)');
    if (defaultTab) {
      const tabId = defaultTab.getAttribute('onclick').match(/'([^']+)'/)[1];
      openTab({currentTarget: defaultTab}, tabId);
    }
  }
}

// Show form message
function showFormMessage(form, message, type = 'info') {
  const messageEl = form.querySelector('.form-message');
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = 'form-message ' + type;
    messageEl.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }
}

// Handle category form submission
document.querySelector('.category-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = this;
  const submitBtn = form.querySelector('#addCategoryBtn');
  const loadingMessage = document.getElementById('loadingMessage');
  const formData = new FormData(form);
  
  // Show loading message
  loadingMessage.style.display = 'block';
  submitBtn.disabled = true;
  
  // Animate the dots
  const dots = loadingMessage.querySelector('.loading-dots');
  let dotCount = 3;
  const dotInterval = setInterval(() => {
    dotCount = (dotCount % 3) + 1;
    dots.textContent = '.'.repeat(dotCount);
  }, 500);
  
  try {
    // Submit form
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      redirect: 'manual'
    });

    // Handle redirect
    if (response.type === 'opaqueredirect' || response.redirected) {
      window.location.href = response.url;
      return;
    }

    // Handle JSON response
    try {
      const result = await response.json();
      if (result.redirect) {
        window.location.href = result.redirect;
      } else {
        throw new Error('No redirect URL in response');
      }
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      throw new Error('Invalid server response');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại.');
  } finally {
    clearInterval(dotInterval);
    loadingMessage.style.display = 'none';
    submitBtn.disabled = false;
  }
});

// Intercept other form submissions
document.querySelectorAll("form:not(#loginForm):not(.category-form)").forEach((form) => {
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const actionUrl = this.action;

    // ✅ Inject date-time for "add-category" form only
    if (actionUrl.includes("add-category")) {
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, "0");
      const formatted = `${now.getFullYear()}_${pad(now.getDate())}_${pad(now.getMonth() + 1)}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}`;
      const input = form.querySelector("input[name='categoryName']");
      if (input) input.value = formatted;
    }

    const formData = new FormData(this);

    fetch(actionUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit form");
        }
        // Check if the response is a redirect
        if (response.redirected) {
          // Follow the server's redirect URL
          window.location.href = response.url;
        } else {
          return response.text();
        }
      })
      .then((message) => {
        if (actionUrl.includes("add-product")) {
          // Show popup for "Add Product" form
          showPopup(message);
        } else if (actionUrl.includes("add-category")) {
          // No need for manual redirect; handled by response.redirected
          console.log("Add category successful:", message);
        } else {
          // For other forms, log the response
          console.log("Form submitted successfully:", message);
        }
      })
      .catch((error) => {
        if (actionUrl.includes("add-product")) {
          // Show popup for "Add Product" form on error
          showPopup("An error occurred: " + error.message);
        } else {
          // Log error for other forms, including "Add Category"
          console.error("Error submitting form:", error);
        }
      });
  });
});
