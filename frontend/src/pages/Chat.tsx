import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Upload, GraduationCap, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import chambiImage from "@/assets/chambi-capybara.svg";
import { AuthForm } from "@/components/AuthForm";
import confetti from "canvas-confetti";

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  
  // Learning Mode State
  const [learningMode, setLearningMode] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [score, setScore] = useState(0);

  const handleLogin = (t: string, u: string) => {
    setToken(t);
    setUsername(u);
  };

  const fetchPictograms = async (text: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_AI_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected: text.split(" ") })
      });
      
      if (!response.ok) throw new Error("Failed to fetch pictograms");
      
      const data = await response.json();
      setRecommendations(data.recommended);
      
      toast({
        title: "¡Pictogramas encontrados! 🎉",
        description: "Aquí tienes los resultados."
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error 😢",
        description: "No pude conectar con el servicio de IA.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      setLoading(true);
      await fetchPictograms(message);
      setLoading(false);
      setMessage("");
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Predict image class using Backend
      const response = await fetch(`${import.meta.env.VITE_AI_URL}/api/predict`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error("Failed to predict image");

      const data = await response.json();
      const className = data.class_name;

      toast({
        title: "Imagen analizada 📸",
        description: `Parece que es: ${className}. Buscando pictogramas...`
      });

      // Get pictograms for the predicted class
      await fetchPictograms(className);

    } catch (error) {
      console.error(error);
      toast({
        title: "Error 😢",
        description: "No pude analizar la imagen. Asegúrate de que el backend esté corriendo en el puerto correcto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Quiz Logic
  const fetchQuiz = async () => {
      setQuizLoading(true);
      try {
          const res = await fetch(`${import.meta.env.VITE_AI_URL}/quiz/generate`);
          if (res.ok) {
              const data = await res.json();
              setQuiz(data);
          }
      } catch (e) {
          console.error(e);
          toast({ title: "Error", description: "No pude generar el quiz", variant: "destructive" });
      } finally {
          setQuizLoading(false);
      }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
      if (isCorrect) {
          confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
          });
          toast({ title: "¡Correcto! 🌟", description: "¡Muy bien hecho!" });
          setScore(s => s + 10);
          setTimeout(fetchQuiz, 1500); // Auto load next
      } else {
          toast({ title: "Ups... 😅", description: "Inténtalo de nuevo.", variant: "destructive" });
          setScore(s => Math.max(0, s - 5));
      }
  };

  useEffect(() => {
      if (learningMode && !quiz) {
          fetchQuiz();
      }
  }, [learningMode]);

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="absolute top-4 left-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                    Inicia sesión para chatear con Chambi
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Necesitas una cuenta para guardar tu progreso y personalizar tu experiencia.
                </p>
            </div>
            <AuthForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-20 w-40 h-40 bg-primary/30 rounded-full animate-float blur-3xl" />
        <div className="absolute bottom-32 left-20 w-48 h-48 bg-secondary/30 rounded-full animate-bounce-slow blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-accent/30 rounded-full animate-pulse-slow blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-primary/25 rounded-full animate-float blur-2xl" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="border-b-2 border-border bg-card/95 backdrop-blur-sm shadow-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="lg" onClick={() => navigate('/')} className="text-lg font-semibold hover:bg-primary/10">
                <ArrowLeft className="w-6 h-6 mr-2" />
                Volver
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-cyan-500 md:text-4xl hidden md:block">
            PictoChat
          </h1>

          <div className="flex items-center gap-4">
              {learningMode && (
                  <div className="bg-primary/10 px-4 py-2 rounded-full font-bold text-primary animate-pulse">
                      Puntos: {score}
                  </div>
              )}
              <Button 
                variant={learningMode ? "default" : "outline"}
                onClick={() => setLearningMode(!learningMode)}
                className="gap-2"
              >
                  <GraduationCap className="w-5 h-5" />
                  {learningMode ? "Modo Chat" : "Aprender"}
              </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Card className="h-full min-h-[600px] flex flex-col border-2 border-border shadow-lg bg-card/95 backdrop-blur-sm">
          
          {/* Learning Mode Interface */}
          {learningMode ? (
              <div className="flex-1 flex flex-col p-6 items-center justify-center gap-8 animate-fade-in">
                  {quizLoading || !quiz ? (
                      <div className="flex flex-col items-center gap-4">
                          <RefreshCw className="w-10 h-10 animate-spin text-primary" />
                          <p className="text-lg text-muted-foreground">Chambi está preparando un ejercicio...</p>
                      </div>
                  ) : (
                      <>
                        <div className="flex flex-col items-center gap-4 text-center">
                            <img src={chambiImage} alt="Chambi" className="w-32 h-32 animate-bounce-slow" />
                            <Card className="p-6 bg-primary/10 border-2 border-primary/30 text-xl font-bold">
                                {quiz.question}
                            </Card>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                            {quiz.options.map((opt: any) => (
                                <Card 
                                    key={opt.id}
                                    onClick={() => handleQuizAnswer(opt.is_correct)}
                                    className="p-4 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform border-2 hover:border-primary active:scale-95"
                                >
                                    <img src={opt.url} alt="Option" className="w-32 h-32 object-contain" />
                                </Card>
                            ))}
                        </div>
                        
                        <Button variant="ghost" onClick={fetchQuiz} className="mt-4">
                            Saltar pregunta <RefreshCw className="w-4 h-4 ml-2" />
                        </Button>
                      </>
                  )}
              </div>
          ) : (
            // Chat Mode Interface
            <>
                {/* Messages area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {/* Welcome message with Chambi */}
                    <div className="flex flex-col items-center gap-6">
                    {/* Chambi the Capybara */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse-slow" />
                        <img src={chambiImage} alt="Chambi el Capibara" className="w-40 h-40 relative z-10 animate-bounce-slow" />
                    </div>
                    
                    {/* Speech bubble */}
                    <Card className="max-w-xl p-8 bg-primary/10 border-2 border-primary/30 animate-fade-in text-center relative shadow-xl hover-lift">
                        {/* Speech bubble tail */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-primary/30" />
                        
                        <p className="text-2xl font-bold text-foreground mb-3">
                        ¡Hola! Soy Chambi 🦫
                        </p>
                        <p className="text-xl text-foreground mb-2 font-semibold">
                        Tu amigo capibara que te ayudará con pictogramas
                        </p>
                        <p className="text-lg text-muted-foreground">
                        Puedes escribirme o subir una imagen para empezar. ¡Estoy aquí para ayudarte!
                        </p>
                    </Card>
                    </div>

                    {/* Recommendations Area */}
                    {recommendations.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 animate-fade-in">
                        {recommendations.map((picto) => (
                        <Card key={picto.id} className="p-4 flex flex-col items-center hover-lift border-2 border-primary/20">
                            <img src={picto.url} alt={picto.palabra} className="w-full h-auto rounded-md mb-2" />
                            <p className="text-lg font-bold text-center capitalize">{picto.palabra}</p>
                        </Card>
                        ))}
                    </div>
                    )}
                </div>

                {/* Input area */}
                <div className="border-t-2 border-border p-4 bg-muted/50 backdrop-blur-sm">
                    <div className="flex gap-2 items-end">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                    />
                    <Button size="lg" variant="outline" onClick={handleImageUploadClick} className="border-2 border-secondary hover:bg-secondary hover:text-secondary-foreground rounded-2xl h-14 px-6 hover-lift transition-all">
                        <Upload className="w-6 h-6" />
                    </Button>
                    
                    <div className="flex-1 relative">
                        <Input 
                        value={message} 
                        onChange={e => setMessage(e.target.value)} 
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()} 
                        placeholder="Pregúntale a Chambi..." 
                        className="text-lg h-14 pr-14 rounded-2xl border-2 border-border focus:border-primary transition-all" 
                        disabled={loading}
                        />
                    </div>

                    <Button size="lg" onClick={handleSendMessage} disabled={!message.trim() || loading} className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-2xl h-14 px-6 shadow-lg hover-lift disabled:opacity-50 transition-all">
                        <Send className="w-6 h-6" />
                    </Button>
                    </div>
                    
                    <p className="text-center text-sm text-muted-foreground mt-3">
                    Chambi está listo para ayudarte con pictogramas 🦫
                    </p>
                </div>
            </>
          )}
        </Card>
      </main>
    </div>
  );
};
export default Chat;