document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const gender = document.getElementById("gender").value;
    const errorMessage = document.getElementById("errorMessage");

    // Password match validation
    if (password !== confirmPassword) {
        errorMessage.style.display = "block";
        return;
    } else {
        errorMessage.style.display = "none";
    }

    // Basic validation check for other fields
    if (username && password && gender) {
        submitSignup(username, password, gender);
    } else {
        openDialog();
    }
});

async function submitSignup(username, password, gender) {
    const userData = { username, password, gender };

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            alert("Account created successfully!");
            window.location.href = "index.html"; // Redirect to login page
        } else {
            openDialog();
        }
    } catch (error) {
        console.error('Error:', error);
        openDialog();
    }
}

function openDialog() {
    document.getElementById("dialog").style.display = "flex";
}

function closeDialog() {
    document.getElementById("dialog").style.display = "none";
}

function goToLogin() {
    window.location.href = "index.html"; // Link back to login page
}
