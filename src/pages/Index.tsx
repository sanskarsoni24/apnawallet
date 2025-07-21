
import LandingPage from "@/components/landing/LandingPage";
import Header from "@/components/layout/Header";
import Container from "@/components/layout/Container";
import Mark25Dashboard from "@/components/dashboard/Mark25Dashboard";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const { isLoggedIn } = useUser();
  
  if (isLoggedIn) {
    return <Mark25Dashboard />;
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Container>
          <LandingPage />
        </Container>
      </main>
    </div>
  );
};

export default Index;
