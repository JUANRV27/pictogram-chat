import { Upload, Sparkles, Download } from "lucide-react";
const steps = [{
  number: "1",
  icon: Upload,
  title: "Sube tu Foto",
  description: "Elige cualquier imagen desde tu dispositivo",
  color: "primary"
}, {
  number: "2",
  icon: Sparkles,
  title: "Magia de IA",
  description: "Nuestra inteligencia artificial busca y analiza pictogramas",
  color: "secondary"
}, {
  number: "3",
  icon: Download,
  title: "¡Listo para Usar!",
  description: "Descarga o comparte tus pictogramas favoritos",
  color: "accent"
}];
const HowItWorks = () => {
  return <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            ¿Cómo{" "}
            <span className="gradient-secondary bg-clip-text text-amber-400">
              Funciona
            </span>
            ?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Solo 3 pasos súper fáciles
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-1/4 left-10 right-10 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-30" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            
            // Define specific styles based on the step color type
            let badgeClass = "";
            let iconBoxClass = "";
            let iconClass = "";

            if (step.color === "primary") { // Purple (Step 1)
                badgeClass = "bg-primary text-primary-foreground"; // Purple bg, white text
                iconBoxClass = "bg-primary/20 border-primary"; // Light purple bg, purple border
                iconClass = "text-primary"; // Purple icon
            } else if (step.color === "secondary") { // Cyan/Orange (Step 2 - User called it Naranja/Celeste contextually, but secondary is Cyan in CSS)
                // User requirement: Number white. Box border matching color. Icon matching color. Background lighter.
                badgeClass = "bg-secondary text-white"; 
                iconBoxClass = "bg-secondary/20 border-secondary";
                iconClass = "text-secondary";
            } else if (step.color === "accent") { // Orange (Step 3)
                // User requirement: Number white.
                badgeClass = "bg-accent text-white";
                iconBoxClass = "bg-accent/20 border-accent";
                iconClass = "text-accent";
            }

            return (
              <div key={index} className="relative flex flex-col items-center text-center space-y-4 animate-fade-in" style={{
                animationDelay: `${index * 150}ms`
              }}>
                {/* Number badge */}
                <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-10 ${badgeClass}`}>
                  {step.number}
                </div>

                {/* Icon container */}
                <div className={`w-32 h-32 rounded-3xl border-2 flex items-center justify-center hover-lift relative z-0 backdrop-blur-sm ${iconBoxClass}`}>
                  <Icon className={`w-16 h-16 ${iconClass}`} />
                </div>

                {/* Content */}
                <h3 className="text-2xl md:text-3xl font-bold text-foreground pt-4">
                  {step.title}
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>;
};
export default HowItWorks;
