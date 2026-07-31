"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Play, 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  Fingerprint, 
  Award, 
  Cloud, 
  Star, 
  User, 
  Globe, 
  Mail, 
  Send, 
  Share2, 
  Sparkles, 
  X,
  CheckCircle,
  School,
  GraduationCap,
  ArrowUpRight
} from "lucide-react";
import FooterGlow from "../components/ui/demo";
import SpotlightCard from "../components/ui/spotlight-card";

export default function Home() {
  // Modal states
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [comingSoonModalOpen, setComingSoonModalOpen] = useState(false);
  const [comingSoonPortal, setComingSoonPortal] = useState("");
  
  // Form states
  const [demoEmail, setDemoEmail] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isDemoSubmitted, setIsDemoSubmitted] = useState(false);
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);

  // Handle Parent Portal click
  const openComingSoon = (portalName: string) => {
    setComingSoonPortal(portalName);
    setComingSoonModalOpen(true);
  };

  // Submissions handlers
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoEmail.trim()) {
      setIsDemoSubmitted(true);
      setTimeout(() => {
        setIsDemoSubmitted(false);
        setDemoEmail("");
        setScheduleModalOpen(false);
      }, 2000);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsNewsletterSubmitted(true);
      setTimeout(() => {
        setIsNewsletterSubmitted(false);
        setNewsletterEmail("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-inter antialiased relative overflow-hidden selection:bg-[#c0c1ff]/30 selection:text-white">
      {/* Background glowing gradients */}
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-[#8083ff]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#6f00be]/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[#3cd7ff]/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Top Sticky Header */}
      <header className="sticky top-0 w-full z-50 bg-[#050505]/40 backdrop-blur-xl border-b border-[#464554]/20 shadow-sm">
        <div className="flex justify-between items-center max-w-[1280px] mx-auto px-8 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#6f00be] shadow-[0_0_20px_rgba(128,131,255,0.4)] group-hover:scale-105 transition-transform duration-300">
              <span className="font-hanken font-bold text-lg text-white">EV</span>
            </div>
            <div>
              <h1 className="font-hanken font-bold text-lg leading-none text-white tracking-tight">EduVerse</h1>
              <span className="text-[9px] text-[#c7c4d7] font-geist tracking-widest uppercase">Management Suite</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              className="font-body-md text-sm text-[#c7c4d7] hover:text-[#c0c1ff] hover:border-b-2 hover:border-[#c0c1ff] pb-1 transition-all duration-200"
            >
              Features
            </a>
            <a 
              href="#solutions" 
              className="font-body-md text-sm text-[#c7c4d7] hover:text-[#c0c1ff] hover:border-b-2 hover:border-[#c0c1ff] pb-1 transition-all duration-200"
            >
              Solutions
            </a>
            <a 
              href="#portals" 
              className="font-body-md text-sm text-[#c0c1ff] font-semibold border-b-2 border-[#c0c1ff] pb-1 transition-all duration-200"
            >
              Portals
            </a>
            <a 
              href="#pricing" 
              className="font-body-md text-sm text-[#c7c4d7] hover:text-[#c0c1ff] hover:border-b-2 hover:border-[#c0c1ff] pb-1 transition-all duration-200"
            >
              Pricing
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/school-admin-login" 
              className="hidden md:block font-body-md text-sm text-[#c7c4d7] hover:text-white transition-colors duration-200 scale-95 active:scale-90"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register-school"
              className="bg-[#8083ff] text-[#0d0096] bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] px-5 py-2 rounded-full text-xs font-bold hover:shadow-[0_0_20px_rgba(192,193,255,0.4)] hover:brightness-110 transition-all scale-95 active:scale-90 duration-200"
            >
              Register School
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 hero-glow -z-10 pointer-events-none" />
          <div className="max-w-[1280px] mx-auto px-8 grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Text Content */}
            <div className="lg:col-span-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#c0c1ff] uppercase tracking-widest bg-[#8083ff]/10 border border-[#8083ff]/20 px-3.5 py-1.5 rounded-full mb-6">
                <Sparkles size={12} className="text-[#c0c1ff] animate-pulse" />
                Global Academic Command System
              </span>
              <h1 className="font-hanken font-extrabold text-4xl sm:text-5xl md:text-6xl mb-6 bg-gradient-to-r from-[#c0c1ff] via-[#ddb7ff] to-[#3cd7ff] bg-clip-text text-transparent tracking-tight leading-[1.1]">
                AI-Powered Education Management Platform
              </h1>
              <p className="font-hanken text-[#c7c4d7] text-base md:text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Manage registered academic institutions, empower educators with AI analytics, inspire students through interactive hubs, and streamline administrative workflows with one intelligent platform.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="#portals"
                  className="px-8 py-4 bg-gradient-to-r from-[#8083ff] to-[#6f00be] text-white font-bold rounded-xl shadow-[0_0_25px_rgba(128,131,255,0.3)] hover:shadow-[0_0_35px_rgba(128,131,255,0.5)] hover:brightness-110 transition-all text-center flex items-center justify-center gap-2 group duration-300"
                >
                  Access Portals
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <button 
                  onClick={() => setDemoModalOpen(true)}
                  className="px-8 py-4 border border-[#c0c1ff]/20 bg-[#c0c1ff]/5 hover:bg-[#c0c1ff]/10 text-[#c0c1ff] font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Play size={16} fill="currentColor" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right Column Visuals with Floating Stats */}
            <div className="lg:col-span-6 relative mt-6 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 group">
                {/* Classroom Image */}
                <img 
                  alt="Modern Connected Classroom" 
                  className="w-full h-auto object-cover min-h-[300px] max-h-[480px] group-hover:scale-[1.02] transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg2Dd4YvQ0l-t2xOt8DRISln7OoPBqoeO9dMX8Q3QXGrWGcLCPLs2hWIafzh5-LZIy0dVjKFhf2fQmUR2tlisaO9pgnuj_SzVwoZMrqycrHv6AiGTY9a_psOOkIzlKamuB6Mh4BhxSxB0S4xG2SsnxAdu5U6lBJ0ej0Soi7a5n7y5lpBA8E3WFEUU9OSO-kEGi8ebRcS-kcLBbGtIvzvUjKMnZ2Y2kDSlGLzYbT7s17u0O6TuzA3wl_BUDUYnWIjb2Ugb3YVv1fpA"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/20 to-transparent pointer-events-none" />
              </div>

              {/* Floating Stat 1 */}
              <div className="absolute -top-6 -right-4 glass-card p-5 rounded-2xl shadow-xl gradient-border hidden md:block select-none animate-bounce-slow">
                <p className="text-[#c0c1ff] font-hanken font-bold text-3xl leading-none">150+</p>
                <p className="font-geist text-[10px] uppercase tracking-wider text-[#c7c4d7] mt-1">Active Schools</p>
              </div>

              {/* Floating Stat 2 */}
              <div className="absolute bottom-12 -left-6 glass-card p-5 rounded-2xl shadow-xl gradient-border hidden md:block select-none animate-pulse-slow">
                <p className="text-[#ddb7ff] font-hanken font-bold text-3xl leading-none">98%</p>
                <p className="font-geist text-[10px] uppercase tracking-wider text-[#c7c4d7] mt-1">Satisfaction</p>
              </div>

              {/* Floating Stat 3 */}
              <div className="absolute -bottom-4 right-10 glass-card p-5 rounded-2xl shadow-xl gradient-border hidden md:block select-none">
                <p className="text-[#3cd7ff] font-hanken font-bold text-3xl leading-none">25K+</p>
                <p className="font-geist text-[10px] uppercase tracking-wider text-[#c7c4d7] mt-1">Global Students</p>
              </div>
            </div>

          </div>
        </section>

        {/* Portal Section */}
        <section id="portals" className="py-24 bg-[#0e0e0e]/60 border-y border-[#464554]/10 relative">
          <div className="max-w-[1280px] mx-auto px-8 text-center mb-16">
            <h2 className="font-hanken font-bold text-3xl md:text-4xl text-white mb-4 tracking-tight">One Platform, Multiple Worlds</h2>
            <p className="font-hanken text-[#c7c4d7] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Seamlessly tailored portals for academic leaders, managers, students, and parents to optimize institutional engagement.
            </p>
          </div>

          <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl">
            
            {/* School Admin Card */}
            <SpotlightCard className="w-full max-w-[360px] mx-auto p-6 flex flex-col justify-between min-h-[480px] border border-white/5 relative overflow-hidden group">
              {/* Header Bar */}
              <div className="flex justify-between items-center w-full mb-6 z-10">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <School size={20} />
                </div>
                <Link 
                  href="/auth/school-admin-login" 
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8083ff] to-[#6f00be] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(128,131,255,0.3)]"
                >
                  <ArrowUpRight size={18} />
                </Link>
              </div>

              {/* Centered Image Showcase */}
              <div className="w-full aspect-[1.6] rounded-xl overflow-hidden mb-6 border border-white/5 relative group-hover:border-white/10 transition-colors z-10">
                <img 
                  alt="School Administration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1592066575517-58df903152f2?q=80&w=1298&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Title & Info */}
              <div className="flex flex-col items-center text-center z-10">
                <h3 className="font-hanken font-extrabold text-2xl bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-transparent mb-3 tracking-tight">
                  SCHOOL ADMIN
                </h3>
                <p className="text-xs text-[#c7c4d7] mb-6 leading-relaxed max-w-[280px] font-medium font-hanken">
                  Configure institutional registries, set course fee structures, manage student schedules, and review grades.
                </p>
              </div>

              {/* Bottom Action Link */}
              <div className="w-full flex justify-center mt-auto pt-2 z-10">
                <Link 
                  href="/auth/school-admin-login"
                  className="text-xs font-bold text-white group-hover:text-[#c0c1ff] transition-colors flex items-center gap-1.5 font-hanken"
                >
                  Launch Portal <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>

              {/* Bottom Corner Glow */}
              <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#8083ff]/10 rounded-full blur-2xl group-hover:bg-[#8083ff]/20 transition-all duration-500 pointer-events-none" />
            </SpotlightCard>

            {/* Student Portal Card */}
            <SpotlightCard className="w-full max-w-[360px] mx-auto p-6 flex flex-col justify-between min-h-[480px] border border-white/5 relative overflow-hidden group">
              {/* Header Bar */}
              <div className="flex justify-between items-center w-full mb-6 z-10">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <GraduationCap size={20} />
                </div>
                <Link 
                  href="/auth/student-login" 
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8083ff] to-[#6f00be] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(128,131,255,0.3)]"
                >
                  <ArrowUpRight size={18} />
                </Link>
              </div>

              {/* Centered Image Showcase */}
              <div className="w-full aspect-[1.6] rounded-xl overflow-hidden mb-6 border border-white/5 relative group-hover:border-white/10 transition-colors z-10">
                <img 
                  alt="Student Learning Hub"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Title & Info */}
              <div className="flex flex-col items-center text-center z-10">
                <h3 className="font-hanken font-extrabold text-2xl bg-gradient-to-r from-[#3cd7ff] to-[#c0c1ff] bg-clip-text text-transparent mb-3 tracking-tight">
                  STUDENT HUB
                </h3>
                <p className="text-xs text-[#c7c4d7] mb-6 leading-relaxed max-w-[280px] font-medium font-hanken">
                  Access interactive virtual classrooms, take modules quizzes, download certificates, and view results.
                </p>
              </div>

              {/* Bottom Action Link */}
              <div className="w-full flex justify-center mt-auto pt-2 z-10">
                <Link 
                  href="/auth/student-login"
                  className="text-xs font-bold text-white group-hover:text-[#3cd7ff] transition-colors flex items-center gap-1.5 font-hanken"
                >
                  Access Platform <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>

              {/* Bottom Corner Glow */}
              <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#3cd7ff]/10 rounded-full blur-2xl group-hover:bg-[#3cd7ff]/20 transition-all duration-500 pointer-events-none" />
            </SpotlightCard>

          </div>
        </section>

        {/* Bento Features Section */}
        <section id="features" className="py-24 relative max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-[#3cd7ff] uppercase tracking-widest bg-[#3cd7ff]/10 border border-[#3cd7ff]/20 px-3 py-1 rounded-full mb-4 inline-block">
              System Core Capabilities
            </span>
            <h2 className="font-hanken font-bold text-3xl md:text-4xl text-white mt-3 mb-4 tracking-tight">Supercharged EdTech Infrastructure</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main AI Bento Card */}
            <SpotlightCard className="md:col-span-8 p-10 gradient-border min-h-[380px] flex flex-col justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#8083ff]/10 border border-[#8083ff]/20 flex items-center justify-center text-[#c0c1ff] shadow-[0_0_15px_rgba(128,131,255,0.1)] group-hover:scale-105 transition-transform duration-300">
                <Brain size={28} />
              </div>
              <div>
                <h3 className="font-hanken font-bold text-2xl md:text-3xl text-white mb-3">AI-Powered Course Generation</h3>
                <p className="font-hanken text-[#c7c4d7] text-sm md:text-base max-w-xl leading-relaxed">
                  Generate course structures, dynamically construct syllabus modules, and build automated multiple-choice tests powered by advanced large language models tailored directly to course contents.
                </p>
              </div>
            </SpotlightCard>

            {/* Analytics Bento Card */}
            <SpotlightCard className="md:col-span-4 p-10 gradient-border flex flex-col justify-between bg-gradient-to-br from-[#8083ff]/5 to-transparent">
              <div className="w-14 h-14 rounded-2xl bg-[#ddb7ff]/10 border border-[#ddb7ff]/20 flex items-center justify-center text-[#ddb7ff] group-hover:scale-105 transition-transform duration-300">
                <TrendingUp size={28} />
              </div>
              <div className="mt-8">
                <h4 className="font-hanken font-bold text-xl text-white mb-2">Institutional Analytics</h4>
                <p className="font-hanken text-xs text-[#c7c4d7] leading-relaxed">
                  Real-time visualization of overall student counts, registered schools, licensing pipelines, and system activity logs for operational intelligence.
                </p>
              </div>
            </SpotlightCard>

            {/* Smart Attendance Bento Card */}
            <SpotlightCard className="md:col-span-4 p-8 gradient-border">
              <div className="w-12 h-12 rounded-xl bg-[#3cd7ff]/10 border border-[#3cd7ff]/20 flex items-center justify-center text-[#3cd7ff] mb-6 group-hover:scale-105 transition-transform duration-300">
                <Fingerprint size={24} />
              </div>
              <h4 className="font-hanken font-bold text-lg text-white mb-2">Precision Registries</h4>
              <p className="font-hanken text-xs text-[#c7c4d7] leading-relaxed">
                High-fidelity tracking of students, teachers, and school information with role-based dashboard security constraints.
              </p>
            </SpotlightCard>

            {/* Digital Assessments Bento Card */}
            <SpotlightCard className="md:col-span-4 p-8 gradient-border">
              <div className="w-12 h-12 rounded-xl bg-[#8083ff]/10 border border-[#8083ff]/20 flex items-center justify-center text-[#c0c1ff] mb-6 group-hover:scale-105 transition-transform duration-300">
                <Award size={24} />
              </div>
              <h4 className="font-hanken font-bold text-lg text-white mb-2">Dynamic Quiz Engine</h4>
              <p className="font-hanken text-xs text-[#c7c4d7] leading-relaxed">
                Configure adaptive student tests, compile grades instantly, generate completion certificates, and track student success metrics.
              </p>
            </SpotlightCard>

            {/* Cloud Infrastructure Bento Card */}
            <SpotlightCard className="md:col-span-4 p-8 gradient-border">
              <div className="w-12 h-12 rounded-xl bg-[#ddb7ff]/10 border border-[#ddb7ff]/20 flex items-center justify-center text-[#ddb7ff] mb-6 group-hover:scale-105 transition-transform duration-300">
                <Cloud size={24} />
              </div>
              <h4 className="font-hanken font-bold text-lg text-white mb-2">SaaS Cloud Architecture</h4>
              <p className="font-hanken text-xs text-[#c7c4d7] leading-relaxed">
                Subsecond API responses, robust relational database pipelines, secure session validations, and 99.9% operational uptime.
              </p>
            </SpotlightCard>
          </div>
        </section>

        {/* Dynamic Statistics Section */}
        <section className="py-16 border-y border-[#464554]/10 bg-[#080808]/40 relative select-none">
          <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-2 lg:grid-cols-5 gap-8 text-center">
            <div className="stat-animate">
              <p className="font-hanken font-extrabold text-4xl md:text-5xl text-[#c0c1ff] tracking-tight">150+</p>
              <p className="font-geist text-[10px] uppercase tracking-widest text-[#c7c4d7] mt-2 font-medium">Institutions</p>
            </div>
            <div className="stat-animate">
              <p className="font-hanken font-extrabold text-4xl md:text-5xl text-[#ddb7ff] tracking-tight">25K+</p>
              <p className="font-geist text-[10px] uppercase tracking-widest text-[#c7c4d7] mt-2 font-medium">Students</p>
            </div>
            <div className="stat-animate">
              <p className="font-hanken font-extrabold text-4xl md:text-5xl text-[#3cd7ff] tracking-tight">5K+</p>
              <p className="font-geist text-[10px] uppercase tracking-widest text-[#c7c4d7] mt-2 font-medium">Teachers</p>
            </div>
            <div className="stat-animate">
              <p className="font-hanken font-extrabold text-4xl md:text-5xl text-[#c0c1ff] tracking-tight">500+</p>
              <p className="font-geist text-[10px] uppercase tracking-widest text-[#c7c4d7] mt-2 font-medium">Courses Built</p>
            </div>
            <div className="stat-animate col-span-2 lg:col-span-1">
              <p className="font-hanken font-extrabold text-4xl md:text-5xl text-[#ddb7ff] tracking-tight">10K+</p>
              <p className="font-geist text-[10px] uppercase tracking-widest text-[#c7c4d7] mt-2 font-medium">Certificates</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="solutions" className="py-24 max-w-[1280px] mx-auto px-8 relative">
          <div className="text-center mb-16">
            <h2 className="font-hanken font-bold text-3xl md:text-4xl text-white tracking-tight">Trusted by Global Educators</h2>
            <p className="font-hanken text-[#c7c4d7] text-sm md:text-base max-w-xl mx-auto mt-4 leading-relaxed">
              Discover how academic directors, principals, and administrative operations scale their capabilities using our unified suite.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <SpotlightCard className="p-10 border-l-4 border-l-[#c0c1ff] flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-[#3cd7ff]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="font-hanken text-sm text-[#e5e2e1] italic mb-6 leading-relaxed">
                  "EduVerse Management Suite completely automated our administrative workflow. We have reduced registry reporting duration by over 40% and improved response rate."
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-white/5 pt-4 mt-4">
                <div className="w-12 h-12 rounded-full bg-[#c0c1ff]/15 flex items-center justify-center text-[#c0c1ff]">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Dr. Elena Rodriguez</p>
                  <p className="text-[10px] font-geist text-[#c7c4d7] uppercase tracking-wider">Director, Apex Academy</p>
                </div>
              </div>
            </SpotlightCard>

            {/* Testimonial 2 */}
            <SpotlightCard className="p-10 border-l-4 border-l-[#ddb7ff] flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-[#3cd7ff]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="font-hanken text-sm text-[#e5e2e1] italic mb-6 leading-relaxed">
                  "The LLM-powered module quiz generation is unparalleled. It creates structured course assessments and builds interactive certificates in seconds. The students love it."
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-white/5 pt-4 mt-4">
                <div className="w-12 h-12 rounded-full bg-[#ddb7ff]/15 flex items-center justify-center text-[#ddb7ff]">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Marcus Thorne</p>
                  <p className="text-[10px] font-geist text-[#c7c4d7] uppercase tracking-wider">Principal, Innovation High</p>
                </div>
              </div>
            </SpotlightCard>

            {/* Testimonial 3 */}
            <SpotlightCard className="p-10 border-l-4 border-l-[#3cd7ff] flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-[#3cd7ff]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="font-hanken text-sm text-[#e5e2e1] italic mb-6 leading-relaxed">
                  "An incredibly intuitive interface for school admins, students, and parents. Managing student fees, courses, and schedules has never been this cohesive."
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-white/5 pt-4 mt-4">
                <div className="w-12 h-12 rounded-full bg-[#3cd7ff]/15 flex items-center justify-center text-[#3cd7ff]">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Sarah Jenkins</p>
                  <p className="text-[10px] font-geist text-[#c7c4d7] uppercase tracking-wider">Dean, Global Ed Institute</p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* CTA Section */}
        <section id="pricing" className="py-24 max-w-[1280px] mx-auto px-8">
          <div className="bg-gradient-to-br from-[#8083ff]/10 to-[#6f00be]/10 p-12 md:p-16 rounded-[2rem] text-center border border-[#8083ff]/20 relative overflow-hidden group">
            
            {/* Interactive glows */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#8083ff]/15 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#6f00be]/15 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            
            <h2 className="font-hanken font-bold text-3xl md:text-5xl text-white mb-6 relative z-10 tracking-tight">Ready to Evolve Your Institution?</h2>
            <p className="font-hanken text-[#c7c4d7] text-base md:text-lg mb-10 max-w-xl mx-auto relative z-10 leading-relaxed">
              Join over 150 forward-thinking schools using EduVerse Management Suite to design the future of digital learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button 
                onClick={() => setScheduleModalOpen(true)}
                className="px-10 py-5 bg-gradient-to-r from-[#8083ff] to-[#6f00be] hover:shadow-[0_0_30px_rgba(128,131,255,0.4)] text-white font-bold rounded-xl transition-all duration-300"
              >
                Schedule Private Demo
              </button>
              <button 
                onClick={() => openComingSoon("Product Brochure Download")}
                className="px-10 py-5 border border-[#c0c1ff]/30 text-[#c0c1ff] font-bold rounded-xl hover:bg-[#c0c1ff]/10 transition-all duration-300"
              >
                Download Brochure
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <FooterGlow />


      {/* --- INTERACTIVE MODALS --- */}

      {/* 1. Watch Demo Video Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl glass-card rounded-2xl overflow-hidden gradient-border">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#050505]/60">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles size={14} className="text-[#c0c1ff]" />
                EduVerse Management Suite Guided Tour
              </span>
              <button 
                onClick={() => setDemoModalOpen(false)}
                className="text-[#c7c4d7] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Content */}
            <div className="relative aspect-video bg-neutral-900 flex items-center justify-center">
              {/* Using a mockup high-quality interface showcase placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#8083ff]/20 via-black to-[#6f00be]/20">
                <div className="w-16 h-16 rounded-full bg-[#c0c1ff]/20 border border-[#c0c1ff]/30 flex items-center justify-center text-[#c0c1ff] mb-4 animate-pulse">
                  <Play size={28} fill="currentColor" className="ml-1" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">EduVerse Platform Demo Walkthrough</h3>
                <p className="text-xs text-[#c7c4d7] max-w-md mb-6 leading-relaxed">
                  Learn how Super Admins configure system pricing, School Admins manage attendance and registries, and Students receive certification performance grades.
                </p>
                <button 
                  onClick={() => setDemoModalOpen(false)}
                  className="px-6 py-2.5 bg-white text-black font-bold text-xs rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Close Walkthrough
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Schedule Private Demo Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-card p-8 rounded-2xl gradient-border relative">
            <button 
              onClick={() => setScheduleModalOpen(false)}
              className="absolute top-4 right-4 text-[#c7c4d7] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-hanken font-bold text-2xl text-white mb-2">Schedule Private Demo</h3>
            <p className="text-xs text-[#c7c4d7] mb-6 leading-relaxed">
              Fill in your email below, and our EdTech enterprise integration team will reach out within 24 hours to schedule a custom demonstration.
            </p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-geist uppercase tracking-widest text-[#c7c4d7] mb-2">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full bg-[#131313] border border-[#464554]/30 rounded-lg text-sm px-4 py-3 focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff]/20 focus:outline-none text-white placeholder:text-[#c7c4d7]/30"
                  placeholder="name@institution.edu"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={isDemoSubmitted}
                className="w-full py-3 bg-gradient-to-r from-[#8083ff] to-[#6f00be] hover:shadow-[0_0_20px_rgba(128,131,255,0.3)] text-white font-bold rounded-lg text-xs transition-all disabled:opacity-50"
              >
                {isDemoSubmitted ? "Requesting Demo..." : "Submit Request"}
              </button>

              {isDemoSubmitted && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-lg flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-400 mt-0.5" />
                  <p className="text-[10px] text-emerald-400 leading-relaxed font-medium">
                    Thank you! Your request has been logged. An assistant will contact you soon.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* 3. Portal / Feature Coming Soon Modal */}
      {comingSoonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm glass-card p-8 rounded-2xl gradient-border text-center relative">
            <button 
              onClick={() => setComingSoonModalOpen(false)}
              className="absolute top-4 right-4 text-[#c7c4d7] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#ddb7ff]/10 border border-[#ddb7ff]/20 flex items-center justify-center text-[#ddb7ff] mx-auto mb-4 animate-pulse">
              <Sparkles size={20} />
            </div>

            <h3 className="font-hanken font-bold text-xl text-white mb-2">{comingSoonPortal}</h3>
            <p className="text-xs text-[#c7c4d7] mb-6 leading-relaxed">
              This feature is currently undergoing maintenance and security review. It will become fully active in the next release.
            </p>

            <button 
              onClick={() => setComingSoonModalOpen(false)}
              className="w-full py-2.5 bg-white text-black font-bold rounded-lg text-xs hover:bg-neutral-200 transition-colors"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
