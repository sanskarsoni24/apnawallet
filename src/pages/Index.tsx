
import React from "react";
import Container from "@/components/layout/Container";
import Dashboard from "@/components/dashboard/Dashboard";
import LandingPage from "@/components/landing/LandingPage";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const { isLoggedIn } = useUser();
  
  return (
    <Container>
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <LandingPage />
      )}
    </Container>
  );
};

export default Index;
