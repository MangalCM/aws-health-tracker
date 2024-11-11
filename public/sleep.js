// Set initial value for sleep hours
const sleepHoursInput = document.getElementById('sleepHours');
const sleepHoursValue = document.getElementById('sleepHoursValue');

sleepHoursInput.addEventListener('input', function() {
    sleepHoursValue.textContent = `${this.value} hours`;
});

// Function to check sleep adequacy based on age
function checkSleepAdequacy(age, sleepHours) {
    let requiredSleep;

    // Determine sleep requirements based on age
    if (age <= 1) requiredSleep = [14, 17]; // Infants
    else if (age <= 2) requiredSleep = [11, 14]; // Toddlers
    else if (age <= 5) requiredSleep = [10, 13]; // Preschoolers
    else if (age <= 13) requiredSleep = [9, 11]; // School-age children
    else if (age <= 18) requiredSleep = [8, 10]; // Teenagers
    else requiredSleep = [7, 9]; // Adults

    // Check if the sleep is adequate
    if (sleepHours < requiredSleep[0]) {
        return "You might need more sleep for your age. Rest well!";
    } else if (sleepHours > requiredSleep[1]) {
        return "You're getting plenty of sleep! Great job!";
    } else {
        return "You're within the recommended sleep range for your age!";
    }
}

// Handle form submission
document.getElementById('sleepForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const sleepHours = parseFloat(sleepHoursInput.value);
    const userAge = parseInt(document.getElementById('userAge').value);
    const sleepType = document.getElementById('sleepType').value;
    
    const message = checkSleepAdequacy(userAge, sleepHours);
    
    const resultMessageDiv = document.getElementById('resultMessage');
    resultMessageDiv.textContent = message;
    resultMessageDiv.style.display = 'block';

    // Send data to server
    const username = localStorage.getItem('username'); // Get username from local storage

    fetch('/api/sleep', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, sleepHours, sleepType }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Log success message from server
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to record sleep data.');
    });
});