import { WizardStep } from "../types";

interface StepIndicatorProps {
  currentStep: number;
  steps: WizardStep[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= step.id
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step.id}
            </div>
            
            <div className="ml-3 mr-6 text-sm">
              <div className={`font-medium ${
                currentStep >= step.id ? 'text-emerald-600' : 'text-gray-500'
              }`}>
                {step.title}
              </div>
              <div className="text-gray-500 text-xs">
                {step.description}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`w-10 mr-2 h-0.5 ${
                currentStep > step.id ? 'bg-emerald-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}