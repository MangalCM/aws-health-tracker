// Fetch and display previous medical records when the page loads
window.onload = function() {
    const username = localStorage.getItem('username');

    // Check if username is available
    if (!username) {
        alert("User must be logged in to view medical history.");
        return;
    }

    fetch(`/api/history?username=${username}`, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                displayPreviousRecords(data);
            } else {
                alert("No previous records found.");
                displayPreviousRecords([]);
            }
        })
        .catch(error => {
            console.error('Error fetching previous records:', error);
            alert('Failed to fetch previous records.');
        });
};

// Function to display previous records in a div
function displayPreviousRecords(records) {
    const previousRecordsDiv = document.getElementById('previousRecords');
    previousRecordsDiv.innerHTML = ''; // Clear existing records

    if (records.length === 0) {
        previousRecordsDiv.innerHTML += '<p>No previous records found.</p>';
        return;
    }

    records.forEach(record => {
        previousRecordsDiv.innerHTML += `
            <div class="record">
                <p><strong>Date:</strong> ${new Date(record.date).toLocaleDateString()}</p>
                <p><strong>Condition:</strong> ${record.condition}</p>
                <p><strong>Reason:</strong> ${record.reason}</p>
                <p><strong>Medications:</strong> ${record.medications || 'None'}</p>
            </div>`;
    });
}
