document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;

        const urlDisplay = document.getElementById('urlDisplay');
        urlDisplay.textContent = `Checking: ${url}`;

        const statusMessage = document.getElementById('statusMessage');
        statusMessage.className = 'status loading';
        statusMessage.textContent = 'Checking website safety...';

        fetch('http://127.0.0.1:5000/check-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);

            if (data.status === 'error') {
                statusMessage.className = 'status safe';
                statusMessage.textContent = 'Unable to analyze website. Assuming safe.';
                return;
            }

            // Only mark as phishing if backend explicitly says so
            if (data.isPhishing === true) {
                statusMessage.className = 'status phishing';
                statusMessage.textContent = 'Warning! This website appears to be a phishing site!';
            } else {
                statusMessage.className = 'status safe';
                statusMessage.textContent = 'This website appears to be safe.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            statusMessage.className = 'status safe';
            statusMessage.textContent = 'Error checking website. Assuming safe.';
        });
    });
});