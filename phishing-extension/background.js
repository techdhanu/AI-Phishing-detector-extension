chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'CHECK_URL') {
        fetch('http://127.0.0.1:5000/check-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: request.url })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from API:', data);
            sendResponse({isPhishing: data.isPhishing});
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({isPhishing: true}); // Err on the side of caution
        });
        
        return true; // Required for async response
    }
  });
  