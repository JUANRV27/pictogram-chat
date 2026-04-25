import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Rocket } from "lucide-react";
const CallToAction = () => {
  const navigate = useNavigate();
  return <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-primary opacity-10" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 bg-secondary/35 rounded-full animate-float blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/35 rounded-full animate-pulse-slow blur-3xl" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-card border-2 border-primary/20 rounded-3xl p-12 shadow-2xl hover-lift text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Rocket className="w-10 h-10 text-primary animate-bounce-slow" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            ¿Listo para{" "}
            <span className="gradient-primary bg-clip-text text-purple-600">
              Empezar
            </span>
            ?
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Únete a miles de niños y familias que ya están aprendiendo con pictogramas de forma divertida
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="text-xl px-10 py-7 h-auto rounded-full bg-purple-600 hover:bg-purple-700 text-white hover-lift shadow-xl font-semibold" onClick={() => navigate('/chat')}>
              ¡Comenzar Ahora Gratis!
            </Button>
          </div>

          <p className="text-lg text-muted-foreground">
            No se requiere tarjeta de crédito • Siempre gratis • Seguro para niños
          </p>
        </div>
      </div>
    </section>;
};
export default CallToAction;
