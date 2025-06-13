import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Shield, Smartphone, ChevronRight } from "lucide-react";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-cush-blue-600">Cush</span>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <a href="#features" className="text-gray-900 hover:text-cush-blue-600 px-3 py-2 text-sm font-medium">Features</a>
                  <a href="#stats" className="text-gray-500 hover:text-cush-blue-600 px-3 py-2 text-sm font-medium">Pricing</a>
                  <a href="#" className="text-gray-500 hover:text-cush-blue-600 px-3 py-2 text-sm font-medium">About</a>
                  <a href="#" className="text-gray-500 hover:text-cush-blue-600 px-3 py-2 text-sm font-medium">Contact</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-cush-blue-600 hover:text-cush-blue-700 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-cush-blue-600 hover:bg-cush-blue-700 text-white font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cush-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Simplify Your{" "}
                <span className="text-cush-blue-600">Financial</span>
                {" "}Management
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Take control of your finances with our comprehensive platform. Track expenses, manage investments, and grow your wealth with intelligent insights.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button className="bg-cush-blue-600 hover:bg-cush-blue-700 text-white px-8 py-3 text-lg">
                    Start Free Trial
                  </Button>
                </Link>
                <Button variant="outline" className="border-gray-300 hover:border-cush-blue-300 text-gray-700 px-8 py-3 text-lg">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              {/* Financial dashboard preview */}
              <Card className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Account Overview</h3>
                  <span className="text-sm text-gray-500">Last updated: Today</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-cush-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-cush-blue-600 font-medium">Total Balance</p>
                    <p className="text-2xl font-bold text-cush-blue-800">£1,320.00</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Monthly Growth</p>
                    <p className="text-2xl font-bold text-green-800">+£25.20</p>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-r from-cush-blue-100 to-cush-blue-50 rounded-lg flex items-end p-4">
                  <div className="flex items-end space-x-2 w-full">
                    <div className="bg-cush-blue-600 h-8 w-4 rounded-t"></div>
                    <div className="bg-cush-blue-500 h-12 w-4 rounded-t"></div>
                    <div className="bg-cush-blue-600 h-16 w-4 rounded-t"></div>
                    <div className="bg-cush-blue-700 h-20 w-4 rounded-t"></div>
                    <div className="bg-cush-blue-600 h-14 w-4 rounded-t"></div>
                    <div className="bg-cush-blue-500 h-10 w-4 rounded-t"></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features for Modern Finance</h2>
            <p className="mt-4 text-xl text-gray-600">Everything you need to manage your financial life effectively</p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-cush-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="text-cush-blue-600 w-8 h-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Smart Analytics</h3>
              <p className="mt-4 text-gray-600">Get intelligent insights into your spending patterns and financial trends with advanced analytics.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-cush-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Shield className="text-cush-blue-600 w-8 h-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Bank-Level Security</h3>
              <p className="mt-4 text-gray-600">Your data is protected with enterprise-grade security and encryption protocols.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-cush-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="text-cush-blue-600 w-8 h-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Mobile Ready</h3>
              <p className="mt-4 text-gray-600">Access your finances anywhere with our responsive design and mobile optimization.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="py-20 bg-cush-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10K+</div>
              <div className="text-cush-blue-100 mt-2">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">£50M+</div>
              <div className="text-cush-blue-100 mt-2">Managed Assets</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">99.9%</div>
              <div className="text-cush-blue-100 mt-2">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">24/7</div>
              <div className="text-cush-blue-100 mt-2">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Transform Your Finances?</h2>
          <p className="mt-4 text-xl text-gray-600">Join thousands of users who have already simplified their financial management.</p>
          <Link href="/dashboard">
            <Button className="mt-8 bg-cush-blue-600 hover:bg-cush-blue-700 text-white px-8 py-4 text-lg">
              Get Started Today
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
