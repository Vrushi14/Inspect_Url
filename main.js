document.getElementById("validateBtn").addEventListener("click", function() {
        const urlInput = document.getElementById("urlInput").value.trim();
        const messageElement = document.getElementById("message");
        const urlListElement = document.getElementById("urlList");

        // Blocked URLs list
        const blockedUrls = [
            "http://paruluniversity.com",
            "http://danger.com",
            "http://squidgame.com",
            "http://evil.com",
            "http://malware.com",
            "http://laxmichitfund.com",
            "http://ransomware.com",
            "http://phishing.com"
        ];

       
        messageElement.textContent = "";
        urlListElement.innerHTML = "";

        
        if (!urlInput) {
            messageElement.textContent = "Please enter a valid URL.";
            messageElement.style.color = "#f39c12"; 
            return;
        }

        try {
            const url = new URL(urlInput);

           
            if (blockedUrls.includes(urlInput)) {
                messageElement.textContent = "This URL is blocked.";
                messageElement.style.color = "#e74c3c"; 
            } else {
                const listItem = document.createElement("li");
                listItem.innerHTML = `${urlInput} - <span class="status-accessible">Accessible</span>`;
                urlListElement.appendChild(listItem);

                messageElement.textContent = "URL is valid!";
                messageElement.style.color = "#00f7ff"; 
            }
        } catch (error) {
            messageElement.textContent = "Invalid URL.";
            messageElement.style.color = "#f39c12"; 
        }
 });

