"use client";

import React from "react";
import Header from "@/components/header";
import ParticleBackground from "@/components/particle-background";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Shield,
  TrendingUp,
  Wallet,
  BarChart3,
  Zap,
  Users,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ConnectWallet from "@/components/wallet/connect-wallet";

export default function LandingPage() {
  return (
    <>
      <Header />
      <ParticleBackground />

      <div className="flex min-h-screen flex-col mx-auto bg-gradient-to-b from-background via-primary/5 to-background">
        {/* Hero Section */}
        <main className="flex-1 flex items-center flex-col">
          <section className="container px-4 py-24 md:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium bg-primary/10 rounded-full w-fit"
                >
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-primary">AI-Powered Portfolio Analysis</span>
                </motion.div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                      SUI Network
                    </span>{" "}
                    <span className="text-foreground">Portfolio Analyzer</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                    Maximize your SUI investments with AI-driven insights, real-time gas
                    optimization, and comprehensive portfolio tracking. Your intelligent companion
                    for the SUI ecosystem.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col gap-4 sm:flex-row"
                >
                  <ConnectWallet label="Launch App" className="text-lg px-8 py-6" />
                  <Button variant="outline" size="lg" asChild className="group">
                    <Link href="#features">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-8 pt-4"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">10K+ Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-muted-foreground">Audited</span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center justify-center relative"
              >
                <div className="relative h-[400px] w-[400px]">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl" />

                  <Image
                    src="/hero-image.png"
                    alt="SUI Portfolio Dashboard"
                    fill
                    className="object-contain relative z-10 drop-shadow-2xl"
                    priority
                  />

                  {/* Animated coins */}
                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute z-20 -bottom-5 -left-10"
                  >
                    <Image
                      src="/coin.png"
                      alt="SUI Coin"
                      width={60}
                      height={60}
                      className="drop-shadow-xl"
                    />
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, 20, 0],
                      rotate: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute z-20 top-10 -right-10"
                  >
                    <Image
                      src="/sui-logo.svg"
                      alt="SUI Logo"
                      width={50}
                      height={50}
                      className="drop-shadow-xl"
                    />
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      x: [0, 10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                    className="absolute z-20 bottom-20 right-10"
                  >
                    <Image
                      src="/coin.png"
                      alt="SUI Coin"
                      width={45}
                      height={45}
                      className="drop-shadow-xl"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="container px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-card/50 backdrop-blur rounded-2xl p-8 border"
            >
              {[
                { label: "Total Volume Analyzed", value: "$2.5M+" },
                { label: "Gas Saved", value: "45K SUI" },
                { label: "Active Portfolios", value: "10K+" },
                { label: "AI Predictions", value: "95%" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Features Section */}
          <section id="features" className="container px-4 py-24 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Everything You Need for SUI Success
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools designed specifically for the SUI ecosystem to help you make
                informed decisions
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <BarChart3 className="h-6 w-6" />,
                  title: "Portfolio Analytics",
                  description:
                    "Real-time tracking of your SUI assets with detailed performance metrics and historical data.",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: <Bot className="h-6 w-6" />,
                  title: "AI-Powered Insights",
                  description:
                    "Get personalized recommendations and predictions based on advanced machine learning models.",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Security Analysis",
                  description:
                    "Advanced smart contract analysis to identify potential risks and protect your investments.",
                  gradient: "from-green-500 to-emerald-500",
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Gas Optimization",
                  description:
                    "Smart gas fee predictions and optimization strategies to minimize transaction costs.",
                  gradient: "from-orange-500 to-red-500",
                },
                {
                  icon: <TrendingUp className="h-6 w-6" />,
                  title: "Staking Analytics",
                  description:
                    "Maximize your staking rewards with detailed validator analysis and APY tracking.",
                  gradient: "from-indigo-500 to-purple-500",
                },
                {
                  icon: <Wallet className="h-6 w-6" />,
                  title: "Tax Reporting",
                  description:
                    "Automated tax calculation and reporting for all your SUI transactions and yields.",
                  gradient: "from-pink-500 to-rose-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    }}
                  />
                  <div className="relative h-full p-8 bg-card/50 backdrop-blur rounded-2xl border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                    <div
                      className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.gradient} mb-4`}
                    >
                      <span className="text-white">{feature.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="container px-4 py-24"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 p-12 text-center">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
              <div className="relative mx-auto max-w-3xl space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  viewport={{ once: true }}
                  className="inline-flex p-4 rounded-full bg-primary/10 mb-4"
                >
                  <Wallet className="h-8 w-8 text-primary" />
                </motion.div>
                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Optimize Your{" "}
                  <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    SUI Portfolio?
                  </span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  Join thousands of investors who trust our AI-powered platform for comprehensive
                  SUI ecosystem analysis
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="mt-4 text-lg px-8 py-6">
                    <Link href="/portfolio">
                      Start Free Analysis <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="border-t bg-card/50 backdrop-blur mx-auto"
        >
          <div className="container px-4 py-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-500">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">SUI Analyzer</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI-powered portfolio analysis for the SUI ecosystem
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/portfolio" className="hover:text-primary transition-colors">
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link href="/gas-advisor" className="hover:text-primary transition-colors">
                      Gas Advisor
                    </Link>
                  </li>
                  <li>
                    <Link href="/staking" className="hover:text-primary transition-colors">
                      Staking
                    </Link>
                  </li>
                  <li>
                    <Link href="/tax" className="hover:text-primary transition-colors">
                      Tax Report
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      API
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Connect</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Discord
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Telegram
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              © 2024 SUI Analyzer. All rights reserved.
            </div>
          </div>
        </motion.footer>
      </div>
    </>
  );
}
