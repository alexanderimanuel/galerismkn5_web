interface WizardHeaderProps {
  title?: string;
  subtitle?: string;
}

export function WizardHeader({ 
  title = "Klaim Akun Siswa",
  subtitle = "Sistem Galeri Digital SMKN 5"
}: WizardHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center">
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}