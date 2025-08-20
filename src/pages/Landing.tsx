import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Target, BarChart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/20 bg-card/10 backdrop-blur-md"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary animate-pulse-neon" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Apex AI Studio
            </span>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-primary/20 hover:border-primary">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-primary hover:shadow-neon">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Next-Generation AI Studio
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Harness the power of artificial intelligence to create, analyze, and optimize 
            your content like never before. Welcome to the future of digital creativity.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-primary hover:shadow-neon text-lg px-8 py-4">
              Launch Studio <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          <Card className="bg-gradient-card border-border/20 hover:shadow-purple transition-all duration-300 hover:scale-105">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4 animate-glow" />
              <CardTitle className="text-xl">AI-Powered Creation</CardTitle>
              <CardDescription>
                Generate stunning content with our advanced AI algorithms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Leverage cutting-edge machine learning to create compelling ads, 
                copy, and visual content in seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/20 hover:shadow-neon transition-all duration-300 hover:scale-105">
            <CardHeader>
              <Target className="h-12 w-12 text-accent mb-4 animate-float" />
              <CardTitle className="text-xl">Precision Targeting</CardTitle>
              <CardDescription>
                Reach your exact audience with intelligent targeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI analyzes millions of data points to identify and 
                target your ideal customers with surgical precision.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/20 hover:shadow-green transition-all duration-300 hover:scale-105">
            <CardHeader>
              <BarChart className="h-12 w-12 text-success mb-4 animate-pulse-neon" />
              <CardTitle className="text-xl">Real-time Analytics</CardTitle>
              <CardDescription>
                Track performance with advanced analytics dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitor campaign performance in real-time with our 
                comprehensive analytics and optimization suggestions.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-card border-primary/20 max-w-2xl mx-auto">
            <CardContent className="pt-8">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Ready to Transform Your Business?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of creators who are already using Apex AI Studio 
                to revolutionize their digital presence.
              </p>
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-primary hover:shadow-neon">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;