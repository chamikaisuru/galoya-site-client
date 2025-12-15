import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Wine } from 'lucide-react';

export default function AgeVerification() {
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Skip verification for admin pages
    if (window.location.pathname.startsWith('/admin')) {
      setIsVerified(true);
      return;
    }

    // Check if user has already verified age in this session
    const verified = sessionStorage.getItem('age_verified');
    if (verified === 'true') {
      setIsVerified(true);
      setShowModal(false);
    } else {
      // Show modal after a brief delay for better UX
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      sessionStorage.setItem('age_verified', 'true');
      setIsVerified(true);
      setShowModal(false);
    } else {
      // Redirect to a different page or show rejection message
      window.location.href = 'https://responsibility.org/';
    }
  };

  if (isVerified || !showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-lg bg-card border-primary/20 shadow-2xl animate-in zoom-in duration-300">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Wine className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-serif text-foreground">
            Age Verification Required
          </CardTitle>
          <CardDescription className="text-base">
            You must be of legal drinking age to enter this website
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-foreground">Legal Drinking Age</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By entering this website, you confirm that you are at least 21 years old 
                  and agree to our terms of use.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-lg font-medium text-foreground">
              Are you 21 years of age or older?
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                onClick={() => handleVerify(true)}
                className="bg-primary text-black hover:bg-primary/90 h-12 text-base font-bold uppercase tracking-widest"
              >
                Yes, I am 21+
              </Button>
              <Button
                onClick={() => handleVerify(false)}
                variant="outline"
                className="border-white/20 h-12 text-base font-bold uppercase tracking-widest hover:bg-destructive hover:text-white"
              >
                No, I'm under 21
              </Button>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-xs text-muted-foreground">
              By clicking "Yes", you confirm that you are of legal drinking age in your country/region
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}