let searchForm = document.querySelector(".search-form");

document.querySelector("#search-btn").onclick = () => {
  searchForm.classList.toggle("active");
  shoppingCart.classList.remove("active");
  loginForm.classList.remove("active");
  navbar.classList.remove("active");
};

let shoppingCart = document.querySelector(".shopping-cart");

document.querySelector("#cart-btn").onclick = () => {
  shoppingCart.classList.toggle("active");
  searchForm.classList.remove("active");
  loginForm.classList.remove("active");
  navbar.classList.remove("active");
};

let loginForm = document.querySelector(".login-form");

document.querySelector("#login-btn").onclick = () => {
  loginForm.classList.toggle("active");
  searchForm.classList.remove("active");
  shoppingCart.classList.remove("active");
  navbar.classList.remove("active");
};

let navbar = document.querySelector(".navbar");

document.querySelector("#menu-btn").onclick = () => {
  navbar.classList.toggle("active");
  searchForm.classList.remove("active");
  shoppingCart.classList.remove("active");
  loginForm.classList.remove("active");
};

window.onscroll = () => {
  searchForm.classList.remove("active");
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

// Intercept form submissions
document.querySelectorAll("form").forEach((form) => {
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
