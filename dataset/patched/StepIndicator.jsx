
import React from "react";

export function StepIndicator({ currentStep, totalSteps }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="step-indicator">
      {steps.map(step => (
        <span 
          key={step}
          className={`step ${step <= currentStep ? "completed" : ""}`}
        >
          {step}
        </span>
      ))}
    </div>
  );
}


