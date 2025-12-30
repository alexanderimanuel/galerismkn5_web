import Swal from 'sweetalert2';

interface DeleteConfirmationOptions {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const showDeleteConfirmation = async (options?: DeleteConfirmationOptions) => {
  const {
    title = "Apakah Anda yakin?",
    text = "Anda tidak akan dapat mengembalikan ini!",
    confirmButtonText = "Ya, hapus!",
    cancelButtonText = "Batal"
  } = options || {};

  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true
  });

  return result.isConfirmed;
};

export const showDeleteSuccess = async (message?: string) => {
  await Swal.fire({
    title: "Terhapus!",
    text: message || "Proyek Anda telah berhasil dihapus.",
    icon: "success",
    confirmButtonColor: "#3085d6"
  });
};

export const showDeleteError = async (message?: string) => {
  await Swal.fire({
    title: "Error!",
    text: message || "Gagal menghapus proyek. Silakan coba lagi.",
    icon: "error",
    confirmButtonColor: "#d33"
  });
};