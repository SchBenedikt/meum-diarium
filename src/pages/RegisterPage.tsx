import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Eye, EyeOff, User, LogIn, UserPlus, BookOpen, ScrollText, Users, Sparkles, Award } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

const registerSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  username: z.string()
    .min(3, 'Benutzername muss mindestens 3 Zeichen lang sein')
    .max(20, 'Benutzername darf maximal 20 Zeichen lang sein')
    .regex(/^[a-zA-Z0-9_]+$/, 'Benutzername darf nur Buchstaben, Zahlen und Unterstriche enthalten'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Sie müssen die AGB und Datenschutzbestimmungen akzeptieren'
  }),
  displayName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);
    
    // Additional email validation before submission
    if (emailError) {
      setError('Bitte korrigieren Sie Ihre E-Mail-Adresse');
      setIsLoading(false);
      return;
    }
    
    const result = await registerUser({
      email: data.email,
      username: data.username,
      password: data.password,
      displayName: data.displayName,
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registrierung fehlgeschlagen');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Registrieren"
        description="Erstellen Sie ein Konto bei Meum Diarium"
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
                  <UserPlus className="w-6 h-6 text-white" />
                </motion.div>
                
                <CardTitle className="text-3xl font-bold">Registrieren</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Treten Sie der Meum Diarium Community bei
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
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
                    <Label htmlFor="username" className="text-sm font-medium">Benutzername</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="benutzername"
                        className="pl-12 h-12 border-2 focus:border-primary transition-colors"
                        {...register('username')}
                      />
                    </div>
                    {errors.username && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-destructive"
                      >
                        {errors.username.message}
                      </motion.p>
                    )}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="displayName" className="text-sm font-medium">Anzeigename (optional)</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Ihr Name"
                      className="h-12 border-2 focus:border-primary transition-colors"
                      {...register('displayName')}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
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
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Passwort bestätigen</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="•••••••••"
                        className="pl-12 pr-12 h-12 border-2 focus:border-primary transition-colors"
                        {...register('confirmPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-destructive"
                      >
                        {errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </motion.div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4 pt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="w-full space-y-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.85 }}
                      className="space-y-2"
                    >
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="acceptTerms"
                          className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary focus:border-primary"
                          {...register('acceptTerms')}
                        />
                        <label htmlFor="acceptTerms" className="text-sm text-muted-foreground leading-relaxed">
                          Ich akzeptiere die{' '}
                          <Link to="/agb" className="text-primary hover:underline">
                            Allgemeinen Geschäftsbedingungen
                          </Link>
                          {' '}und die{' '}
                          <Link to="/privacy" className="text-primary hover:underline">
                            Datenschutzbestimmungen
                          </Link>
                        </label>
                      </div>
                      {errors.acceptTerms && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-destructive ml-6"
                        >
                          {errors.acceptTerms.message}
                        </motion.p>
                      )}
                    </motion.div>
                    
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Konto wird erstellt...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Konto erstellen
                        </>
                      )}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/30" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Bereits registriert?</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full h-12 text-base font-semibold border-2 hover:bg-muted/50 transition-all duration-300"
                      asChild
                    >
                      <Link to="/login" className="flex items-center justify-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Anmelden
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
