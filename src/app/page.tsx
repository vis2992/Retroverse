'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Users, Zap, Shield, Heart, Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui';

export default function Home() {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isInitialized && user) {
      router.push('/dashboard');
    }
  }, [user, isInitialized, router]);

  const features = [
    {
      icon: MessageSquare,
      title: 'Real-time Collaboration',
      description: 'Watch ideas flow in real-time as your team shares feedback together.',
    },
    {
      icon: Shield,
      title: 'Anonymous Feedback',
      description: 'Let team members share honest thoughts without fear of judgment.',
    },
    {
      icon: Heart,
      title: 'Vote & Prioritize',
      description: 'Upvote the most important items to focus on what matters.',
    },
    {
      icon: Zap,
      title: 'Ready-made Templates',
      description: 'Start fast with Mad/Sad/Glad, Start/Stop/Continue, and more.',
    },
  ];

  const templates = [
    { emoji: '😠', name: 'Mad', color: '#ef4444' },
    { emoji: '😢', name: 'Sad', color: '#3b82f6' },
    { emoji: '😊', name: 'Glad', color: '#22c55e' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-600/10 rounded-full blur-[150px]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Stars - Only render on client to avoid hydration mismatch */}
        {mounted && [...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-2xl">🦉</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Retrospeck</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8">
              <span className="text-base">🦉</span>
              See your sprints through Retrospeck's eyes
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-tight"
          >
            See your sprints{' '}
            <span className="bg-gradient-to-r from-violet-400 via-amber-400 to-indigo-400 bg-clip-text text-transparent">
              more clearly
            </span>
            <br />
            with Retrospeck
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Your wise owl companion for agile retrospectives. Retrospeck helps teams reflect, 
            discover insights, and learn from every sprint in a beautiful real-time workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <Users className="w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Preview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-6 justify-center overflow-hidden">
            {templates.map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="w-72 bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{template.emoji}</span>
                    <span className="font-semibold text-white">{template.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-zinc-400 ml-auto">3</span>
                  </div>
                  <div className="h-1 rounded-full mt-3" style={{ backgroundColor: template.color }} />
                </div>
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="p-3 bg-zinc-800/60 rounded-xl border border-white/5"
                      style={{ opacity: 1 - i * 0.2 }}
                    >
                      <div className="h-3 bg-white/10 rounded w-full mb-2" />
                      <div className="h-3 bg-white/10 rounded w-2/3" />
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                          <Heart className="w-3 h-3" />
                          {3 - i}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Built for agile teams who want to improve with every sprint
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mb-4 group-hover:from-violet-500/30 group-hover:to-indigo-500/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <blockquote className="text-2xl sm:text-3xl font-medium text-white max-w-3xl mx-auto mb-6 leading-relaxed">
              &quot;Retrospeck transformed how our team does retrospectives. 
              It&apos;s like having a wise facilitator who helps us see patterns we'd miss.&quot;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600" />
              <div className="text-left">
                <p className="font-medium">Sarah Chen</p>
                <p className="text-sm text-zinc-500">Engineering Manager at TechCorp</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-violet-600/20 via-indigo-600/20 to-fuchsia-600/20 border border-white/10 p-12 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to see more clearly?</h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
                Join teams using Retrospeck to gain insights and improve with every sprint
              </p>
              <Link href="/signup">
                <Button size="lg">
                  Get Started for Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">🦉</span>
              </div>
              <span className="font-semibold">Retrospeck</span>
            </div>
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} Retrospeck. Built with 💜 for agile teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
