
export interface Meal {
  id: string;
  name: string;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export async function fetchMeals(): Promise<Meal[]> {
  // Mock data
  const mockMeals: Meal[] = [
    // { id: '1', name: 'Oatmeal with Berries', date: '2023-06-01', type: 'breakfast' },
    // { id: '2', name: 'Grilled Chicken Salad', date: '2023-06-01', type: 'lunch' },
    // { id: '3', name: 'Salmon with Roasted Vegetables', date: '2023-06-01', type: 'dinner' },
    // { id: '4', name: 'Yogurt Parfait', date: '2023-06-02', type: 'breakfast' },
    // { id: '5', name: 'Vegetable Stir Fry', date: '2023-06-02', type: 'lunch' },
  ];

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockMeals;
}

