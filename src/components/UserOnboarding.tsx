"use client";

import React, { useState } from "react";

const UserOnboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dietPreference: "",
    healthGoals: [],
    allergies: [],
    cookingSkill: "",
    timeAvailability: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setFormData({ ...formData, [name]: selectedValues });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">User Onboarding</h2>
      {step === 1 && (
        <div>
          <h3 className="mb-2 text-lg font-semibold">Step 1: Diet Preference</h3>
          <select
            name="dietPreference"
            value={formData.dietPreference}
            onChange={handleInputChange}
            className="w-full rounded border p-2"
          >
            <option value="">Select diet preference</option>
            <option value="omnivore">Omnivore</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
          </select>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3 className="mb-2 text-lg font-semibold">Step 2: Health Goals</h3>
          <select
            name="healthGoals"
            multiple
            value={formData.healthGoals}
            onChange={handleMultiSelect}
            className="w-full rounded border p-2"
          >
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
            <option value="heart_health">Heart Health</option>
            <option value="diabetes_management">Diabetes Management</option>
          </select>
        </div>
      )}
      {/* Add more steps for allergies, cooking skill, and time availability */}
      <div className="mt-4 flex justify-between">
        {step > 1 && (
          <button onClick={prevStep} className="rounded bg-gray-300 px-4 py-2">
            Previous
          </button>
        )}
        {step < 5 ? (
          <button onClick={nextStep} className="rounded bg-blue-500 px-4 py-2 text-white">
            Next
          </button>
        ) : (
          <button className="rounded bg-green-500 px-4 py-2 text-white">Finish</button>
        )}
      </div>
    </div>
  );
};

export default UserOnboarding;
