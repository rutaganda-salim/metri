
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, LockKeyhole, UserRound, Github } from "lucide-react";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const defaultTab =
    searchParams.get("tab") === "register" ? "register" : "login";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const tab = searchParams.get("tab") === "register" ? "register" : "login";
    setActiveTab(tab);
  }, [searchParams]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // Redirect happens automatically with OAuth
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setIsMagicLinkSent(true);
      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // Redirect happens automatically
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-background text-foreground">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <Card className="border-border bg-card shadow-lg overflow-hidden">
          <CardHeader className="space-y-1 text-center pb-6 border-b">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-black rounded-full p-2 mr-2">
                <UserRound className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Metri
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Sign in or create an account to manage your website analytics
            </CardDescription>
          </CardHeader>

          {isMagicLinkSent ? (
            <CardContent className="space-y-6 pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto bg-sidebar-accent/50 w-16 h-16 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-sidebar-primary" />
                </div>
                <h3 className="text-xl font-medium">Check your email</h3>
                <p className="text-card-foreground">
                  We've sent a magic link to{" "}
                  <span className="font-medium">{email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to sign in
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsMagicLinkSent(false)}
              >
                Go back
              </Button>
            </CardContent>
          ) : (
            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-center">
                <TabsList className="grid w-[80%] items-center grid-cols-2 p-1 mx-auto mt-6 mb-2">
                  <TabsTrigger value="login" className="rounded-md">Login</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-md">Register</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="login">
                <CardContent className="space-y-5 pt-6">
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 border-gray-300"
                      onClick={handleGithubSignIn}
                      disabled={isLoading}
                    >
                      <Github className="h-4 w-4" />
                      Sign in with GitHub
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          placeholder="Email address"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-input/10 pl-10"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-black/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Magic Link"}
                      <LockKeyhole className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-5 pt-6">
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-gray-300"
                        onClick={handleGithubSignIn}
                        disabled={isLoading}
                      >
                        <Github className="h-4 w-4" />
                        Sign up with GitHub
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          placeholder="Full Name"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="bg-input/10 pl-10"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          placeholder="Email address"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-input/10 pl-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pb-6">
                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-black/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Creating account..."
                        : "Continue with Magic Link"}
                      <LockKeyhole className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
