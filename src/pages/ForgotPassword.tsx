
import React from "react";
import Container from "@/components/layout/Container";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <Container className="flex items-center justify-center min-h-[calc(100vh-120px)] py-8">
      <div className="w-full">
        <ForgotPasswordForm />
      </div>
    </Container>
  );
};

export default ForgotPassword;
