// Handle form submission for medical history
document.getElementById('medicalHistoryForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const historyDate = document.getElementById('historyDate').value;
    const medicalCondition = document.getElementById('medicalCondition').value;
    const reason = document.getElementById('reason').value;
    const medications = document.getElementById('medications').value;

    // Get the username from local storage
    const username = localStorage.getItem('username');

    const userData = {
        username,
        date: historyDate,
        condition: medicalCondition,
        reason: reason,
        medications: medications
    };

    try {
        const response = await fetch('/api/medical', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const result = await response.json();
        
        if (response.ok) {
            alert(result.message); // Log success message from server
            document.getElementById('medicalHistoryForm').reset(); // Reset form fields
        } else {
            alert('Error submitting medical history: ' + result.message);
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit medical history.');
    }
});

// Handle view history button click event
document.getElementById('historyBtn').addEventListener('click', function() {
    // Redirect to history.html
    window.location.href = 'history.html'; 
});