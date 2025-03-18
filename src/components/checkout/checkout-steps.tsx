// components/checkout/checkout-steps.tsx
import { CheckCircle } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: number;
}

export const CheckoutSteps = ({ currentStep }: CheckoutStepsProps) => {
  const steps = [
    { name: "Shipping & Billing", description: "Address information" },
    { name: "Payment", description: "Payment method" },
    { name: "Review", description: "Review your order" },
  ];

  return (
    <div className="hidden md:block mb-8">
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={step.name}
            className="flex flex-col items-center relative z-10"
          >
            {/* Step circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {index < currentStep ? (
                <CheckCircle size={20} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {/* Step label */}
            <div className="mt-2 text-center">
              <div
                className={`font-medium ${
                  index <= currentStep ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.name}
              </div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
          </div>
        ))}

        {/* Progress line */}
        <div className="absolute left-0 top-5 h-0.5 w-full bg-gray-200">
          <div
            className="h-full bg-black transition-all duration-500 ease-in-out"
            style={{
              width: `${
                currentStep === 0 ? "0%" : currentStep === 1 ? "50%" : "100%"
              }`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
