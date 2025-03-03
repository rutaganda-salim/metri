import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, ChevronDown, Code, Globe, LineChart, Lock, BarChart3, Zap, Star, Users } from "lucide-react";

const Landing = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="w-full backdrop-blur-sm bg-background/80 border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
            <LineChart className="h-6 w-6" />
            <span>Metri</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth" className="text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Link to="/auth">
              <Button>
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Redesigned without an image */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-block rounded-full px-3 py-1 text-sm bg-secondary text-foreground">
              <span className="flex items-center justify-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                Analytics for everyone
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight vercel-gradient">
              <span className="text-gradient">Metri</span> Analytics that <br /> 
              just works
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, fast analytics for your websites and applications. No cookies required, fully GDPR compliant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn more
                </Button>
              </a>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground justify-center">
              <div className="flex items-center">
                <Check className="mr-1 h-4 w-4 text-primary" />
                <span>Privacy-focused</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-1 h-4 w-4 text-primary" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-1 h-4 w-4 text-primary" />
                <span>No cookies</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-3xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-background/60 rounded-lg p-4 border border-border shadow-sm flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-primary">{(i + 1) * 10}k+</div>
                    <div className="text-muted-foreground text-sm">
                      {i === 0 ? 'Users' : i === 1 ? 'Websites' : i === 2 ? 'Companies' : 'Countries'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Analytics Features</h2>
            <p className="text-muted-foreground">
              Everything you need to understand your website traffic and user behavior, without compromising on privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="vercel-card">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Real-time Tracking</h3>
                <p className="text-muted-foreground">
                  See who is on your website in real-time, where they came from, and what they're doing.
                </p>
              </CardContent>
            </Card>

            <Card className="vercel-card">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Detailed Reports</h3>
                <p className="text-muted-foreground">
                  Get detailed reports on visitor metrics, device usage, and traffic sources.
                </p>
              </CardContent>
            </Card>

            <Card className="vercel-card">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Privacy-Focused</h3>
                <p className="text-muted-foreground">
                  No cookies, no personal data collection, and full GDPR compliance out of the box.
                </p>
              </CardContent>
            </Card>

            <Card className="vercel-card">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Simple Integration</h3>
                <p className="text-muted-foreground">
                  Add a single line of code to your website and you're ready to go.
                </p>
              </CardContent>
            </Card>

            <Card className="vercel-card">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Custom Dashboards</h3>
                <p className="text-muted-foreground">
                  Create and customize dashboards to focus on the metrics that matter to you.
                </p>
              </CardContent>
            </Card>

            <Card className="vercel-card">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Fast & Lightweight</h3>
                <p className="text-muted-foreground">
                  Our tracking script is tiny and doesn't affect your website's performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Get up and running in minutes with our simple setup process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
                <span className="text-xl font-bold">1</span>
                <div className="absolute -right-full top-1/2 h-0.5 w-full bg-border hidden md:block"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up for an account to get started with our analytics platform.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
                <span className="text-xl font-bold">2</span>
                <div className="absolute -right-full top-1/2 h-0.5 w-full bg-border hidden md:block"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Add Your Website</h3>
              <p className="text-muted-foreground">
                Enter your website details and get a unique tracking code.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">View Your Analytics</h3>
              <p className="text-muted-foreground">
                Start seeing real-time data and insights about your visitors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">
              Choose the plan that's right for you. All plans include full access to our analytics platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="vercel-card">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Free</h3>
                  <div className="mt-4 mb-2">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <p className="text-muted-foreground">
                    For personal projects and small websites.
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>1 website</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>10,000 pageviews/month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>7 days data retention</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>Basic analytics</span>
                  </li>
                </ul>
                <Link to="/auth" className="mt-auto">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="vercel-card relative overflow-hidden">
              <div className="absolute inset-0 bg-secondary/70 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-xl font-bold mb-2">Pro Plan</div>
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full inline-block">
                    Coming Soon
                  </div>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col h-full opacity-50">
                <div className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                  Most Popular
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Pro</h3>
                  <div className="mt-4 mb-2">
                    <span className="text-4xl font-bold">$19</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <p className="text-muted-foreground">
                    For growing businesses and professional websites.
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>5 websites</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>100,000 pageviews/month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>30 days data retention</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>Custom dashboards</span>
                  </li>
                </ul>
                <Button className="w-full mt-auto" disabled>
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="vercel-card relative overflow-hidden">
              <div className="absolute inset-0 bg-secondary/70 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-xl font-bold mb-2">Enterprise Plan</div>
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full inline-block">
                    Coming Soon
                  </div>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col h-full opacity-50">
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Enterprise</h3>
                  <div className="mt-4 mb-2">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <p className="text-muted-foreground">
                    For large businesses with multiple websites.
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>Unlimited websites</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>1,000,000 pageviews/month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>1 year data retention</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>Custom dashboards</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-auto" disabled>
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Updated to use cards */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Loved by Developers</h2>
            <p className="text-muted-foreground">
              Here's what our users are saying about our analytics platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-lg mb-6 flex-1">
                  "This analytics platform is exactly what I needed. Simple, privacy-focused, and gives me all the data I care about."
                </blockquote>
                <div className="flex items-center mt-auto border-t pt-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-3 border border-border">
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                      alt="Sarah Chen"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Chen</p>
                    <p className="text-sm text-muted-foreground">Frontend Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-lg mb-6 flex-1">
                  "I switched from Google Analytics and couldn't be happier. No more cookie banners and the data is more accurate."
                </blockquote>
                <div className="flex items-center mt-auto border-t pt-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-3 border border-border">
                    <img 
                      src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952" 
                      alt="David Johnson"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">David Johnson</p>
                    <p className="text-sm text-muted-foreground">Agency Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-lg mb-6 flex-1">
                  "The simplicity of the dashboard is refreshing. I can find what I need without getting lost in a sea of metrics I don't care about."
                </blockquote>
                <div className="flex items-center mt-auto border-t pt-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-3 border border-border">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
                      alt="Maria Rodriguez"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Maria Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Marketing Director</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 4 */}
            <Card className="hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-lg mb-6 flex-1">
                  "Setting up took less than 5 minutes. The integration was smooth and the data started flowing immediately."
                </blockquote>
                <div className="flex items-center mt-auto border-t pt-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-3 border border-border">
                    <img 
                      src="https://images.unsplash.com/photo-1566492031773-4f4e44671857" 
                      alt="James Wilson"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">James Wilson</p>
                    <p className="text-sm text-muted-foreground">CTO</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 5 */}
            <Card className="hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-lg mb-6 flex-1">
                  "As a developer, I appreciate how lightweight the tracking script is. It doesn't slow down my site at all."
                </blockquote>
                <div className="flex items-center mt-auto border-t pt-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-3 border border-border">
                    <img 
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36" 
                      alt="Alex Thompson"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Alex Thompson</p>
                    <p className="text-sm text-muted-foreground">Software Engineer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 6 */}
            <Card className="hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-lg mb-6 flex-1">
                  "The customer support is exceptional. They helped me set up custom tracking for my SPA and were responsive throughout."
                </blockquote>
                <div className="flex items-center mt-auto border-t pt-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-3 border border-border">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956" 
                      alt="Emma Davis"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Emma Davis</p>
                    <p className="text-sm text-muted-foreground">Product Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Have a question? Find the answer below or contact our support team.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Is your analytics platform GDPR compliant?",
                answer: "Yes, our platform is fully GDPR compliant. We don't use cookies, don't track personal data, and don't share any data with third parties. You can use our platform without showing cookie consent banners."
              },
              {
                question: "How do I install the tracking code?",
                answer: "Simply add our script tag to the head section of your website. Once you create an account, you'll get a unique tracking code to add to your site. It's a single line of code that takes seconds to install."
              },
              {
                question: "Can I track multiple websites with one account?",
                answer: "Yes, depending on your plan. The Free plan allows for one website, the Pro plan for five websites, and the Enterprise plan for unlimited websites. Each website will have its own dashboard and analytics."
              },
              {
                question: "Do you offer a free trial for paid plans?",
                answer: "Yes, we offer a 14-day free trial for all paid plans. No credit card required. You can try all the features and see if it's right for you before committing."
              },
              {
                question: "How accurate is your tracking compared to Google Analytics?",
                answer: "Our tracking is often more accurate than Google Analytics because we don't get blocked by ad-blockers as frequently. We've designed our script to be lightweight and privacy-friendly, which means it's less likely to be blocked."
              },
              {
                question: "Can I export my analytics data?",
                answer: "Yes, all paid plans allow you to export your analytics data in CSV, JSON, or PDF formats. You can also schedule regular exports to be sent to your email."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-foreground/20"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex justify-between items-center focus:outline-none"
                >
                  <h3 className="text-left font-medium text-lg">{faq.question}</h3>
                  <div className={`transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index 
                      ? 'max-h-96 py-4 opacity-100' 
                      : 'max-h-0 py-0 opacity-0'
                  }`}
                >
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of websites using our analytics platform to gain insights without compromising user privacy.
            </p>
            <Link to="/auth">
              <Button size="lg">
                Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold flex items-center space-x-2 mb-4">
                <LineChart className="h-6 w-6" />
                <span>Metri</span>
              </div>
              <p className="text-muted-foreground">
                Simple, privacy-focused analytics for your websites and applications.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Guides</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">GDPR</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Metri. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
