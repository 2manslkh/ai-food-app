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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Onboarding</h2>
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Step 1: Diet Preference
          </h3>
          <select
            name="dietPreference"
            value={formData.dietPreference}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
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
          <h3 className="text-lg font-semibold mb-2">Step 2: Health Goals</h3>
          <select
            name="healthGoals"
            multiple
            value={formData.healthGoals}
            onChange={handleMultiSelect}
            className="w-full p-2 border rounded"
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
          <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">
            Previous
          </button>
        )}
        {step < 5 ? (
          <button
            onClick={nextStep}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export default UserOnboarding;
