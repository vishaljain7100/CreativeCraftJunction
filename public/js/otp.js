const otpInputs = document.querySelectorAll('input[name="otp"]');

otpInputs.forEach((input, index) => {
    input.addEventListener('input', function () {
        // Ensure only one digit is entered
        if (this.value.length > 1) {
            this.value = this.value.slice(0, 1);
        }

        if (this.value.length === 1) {
            // Move to the next input field
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        } else if (this.value.length === 0) {
            // Move to the previous input field
            if (index > 0) {
                otpInputs[index - 1].focus();
            }
        }
    });

    // Handle backspace key
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && this.value.length === 0) {
            // Move to the previous input field
            if (index > 0) {
                otpInputs[index - 1].focus();
            }
        }
    });
});
