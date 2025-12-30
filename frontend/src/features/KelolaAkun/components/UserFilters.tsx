interface UserFiltersProps {
    selectedRole: string;
    selectedJurusan: string;
    selectedKelas: string;
    searchQuery: string;
    onRoleChange: (role: string) => void;
    onJurusanChange: (jurusan: string) => void;
    onKelasChange: (kelas: string) => void;
    onSearchChange: (search: string) => void;
    onReset: () => void;
    jurusanOptions: Array<{ value: string; label: string }>;
}

const ROLE_OPTIONS = [
    { value: 'guru', label: 'Guru' },
    { value: 'siswa', label: 'Siswa' }
];

const KELAS_OPTIONS = ["10", "11", "12"].map(kelas => ({
    value: kelas,
    label: `Kelas ${kelas}`
}));

export default function UserFilters({
    selectedRole,
    selectedJurusan,
    selectedKelas,
    searchQuery,
    onRoleChange,
    onJurusanChange,
    onKelasChange,
    onSearchChange,
    onReset,
    jurusanOptions
}: UserFiltersProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Search Bar */}
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="">
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            placeholder="Cari nama, email, atau NIS/NIP..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full px-4 py-3 pl-10 pr-10 text-slate-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                {/* Role Filter */}
                <div className="relative">
                    <select
                        value={selectedRole}
                        onChange={(e) => onRoleChange(e.target.value)}
                        className="appearance-none bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg border-0 cursor-pointer transition-colors min-w-[120px] text-sm font-medium pr-10"
                    >
                        <option value="">Semua Peran</option>
                        {ROLE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Jurusan Filter */}
                <div className="relative">
                    <select
                        value={selectedJurusan}
                        onChange={(e) => onJurusanChange(e.target.value)}
                        className="appearance-none bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg border-0 cursor-pointer transition-colors min-w-[150px] text-sm font-medium pr-10"
                    >
                        <option value="">Semua Jurusan</option>
                        {jurusanOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Kelas Filter (only show for siswa) */}
                {selectedRole === 'siswa' && (
                    <div className="relative">
                        <select
                            value={selectedKelas}
                            onChange={(e) => onKelasChange(e.target.value)}
                            className="appearance-none bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg border-0 cursor-pointer transition-colors min-w-[120px] text-sm font-medium pr-10"
                        >
                            <option value="">Semua Kelas</option>
                            {KELAS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Reset Button */}
                {(selectedRole || selectedJurusan || selectedKelas || searchQuery) && (
                    <button
                        onClick={onReset}
                        className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                        Reset Filter
                    </button>
                )}
            </div>
        </div>
    );
}