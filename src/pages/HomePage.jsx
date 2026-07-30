import { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import ImmersiveDiscoverySection from '../components/home/ImmersiveDiscoverySection';
import JourneyFlowSection from '../components/home/JourneyFlowSection';
import DestinationsSection from '../components/home/DestinationsSection';
import FeaturesSection from '../components/home/FeaturesSection';
import ToolsSuiteSection from '../components/home/ToolsSuiteSection';
import BudgetPreviewSection from '../components/home/BudgetPreviewSection';
import PlannerAdBanner from '../components/home/PlannerAdBanner';
import FeaturedGuidesSection from '../components/home/FeaturedGuidesSection';
import CategoriesSection from '../components/home/CategoriesSection';
import ChatbotSection from '../components/home/ChatbotSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BlogSection from '../components/home/BlogSection';
import FeedbackSection from '../components/home/FeedbackSection';

export default function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="space-y-0 overflow-x-hidden">
      <div className="reveal"><HeroSection /></div>
      <div className="reveal"><ImmersiveDiscoverySection /></div>
      <div className="reveal"><JourneyFlowSection /></div>
      <div className="reveal"><DestinationsSection /></div>
      <div className="reveal"><FeaturesSection /></div>
      <div className="reveal"><ToolsSuiteSection /></div>
      <div className="reveal"><BudgetPreviewSection /></div>
      <div className="reveal"><PlannerAdBanner /></div>
      <div className="reveal"><FeaturedGuidesSection /></div>
      <div className="reveal"><CategoriesSection /></div>
      <div className="reveal"><ChatbotSection /></div>
      <div className="reveal"><TestimonialsSection /></div>
      <div className="reveal"><BlogSection /></div>
      <div className="reveal"><FeedbackSection /></div>
    </div>
  );
}
