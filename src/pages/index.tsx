import React from "react";
import Layout from "../components/Layout";
import UserOnboarding from "../components/UserOnboarding";

const Home: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">Welcome to AI Meal Planner</h1>
      <UserOnboarding />
    </Layout>
  );
};

export default Home;
