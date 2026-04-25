import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Image as ImageIcon, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const Hero = () => {
  const navigate = useNavigate();
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full animate-float blur-2xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/30 rounded-full animate-bounce-slow blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-accent/30 rounded-full animate-pulse-slow blur-2xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-lg border-2 border-primary/20 animate-fade-in">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold text-foreground">¡Nueva y Divertida!</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight animate-fade-in">
            Bienvenido a{" "}
            <span className="gradient-primary bg-clip-text text-cyan-500">
              PictoChat
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Sube una foto y descubre pictogramas que te ayudarán a comunicarte mejor.
            ¡Es fácil, rápido y muy divertido! 🎨
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="text-xl px-8 py-6 h-auto rounded-full bg-primary hover:bg-purple-400 hover:text-black text-primary-foreground hover-lift shadow-lg font-semibold transition-colors">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Comenzar a Chatear
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Elige una opción</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/builder')}>
                  Constructor de Oraciones
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/realtime-chat')}>
                  Chat en Tiempo Real
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/chat')}>
                  Aprende con Chambi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="lg" variant="outline" className="text-xl px-8 py-6 h-auto rounded-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground hover-lift shadow-lg font-semibold" onClick={() => navigate('/chat')}>
              <ImageIcon className="w-6 h-6 mr-2" />
              Subir Imagen
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-12 flex flex-wrap justify-center gap-8 text-muted-foreground animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-lg">Fácil de usar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-lg">Seguro para niños</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-lg">Siempre gratis</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;
