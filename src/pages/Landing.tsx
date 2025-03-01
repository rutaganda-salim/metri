
import React from "react";
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
  CheckCircle2
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold">Pulse Analytics</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/auth">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/auth?tab=register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                <span>Simple, powerful web analytics</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                Track your website performance <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">without compromising privacy</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Get actionable insights about your visitors with a lightweight, privacy-focused analytics tool that's easy to set up and use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?tab=register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    See Features
                  </Button>
                </a>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
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
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
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
      <section className="bg-white dark:bg-gray-800 py-16 border-y border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">100%</div>
              <p className="text-gray-600 dark:text-gray-300">Privacy Focused</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">5s</div>
              <p className="text-gray-600 dark:text-gray-300">Setup Time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
              <p className="text-gray-600 dark:text-gray-300">Real-time Monitoring</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">0</div>
              <p className="text-gray-600 dark:text-gray-300">Third-party Trackers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Analytics Features</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to understand your website traffic and visitor behavior in one simple dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Global Insights</h3>
            <p className="text-gray-600 dark:text-gray-300">
              See where your visitors come from with detailed geographic data and traffic sources.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor traffic as it happens with our live dashboard updates and time-based charts.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacy Focused</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Collect valuable insights without compromising your visitors' privacy or using cookies.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <PieChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Device Metrics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Understand what devices, browsers, and operating systems your visitors are using.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visit Duration</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track how long visitors stay on your site and which pages they spend the most time on.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <MousePointer className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Page Interactions</h3>
            <p className="text-gray-600 dark:text-gray-300">
              See which buttons, links, and elements users interact with most on your site.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 px-4 border-y border-gray-200 dark:border-gray-700">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started with Pulse Analytics in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Create Account</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up for free in less than a minute with just your email.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Add Your Website</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add your website URL and get a unique tracking script.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">View Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Watch real-time data flow into your dashboard immediately.
              </p>
            </div>
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
      <footer className="bg-white dark:bg-gray-800 py-12 px-4 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold">Pulse Analytics</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} Pulse Analytics. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
