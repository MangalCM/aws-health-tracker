function signin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Perform the API call to authenticate the user
  fetch("http://52.66.236.209:3000/api/auth/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
    if (data.success) {
        // Store username in local storage
        localStorage.setItem('username', username);
        // Redirect to home.html if login is successful
        window.location.href = "home.html";
    } else {
          // Show error dialog if login fails
          document.getElementById("dialog").querySelector("h3").textContent = data.message; // Set the error message
          document.getElementById("dialog").style.display = "flex"; // Show the dialog
      }
  })
  .catch(error => {
      console.error("Error during login:", error);
      openDialog(); // Show error dialog on error
  });
}


function openDialog() {
    document.getElementById("dialog").style.display = "flex";
}

function closeDialog() {
    document.getElementById("dialog").style.display = "none";
}

function openSignup() {
    window.location.href = "signup.html"; // Link to your signup page
}

