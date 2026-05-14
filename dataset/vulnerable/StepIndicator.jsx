
import React, { useMemo } from "react";

export function StepIndicator({ currentStep, totalSteps }) {
  const stepsHtml = useMemo(() => {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
    return `
      <div class="step-indicator">
        ${steps.map(step => 
          `<span class="step ${step <= currentStep ? "completed" : ""}">${step}</span>`
        ).join("")}
      </div>
    `;
  }, [currentStep, totalSteps]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: stepsHtml }}
    />
  );
}


