import Swal from 'sweetalert2';

const SweetAlert = {
    fire: (options) => {
        return Swal.fire(options);
    },

    confirmStatus: async (title, text, confirmButtonText) => {
        const result = await Swal.fire({
            title,
            text,
            showCancelButton: true,
            confirmButtonColor: '#052e26',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText,
            cancelButtonText: ("Cancel")
        });

        return result.isConfirmed;
    },

    confirmDelete: async (title, text) => {
        const result = await Swal.fire({
            title,
            text,
            showCancelButton: true,
            confirmButtonColor: '#052e26',
            cancelButtonColor: '#d33',
            confirmButtonText: ('Yes, delete it!'),
            cancelButtonText: ("Cancel")
        });

        return result.isConfirmed;
    },

    success: (title, text) => {
        return Swal.fire({
            icon: 'success',
            title,
            text,
        });
    },

    redirectWithMessage: async (title, redirectUrl, navigate) => {
        return Swal.fire({
            icon: 'info',
            title,
            timer: 5000, 
            timerProgressBar: true,
            showConfirmButton: false,
        }).then(() => {
            navigate(redirectUrl);
        });
    },

    successWithRedirect: async (title, text, redirectUrl) => {
        return Swal.fire({
            icon: 'success',
            title,
            text,
            timer: 1000, // Auto close after 1 second
            timerProgressBar: true,
            showConfirmButton: false,
        }).then(() => {
            window.location.href = redirectUrl; // Redirect after Swal closes
        });
    },

    error: (title, text) => {
        return Swal.fire({
            icon: 'error',
            title,
            text,
        });
    },

    info: (title, text) => {
        return Swal.fire({
            icon: 'info',
            title,
            text,
        });
    },

    warning: (title, text) => {
        return Swal.fire({
            icon: 'warning',
            title,
            text,
        });
    },

    custom: async (options) => {
        const result = await Swal.fire(options);
        return result;
    },
};

export default SweetAlert;