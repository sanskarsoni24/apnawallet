
import React from "react";
import Container from "@/components/layout/Container";
import DesktopApp from "@/components/desktop/DesktopApp";
import { Helmet } from "react-helmet";

const DesktopAppPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Desktop App - Surakshit Locker</title>
        <meta name="description" content="Download and learn about the Surakshit Locker desktop application" />
      </Helmet>
      <Container>
        <DesktopApp />
      </Container>
    </>
  );
};

export default DesktopAppPage;
