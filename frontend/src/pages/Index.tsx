import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Top buttons removed */}
      <Hero />
      <Features />
      <HowItWorks />
      <CallToAction />
    </div>
  );
};

export default Index;
