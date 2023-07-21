Genesys("subscribe", "MessagingService.reconnecting", function() {
    console.log("Reconnecting");
});

Genesys("subscribe", "MessagingService.reconnected", function() {
    console.log("Reconnected");
});

Genesys("subscribe", "Conversations.ready", function(){
    console.log("Conversation ready");
});

Genesys("subscribe", "Conversations.opened", function(){
    console.log("Conversation opened");
});

Genesys("subscribe", "Conversations.started", function(){
    console.log("Conversation started");
});

Genesys("subscribe", "Conversations.closed", function(){
    console.log("Conversation closed");
});

Genesys("subscribe", "Conversations.error", function(){
    console.log("Error:", o.data.error);
});

// Genesys("command", "Database.set", {
//     messaging: {
//       customAttributes: {
//         name: "Local Test",
//         email: "localtest@mail.com",
//         dateOfBirth: "01/02/1993",
//         policyNumber: "polNum123"
//       }
//     }
// });

Genesys("subscribe", "MessagingService.messagesReceived", function({ data }) {
    // console.log("Message received:");
    console.log(data);
    
    if (data.messages[0].direction === "Outbound") {
        if ("events" in data.messages[0]) {
            if (data.messages[0].events[0].presence.type === "Disconnect") {
                displayMessage(data.messages[0].channel.from.nickname, "Disconnected from the chat. If you want to continue conversation, please send a message.");
                
                document.getElementById("customer-form").style.display = "flex";
                document.getElementById("chatbox-messages").style.display = "none";
                document.getElementById("chatbox-input").style.display = "none";
                document.getElementById("chatbox-buttons").style.display = "none";
                
                // Genesys("command", "MessagingService.clearSession");
                
            } else {
                console.log("Message error!");
            }
        } else {
            displayMessage(data.messages[0].channel.from.nickname, data.messages[0].text);
        }
    } else if (data.messages[0].direction === "Inbound") {
        if (data.messages[0].text === "INITIAL_MESSAGE") {
            
            console.log("Initial message received");

        } else {
            displayMessage("You", data.messages[0].text);
        }
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