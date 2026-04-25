import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  onLogin: (token: string, username: string) => void;
}

export const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  if (!import.meta.env.VITE_BACKEND_URL) {
    // non-blocking notice so developer knows why requests go to localhost
    toast({ title: "Aviso", description: `VITE_BACKEND_URL no está definido — usando ${backendUrl}` });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? `${backendUrl}/auth/login` : `${backendUrl}/auth/register`;
    
    try {
      const headers = { "Content-Type": "application/json" };
      const bodyObj: Record<string, string> = { username, password };
      if (!isLogin) bodyObj.email = email;
      const body = JSON.stringify(bodyObj);

      console.debug("Auth request:", endpoint, bodyObj);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: body,
      });

      // Safely parse response body (might be empty)
      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        // non-JSON response
        data = { detail: text };
      }

      if (!response.ok) {
        throw new Error(data.detail || "Auth failed");
      }

      if (isLogin) {
        // backend returns { token, user }
        onLogin(data.token, data.user?.username || username);
        toast({ title: "¡Bienvenido! 👋" });
      } else {
        toast({ title: "Registro exitoso", description: "Ahora puedes iniciar sesión" });
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Auth error", { endpoint, error });
      toast({ title: "Error", description: error.message || "Credenciales inválidas", variant: "destructive" });
    }
  };

  const handleGuestLogin = () => {
    if (!username.trim()) {
      toast({ title: "Error", description: "Ingresa un nombre de usuario para entrar como invitado", variant: "destructive" });
      return;
    }
    // Generate a fake token for guest
    onLogin("guest-token", username + " (Invitado)");
    toast({ title: "¡Bienvenido Invitado! 👋" });
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        {!isLogin && (
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        )}
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">
          {isLogin ? "Entrar" : "Registrarse"}
        </Button>
      </form>
      
      <div className="relative my-4">
        {/* Divider removed */}
      </div>

      {/* Guest login button removed */}

      <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="w-full mt-2">
        {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
      </Button>
    </Card>
  );
};
