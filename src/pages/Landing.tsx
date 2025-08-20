import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Target, BarChart, Sparkles, Star, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 border-b border-border/20 bg-card/10 backdrop-blur-md"
      >
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-neon">
              <Sparkles className="h-6 w-6 text-white animate-pulse-neon" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Apex AI Studio
            </span>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-primary/30 hover:border-primary hover:shadow-purple transition-all duration-300">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-primary hover:shadow-neon transition-all duration-300 hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center justify-center p-2 bg-gradient-card border border-primary/20 rounded-full mb-8 backdrop-blur-sm">
              <div className="flex items-center space-x-2 px-4 py-2">
                <Star className="h-4 w-4 text-primary animate-glow" />
                <span className="text-sm text-muted-foreground">Trusted by 10,000+ creators</span>
                <Star className="h-4 w-4 text-primary animate-glow" />
              </div>
            </div>
            
            <h1 className="text-7xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Next-Generation<br />AI Marketing Studio
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Harness the power of artificial intelligence to create, analyze, and optimize 
              your marketing campaigns like never before. Welcome to the future of digital creativity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-primary hover:shadow-neon text-lg px-8 py-4 transition-all duration-300 hover:scale-105">
                  Launch Studio <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-accent/30 hover:border-accent hover:shadow-green text-lg px-8 py-4 transition-all duration-300">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 mb-24"
          >
            <Card className="bg-gradient-card border border-primary/20 backdrop-blur-sm hover:shadow-purple transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-2xl shadow-neon w-fit">
                  <Zap className="h-12 w-12 text-white group-hover:animate-glow" />
                </div>
                <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">AI-Powered Creation</CardTitle>
                <CardDescription className="text-lg">
                  Generate stunning content with our advanced AI algorithms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Leverage cutting-edge machine learning to create compelling ads, 
                  copy, and visual content in seconds. Our AI understands your brand voice.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border border-accent/20 backdrop-blur-sm hover:shadow-green transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-accent rounded-2xl shadow-green w-fit">
                  <Target className="h-12 w-12 text-white group-hover:animate-float" />
                </div>
                <CardTitle className="text-2xl text-accent">Precision Targeting</CardTitle>
                <CardDescription className="text-lg">
                  Reach your exact audience with intelligent targeting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI analyzes millions of data points to identify and 
                  target your ideal customers with surgical precision and efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border border-primary/20 backdrop-blur-sm hover:shadow-neon transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-2xl shadow-neon w-fit">
                  <BarChart className="h-12 w-12 text-white group-hover:animate-pulse-neon" />
                </div>
                <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">Real-time Analytics</CardTitle>
                <CardDescription className="text-lg">
                  Track performance with advanced analytics dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor campaign performance in real-time with our 
                  comprehensive analytics and AI-powered optimization suggestions.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trust Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">99%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">10x</div>
                <div className="text-sm text-muted-foreground">Faster Creation</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">AI Support</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">1M+</div>
                <div className="text-sm text-muted-foreground">Campaigns Created</div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-card border border-primary/20 max-w-4xl mx-auto backdrop-blur-sm shadow-neon">
              <CardContent className="pt-12 pb-12">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-primary rounded-2xl shadow-neon mb-6">
                  <Shield className="h-8 w-8 text-white animate-glow" />
                </div>
                <h2 className="text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-muted-foreground mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
                  Join thousands of creators who are already using Apex AI Studio 
                  to revolutionize their digital presence and scale their success.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/signup">
                    <Button size="lg" className="bg-gradient-primary hover:shadow-neon text-lg px-8 py-4 transition-all duration-300 hover:scale-105">
                      Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="border-accent/30 hover:border-accent hover:shadow-green text-lg px-8 py-4 transition-all duration-300">
                    View Pricing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Landing;