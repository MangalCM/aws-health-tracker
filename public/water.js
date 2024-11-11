let currentProgress = 0;
const dailyIntakeHistory = {}; // Object to store daily intake for the last 7 days

// Function to fetch water intake history from the server
function fetchWaterHistory() {
    const username = localStorage.getItem('username'); // Get username from session or local storage
    
    fetch(`/api/water?username=${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateGraph(data.data, data.dates); // Update graph with fetched data
            currentProgress = Object.values(data.data).reduce((sum, val) => sum + (val || 0), 0); // Calculate current progress
            document.getElementById("current-progress").textContent = currentProgress;
        } else {
            // If no previous records, initialize with zeros
            const lastSevenDays = getLastSevenDays();
            lastSevenDays.forEach(date => {
                dailyIntakeHistory[date] = 0; // Initialize with zero if no data
            });
            updateGraph(dailyIntakeHistory, lastSevenDays); // Update graph with zeros
        }
    })
    .catch(error => {
        console.error('Error fetching water history:', error);
    });
}

// Function to get last seven days' dates
function getLastSevenDays() {
    const today = new Date();
    const lastSevenDays = [];
    
    for (let i = 0; i < 7; i++) {
        const dateString = new Date(today);
        dateString.setDate(today.getDate() - i);
        lastSevenDays.push(dateString.toISOString().split('T')[0]); // Push formatted date
    }
    
    return lastSevenDays;
}

function submitWater() {
    const glassesToAdd = parseInt(document.getElementById("addGlasses").value);
    
    if (!isNaN(glassesToAdd)) {
        fetchWaterData(glassesToAdd); // Call function to send data to server
    } else {
        alert("Please enter a valid number of glasses.");
    }
}

// Function to send water intake data to the server
function fetchWaterData(glassesToAdd) {
    const username = localStorage.getItem('username'); // Get username from session or local storage
    
    fetch('/api/water', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, glasses: glassesToAdd }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message); // Alert success message
            
            // Update today's intake immediately
            const todayString = new Date().toISOString().split('T')[0];
            dailyIntakeHistory[todayString] = (dailyIntakeHistory[todayString] || 0) + glassesToAdd; // Update today's intake
            
            // Update current progress
            currentProgress += glassesToAdd;
            document.getElementById("current-progress").textContent = currentProgress;

            // Update graph immediately with new data
            updateGraph(dailyIntakeHistory, getLastSevenDays()); // Pass updated history and dates
            
            document.getElementById("addGlasses").value = ''; // Reset input field
        }
    })
    .catch(error => {
        console.error('Error submitting water intake:', error);
    });
}

// Function to update graph based on historical data and current progress
function updateGraph(intakeData, dates) {
    const maxHeight = 200; // Maximum height of the graph in pixels
    const maxInputValue = Math.max(...Object.values(intakeData), 1); // Get max value for scaling

    const bars = document.querySelectorAll('.bar');
    
    dates.forEach((date, index) => {
        const heightPercentage = (intakeData[date] / maxInputValue) * maxHeight; // Calculate height percentage
        bars[index].style.height = heightPercentage + 'px'; // Set bar height
        bars[index].textContent = intakeData[date] || 0; // Display value on bar or zero if not available
    });
}

// Fetch initial water history when page loads
window.onload = function() {
    fetchWaterHistory(); 
};