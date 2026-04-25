import { Card } from "@/components/ui/card";
import { Search, Brain, MessageSquare, Sparkles } from "lucide-react";
const features = [{
  icon: Search,
  title: "Busca Pictogramas",
  description: "Sube cualquier foto y encuentra pictogramas relacionados al instante",
  color: "primary",
  gradient: "gradient-primary"
}, {
  icon: Brain,
  title: "Inteligencia Artificial",
  description: "Nuestra IA entiende las imágenes y te muestra los mejores pictogramas",
  color: "secondary",
  gradient: "gradient-secondary"
}, {
  icon: MessageSquare,
  title: "Chat Amigable",
  description: "Habla con nuestro asistente que siempre está listo para ayudarte",
  color: "accent",
  gradient: "gradient-accent"
}, {
  icon: Sparkles,
  title: "Aprende Jugando",
  description: "Descubre nuevos pictogramas cada día de forma divertida e interactiva",
  color: "primary",
  gradient: "gradient-primary"
}];
const Features = () => {
  return <section className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            ¿Qué hace{" "}
            <span className="gradient-primary bg-clip-text text-cyan-500">
              PictoChat
            </span>
            ?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Una herramienta mágica que convierte tus fotos en pictogramas útiles
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => {
          const Icon = feature.icon;
          return <Card key={index} className="p-8 hover-lift border-2 border-border hover:border-primary/30 transition-all duration-300 bg-card" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="flex flex-col items-start gap-4">
                  <div className={`p-4 rounded-2xl ${feature.gradient} shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>;
        })}
        </div>
      </div>
    </section>;
};
export default Features;
