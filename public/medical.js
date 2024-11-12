// Handle form submission for medical history (MongoDB)
document.getElementById('medicalHistoryForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const historyDate = document.getElementById('historyDate').value;
    const medicalCondition = document.getElementById('medicalCondition').value;
    const reason = document.getElementById('reason').value;
    const medications = document.getElementById('medications').value;

    const username = localStorage.getItem('username');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('date', historyDate);
    formData.append('condition', medicalCondition);
    formData.append('reason', reason);
    formData.append('medications', medications);

    try {
        const response = await fetch('/api/medical', {
            method: 'POST',
            body: formData, // Sending data for MongoDB
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

// Handle file upload to S3 (Medical Report and Image)
document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const medicalReportFile = document.getElementById('medicalReport').files[0]; // Medical report file
    const uploadImageFile = document.getElementById('uploadImage').files[0]; // Upload image file

    const formData = new FormData();
    if (medicalReportFile) formData.append('medicalReport', medicalReportFile);
    if (uploadImageFile) formData.append('uploadImage', uploadImageFile);

    try {
        const response = await fetch('/api/medical/uploadFiles', {
            method: 'POST',
            body: formData, // Sending form data containing the files for S3
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Log success message from server
        } else {
            alert('Error uploading files: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to upload files.');
    }
});

// Add event listener for the "View History" button to navigate to history.html
document.getElementById('historyBtn').addEventListener('click', function () {
    window.location.href = 'history.html'; // Redirect to the history page
});
