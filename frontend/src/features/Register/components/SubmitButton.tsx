interface SubmitButtonProps {
  isSubmitting: boolean;
  isLoading: boolean;
  text?: string;
  loadingText?: string;
}

export function SubmitButton({ 
  isSubmitting, 
  isLoading, 
  text = "Daftar",
  loadingText = "Memproses..."
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting || isLoading}
      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isSubmitting || isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </div>
      ) : (
        text
      )}
    </button>
  );
}