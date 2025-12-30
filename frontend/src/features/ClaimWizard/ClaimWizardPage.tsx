"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useClaimWizard } from "./hooks";
import { 
  StepIndicator, 
  WizardHeader, 
  IdentityStep, 
  ActivationStep, 
  WizardNavigation,
  ErrorAlert 
} from "./components";
import { WizardStep } from "./types";

const wizardSteps: WizardStep[] = [
  {
    id: 1,
    title: "Identitas",
    description: "Pilih jurusan, kelas, dan nama"
  },
  {
    id: 2,
    title: "Keamanan",
    description: "Atur email dan password"
  }
];

export function ClaimWizardPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuth();
  
  const {
    currentStep,
    formData,
    validationErrors,
    isSubmitting,
    generalError,
    updateFormData,
    nextStep,
    prevStep,
    submitClaim,
    clearErrors,
    canProceed
  } = useClaimWizard();

  const handleSubmit = async () => {
    const result = await submitClaim();
    
    if (result && result.success) {
      // Store token and user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      
      // Update auth context
      setToken(result.token);
      setUser(result.user);
      
      // Redirect to dashboard
      router.push('/dashboard');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <IdentityStep
            formData={formData}
            validationErrors={validationErrors}
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <ActivationStep
            formData={formData}
            validationErrors={validationErrors}
            onUpdate={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 pt-10 md:pt-30">
      <div className="max-w-2xl w-full">
        <WizardHeader />
        
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
          <StepIndicator currentStep={currentStep} steps={wizardSteps} />
          
          <ErrorAlert error={generalError} onClose={clearErrors} />
          
          <div className="mb-6">
            {renderCurrentStep()}
          </div>
          
          <WizardNavigation
            currentStep={currentStep}
            totalSteps={wizardSteps.length}
            canProceed={canProceed()}
            isSubmitting={isSubmitting}
            onNext={nextStep}
            onPrev={prevStep}
            onSubmit={handleSubmit}
          />
        </div>
        
        <div className="text-center mt-6">
          <span className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <button 
              onClick={() => router.push('/login')} 
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Masuk di sini
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}