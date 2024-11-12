// Handle form submission for medical history
document.getElementById('medicalHistoryForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const historyDate = document.getElementById('historyDate').value;
    const medicalCondition = document.getElementById('medicalCondition').value;
    const reason = document.getElementById('reason').value;
    const medications = document.getElementById('medications').value;
    const medicalReportFile = document.getElementById('medicalReport').files[0]; // Medical report file
    const uploadImageFile = document.getElementById('uploadImage').files[0]; // Upload image file

    // Get the username from local storage
    const username = localStorage.getItem('username');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('date', historyDate);
    formData.append('condition', medicalCondition);
    formData.append('reason', reason);
    formData.append('medications', medications);
    if (medicalReportFile) formData.append('medicalReport', medicalReportFile);
    if (uploadImageFile) formData.append('uploadImage', uploadImageFile);

    try {
        const response = await fetch('/api/medical', {
            method: 'POST',
            body: formData, // Sending form data containing the files
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
