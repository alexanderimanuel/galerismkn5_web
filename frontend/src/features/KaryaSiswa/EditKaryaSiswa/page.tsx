"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUpdateProyek, useProyek } from "@/hooks/ProjekHooks";
import { useAuth } from "@/context/AuthContext";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import "../../../styles/dropzone.css";

interface FormData {
    judul: string;
    deskripsi: string;
    tautan_proyek: string;
}

interface UploadedFile {
    file: File;
    preview: string;
    status: 'uploading' | 'success' | 'error';
}

interface FormErrors {
    judul?: string;
    deskripsi?: string;
    tautan_proyek?: string;
}

export default function EditKaryaSiswa({ user, logout }: { user: any; logout: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const proyekId = searchParams.get('id');
    const { user: authUser } = useAuth();
    const { proyek, isLoading: isLoadingProyek } = useProyek(proyekId || '');
    const { updateProyek, isUpdating, error } = useUpdateProyek(proyekId || '');
    const dropzoneRef = useRef<HTMLDivElement>(null);
    const dropzoneInstance = useRef<Dropzone | null>(null);

    const [formData, setFormData] = useState<FormData>({
        judul: "",
        deskripsi: "",
        tautan_proyek: "",
    });

    // Load existing project data when component mounts
    useEffect(() => {
        if (proyek) {
            setFormData({
                judul: proyek.judul || "",
                deskripsi: proyek.deskripsi || "",
                tautan_proyek: proyek.tautan_proyek || "",
            });
        }
    }, [proyek]);

    // Redirect if no project ID provided
    useEffect(() => {
        if (!proyekId) {
            router.push('/karya');
            return;
        }
    }, [proyekId, router]);

    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>("");

    // Initialize Dropzone
    useEffect(() => {
        if (dropzoneRef.current && !dropzoneInstance.current) {
            dropzoneInstance.current = new Dropzone(dropzoneRef.current, {
                url: "/api/upload", // Placeholder URL
                autoProcessQueue: false,
                maxFiles: 1,
                acceptedFiles: "image/*",
                maxFilesize: 2, // 2MB
                addRemoveLinks: true,
                dictDefaultMessage: "Klik atau seret gambar proyek ke sini",
                dictRemoveFile: "Hapus",
                dictFileTooBig: "File terlalu besar. Maksimal 2MB.",
                dictInvalidFileType: "Tipe file tidak valid. Hanya gambar yang diperbolehkan.",
                dictMaxFilesExceeded: "Hanya boleh upload 1 gambar.",
                previewTemplate: `
                    <div class="dz-preview dz-file-preview">
                        <div class="dz-image"><img data-dz-thumbnail /></div>
                        <div class="dz-details">
                            <div class="dz-size"><span data-dz-size></span></div>
                            <div class="dz-filename"><span data-dz-name></span></div>
                        </div>
                        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                        <div class="dz-error-message"><span data-dz-errormessage></span></div>
                        <div class="dz-success-mark">✓</div>
                        <div class="dz-error-mark">✗</div>
                    </div>
                `
            });

            dropzoneInstance.current.on('addedfile', (file) => {
                setUploadedFile({
                    file,
                    preview: URL.createObjectURL(file),
                    status: 'success'
                });
                // Clear any previous errors when new file is added
                if (errors.judul && errors.judul.includes('gambar')) {
                    setErrors(prev => ({
                        ...prev,
                        judul: undefined
                    }));
                }
            });

            dropzoneInstance.current.on('removedfile', () => {
                setUploadedFile(null);
            });

            dropzoneInstance.current.on('error', (file, errorMessage) => {
                setErrors(prev => ({
                    ...prev,
                    judul: `Error uploading ${file.name}: ${errorMessage}`
                }));
                setUploadedFile(prev => prev ? {
                    ...prev,
                    status: 'error'
                } : null);
            });
        }

        return () => {
            if (dropzoneInstance.current) {
                dropzoneInstance.current.destroy();
                dropzoneInstance.current = null;
            }
        };
    }, []);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.judul.trim()) {
            newErrors.judul = "Judul karya harus diisi";
        }

        if (!formData.deskripsi.trim()) {
            newErrors.deskripsi = "Deskripsi karya harus diisi";
        } else if (formData.deskripsi.trim().length < 10) {
            newErrors.deskripsi = "Deskripsi minimal 10 karakter";
        }

        // Validate URL format if provided
        if (formData.tautan_proyek.trim()) {
            try {
                new URL(formData.tautan_proyek);
            } catch {
                newErrors.tautan_proyek = "Format URL tidak valid";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Remove the jurusan_id validation since we're updating, not creating
        // The project already has a jurusan_id that we'll preserve

        setIsSubmitting(true);

        try {
            const proyekData = {
                judul: formData.judul.trim(),
                deskripsi: formData.deskripsi.trim(),
                tautan_proyek: formData.tautan_proyek.trim() || undefined,
                jurusan_id: proyek?.jurusan_id || authUser?.jurusan_id,
                image: uploadedFile?.file
            };

            console.log('Updating project with data:', proyekData);
            const result = await updateProyek(proyekData);

            // Handle success message with upload info
            if (result?.upload_info) {
                setSuccessMessage(
                    `Karya berhasil diperbarui! Gambar "${result.upload_info.original_name}" (${result.upload_info.size_formatted}) telah tersimpan.`
                );
            } else {
                setSuccessMessage("Karya berhasil diperbarui!");
            }

            // Show success message briefly before redirect
            setTimeout(() => {
                router.push('/karya');
            }, 1500);
        } catch (err: any) {
            console.error('Error updating proyek:', err);

            let errorMessage = "Terjadi kesalahan saat memperbarui karya";

            // Handle different types of errors
            if (err.response?.data) {
                const errorData = err.response.data;
                
                console.error('Full error response:', errorData);

                // Handle validation errors
                if (errorData.errors) {
                    console.error('Validation errors:', errorData.errors);
                    setErrors(errorData.errors);
                    return; // Don't set general error if we have field-specific errors
                }

                // Handle upload-specific errors
                if (errorData.upload_details) {
                    errorMessage = `Gagal mengunggah gambar "${errorData.upload_details.original_name}" (${errorData.upload_details.size}): ${errorData.error}`;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }

                // Add debug information if available
                if (errorData.debug) {
                    console.error('Debug info:', errorData.debug);
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setErrors({
                judul: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-10 md:pt-20">
            <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href="/karya"
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali
                        </Link>
                        <div className="border-l h-6 border-gray-300"></div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Karya</h1>
                    </div>
                    <p className="text-gray-600">Sesuaikan Karyamu</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="p-4 border-b bg-green-50 border-green-200">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-green-700">{successMessage}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Judul Field */}
                        <div>
                            <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
                                Judul <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="judul"
                                name="judul"
                                value={formData.judul}
                                onChange={handleInputChange}
                                placeholder="Isi judul karya..."
                                className={`w-full text-slate-800 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.judul ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isSubmitting}
                            />
                            {errors.judul && (
                                <p className="mt-1 text-sm text-red-600">{errors.judul}</p>
                            )}
                        </div>

                        {/* Deskripsi Field */}
                        <div>
                            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="deskripsi"
                                name="deskripsi"
                                rows={6}
                                value={formData.deskripsi}
                                onChange={handleInputChange}
                                placeholder="Isi deskripsi karya..."
                                className={`w-full text-slate-800 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${errors.deskripsi ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isSubmitting}
                            />
                            {errors.deskripsi && (
                                <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Minimal 10 karakter. Jelaskan karya Anda dengan detail.
                            </p>
                        </div>

                        {/* File/Link Field */}
                        <div>
                            <label htmlFor="tautan_proyek" className="block text-sm font-medium text-gray-700 mb-2">
                                File/Link Proyek
                            </label>
                            <input
                                type="url"
                                id="tautan_proyek"
                                name="tautan_proyek"
                                value={formData.tautan_proyek}
                                onChange={handleInputChange}
                                placeholder="https://github.com/username/project atau link lainnya..."
                                className={`w-full text-slate-800 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.tautan_proyek ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isSubmitting}
                            />
                            {errors.tautan_proyek && (
                                <p className="mt-1 text-sm text-red-600">{errors.tautan_proyek}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Opsional. Tambahkan link ke GitHub, portfolio online, atau platform lainnya.
                            </p>
                        </div>

                        {/* Image Upload Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gambar Proyek
                            </label>
                            <div
                                ref={dropzoneRef}
                                className="dropzone border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                            >
                                {/* Dropzone will replace this content */}
                            </div>
                            {uploadedFile && (
                                <div className={`mt-2 p-3 border rounded-lg ${uploadedFile.status === 'success' ? 'bg-green-50 border-green-200' :
                                        uploadedFile.status === 'error' ? 'bg-red-50 border-red-200' :
                                            'bg-blue-50 border-blue-200'
                                    }`}>
                                    <div className="flex items-center space-x-2">
                                        {uploadedFile.status === 'success' && (
                                            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                        {uploadedFile.status === 'error' && (
                                            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 18.333 3.924 20 5.464 20z" />
                                            </svg>
                                        )}
                                        {uploadedFile.status === 'uploading' && (
                                            <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${uploadedFile.status === 'success' ? 'text-green-700' :
                                                    uploadedFile.status === 'error' ? 'text-red-700' :
                                                        'text-blue-700'
                                                }`}>
                                                {uploadedFile.file.name}
                                            </p>
                                            <p className={`text-xs ${uploadedFile.status === 'success' ? 'text-green-600' :
                                                    uploadedFile.status === 'error' ? 'text-red-600' :
                                                        'text-blue-600'
                                                }`}>
                                                {Math.round(uploadedFile.file.size / 1024)} KB • {uploadedFile.file.type}
                                                {uploadedFile.status === 'success' && " • Siap diunggah"}
                                                {uploadedFile.status === 'uploading' && " • Mengunggah..."}
                                                {uploadedFile.status === 'error' && " • Upload gagal"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Opsional. Upload gambar screenshot atau foto dari proyek Anda.
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <svg className="h-5 w-5 text-blue-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm">
                                    <p className="text-blue-800 font-medium">Informasi Penting</p>
                                    <p className="text-blue-700 mt-1">
                                        Perubahan akan otomatis tersimpan dan karya tetap dalam status saat ini.
                                        Pastikan semua informasi sudah benar sebelum menyimpan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <Link
                                href="/karya"
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting || isUpdating}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                            >
                                {(isSubmitting || isUpdating) ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Perubahan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
