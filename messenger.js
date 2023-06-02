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

// Function to send a message
function sendMessage() {
    var messageInput = document.getElementById("message");
    var message = messageInput.value;
    messageInput.value = ""; // Clear the input field

    Genesys("command", "MessagingService.sendMessage", {
        message: message
    });
}

// Function to display a message in the chatbox
function displayMessage(sender, message) {
    var chatbox = document.getElementById("chatbox");
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

    chatbox.appendChild(messageElement);

    // Scroll to the bottom of the chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Add event listener for Enter key press
var messageInput = document.getElementById("message");
messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});