import Swal from 'sweetalert2';

const Toast = {
    success: (title) => {
        return Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            title,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
                });
            },

    error: (title) => {
        return Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'error',
            title,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
                });
            },

    info: (title) => {
        return Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'info',
            title,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
                });
            },

    warning: (title) => {
        return Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
                });
            }
};

export default Toast;