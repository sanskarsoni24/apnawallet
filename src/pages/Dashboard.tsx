
import React from 'react';
import MainNav from '../components/layout/MainNav';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav className="border-b" />
      <div className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your document dashboard.</p>
      </div>
    </div>
  );
};

export default Dashboard;
