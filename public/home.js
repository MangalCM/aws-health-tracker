const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');

menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-open');
});

// Navigate to a page when a button is clicked
function navigateTo(page) {
    window.location.href = page;
}



// Existing code...

// Calculate BMI and display result
function calculateBMI(event) {
    event.preventDefault(); // Prevent form submission

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to meters

    if (weight > 0 && height > 0) {
        const bmi = (weight / (height * height)).toFixed(2); // Calculate BMI
        let message = '';

        // Personalized suggestions based on BMI
        if (bmi < 18.5) {
            message = `Your BMI is ${bmi}. You are underweight. It's important to eat a balanced diet and consider increasing your calorie intake to gain weight healthily.`;
        } else if (bmi >= 18.5 && bmi < 24.9) {
            message = `Your BMI is ${bmi}. You are in the normal weight range. Keep up the good work and maintain a balanced diet and regular exercise!`;
        } else if (bmi >= 25 && bmi < 29.9) {
            message = `Your BMI is ${bmi}. You are overweight. Consider incorporating more physical activity into your routine and monitor your diet to achieve a healthier weight.`;
        } else {
            message = `Your BMI is ${bmi}. You are classified as obese. It's advisable to consult with a healthcare provider for personalized advice on weight management and healthy living.`;
        }

        // Display result
        document.getElementById('bmiResult').innerText = message;
    } else {
        document.getElementById('bmiResult').innerText = 'Please enter valid weight and height.';
    }
}