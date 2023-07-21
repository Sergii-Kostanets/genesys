// var conversationDisconnected = true;
// Genesys("subscribe", "MessagingService.conversationDisconnected", function({data}){
//     if (!conversationDisconnected) {
//         // console.log("Conversation disconnected");
//             console.log(data);
//             conversationDisconnected = true;
//             document.getElementById("customer-form").style.display = "flex";
//             document.getElementById("chatbox-messages").style.display = "none";
//             document.getElementById("chatbox-input").style.display = "none";
//             document.getElementById("chatbox-buttons").style.display = "none";
//     }
// });

// Validation - Name (required)
var nameInput = document.getElementById('name');
var nameRegex = /^([A-Za-z\u00C0-\u017F'-]+\s*){1,10}$/;

nameInput.addEventListener('input', function() {
    var inputValue = this.value.trim();

    if (inputValue === '') {
        this.classList.remove('validation-success');
        this.classList.add('validation-error');
        this.removeAttribute('title');
        this.setAttribute('title', 'Please enter your full name.');
    } else if (!nameRegex.test(inputValue)) {
        this.classList.remove('validation-success');
        this.classList.add('validation-error');
        this.removeAttribute('title');
        this.setAttribute('title', 'Please enter a valid full name with one or two words.');
    } else {
        this.classList.remove('validation-error');
        this.classList.add('validation-success');
        this.removeAttribute('title');
    }
});

// Validation - Email (required)
var emailInput = document.getElementById('email');

emailInput.addEventListener('input', function () {
    var email = emailInput.value;
    var isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

    if (isValidEmail) {
        emailInput.classList.remove('validation-error');
        emailInput.classList.add('validation-success');
        emailInput.removeAttribute('title');
    } else {
        emailInput.classList.remove('validation-success');
        emailInput.classList.add('validation-error');
        emailInput.setAttribute('title', 'Please enter a valid email address.');
    }
});

// Validation - Date of Birth (required)
var dobInput = document.getElementById('dateOfBirth');

dobInput.addEventListener('input', function () {
    var inputValue = dobInput.value.trim();
    if (inputValue === '') {
        this.classList.remove('validation-success');
        this.classList.add('validation-error');
        this.removeAttribute('title');
        this.setAttribute('title', 'Please enter your date of birth.');
    } else {
        this.classList.remove('validation-error');
        this.classList.add('validation-success');
        this.removeAttribute('title');
    }
});

// Validation - Policy Number (optional)
var policyNumberInput = document.getElementById('policyNumber');

policyNumberInput.addEventListener('input', function () {
    var policyNumber = policyNumberInput.value;
    var regex = /^[a-zA-Z0-9]{0,20}$/;

    if (!regex.test(policyNumber) || policyNumber.length > 20) {
        policyNumberInput.classList.remove('validation-success');
        policyNumberInput.classList.add('validation-error');
        policyNumberInput.setAttribute('title', 'Please enter a valid client code (only letters and digits are allowed).');
    } else {
        policyNumberInput.classList.remove('validation-error');
        policyNumberInput.classList.add('validation-success');
        policyNumberInput.removeAttribute('title');
    }
});


// Validation function
function validateCustomerForm() {

    // Validate name
    var name = nameInput.value;
    var isNameValid = nameRegex.test(name);

    // Validate email
    var email = emailInput.value;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var isEmailValid = emailRegex.test(email);
    
    // Validate date of birth
    var dateOfBirth = dobInput.value.trim();
    var isDOBValid = dateOfBirth === '' ? false : true;
    
    // Validate policy number
    var policyNumber = policyNumberInput.value;
    var policyNumberRegex = /^[a-zA-Z0-9]{0,20}$/;
    var isPolicyNumberValid = policyNumberRegex.test(policyNumber) && policyNumber.length <= 20;
    
    // Check if all fields are valid
    var isFormValid = isNameValid && isEmailValid && isDOBValid && isPolicyNumberValid;
        
    if (isFormValid) {
        submitCustomerForm();
    } else {
        var showSubmitError = document.getElementById('customer-form');
        showSubmitError.classList.add('submit-error');
        // var showSubmitErrorText = document.getElementById('customer-form');
        // showSubmitErrorText.innerText = 'Please fill in all required fields with valid values';
    }
}

function submitCustomerForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var dateOfBirth = document.getElementById("dateOfBirth").value;
    var policyNumber = document.getElementById("policyNumber").value;
    
    // closeCustomerForm();
    // formWasShownRenewals = true;
    
    document.getElementById("customer-form").style.display = "none";
    document.getElementById("chatbox-messages").style.display = "block";
    document.getElementById("chatbox-input").style.display = "block";
    document.getElementById("chatbox-buttons").style.display = "flex";

    Genesys("command", "Database.set", {
        messaging: {
            customAttributes: {
                name: name,
                email: email,
                dateOfBirth: dateOfBirth,
                policyNumber: policyNumber
            }
        }
    });
    
    Genesys("command", "MessagingService.sendMessage", {
        message: "INITIAL_MESSAGE"
    });
    
    // conversationDisconnected = false;
    
}


