Genesys("command", "Database.set", {
    messaging: {
      customAttributes: {
        name: "Local Test",
        email: "localtest@mail.com",
        dateOfBirth: "01/02/1993",
        policyNumber: "polNum123"
      }
    }
});

Genesys("subscribe", "MessagingService.messagesReceived", function({ data }) {
    console.log(data);
    console.log(data.messages[0].text);
    
    if (data.messages[0].direction == "Outbound") {
        displayMessage("Agent", data.messages[0].text);
    } else if (data.messages[0].direction == "Inbound") {
        displayMessage("You", data.messages[0].text);
    }
});

var messageInput = document.getElementById("chatbox-input");

// Function to clear the input field
function clearMessage() {
    messageInput.value = ""; // Clear the input field
}

// Function to send a message
function sendMessage() {
    var message = messageInput.value;
    clearMessage()
    
    Genesys("command", "MessagingService.sendMessage", {
        message: message
    });
}

// Function to display a message in the chatbox
function displayMessage(sender, message) {
    var chatboxMessages = document.getElementById("chatbox-messages");
    var messageElement = document.createElement("div");
    messageElement.classList.add("message");

    var senderElement = document.createElement("span");
    senderElement.classList.add("sender");
    senderElement.innerText = sender + ": ";

    var contentElement = document.createElement("span");
    contentElement.classList.add("content");
    contentElement.innerText = message;

    messageElement.appendChild(senderElement);
    messageElement.appendChild(contentElement);

    chatboxMessages.appendChild(messageElement);

    // Scroll to the bottom of the chatbox
    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
}

// Add event listener for Enter key press
messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});