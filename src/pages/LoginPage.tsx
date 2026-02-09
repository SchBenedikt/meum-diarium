import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Eye, EyeOff, UserPlus, BookOpen, ScrollText, Users } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Watch email field for real-time validation
  const emailValue = watch('email');

  // Enhanced email validation function
  const validateEmailRealtime = async (email: string) => {
    if (!email) {
      setEmailError(null);
      return;
    }

    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }

    // Check for common invalid email patterns
    const invalidPatterns = [
      /^[^@]+@[^@]*\.[^@]*[^a-zA-Z]$/, // TLD doesn't end with letter
      /^[^@]+@[^@]*\.[^@]*\.$/, // TLD ends with dot
      /^[^@]+@[^@]*\.\.$/, // Double dot at end
      /^[^@]+@[^@]*\.\./, // Double dot before TLD
      /^[^@]*\.\./, // Starts with dot
      /^[^@]*\.$/, // Ends with dot before @
      /^[^@]*@.*@/, // Multiple @ symbols
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.test(email)) {
        setEmailError('Diese E-Mail-Adresse scheint ungültig zu sein');
        return;
      }
    }

    // Check for common disposable email domains
    const disposableDomains = [
      'tempmail.org', '10minutemail.com', 'guerrillamail.com',
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.some(d => domain?.includes(d))) {
      setEmailError('Bitte verwenden Sie eine permanente E-Mail-Adresse');
      return;
    }

    // If all checks pass
    setEmailError(null);
  };

  // Trigger validation when email changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (emailValue) {
        validateEmailRealtime(emailValue);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [emailValue]);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);
    
    // Additional email validation before submission
    if (emailError) {
      setError('Bitte korrigieren Sie Ihre E-Mail-Adresse');
      setIsLoading(false);
      return;
    }
    
    const result = await login(data.email, data.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Login fehlgeschlagen');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Anmelden"
        description="Melden Sie sich bei Meum Diarium an"
        noIndex={true}
      />
      
      <main className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </motion.div>
                
                <CardTitle className="text-3xl font-bold">Anmelden</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Willkommen zurück bei Meum Diarium
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-5">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Alert variant="destructive" className="border-0 bg-destructive/10 text-destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-sm font-medium">E-Mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="ihre@email.de"
                        className="pl-12 h-12 border-2 focus:border-primary transition-colors"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-destructive"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                    {emailError && !errors.email && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-destructive"
                      >
                        {emailError}
                      </motion.p>
                    )}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="password" className="text-sm font-medium">Passwort</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="•••••••••"
                        className="pl-12 pr-12 h-12 border-2 focus:border-primary transition-colors"
                        {...register('password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-destructive"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </motion.div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4 pt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full space-y-4"
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Anmelden...
                        </>
                      ) : (
                        'Anmelden'
                      )}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/30" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Oder</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full h-12 text-base font-semibold border-2 hover:bg-muted/50 transition-all duration-300"
                      asChild
                    >
                      <Link to="/register" className="flex items-center justify-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Neues Konto erstellen
                      </Link>
                    </Button>
                  </motion.div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
