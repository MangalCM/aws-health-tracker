// Function to submit today's workout data
function addExercise() {
  const workoutType = document.getElementById("workout").value;
  const durationInputValue = parseInt(document.getElementById("minutes").value);
  
  if (!workoutType || isNaN(durationInputValue)) {
      alert("Please select a workout and enter duration.");
      return;
  }
  
  const exerciseData = { exercise: workoutType, duration: durationInputValue };
  
  fetchExerciseData(exerciseData); // Send data to server
}

// Function to send workout data to server
function fetchExerciseData(exerciseData) {
  const username = localStorage.getItem('username'); 

  // Check if username is retrieved correctly
  if (!username) {
      alert("User must be logged in to record exercise.");
      return;
  }

  fetch('/api/exercise', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, ...exerciseData }),
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    if (data.message) {
        alert(data.message); // Alert success message
        document.getElementById("minutes").value = ''; // Reset input field
        document.getElementById("workout").selectedIndex = 0; // Reset workout selection
    }
})
.catch(error => {
    console.error('Error submitting exercise:', error);
    alert('Failed to record exercise data.');
});
}

// Fetch initial exercise history when page loads (optional)
window.onload = function() {
 // You can choose to leave this empty if you don't need any initial fetch
};