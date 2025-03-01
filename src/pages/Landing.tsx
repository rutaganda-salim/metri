
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BarChart2, 
  Globe, 
  Shield, 
  Zap, 
  LineChart, 
  PieChart, 
  Clock, 
  MousePointer,
  CheckCircle2,
  Menu,
  X,
  Users,
  Code,
  Settings,
  ThumbsUp,
  ArrowUpRight,
  Lock,
  Laptop,
  Smartphone
} from "lucide-react";

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Zap className="h-8 w-8 text-blue-400" />
          <span className="text-2xl font-bold">Pulse Analytics</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
          <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/auth">
            <Button variant="ghost" className="text-gray-300 hover:text-white">Login</Button>
          </Link>
          <Link to="/auth?tab=register">
            <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-300 hover:text-white" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 py-4 px-4 absolute w-full z-50">
          <nav className="flex flex-col space-y-4">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors" onClick={toggleMobileMenu}>Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors" onClick={toggleMobileMenu}>How It Works</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors" onClick={toggleMobileMenu}>Pricing</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors" onClick={toggleMobileMenu}>Testimonials</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors" onClick={toggleMobileMenu}>FAQ</a>
            <div className="pt-4 flex flex-col space-y-2">
              <Link to="/auth" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-center text-gray-300 hover:text-white">Login</Button>
              </Link>
              <Link to="/auth?tab=register" onClick={toggleMobileMenu}>
                <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="container mx-auto py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm font-medium">
                <span>Simple, powerful web analytics</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                Track your website performance <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">without compromising privacy</span>
              </h1>
              <p className="text-lg text-gray-300">
                Get actionable insights about your visitors with a lightweight, privacy-focused analytics tool that's easy to set up and use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?tab=register">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    Start for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800">
                    See Features
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                  <span>No cookies</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                  <span>GDPR compliant</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                  <span>Unlimited websites</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                  <span>Real-time data</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl border border-gray-700 bg-gray-800">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Analytics Dashboard Preview" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-800 py-16 border-y border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
              <p className="text-gray-300">Privacy Focused</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">5s</div>
              <p className="text-gray-300">Setup Time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <p className="text-gray-300">Real-time Monitoring</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">0</div>
              <p className="text-gray-300">Third-party Trackers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Analytics Features</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Everything you need to understand your website traffic and visitor behavior in one simple dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Global Insights</h3>
            <p className="text-gray-300">
              See where your visitors come from with detailed geographic data and traffic sources.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-gray-300">
              Monitor traffic as it happens with our live dashboard updates and time-based charts.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacy Focused</h3>
            <p className="text-gray-300">
              Collect valuable insights without compromising your visitors' privacy or using cookies.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <PieChart className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Device Metrics</h3>
            <p className="text-gray-300">
              Understand what devices, browsers, and operating systems your visitors are using.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visit Duration</h3>
            <p className="text-gray-300">
              Track how long visitors stay on your site and which pages they spend the most time on.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <MousePointer className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Page Interactions</h3>
            <p className="text-gray-300">
              See which buttons, links, and elements users interact with most on your site.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-900 py-20 px-4 border-y border-gray-700">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get started with Pulse Analytics in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Create Account</h3>
              <p className="text-gray-300">
                Sign up for free in less than a minute with just your email.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Add Your Website</h3>
              <p className="text-gray-300">
                Add your website URL and get a unique tracking script.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">View Analytics</h3>
              <p className="text-gray-300">
                Watch real-time data flow into your dashboard immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="container mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose the plan that's right for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free tier */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-1">$0</div>
              <p className="text-gray-400 text-sm">Forever free</p>
            </div>
            <div className="space-y-3 mb-8 flex-1">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">1 website</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">10,000 page views/month</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">7 days data retention</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Basic analytics</span>
              </div>
            </div>
            <Link to="/auth?tab=register">
              <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-700">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Premium tier */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-blue-600 flex flex-col h-full relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Premium</h3>
              <div className="text-3xl font-bold mb-1">$19</div>
              <p className="text-gray-400 text-sm">per month</p>
            </div>
            <div className="space-y-3 mb-8 flex-1">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">5 websites</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">100,000 page views/month</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">1 year data retention</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Advanced analytics</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Export data in CSV/JSON</span>
              </div>
            </div>
            <Link to="/auth?tab=register">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Enterprise tier */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-1">$49</div>
              <p className="text-gray-400 text-sm">per month</p>
            </div>
            <div className="space-y-3 mb-8 flex-1">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Unlimited websites</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">1M+ page views/month</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Unlimited data retention</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Custom analytics reports</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">API access</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Priority support</span>
              </div>
            </div>
            <Link to="/auth?tab=register">
              <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-700">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-gray-900 py-20 px-4 border-y border-gray-700">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied users who improved their websites with our insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">J</div>
                </div>
                <div>
                  <div className="font-semibold">James Smith</div>
                  <div className="text-sm text-gray-400">Web Developer</div>
                </div>
              </div>
              <p className="text-gray-300">
                "Pulse Analytics gives me exactly what I need without the bloat of other tools. It's lightweight, privacy-focused, and provides actionable insights."
              </p>
              <div className="flex mt-4 text-yellow-400">
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold">S</div>
                </div>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-gray-400">Marketing Director</div>
                </div>
              </div>
              <p className="text-gray-300">
                "I switched to Pulse Analytics for our company website and I'm amazed by how much cleaner and more useful the data is compared to our previous solution."
              </p>
              <div className="flex mt-4 text-yellow-400">
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-xl font-bold">M</div>
                </div>
                <div>
                  <div className="font-semibold">Michael Brown</div>
                  <div className="text-sm text-gray-400">Startup Founder</div>
                </div>
              </div>
              <p className="text-gray-300">
                "As a startup owner, I needed analytics that wouldn't slow down my site or violate privacy laws. Pulse Analytics delivered exactly that with an intuitive interface."
              </p>
              <div className="flex mt-4 text-yellow-400">
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
                <ThumbsUp className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Get answers to common questions about Pulse Analytics
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">Is Pulse Analytics GDPR compliant?</h3>
            <p className="text-gray-300">
              Yes, Pulse Analytics is fully GDPR compliant. We don't use cookies or collect any personally identifiable information. Our analytics respects your visitors' privacy while still giving you valuable insights.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">Will the tracking script slow down my website?</h3>
            <p className="text-gray-300">
              No, our tracking script is designed to be extremely lightweight (less than 2KB) and asynchronous, meaning it won't impact your website's loading speed or performance.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">Can I track multiple websites?</h3>
            <p className="text-gray-300">
              Yes, depending on your plan, you can track multiple websites from a single dashboard. Our Premium plan allows for 5 websites, and our Enterprise plan offers unlimited website tracking.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">How do I install the tracking code on my website?</h3>
            <p className="text-gray-300">
              Simply add your website in your dashboard, and we'll generate a unique tracking script for you. Add this script to the head section of your website, and you're good to go. We provide specific instructions for popular platforms like WordPress, Shopify, and others.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">Can I export my analytics data?</h3>
            <p className="text-gray-300">
              Yes, with our Premium and Enterprise plans, you can export your analytics data in CSV or JSON formats for further analysis or reporting.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to gain insights about your website?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of websites that use Pulse Analytics to understand their audience and improve their metrics.
          </p>
          <Link to="/auth?tab=register">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">Pulse Analytics</span>
              </div>
              <p className="text-gray-400 mb-4">
                Privacy-focused web analytics platform that helps you understand your website traffic.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Pulse Analytics. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Cookies Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
