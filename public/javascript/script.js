// JavaScript code for handling checkbox click event and AJAX request
document.addEventListener('DOMContentLoaded', function () {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Add event listener to each checkbox
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            // Get the module ID and selected value
            const moduleID = this.id;
            const selected = this.checked ? 'Yes' : 'No';

            // Send an AJAX request to update the selected value
            fetch('/updateSelected', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ moduleID, selected })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Selected value updated successfully');
                } else {
                    console.error('Error updating selected value');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });

    // Function to handle the registerModules button click event
    function registerModules() {
        // Add your registration logic here
        document.getElementById('confirmationMessage').innerText = 'Modules registered successfully!';
    }

    // Attach the registerModules function to the Register button click event
    const registerButton = document.querySelector('button');
    registerButton.addEventListener('click', registerModules);
});
