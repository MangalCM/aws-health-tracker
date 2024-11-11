// Fetch and display previous medical records when the page loads
window.onload = function() {
    const username = localStorage.getItem('username');

    fetch(`/api/medical?username=${username}`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayPreviousRecords(data.records);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching previous records:', error);
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
                <p><strong>Date:</strong> ${record.date}</p>
                <p><strong>Condition:</strong> ${record.condition}</p>
                <p><strong>Reason:</strong> ${record.reason}</p>
                <p><strong>Medications:</strong> ${record.medications || 'None'}</p>
            </div>`;
    });
}