// script.js - CORRECTED
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    // FIX 1: Change Array.form(forms) to Array.from(forms) or use Array.prototype.slice.call(forms)
    Array.from(forms).forEach((form) => { 
        form.addEventListener(
                'submit', 
                (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated');
            }, 
            false
        );
        });
})();