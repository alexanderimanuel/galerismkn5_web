"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUsers, useUserMutations } from "@/hooks/UserHooks";
import { useJurusans } from "@/hooks/JurusanHooks";
import { useExcelAdmin } from "@/hooks/ExcelAdminHooks";
import { User, CreateUserData, UpdateUserData } from "@/types/proyek";
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";
import UserTablePagination from "./components/UserTablePagination";
import UserModal from "./components/UserModal";
import { MdAccountCircle } from "react-icons/md";

export default function KelolaAkun({ user, logout }: { user: any, logout: () => void }) {
    const { jurusans } = useJurusans();
    const { createUser, updateUser, deleteUser } = useUserMutations();
    const {
        importStudents,
        downloadTemplate,
        isImporting,
        isDownloading,
        importError,
        downloadError,
    } = useExcelAdmin();

    // Filter states
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedJurusan, setSelectedJurusan] = useState("");
    const [selectedKelas, setSelectedKelas] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<any>(null);

    // Local import states
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localImportError, setLocalImportError] = useState<string | null>(null);

    // Fetch users with filters
    const { users, pagination, isLoading, isError, mutate } = useUsers({
        page: currentPage,
        limit: 10,
        role: selectedRole as 'guru' | 'siswa' | undefined,
        jurusan_id: selectedJurusan ? parseInt(selectedJurusan) : undefined,
        kelas: selectedKelas || undefined,
        search: searchQuery || undefined,
    });

    // Check if user is admin
    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                        <p className="text-gray-600">You don't have permission to access this page.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Filter options
    const jurusanOptions = jurusans.map(jurusan => ({
        value: jurusan.id.toString(),
        label: jurusan.nama
    }));

    // Reset page to 1 when any filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedRole, selectedJurusan, selectedKelas, searchQuery]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
        setSelectedRole("");
        setSelectedJurusan("");
        setSelectedKelas("");
        setSearchQuery("");
        setCurrentPage(1);
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setSubmitError(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setSubmitError(null);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (user: User) => {
        const isConfirmed = window.confirm(
            `Apakah Anda yakin ingin menghapus akun ${user.name}? Tindakan ini tidak dapat dibatalkan.`
        );

        if (isConfirmed) {
            try {
                await deleteUser(user.id);
                await mutate(); // Refresh the data
                alert('Akun berhasil dihapus!');
            } catch (error: any) {
                alert(`Error: ${error.message}`);
            }
        }
    };

    const handleSubmitUser = async (data: CreateUserData | UpdateUserData) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            if (editingUser) {
                await updateUser(editingUser.id, data as UpdateUserData);
                alert('Akun berhasil diperbarui!');
            } else {
                await createUser(data as CreateUserData);
                alert('Akun berhasil ditambahkan!');
            }
            await mutate(); // Refresh the data
            setIsModalOpen(false);
            setSubmitError(null);
        } catch (error: any) {
            console.error('Error submitting user:', error);
            setSubmitError(error);
            // Don't re-throw, let the modal stay open with error
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setLocalImportError(null);
        }
    };

    const handleImportExcel = async () => {
        if (!selectedFile) {
            setLocalImportError('Silakan pilih file Excel terlebih dahulu');
            return;
        }

        setLocalImportError(null);
        
        try {
            const result = await importStudents(selectedFile);
            
            alert(`Import berhasil! ${result.imported_rows} siswa berhasil diimpor dari ${result.total_rows} baris.`);
            await mutate(); // Refresh the data
            setSelectedFile(null);
            
            // Reset file input
            const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error: any) {
            console.error('Error importing Excel:', error);
            setLocalImportError(error.message || 'Terjadi kesalahan saat mengimpor file');
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            await downloadTemplate();
        } catch (error: any) {
            console.error('Error downloading template:', error);
            alert(error.message || 'Terjadi kesalahan saat mengunduh template');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:mt-20">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-left md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Kelola Akun</h1>
                            <p className="mt-2 text-gray-600">
                                Kelola akun guru dan siswa di sistem galeri karya
                            </p>
                        </div>
                        <button
                            onClick={handleAddUser}
                            className="hidden md:flex bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 mt-4 md:mt-0 rounded-lg font-medium transition-colors items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Tambah Akun</span>
                        </button>
                    </div>

                    {/* Stats */}
                    {pagination && (
                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <MdAccountCircle className="h-10 w-10 text-sky-600"/>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Akun {selectedRole ? `(${selectedRole})` : ''}
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {pagination.total}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Halaman Saat Ini
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {pagination.current_page} dari {pagination.last_page}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h9.586a1 1 0 00.707-.293l2.414-2.414a1 1 0 00.293-.707V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Per Halaman
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {pagination.per_page} akun
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Excel Import Section */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-2">Import Data Siswa</h2>
                            <p className="text-sm text-gray-600">
                                Upload file Excel untuk mengimpor data siswa secara massal
                            </p>
                        </div>
                        <button
                            onClick={handleDownloadTemplate}
                            disabled={isDownloading}
                            className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                            {isDownloading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Mengunduh...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    <span>Download Template</span>
                                </>
                            )}
                        </button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex-1">
                            <label htmlFor="excel-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                Pilih File Excel
                            </label>
                            <input
                                id="excel-upload"
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {selectedFile && (
                                <p className="mt-1 text-sm text-gray-600">
                                    File terpilih: {selectedFile.name}
                                </p>
                            )}
                        </div>
                        
                        <button
                            onClick={handleImportExcel}
                            disabled={!selectedFile || isImporting}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                            {isImporting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Mengimpor...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                    </svg>
                                    <span>Import Excel</span>
                                </>
                            )}
                        </button>
                    </div>
                    
                    {(localImportError || importError || downloadError) && (
                        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {localImportError || importError?.message || downloadError?.message}
                        </div>
                    )}
                    
                    <div className="mt-4 text-xs text-gray-500">
                        <p>Format file yang didukung: .xlsx, .xls, .csv (maksimal 10MB)</p>
                        <p>Kolom yang diperlukan: Nama Lengkap, NIS, Kelas, Jenis Kelamin</p>
                    </div>
                </div>
                {/* Filters */}
                <UserFilters
                    selectedRole={selectedRole}
                    selectedJurusan={selectedJurusan}
                    selectedKelas={selectedKelas}
                    searchQuery={searchQuery}
                    onRoleChange={setSelectedRole}
                    onJurusanChange={setSelectedJurusan}
                    onKelasChange={setSelectedKelas}
                    onSearchChange={setSearchQuery}
                    onReset={handleReset}
                    jurusanOptions={jurusanOptions}
                />

                {/* Error State */}
                {isError && (
                    <div className="text-center py-12">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-block">
                            <p className="font-medium">Error memuat data</p>
                            <p className="text-sm">Gagal memuat daftar akun</p>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <UserTable
                    users={users}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    isLoading={isLoading}
                />

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <UserTablePagination
                        currentPage={pagination.current_page || 1}
                        totalPages={pagination.last_page || 1}
                        onPageChange={handlePageChange}
                    />
                )}

                {/* User Modal */}
                <UserModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSubmitError(null);
                    }}
                    onSubmit={handleSubmitUser}
                    user={editingUser}
                    jurusans={jurusans}
                    isLoading={isSubmitting}
                    error={submitError}
                />
            </div>

            {/* Mobile Floating Add Button */}
            <button
                onClick={handleAddUser}
                className="md:hidden fixed bottom-25 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-xl z-50"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
    );
}