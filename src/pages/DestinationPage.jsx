import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import YouTubeTravelSection from '../components/YouTubeTravelSection';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Shield,
  Phone,
  MapPin,
  Map,
  Navigation,
  Calendar,
  Info,
  Heart,
  Star,
  CheckSquare,
  RefreshCw,
  Send,
  DollarSign,
  ArrowRight,
  Building2,
  UtensilsCrossed,
  Car,
  Ticket,
  BookOpen,
  Clock,
  Lock,
  Globe,
  Plus,
  Check,
  Award,
  Activity,
  Compass,
  Leaf,
  Mountain,
  Palmtree,
  Flame,
  Landmark,
  Building,
  Trees,
  Snowflake,
  Zap,
  Sparkles,
  PawPrint,
  Gem,
  AlertTriangle,
  Sunset,
  Sunrise,
  Eye,
  Gauge,
  Umbrella,
  Thermometer,
  Train,
  Smartphone,
  Glasses,
  Shirt,
  Languages,
  Download,
  FileText,
  Volume2,
  Edit3,
  Trash2,
  HeartPulse,
  Camera,
  Bus,
  Footprints,
  Route,
  Bookmark,
  CalendarDays,
  ExternalLink
} from 'lucide-react';
import { topDestinations, currencies, travelCategories, countries } from '../data';
import { cityDatabase } from '../data/cityDatabase';
import { countriesData } from '../data/countryData';
import { getCityImage, usePremiumImage, useDestinationGallery } from '../utils/imageLookup';
import { fetchLiveVisaRequirement, simulateVisaRequirement, fetchLiveNews } from '../utils/rapidApiService';
import { fetchLiveHotels, simulateHotels } from '../utils/amadeusService';
import { fetchLiveTransitJourneys, simulateTransitJourneys } from '../utils/navitiaService';
import UnifiedWeatherDashboard from '../components/UnifiedWeatherDashboard';
import ImageWithWatermark from '../components/ImageWithWatermark';
import TransportAppLogo from '../components/TransportAppLogo';
import { getGeminiApiKey, askGemini, repairJson } from '../utils/gemini';
import { useGeoapifyTravel } from '../hooks/useGeoapifyTravel';
import AttractionsGrid from '../components/AttractionsGrid';
import HospitalSection from '../components/HospitalSection';
import MapPanel from '../components/MapPanel';
import { attractionKnowledgeBase, realCityFoodAndTransit } from '../data/attractionKnowledgeBase';

// Helper function to map category ID to styled Lucide icon
export function getCategoryIcon(id, className = "w-3.5 h-3.5") {
  switch (id) {
    case 'nature':
      return <Leaf className={className} />;
    case 'mountains':
      return <Mountain className={className} />;
    case 'beaches':
      return <Palmtree className={className} />;
    case 'deserts':
      return <Flame className={className} />;
    case 'historical':
      return <Landmark className={className} />;
    case 'cities':
      return <Compass className={className} />;
    case 'skyscrapers':
      return <Building className={className} />;
    case 'forests':
      return <Trees className={className} />;
    case 'snow':
      return <Snowflake className={className} />;
    case 'adventure':
      return <Zap className={className} />;
    case 'islands':
      return <Globe className={className} />;
    case 'cultural':
      return <Sparkles className={className} />;
    case 'wildlife':
      return <PawPrint className={className} />;
    case 'luxury':
      return <Gem className={className} />;
    default:
      return <Globe className={className} />;
  }
}

// Animate digital metrics on mount
export function AnimatedMetric({ value, suffix = "", duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const num = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    if (num === 0) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const stepTime = Math.max(Math.floor(duration / num), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(num / (duration / 25));
      if (start >= num) {
        clearInterval(timer);
        setDisplayValue(value);
      } else {
        const hasText = value.replace(/[0-9]/g, '');
        if (hasText.includes('%')) {
          setDisplayValue(`${start}%`);
        } else if (hasText.includes('km/h')) {
          setDisplayValue(`${start} km/h`);
        } else if (hasText.includes('hPa')) {
          setDisplayValue(`${start} hPa`);
        } else if (hasText.includes('km')) {
          setDisplayValue(`${start} km`);
        } else {
          setDisplayValue(`${start}${suffix}`);
        }
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value, suffix, duration]);

  return <span>{displayValue}</span>;
}

// ── Interactive HTML5 Canvas Weather Particles Simulation ───────────────────
function WeatherSimulator({ condition }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const cond = condition ? condition.toLowerCase() : '';
    const isRain = cond.includes('rain') || cond.includes('drizzle') || cond.includes('tropical') || cond.includes('shower');
    const isSnow = cond.includes('snow') || cond.includes('crisp') || cond.includes('cold') || cond.includes('chilly');
    const isFog = cond.includes('fog') || cond.includes('mist') || cond.includes('hazy') || cond.includes('cloudy') || cond.includes('overcast') || cond.includes('grey');
    const isSunny = !isRain && !isSnow && !isFog; // fallback to sunny/clear

    let width = canvas.width = containerRef.current.clientWidth;
    let height = canvas.height = containerRef.current.clientHeight;

    const handleResize = () => {
      if (canvas && containerRef.current) {
        width = canvas.width = containerRef.current.clientWidth;
        height = canvas.height = containerRef.current.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // initial distribution
      }

      reset() {
        this.x = Math.random() * width;
        this.swayOffset = Math.random() * Math.PI * 2;
        
        if (isRain) {
          this.y = -10;
          this.size = Math.random() * 1.5 + 1;
          this.speedY = Math.random() * 7 + 10;
          this.speedX = Math.random() * 0.3 + 0.5;
          this.opacity = Math.random() * 0.2 + 0.08;
          this.color = 'rgba(156, 163, 175, ';
        } else if (isSnow) {
          this.y = -10;
          // Three parallax layers
          const rand = Math.random();
          if (rand < 0.2) {
            this.layer = 'foreground';
            this.size = Math.random() * 2 + 3.2; // large blurred flakes (3.2px - 5.2px)
            this.speedY = Math.random() * 1.2 + 1.8; // falls fast
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.25 + 0.35; // high opacity
            this.swaySpeed = Math.random() * 0.006 + 0.003;
            this.swayAmplitude = Math.random() * 0.9 + 0.5;
          } else if (rand < 0.5) {
            this.layer = 'midground';
            this.size = Math.random() * 1.2 + 1.5; // mid flakes (1.5px - 2.7px)
            this.speedY = Math.random() * 0.8 + 1.0;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.opacity = Math.random() * 0.2 + 0.2;
            this.swaySpeed = Math.random() * 0.004 + 0.002;
            this.swayAmplitude = Math.random() * 0.6 + 0.3;
          } else {
            this.layer = 'background';
            this.size = Math.random() * 0.6 + 0.8; // micro flakes (0.8px - 1.4px)
            this.speedY = Math.random() * 0.4 + 0.4; // slow falling
            this.speedX = Math.random() * 0.2 - 0.1;
            this.opacity = Math.random() * 0.2 + 0.1;
            this.swaySpeed = Math.random() * 0.002 + 0.001;
            this.swayAmplitude = Math.random() * 0.3 + 0.15;
          }
          this.color = 'rgba(255, 255, 255, ';
        } else if (isSunny) {
          // Sunny particles: 65% beautiful leaves falling, 35% spores floating upwards
          this.particleType = Math.random() < 0.65 ? 'leaf' : 'spore';
          this.angle = Math.random() * Math.PI * 2;
          this.angleSpeed = Math.random() * 0.02 - 0.01;
          
          if (this.particleType === 'leaf') {
            this.y = -10;
            this.size = Math.random() * 5 + 5; // size of leaf
            this.speedY = Math.random() * 0.6 + 0.4; // slow gravity
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.2 + 0.12; // warm transparency
            this.color = Math.random() < 0.5 ? 'rgba(251, 191, 36, ' : 'rgba(245, 158, 11, '; // gold or amber
            this.swaySpeed = Math.random() * 0.004 + 0.0015;
            this.swayAmplitude = Math.random() * 0.7 + 0.35;
          } else {
            // Spore drifts upwards
            this.y = height + 10;
            this.size = Math.random() * 1.5 + 1.2;
            this.speedY = -(Math.random() * 0.3 + 0.15); // floating upwards!
            this.speedX = Math.random() * 0.3 - 0.15;
            this.opacity = Math.random() * 0.35 + 0.15;
            this.color = 'rgba(253, 224, 71, '; // glowing yellow
            this.swaySpeed = Math.random() * 0.005 + 0.002;
            this.swayAmplitude = Math.random() * 0.5 + 0.25;
          }
        }
      }

      update(mouseX, mouseY, hovered) {
        // Apply vertical and standard movement
        this.y += this.speedY;
        this.x += this.speedX;

        // Apply elegant sine-wave horizontal sway
        if (isSunny || isSnow) {
          this.x += Math.sin(this.swayOffset + Date.now() * this.swaySpeed) * this.swayAmplitude;
          if (isSunny && this.particleType === 'leaf') {
            this.angle += this.angleSpeed;
          }
        }

        // Reset if out of bounds (top/bottom depending on movement direction)
        if (isSunny && this.particleType === 'spore') {
          // Spore floating upwards: reset if it goes past the top
          if (this.y < -20 || this.x < -20 || this.x > width + 20) {
            this.reset();
          }
        } else {
          // Standard falling particles: reset if they go past the bottom
          if (isRain && this.y > height - 5) {
            if (Math.random() < 0.45) {
              ripples.push(new SplashRipple(this.x, height - 3));
            }
            this.reset();
          } else if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
            this.reset();
          }
        }

        // Mouse interaction: dodge cursor
        if (hovered && mouseX !== -1000) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = isSnow ? 110 : isSunny ? 90 : 80;

          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            const angle = Math.atan2(dy, dx);
            if (isSnow) {
              // Parallax mouse interaction (closer foreground flakes are affected more!)
              const multiplier = this.layer === 'foreground' ? 5.5 : this.layer === 'midground' ? 3.5 : 1.5;
              this.x += Math.cos(angle) * force * multiplier;
              this.y += Math.sin(angle) * force * (multiplier * 0.6);
            } else if (isSunny) {
              const multiplier = this.particleType === 'leaf' ? 3.0 : 4.5;
              this.x += Math.cos(angle) * force * multiplier;
              this.y += Math.sin(angle) * force * (multiplier * 0.6);
            } else if (isRain) {
              this.speedX += Math.cos(angle) * force * 0.4;
            }
          }
        }
      }

      draw() {
        if (isRain) {
          ctx.beginPath();
          ctx.strokeStyle = `${this.color}${this.opacity})`;
          ctx.lineWidth = this.size;
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + 1, this.y + this.size * 8);
          ctx.stroke();
        } else if (isSnow) {
          ctx.beginPath();
          // Draw soft glowing radial gradients for snowflakes
          const snowGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
          snowGrad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
          snowGrad.addColorStop(0.3, `rgba(255, 255, 255, ${this.opacity * 0.7})`);
          snowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = snowGrad;
          ctx.arc(this.x, this.y, this.size * (this.layer === 'foreground' ? 1.8 : 1.2), 0, Math.PI * 2);
          ctx.fill();
        } else if (isSunny) {
          if (this.particleType === 'leaf') {
            // Draw a gorgeous organic gold/amber leaf shape using bezier curves
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = `${this.color}${this.opacity})`;
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            // Draw quadratic leaf halves
            ctx.quadraticCurveTo(this.size * 0.65, 0, 0, this.size);
            ctx.quadraticCurveTo(-this.size * 0.65, 0, 0, -this.size);
            ctx.fill();
            
            // Subtle leaf vein line
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(0, -this.size);
            ctx.lineTo(0, this.size);
            ctx.stroke();
            
            ctx.restore();
          } else {
            // Draw spore: glowing, soft-edge circle
            ctx.beginPath();
            const sporeGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            sporeGrad.addColorStop(0, `${this.color}${this.opacity})`);
            sporeGrad.addColorStop(0.5, `${this.color}${this.opacity * 0.4})`);
            sporeGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
            ctx.fillStyle = sporeGrad;
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // Condensation drops sliding down for rain
    class CondensationDrop {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -60;
        this.size = Math.random() * 1.8 + 1.2;
        this.speed = Math.random() * 0.4 + 0.15;
        this.opacity = Math.random() * 0.25 + 0.08;
      }

      update() {
        this.y += this.speed;
        if (Math.random() < 0.012) {
          this.x += Math.random() * 0.6 - 0.3;
        }
        if (this.y > height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.35})`;
        ctx.lineWidth = this.size * 0.45;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - this.size * 2.5);
        ctx.stroke();
      }
    }

    // Volumetric fog layers for fog
    class FogLayer {
      constructor(index) {
        this.index = index;
        this.reset();
        this.x = Math.random() * width;
      }

      reset() {
        this.x = -200;
        this.y = Math.random() * height;
        this.size = Math.random() * 140 + 130;
        this.speedX = Math.random() * 0.12 + 0.04;
        this.opacity = Math.random() * 0.12 + 0.04;
      }

      update(mouseX, mouseY, hovered) {
        this.x += this.speedX;
        if (this.x > width + 200) {
          this.reset();
        }

        // Fog parts around cursor
        if (hovered && mouseX !== -1000) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const force = (160 - dist) / 160;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 2.5;
            this.y += Math.sin(angle) * force * 1.2;
          }
        }
      }

      draw() {
        const grad = ctx.createRadialGradient(this.x, this.y, 8, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(203, 213, 225, ${this.opacity})`);
        grad.addColorStop(0.5, `rgba(203, 213, 225, ${this.opacity * 0.45})`);
        grad.addColorStop(1, 'rgba(203, 213, 225, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Ripple effect when rain hits bottom
    class SplashRipple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.maxRadius = Math.random() * 8 + 5;
        this.opacity = Math.random() * 0.22 + 0.12;
        this.speed = Math.random() * 0.3 + 0.2;
      }

      update() {
        this.radius += this.speed;
        this.opacity -= 0.007;
      }

      draw() {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(156, 163, 175, ${this.opacity})`;
        ctx.lineWidth = 0.6;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      isDead() {
        return this.opacity <= 0 || this.radius >= this.maxRadius;
      }
    }

    // Drifting wind lines for foggy condition
    class WindLine {
      constructor() {
        this.reset();
        this.x = Math.random() * width;
      }

      reset() {
        this.x = -150;
        this.y = Math.random() * height;
        this.length = Math.random() * 90 + 60;
        this.speed = Math.random() * 1.2 + 0.6;
        this.opacity = Math.random() * 0.08 + 0.03;
      }

      update() {
        this.x += this.speed;
        if (this.x > width + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(226, 232, 240, ${this.opacity})`;
        ctx.lineWidth = 0.7;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y);
        ctx.stroke();
      }
    }

    // Create objects
    const particles = Array.from({ length: isSunny ? 28 : isSnow ? 55 : isRain ? 35 : 0 }, () => new Particle());
    const condensation = isRain ? Array.from({ length: 10 }, () => new CondensationDrop()) : [];
    const fogs = isFog ? Array.from({ length: 5 }, (_, i) => new FogLayer(i)) : [];
    let ripples = [];
    const winds = isFog ? Array.from({ length: 4 }, () => new WindLine()) : [];

    let lightningTimer = 0;
    let lightningOpacity = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background lightning sheet for Rainy condition
      if (isRain) {
        lightningTimer++;
        if (lightningTimer > 280 && Math.random() < 0.015) {
          lightningOpacity = Math.random() * 0.35 + 0.1;
          lightningTimer = 0;
        }
        if (lightningOpacity > 0) {
          ctx.fillStyle = `rgba(224, 242, 254, ${lightningOpacity})`;
          ctx.fillRect(0, 0, width, height);
          lightningOpacity -= 0.04;
        }
      }

      // Draw base ambient cyan winter glow overlay for Snowy condition
      if (isSnow) {
        const bottomGlow = ctx.createLinearGradient(0, height - 90, 0, height);
        bottomGlow.addColorStop(0, 'rgba(34, 211, 238, 0)');
        bottomGlow.addColorStop(0.5, 'rgba(34, 211, 238, 0.03)');
        bottomGlow.addColorStop(1, 'rgba(34, 211, 238, 0.09)');
        ctx.fillStyle = bottomGlow;
        ctx.fillRect(0, height - 90, width, 90);
      }

      // Draw subtle ambient warming glow filter for Sunny condition (professional, not harsh)
      if (isSunny) {
        const glowGrad = ctx.createLinearGradient(0, 0, 0, height * 0.45);
        const dynamicAlpha = 0.05 + Math.sin(Date.now() * 0.0008) * 0.015; // slow ambient shimmer
        glowGrad.addColorStop(0, `rgba(251, 191, 36, ${dynamicAlpha})`);
        glowGrad.addColorStop(0.5, `rgba(251, 191, 36, ${dynamicAlpha * 0.45})`);
        glowGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height * 0.45);
      }

      // Draw Lens Flare overlay for Sunny condition (on hover)
      if (isSunny && mouseRef.current.x !== -1000 && isHoveredRef.current) {
        const flareX = mouseRef.current.x;
        const flareY = mouseRef.current.y;
        
        ctx.beginPath();
        const primaryGrad = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 130);
        primaryGrad.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
        primaryGrad.addColorStop(0.25, 'rgba(251, 191, 36, 0.07)');
        primaryGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.015)');
        primaryGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = primaryGrad;
        ctx.arc(flareX, flareY, 130, 0, Math.PI * 2);
        ctx.fill();

        const centerX = width / 2;
        const centerY = height / 2;
        const dirX = centerX - flareX;
        const dirY = centerY - flareY;

        const flarePoints = [0.35, 0.7, -0.25];
        flarePoints.forEach((multiplier, i) => {
          const fx = centerX + dirX * multiplier;
          const fy = centerY + dirY * multiplier;
          const radius = Math.abs(18 - i * 4);
          ctx.beginPath();
          const flareGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, radius);
          flareGrad.addColorStop(0, `rgba(251, 191, 36, ${0.12 - i * 0.02})`);
          flareGrad.addColorStop(0.5, `rgba(244, 63, 94, ${0.04 - i * 0.01})`);
          flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = flareGrad;
          ctx.arc(fx, fy, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Update and draw entities
      if (isRain) {
        ripples = ripples.filter((r) => {
          r.update();
          r.draw();
          return !r.isDead();
        });
      }

      if (isFog) {
        winds.forEach((w) => {
          w.update();
          w.draw();
        });
      }

      particles.forEach((p) => {
        p.update(mouseRef.current.x, mouseRef.current.y, isHoveredRef.current);
        p.draw();
      });

      condensation.forEach((c) => {
        c.update();
        c.draw();
      });

      fogs.forEach((f) => {
        f.update(mouseRef.current.x, mouseRef.current.y, isHoveredRef.current);
        f.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [condition]);

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };
  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    mouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 z-0 rounded-[28px] overflow-hidden pointer-events-auto"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block opacity-80 pointer-events-none"
      />
    </div>
  );
}

// Fallback old WeatherEffect wrapper to prevent crashes
function WeatherEffect({ condition }) {
  return <WeatherSimulator condition={condition} />;
}

// ── Expandable Forecast Row Subcomponent ─────────────────────────────────────
function ForecastRow({ day, temp, condition, suggestions, index }) {
  const [isOpen, setIsOpen] = useState(index === 0); // default open first row
  
  return (
    <div className="border border-[var(--border)] bg-[var(--bg-secondary)] rounded-2xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-500/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="w-24 text-sm font-bold text-[var(--text-primary)]">{day}</span>
          
          <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-secondary)] font-mono uppercase tracking-wide">
            {condition}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{temp}</span>
          <span className="text-[var(--text-secondary)] text-sm font-bold transition-transform duration-300">
            {isOpen ? '−' : '+'}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-[var(--border)] bg-slate-500/[0.02] text-xs text-[var(--text-secondary)] leading-relaxed font-light space-y-2">
          <p className="flex items-start gap-1.5 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[var(--text-primary)] font-medium mr-1">AI Advisory:</strong>
              {suggestions}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

const extraDestinationsData = {
  'new-zealand': { country: 'New Zealand', flag: '🇳🇿', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80', preview: 'Adventure ground of pristine lakes, glaciers, and rich Maori heritage.', bestTime: 'Dec - Feb', budget: '$150-300' },
  'costa-rica': { country: 'Costa Rica', flag: '🇨🇷', image: 'https://images.unsplash.com/photo-1565880122-8322c627a92d?w=600&q=80', preview: 'Lush rain forests, active volcanoes, and pristine beaches in Central America.', bestTime: 'Dec - April', budget: '$80-180' },
  'norway': { country: 'Norway', flag: '🇳🇴', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80', preview: 'Majestic deep fjords, towering mountains, and stunning northern lights crossings.', bestTime: 'June - Aug', budget: '$160-320' },
  'swiss-alps': { country: 'Switzerland', flag: '🇨🇭', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', preview: 'Snow-capped peaks, scenic mountain railways, and premium ski resort chalets.', bestTime: 'Jan - March', budget: '$200-400' },
  'patagonia': { country: 'Argentina', flag: '🇦🇷', image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=600&q=80', preview: 'Dramatic mountain spires, massive glaciers, and sweeping windblown steppes.', bestTime: 'Nov - March', budget: '$120-250' },
  'amazon-rainforest': { country: 'Brazil', flag: '🇧🇷', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', preview: 'Explore the world\'s largest tropical rainforest, teeming with unprecedented biological diversity.', bestTime: 'July - Dec', budget: '$70-150' },
  'himalayas': { country: 'Nepal', flag: '🇳🇵', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', preview: 'The roof of the world, offering serene trails, high-altitude peaks, and spiritual retreats.', bestTime: 'Oct - Nov', budget: '$40-100' },
  'rocky-mountains': { country: 'United States', flag: '🇺🇸', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', preview: 'Stretching mountains, alpine lakes, and abundant wildlife across North America.', bestTime: 'June - Aug', budget: '$130-250' },
  'andes': { country: 'Peru', flag: '🇵🇪', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', preview: 'Curving mountain chains dotted with ancient ruins, rich valleys, and active trails.', bestTime: 'May - Sept', budget: '$80-160' },
  'mount-fuji': { country: 'Japan', flag: '🇯🇵', image: 'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?w=600&q=80', preview: 'The symmetrical snow-capped volcanic cone, a long-standing sacred national symbol.', bestTime: 'July - Sept', budget: '$110-250' },
  'dolomites': { country: 'Italy', flag: '🇮🇹', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', preview: 'Towering dolomite rock spires, deep green valleys, and pristine hiking loops.', bestTime: 'June - Sept', budget: '$140-280' },
  'hunza-valley': { country: 'Pakistan', flag: '🇵🇰', image: 'https://images.unsplash.com/photo-1595844730298-b9f1ff982792?w=600&q=80', preview: 'The breathtaking valley of giant peak vistas, ancient stone forts, and turquoise lakes.', bestTime: 'May - Oct', budget: '$30-80' },
  'kilimanjaro': { country: 'Tanzania', flag: '🇹🇿', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', preview: 'Africa\'s highest peak, a majestic free-standing volcanic mountain.', bestTime: 'Jan - March', budget: '$150-300' },
  'phuket': { country: 'Thailand', flag: '🇹🇭', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', preview: 'Tropical island paradise featuring sandy shores, limestone cliffs, and vibrant nightlife.', bestTime: 'Nov - April', budget: '$60-150' },
  'cancún': { country: 'Mexico', flag: '🇲🇽', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', preview: 'Turquoise Caribbean waters, sandy resorts, and nearby historic Mayan ruins.', bestTime: 'Dec - April', budget: '$90-200' },
  'cancun': { country: 'Mexico', flag: '🇲🇽', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', preview: 'Turquoise Caribbean waters, sandy resorts, and nearby historic Mayan ruins.', bestTime: 'Dec - April', budget: '$90-200' },
  'sahara': { country: 'Morocco', flag: '🇲🇦', image: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=600&q=80', preview: 'Stunning vast golden dunes, sunset camel treks, and night skies under desert stars.', bestTime: 'Oct - May', budget: '$50-120' },
  'dubai-desert': { country: 'UAE', flag: '🇦🇪', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', preview: 'Thrilling sandboarding, dune bashing, and luxury bedouin camp retreats.', bestTime: 'Nov - March', budget: '$120-250' },
  'london': { country: 'United Kingdom', flag: '🇬🇧', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', preview: 'A historic global capital rich in royal castles, state museums, and iconic red buses.', bestTime: 'May - Sept', budget: '$150-350' },
  'singapore': { country: 'Singapore', flag: '🇸🇬', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80', preview: 'Futuristic gardens, clean streets, high-end skyscrapers, and delicious local food stalls.', bestTime: 'Feb - April', budget: '$140-300' }
};

// ── Local Transportation Datasets ───────────────────────────────────────────
const TRANSPORT_DATA = {
  riyadh: {
    cheaper: {
      type: 'Riyadh Metro & Bus Network',
      desc: 'The newly launched state-of-the-art Riyadh Metro and Bus network connects key commercial areas, hotels, and airports. Exceptionally fast, climate-controlled, and highly modern.',
      price: '$2.00 - $5.50 / day',
      tip: 'Get a Darb smart transit card in advance to access both Riyadh buses and trains without hassle.'
    },
    luxury: {
      type: 'Chauffeured GMC Yukon / Mercedes',
      desc: 'Elite private chauffeur transfers in premium SUVs like GMC Yukon or luxury sedans. Provides full climate-controlled comfort and professional drivers.',
      price: '$80 - $180 / transfer',
      tip: 'Highly recommended for direct hotel-to-attraction travel to avoid extreme afternoon desert heat.'
    },
    apps: [
      { name: 'Careem', purpose: 'The premier local ride-hailing application across Saudi Arabia for regular and luxury trips.' },
      { name: 'Riyadh Bus App', purpose: 'Official app for local bus network schedules, routes, and smart ticketing.' },
      { name: 'Uber Saudi Arabia', purpose: 'Widely active and highly reliable for standard city rides and airport transfers.' }
    ]
  },
  tokyo: {
    cheaper: {
      type: 'Subway & Metro Grid',
      desc: 'Tokyo Metro and Toei Lines form a dense network. Purchase a 24, 48, or 72-hour Subway Ticket for unlimited travel. Highly punctual and exceptionally clean.',
      price: '$5.50 - $10.00 / day',
      tip: 'Get a Suica or Pasmo IC card for tap-and-go convenience across all JR and subway rail networks.'
    },
    luxury: {
      type: 'Private MK Limousine',
      desc: 'Premium chauffeured transport in immaculate black sedans or Toyota Alphard luxury minivans. Includes English-speaking drivers and top-tier comfort.',
      price: '$120 - $280 / transfer',
      tip: 'Pre-book online for airport transfers from Narita or Haneda to avoid peak premium queues.'
    },
    apps: [
      { name: 'Japan Travel (Navitime)', purpose: 'Best for route planning, train schedules, and platforms navigation.' },
      { name: 'S.RIDE / Go App', purpose: 'The primary local Japanese taxi ride-hailing applications.' },
      { name: 'Google Maps', purpose: 'Flawlessly maps train transfers and estimates platform numbers.' }
    ]
  },
  paris: {
    cheaper: {
      type: 'RATP Metro & Bus',
      desc: 'The Parisian Metro spans 16 comprehensive routes. A Navigo Easy card lets you load cheap single T+ ticket bundles or unlimited daily plans.',
      price: '$2.30 / ticket ($9.50 daily)',
      tip: 'Beware of active pocket-pickers around high-volume stations like Châtelet and Gare du Nord.'
    },
    luxury: {
      type: 'Chauffeured Mercedes Transfer',
      desc: 'High-end private chauffeur bookings in Mercedes S-Class sedans, perfectly tailored for quiet-luxury travel along the Seine.',
      price: '$90 - $190 / transfer',
      tip: 'Pre-arrange an elite meet-and-greet service directly at Charles de Gaulle (CDG) Arrivals.'
    },
    apps: [
      { name: 'Bonjour RATP', purpose: 'Official app for routes mapping, timetables, and loading electronic metro tickets.' },
      { name: 'Bolt / Uber', purpose: 'The leading ride-hailing applications for cars and shared scooters in Paris.' },
      { name: 'Citymapper', purpose: 'Outperforms local tools for live bus rerouting and peak subway disruptions.' }
    ]
  },
  bali: {
    cheaper: {
      type: 'GoCar / Grab Riding',
      desc: 'Due to lack of public rail transits, shared scooter rides (GoRide/GrabBike) are the cheapest way to zip past heavy resort traffic lanes.',
      price: '$1.50 - $4.00 / ride',
      tip: 'Always wear a helmet and hold your smartphone securely to prevent snatch thefts on active roads.'
    },
    luxury: {
      type: 'Private Driver Charter',
      desc: 'Chartering a spacious, air-conditioned SUV with an experienced local driver for a full 10-hour tour is the standard premium way to explore remote temples.',
      price: '$45 - $75 / full day',
      tip: 'Discuss your directions in advance to avoid high mountainous terrain surcharges.'
    },
    apps: [
      { name: 'Grab', purpose: 'Highly efficient app for food delivery, ride-hailing, and booking private vehicles.' },
      { name: 'Gojek', purpose: 'The quintessential local super-app for bike-taxis, courier service, and payments.' },
      { name: 'Klook', purpose: 'Best for pre-booking fast boats to Nusa Penida and inter-island private transfers.' }
    ]
  },
  dubai: {
    cheaper: {
      type: 'Driverless Dubai Metro',
      desc: 'A gorgeous, fully automated driverless overhead metro system connecting major malls, airports, and marina docks. Highly affordable.',
      price: '$2.00 - $4.50 / trip',
      tip: 'Acquire a Silver Nol Card in advance to avoid ticket counter queues. Golden cabin access requires a Gold Nol.'
    },
    luxury: {
      type: 'Supercar Rental / Yacht Charter',
      desc: 'Rent elite supercars (Lamborghini, Ferrari) to cruise Sheikh Zayed Road, or book premium private luxury yacht transfers across the Dubai Marina.',
      price: '$250 - $850 / day',
      tip: 'Ensure you carry an International Driving Permit (IDP) and a high-limit credit card for deposits.'
    },
    apps: [
      { name: 'Careem (Hala Taxi)', purpose: 'Essential local ride-hailing app for booking regular city cabs and luxury sedans.' },
      { name: 'RTA Smart Drive', purpose: 'Official government routing app providing offline map guidance and traffic info.' },
      { name: 'Uber Dubai', purpose: 'Widely active for booking premium high-tier Lexus rides and airport drop-offs.' }
    ]
  },
  newyork: {
    cheaper: {
      type: 'MTA Subway Grid',
      desc: 'The legendary NYC Subway runs 24/7. Simply tap any contactless credit card or smartphone at OMNY turnstiles to enter. Very reliable.',
      price: '$2.90 / single tap',
      tip: 'Taps are capped at $34 per week, after which all subsequent rides are completely free.'
    },
    luxury: {
      type: 'Blade Helicopter / Black Cab',
      desc: 'Zip past airport highway gridlocks with a 5-minute Blade helicopter shuttle, or book a private Cadillac Escalade luxury black-car transfer.',
      price: '$195 - $295 / seat',
      tip: 'Helicopter luggage is strictly limited to 25 lbs; plan for separate heavy luggage courier transits.'
    },
    apps: [
      { name: 'MYmta', purpose: 'Official MTA schedule app showing live train arrivals, delays, and subway maps.' },
      { name: 'Uber / Lyft', purpose: 'Ride-hailing apps widely active across all 5 boroughs for yellow cabs and premium black cars.' },
      { name: 'Curb', purpose: 'Best app for hailing official yellow/green cabs directly and locking low metered pricing.' }
    ]
  },
  rome: {
    cheaper: {
      type: 'ATAC Metro & Tram',
      desc: 'Rome has a simple two-line metro system (A & B) and comprehensive tram networks. Extremely cheap and connects major archaeological hotspots.',
      price: '$1.65 / 100-minute ticket',
      tip: 'Always validate your ticket in the red machines upon boarding buses or trams to avoid heavy fines.'
    },
    luxury: {
      type: 'Private NCC Towncar',
      desc: 'Rent a private NCC (Noleggio Con Conducente) chauffeured luxury sedan. Perfect for navigating ZTL (Limited Traffic Zones) in the old town.',
      price: '$60 - $120 / transfer',
      tip: 'Ensure your private NCC driver possesses the legal windshield permit to enter active ZTL zones.'
    },
    apps: [
      { name: 'TicketAppy', purpose: 'Buy virtual metro/bus tickets directly on your smartphone to bypass station queues.' },
      { name: 'FreeNow (MyTaxi)', purpose: 'The primary local app for summoning official licensed Roman taxis.' },
      { name: 'Moovit', purpose: 'Excellent live route guidance and public transit warning schedules for Rome.' }
    ]
  }
};

const DEFAULT_TRANSPORT = {
  cheaper: {
    type: 'Local Public Transit Grid',
    desc: 'Public buses, subway lines, or municipal train networks are highly active. Acquire a local smart transit card at the arrivals terminal.',
    price: '$2.00 - $6.00 / day',
    tip: 'Pre-check route schedules and platforms to prevent accidental transfer misses.'
  },
  luxury: {
    type: 'Chauffeured Executive Sedan',
    desc: 'Private transfers in luxury towncars or premium sedans provide maximum comfort and secure door-to-door transit.',
    price: '$50 - $150 / transfer',
    tip: 'Book through your hotel concierge or pre-arrange premium online transfers.'
  },
  apps: [
    { name: 'Google Maps / Uber', purpose: 'Universal route planning, subway tracking, and ride-hailing services.' },
    { name: 'Local City Cab App', purpose: 'Summons official city metered taxis with standard local tariffs.' },
    { name: 'Klook Transfers', purpose: 'Convenient online fast boats, private charters, and tour shuttles booking.' }
  ]
};

// ── Real-time Helper Functions & Geocoding Mapping ───────────────────────────
const WMO_WEATHER_CODES = {
  0: 'Sunny',
  1: 'Partly Cloudy', 2: 'Partly Cloudy', 3: 'Partly Cloudy',
  45: 'Foggy', 48: 'Foggy',
  51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle', 56: 'Drizzle', 57: 'Drizzle',
  61: 'Rainy', 63: 'Rainy', 65: 'Rainy', 66: 'Rainy', 67: 'Rainy',
  71: 'Snowy', 73: 'Snowy', 75: 'Snowy', 77: 'Snowy',
  80: 'Showers', 81: 'Showers', 82: 'Showers',
  85: 'Snow Showers', 86: 'Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
};

function mapWmoToCondition(code) {
  return WMO_WEATHER_CODES[code] || 'Clear';
}

function getEmergencyContacts(country) {
  const norm = country ? country.toLowerCase() : '';
  if (norm.includes('united states') || norm.includes('usa') || norm.includes('canada')) {
    return { police: '911', ambulance: '911', fire: '911', note: 'All emergency lines consolidated.' };
  }
  if (norm.includes('united kingdom') || norm.includes('uk')) {
    return { police: '999', ambulance: '999', fire: '999', note: 'Unified emergency dispatch.' };
  }
  if (norm.includes('france') || norm.includes('italy') || norm.includes('spain') || norm.includes('germany') || norm.includes('portugal') || norm.includes('greece') || norm.includes('switzerland') || norm.includes('norway') || norm.includes('iceland')) {
    return { police: '112', ambulance: '112', fire: '112', note: 'Standard European emergency line.' };
  }
  if (norm.includes('japan')) {
    return { police: '110', ambulance: '119', fire: '119', note: 'Separate lines for Police and Fire/Rescue.' };
  }
  if (norm.includes('saudi') || norm.includes('arabia')) {
    return { police: '911 / 999', ambulance: '997', fire: '998', note: '911 active in Riyadh, Mecca, and Medina.' };
  }
  if (norm.includes('pakistan')) {
    return { police: '15', ambulance: '1122 / 115', fire: '16', note: 'Ambulance is via Edhi (115) or Rescue 1122.' };
  }
  if (norm.includes('indonesia')) {
    return { police: '110', ambulance: '118/119', fire: '113', note: 'GSM mobile networks route to 112.' };
  }
  if (norm.includes('egypt')) {
    return { police: '122', ambulance: '123', fire: '180', note: 'Local public safety dispatch.' };
  }
  if (norm.includes('uae') || norm.includes('emirates')) {
    return { police: '999', ambulance: '998', fire: '997', note: 'Dedicated emergency dispatches.' };
  }
  if (norm.includes('australia')) {
    return { police: '000', ambulance: '000', fire: '000', note: 'Triple Zero is active.' };
  }
  return { police: '112', ambulance: '112', fire: '112', note: 'Universal emergency mobile router.' };
}

const parsePrice = (priceStr) => {
  if (!priceStr) return { currency: '$', amount: 'N/A', unit: '' };
  const currencyMatch = priceStr.match(/([^\d\s\-\.,]+)/);
  const currency = currencyMatch ? currencyMatch[1] : '$';
  
  // Split by unit divider "/"
  const parts = priceStr.split('/');
  const rawAmount = parts[0];
  const unit = parts[1] ? `per ${parts[1].trim()}` : '';
  
  // Remove all instances of currency symbol from the amount string
  const amount = rawAmount.split(currency).join('').trim();
  
  return { currency, amount, unit };
};

export function getTransportDataForDest(destination) {
  if (TRANSPORT_DATA[destination.id]) {
    return TRANSPORT_DATA[destination.id];
  }

  const country = destination.country ? destination.country.toLowerCase() : '';
  const city = destination.name;

  let cheaperType = 'Local Public Transit Grid';
  let cheaperDesc = `Public buses, subway lines, or municipal train networks are active across ${city}. Acquire a local smart transit card at the station.`;
  let cheaperPrice = '$2.00 - $6.50 / day';
  let cheaperTip = 'Confirm route schedules using Google Maps or local transport apps.';

  let luxuryType = 'Private Chauffeured Sedan / SUV';
  let luxuryDesc = `Book premium, fully air-conditioned chauffeured private transfers direct from your hotel lobby to all major sites.`;
  let luxuryPrice = '$70 - $150 / transfer';
  let luxuryTip = 'Book via your hotel reception or reliable premium online transfer apps.';

  let apps = [
    { name: 'Uber', purpose: 'The universal standard for rapid ride-hailing and airport transfers.' },
    { name: 'Google Maps', purpose: 'Excellent for live public transit route coordinates and schedules.' }
  ];

  // Dynamic Country Transport Rules for 200+ countries:
  if (country.includes('saudi') || country.includes('arabia') || country.includes('uae') || country.includes('egypt') || country.includes('jordan') || country.includes('qatar') || country.includes('kuwait') || country.includes('bahrain') || country.includes('oman')) {
    cheaperType = `${city} Public Bus & Shuttle network`;
    cheaperDesc = `Affordable air-conditioned municipality buses and localized shuttles covering major heritage nodes.`;
    cheaperPrice = '$1.50 - $4.00 / day';
    cheaperTip = 'Purchase local smart transit cards or tickets at station terminals.';
    luxuryType = 'Luxury Chauffeur Service';
    luxuryDesc = `Elite climate-controlled private transfers in premium SUVs like GMC Yukon or luxury sedans to stay cool in the desert heat.`;
    luxuryPrice = '$80 - $185 / transfer';
    luxuryTip = 'Pre-book online or through your hotel concierge.';
    apps = [
      { name: 'Careem', purpose: 'The premier local ride-hailing app across the Middle East for regular and luxury cars.' },
      { name: 'Uber', purpose: 'Widely active and highly reliable for standard city rides and airport transfers.' }
    ];
  } else if (country.includes('indonesia') || country.includes('thailand') || country.includes('vietnam') || country.includes('malaysia') || country.includes('singapore') || country.includes('philippines') || country.includes('cambodia')) {
    cheaperType = 'Shared Scooter & Local Metro';
    cheaperDesc = `Cheapest way to zip past resort traffic lanes. Highly active rail systems are available in major cities.`;
    cheaperPrice = '$2.00 - $5.00 / day';
    cheaperTip = 'Always request matching helmets for scooter hires.';
    luxuryType = 'Chauffeured Private Car Charter';
    luxuryDesc = `Hire a private local driver for a full 8 to 10 hour day. Exceptional luxury, comfort, and custom itinerary routing.`;
    luxuryPrice = '$45 - $80 / full day';
    luxuryTip = 'Pre-arrange directly with top-rated local travel agencies online.';
    apps = [
      { name: 'Grab', purpose: 'The ultimate super-app for ride-hailing, food delivery, and local transit booking.' }
    ];
    if (country.includes('indonesia') || country.includes('vietnam')) {
      apps.push({ name: 'Gojek', purpose: 'Highly popular and cheap motorbike taxi hailing and digital payment platform.' });
    } else {
      apps.push({ name: 'Uber / Bolt', purpose: 'Reliable ride-hailing and airport transfer services.' });
    }
  } else if (country.includes('japan') || country.includes('korea')) {
    cheaperType = 'Subway & Rapid Rail System';
    cheaperDesc = `High-speed, exceptionally punctual, climate-controlled train and subway grid linking every key commercial area.`;
    cheaperPrice = '$5.00 - $12.00 / day';
    cheaperTip = 'Tap to pay easily with a digital transit card on your phone.';
    luxuryType = 'MK Private Sedan / Taxi';
    luxuryDesc = `Pristine white-gloved luxury taxi transfers with English-speaking drivers and top-tier interior comfort.`;
    luxuryPrice = '$90 - $220 / transfer';
    apps = [
      { name: country.includes('japan') ? 'Go App' : 'Kakao T', purpose: 'The leading national taxi-hailing applications.' },
      { name: 'Japan Travel by Navitime', purpose: 'Highly recommended for transit schedules, platforms, and bullet train routing.' }
    ];
  } else if (country.includes('india')) {
    cheaperType = 'Local Metro & Auto Rickshaws';
    cheaperDesc = `High-frequency city metro lines combined with nimble auto-rickshaws for last-mile connectivity.`;
    cheaperPrice = '$1.00 - $3.00 / day';
    cheaperTip = 'Always negotiate fares or insist on using the meter for rickshaws.';
    luxuryType = 'Private Chauffeured Cab';
    luxuryDesc = `Book air-conditioned private hatchbacks or sedans for comfortable point-to-point transit.`;
    luxuryPrice = '$25 - $50 / day';
    luxuryTip = 'Book via top-rated digital ride-hailing apps to lock upfront fares.';
    apps = [
      { name: 'Ola', purpose: 'The premier national ride-hailing platform for cars and rickshaws.' },
      { name: 'Uber India', purpose: 'Highly active for premium standard cabs and airport transfers.' },
      { name: 'Rapido', purpose: 'Popular bike-taxi hailing service to cut through heavy urban traffic.' }
    ];
  } else if (country.includes('pakistan')) {
    cheaperType = 'Metro Bus & Ride-Sharing Bikes';
    cheaperDesc = `Public bus transit lines where available, or shared bike-hailing for quick transits.`;
    cheaperPrice = 'Rs150 - Rs400 / day';
    cheaperTip = 'Bike rides are quickest to bypass major urban bottlenecks.';
    luxuryType = 'AC Private Ride-Hailing Cab';
    luxuryDesc = `Comfortable, fully air-conditioned sedan and hatchback hailing or daily private rentals.`;
    luxuryPrice = 'Rs2,500 - Rs5,000 / day';
    luxuryTip = 'Book via digital apps to ensure GPS-tracked, secure rides.';
    apps = [
      { name: 'Careem', purpose: 'The most popular and secure ride-hailing service for cars.' },
      { name: 'inDrive', purpose: 'Allows passengers to negotiate and bid custom fares directly with drivers.' },
      { name: 'Yango / Bykea', purpose: 'Highly cost-effective ride-hailing and bike taxi services.' }
    ];
  } else if (country.includes('united kingdom') || country.includes('ireland') || country.includes('uk')) {
    cheaperType = 'Underground & Double-Decker Bus Grid';
    cheaperDesc = `Comprehensive public rail, tube, and bus networks. Tap in and out using contactless bank cards.`;
    cheaperPrice = '£6.00 - £12.00 / day';
    cheaperTip = 'Contactless fares are automatically capped daily, ensuring maximum cost-efficiency.';
    luxuryType = 'Black Cab / Private Chauffeur';
    luxuryDesc = `Spacious, historic black cabs with professional drivers or pre-arranged premium executive sedans.`;
    luxuryPrice = '£35 - £90 / transfer';
    luxuryTip = 'Summon black cabs instantly on the street or using designated local ride apps.';
    apps = [
      { name: 'Citymapper', purpose: 'The absolute best live multi-modal transit planning and navigation app.' },
      { name: 'Uber / Bolt', purpose: 'Widely popular ride-hailing apps for private hire vehicles.' },
      { name: 'Trainline', purpose: 'Essential app for booking national intercity rail tickets and checking departures.' }
    ];
  } else if (country.includes('germany') || country.includes('austria') || country.includes('switzerland')) {
    cheaperType = 'U-Bahn, S-Bahn & Tram Grid';
    cheaperDesc = `High-efficiency municipal rail, subways, and streetcars running on strict schedules.`;
    cheaperPrice = '€6.00 - €15.00 / day';
    cheaperTip = 'Always validate paper tickets in stamp boxes before boarding trains.';
    luxuryType = 'Premium Executive Sedan';
    luxuryDesc = `Private chauffeur services in late-model German luxury sedans (Mercedes, BMW, Audi).`;
    luxuryPrice = '€75 - €180 / transfer';
    luxuryTip = 'Pre-book online for airport routes or ask at your hotel reception.';
    apps = [
      { name: country.includes('switzerland') ? 'SBB Mobile' : 'DB Navigator', purpose: 'Official national railway schedules and mobile ticket bookings.' },
      { name: 'FreeNow', purpose: 'The primary app to summon licensed city taxis and shared micro-mobility.' },
      { name: 'Uber / Bolt', purpose: 'Active in major cities for convenient ride requests.' }
    ];
  } else if (country.includes('france') || country.includes('italy') || country.includes('spain') || country.includes('portugal') || country.includes('greece') || country.includes('netherlands') || country.includes('belgium')) {
    cheaperType = 'Metro & Municipal Bus Network';
    cheaperDesc = `Excellent urban rail and bus grids linking major tourist sights and shopping zones.`;
    cheaperPrice = '€5.00 - €12.00 / day';
    cheaperTip = 'Buy multi-ride ticket booklets at tabac shops or station kiosks for extra discounts.';
    luxuryType = 'Private NCC / Limousine Cab';
    luxuryDesc = `Licensed private transfer drivers (NCC) accessing limited traffic zones (ZTL) directly.`;
    luxuryPrice = '€55 - €140 / transfer';
    luxuryTip = 'Pre-book online or use official taxi queues; avoid unmetered solicitors.';
    apps = [
      { name: 'Bonjour RATP / TicketAppy', purpose: 'Local public transit tickets and routing apps.' },
      { name: 'FreeNow / Cabify', purpose: 'The leading regional taxi and private hire hailing applications.' },
      { name: 'Uber / Bolt', purpose: 'Highly active ride-hailing alternatives across European hubs.' }
    ];
  } else if (country.includes('turkey')) {
    cheaperType = 'Metro, Tramway & Yellow Ferry';
    cheaperDesc = `Inter-continental ferries, modern trams, and subways. Highly scenic and extremely fast.`;
    cheaperPrice = '50 - 120 TL / day';
    cheaperTip = 'Load an Istanbulkart smart card at yellow transit machines near major hubs.';
    luxuryType = 'Yellow Taxi / Private VIP Van';
    luxuryDesc = `Official yellow cabs or spacious Mercedes Sprinter private charters for family transfers.`;
    luxuryPrice = '300 - 800 TL / transfer';
    luxuryTip = 'Verify that the taxi meter is turned on as soon as you board.';
    apps = [
      { name: 'BiTaksi', purpose: 'The leading Turkish taxi-hailing app for booking official yellow and turquoise cabs.' },
      { name: 'Uber Turkey', purpose: 'Reliable option for calling yellow taxis and VIP black vans.' },
      { name: 'Citymapper Istanbul', purpose: 'Excellent for ferry, subway, and tram transit schedules.' }
    ];
  } else if (country.includes('australia') || country.includes('new zealand')) {
    cheaperType = 'Train, Ferry & Bus Grid';
    cheaperDesc = `Punctual and clean commuter train lines, public buses, and scenic harbour ferries.`;
    cheaperPrice = '$8.00 - $16.00 / day';
    cheaperTip = 'Simply tap on and off using contactless bank cards or local smart cards (Opal/Myki).';
    luxuryType = 'Private Airport Transfer';
    luxuryDesc = `Executive private towncars or premium rideshare options for comfortable direct transit.`;
    luxuryPrice = '$65 - $150 / transfer';
    luxuryTip = 'Rideshare pickup zones are designated at major airport terminals.';
    apps = [
      { name: 'Uber / DiDi / Ola', purpose: 'The primary active ride-hailing apps in Australia and NZ.' },
      { name: 'TripView / Opal Travel', purpose: 'Best apps for live train and ferry schedules and delays.' }
    ];
  }

  return {
    cheaper: { type: cheaperType, desc: cheaperDesc, price: cheaperPrice, tip: cheaperTip },
    luxury: { type: luxuryType, desc: luxuryDesc, price: luxuryPrice, tip: luxuryTip },
    apps
  };
}

// ── DestinationPage Component Content ───────────────────────────────────────────────
function DestinationPageContent({ destination }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isFallbackMode } = useAuth();

  const renderSectionLock = (sectionTitle) => (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/[0.01] dark:bg-black/10 backdrop-blur-[2px] px-6">
      <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-white/10 rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <Lock size={20} className="mx-auto text-[var(--accent)] animate-bounce" />
        <h3 className="font-heading font-bold text-base text-slate-950 dark:text-white">
          Unlock {sectionTitle}
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-xs mx-auto">
          Create a free account to unlock detailed safety records, packing checklists, local transport cards, and hotel rates for {destination.name}.
        </p>
        <div className="pt-2">
          <Link 
            to="/auth" 
            state={{ mode: 'signup', from: location.pathname }}
            className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-tr from-[var(--accent)] to-indigo-600 text-white font-semibold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );

  // Save to recently viewed database
  useEffect(() => {
    if (user && destination) {
      const saveRecentlyViewed = async () => {
        const itemSlug = destination.id;
        const itemName = destination.name;
        const itemType = 'city'; 
        
        if (isFallbackMode) {
          const allHist = JSON.parse(localStorage.getItem('tripready_recently_viewed') || '[]');
          // Remove duplicate if exists
          const filtered = allHist.filter(h => !(h.user_id === user.id && h.item_slug === itemSlug));
          filtered.unshift({
            id: crypto.randomUUID(),
            user_id: user.id,
            item_slug: itemSlug,
            item_name: itemName,
            item_type: itemType,
            viewed_at: new Date().toISOString()
          });
          localStorage.setItem('tripready_recently_viewed', JSON.stringify(filtered.slice(0, 20)));
        } else {
          try {
            const { error } = await supabase.from('recently_viewed').insert([{
              user_id: user.id,
              item_slug: itemSlug,
              item_name: itemName,
              item_type: itemType
            }]);
            if (error) throw error;
          } catch (e) {
            // Silently fall back to localStorage without logging console errors
            const allHist = JSON.parse(localStorage.getItem('tripready_recently_viewed') || '[]');
            const filtered = allHist.filter(h => !(h.user_id === user.id && h.item_slug === itemSlug));
            filtered.unshift({
              id: crypto.randomUUID(),
              user_id: user.id,
              item_slug: itemSlug,
              item_name: itemName,
              item_type: itemType,
              viewed_at: new Date().toISOString()
            });
            localStorage.setItem('tripready_recently_viewed', JSON.stringify(filtered.slice(0, 20)));
          }
        }
      };

      saveRecentlyViewed();
    }
  }, [user, destination, isFallbackMode]);

  // ── Favorites ─────────────────────────────────────────────────────
  const [destFavorited, setDestFavorited] = useState(false);

  useEffect(() => {
    if (!user || !destination) return;
    const checkFav = async () => {
      if (isFallbackMode) {
        const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
        setDestFavorited(allFavs.some(f => f.user_id === user.id && f.item_id === destination.id && f.item_type === 'destination'));
      } else {
        try {
          const { data, error } = await supabase.from('favorites').select('id').eq('user_id', user.id).eq('item_id', destination.id).eq('item_type', 'destination');
          if (error) throw error;
          setDestFavorited(data && data.length > 0);
        } catch (e) {
          const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
          setDestFavorited(allFavs.some(f => f.user_id === user.id && f.item_id === destination.id && f.item_type === 'destination'));
        }
      }
    };
    checkFav();
  }, [user, destination, isFallbackMode]);

  const toggleDestFavorite = async () => {
    if (!user) { navigate('/auth', { state: { mode: 'signup', from: location.pathname } }); return; }
    if (destFavorited) {
      if (isFallbackMode) {
        const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
        const filtered = allFavs.filter(f => !(f.user_id === user.id && f.item_id === destination.id && f.item_type === 'destination'));
        localStorage.setItem('tripready_favorites', JSON.stringify(filtered));
      } else {
        try { 
          const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_id', destination.id).eq('item_type', 'destination'); 
          if (error) throw error;
        } catch (e) { 
          const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
          const filtered = allFavs.filter(f => !(f.user_id === user.id && f.item_id === destination.id && f.item_type === 'destination'));
          localStorage.setItem('tripready_favorites', JSON.stringify(filtered));
        }
      }
      setDestFavorited(false);
    } else {
      const newFav = { id: crypto.randomUUID(), user_id: user.id, item_id: destination.id, item_name: destination.name, item_type: 'destination', created_at: new Date().toISOString() };
      if (isFallbackMode) {
        const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
        allFavs.unshift(newFav);
        localStorage.setItem('tripready_favorites', JSON.stringify(allFavs));
      } else {
        try { 
          const { error } = await supabase.from('favorites').insert([newFav]); 
          if (error) throw error;
        } catch (e) { 
          const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
          allFavs.unshift(newFav);
          localStorage.setItem('tripready_favorites', JSON.stringify(allFavs));
        }
      }
      setDestFavorited(true);
    }
  };

  // Premium image hook moved below useGeoapifyTravel to leverage attractions data for iconic landmark selection
  const { isDark } = useTheme();

  // Curate and inject destinations array dynamically to prevent directory schema crash
  const mappedCategories = useMemo(() => {
    return travelCategories.map((cat) => {
      // Find all destinations in topDestinations matching this category ID
      const matching = topDestinations.filter(
        (d) => d.categoryIds && d.categoryIds.includes(cat.id)
      );

      // Sort matching destinations by rank (smaller rank is better / higher priority)
      const sortedMatching = [...matching].sort((a, b) => (a.rank || 9999) - (b.rank || 9999));
      
      // Extract their names and limit to top 18 for premium, clean UI layout
      let destinations = sortedMatching.map((d) => d.name).slice(0, 18);

      // Fallback if none found
      if (destinations.length === 0) {
        if (cat.id === 'nature') {
          destinations = ['Bali', 'Costa Rica', 'Norway', 'New Zealand', 'Amazon Rainforest', 'Hunza Valley'];
        } else if (cat.id === 'mountains') {
          destinations = ['Swiss Alps', 'Patagonia', 'Himalayas', 'Rocky Mountains', 'Andes', 'Mount Fuji', 'Dolomites', 'Kilimanjaro', 'Hunza Valley'];
        } else if (cat.id === 'beaches') {
          destinations = ['Bali', 'Santorini', 'Phuket', 'Cancún', 'Costa Rica'];
        } else if (cat.id === 'deserts') {
          destinations = ['Antarctic Desert', 'Sahara Desert', 'Atacama Desert', 'Namib Desert', 'Gobi Desert', "Rub' al Khali"];
        } else if (cat.id === 'historical') {
          destinations = ['Tokyo', 'Paris', 'Rome', 'London', 'Kyoto', 'Machu Picchu'];
        } else if (cat.id === 'cities') {
          destinations = ['Tokyo', 'Paris', 'London', 'Singapore', 'New York', 'Dubai'];
        } else if (cat.id === 'skyscrapers') {
          destinations = ['Tokyo', 'Dubai', 'Singapore', 'New York'];
        } else if (cat.id === 'forests') {
          destinations = ['Amazon Rainforest', 'Costa Rica'];
        } else {
          destinations = ['Bali', 'Paris', 'Tokyo'];
        }
      }

      return { ...cat, destinations };
    });
  }, []);

  const getCoordinates = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('tokyo') || lower.includes('japan')) return [35.6762, 139.6503];
    if (lower.includes('riyadh') || lower.includes('saudi')) return [24.7136, 46.6753];
    if (lower.includes('new york') || lower.includes('nyc')) return [40.7128, -74.006];
    if (lower.includes('london')) return [51.5074, -0.1278];
    if (lower.includes('paris')) return [48.8566, 2.3522];
    if (lower.includes('bali')) return [-8.4095, 115.1889];
    if (lower.includes('sydney')) return [-33.8688, 151.2093];
    if (lower.includes('cape town')) return [-33.9249, 18.4241];
    if (lower.includes('dubai')) return [25.2048, 55.2708];
    if (lower.includes('são paulo') || lower.includes('brazil')) return [-23.5505, -46.6333];
    if (lower.includes('rome') || lower.includes('italy')) return [41.9028, 12.4964];
    if (lower.includes('singapore')) return [1.3521, 103.8198];
    
    // Additional Category Destinations Mappings (to prevent dynamic geocoding lag)
    if (lower.includes('hunza')) return [36.3167, 74.6500];
    if (lower.includes('costa rica')) return [9.7489, -83.7534];
    if (lower.includes('norway')) return [62.0000, 7.0000];
    if (lower.includes('new zealand') || lower.includes('queenstown')) return [-45.0312, 168.6626];
    if (lower.includes('amazon') || lower.includes('manaus')) return [-3.1190, -60.0217];
    if (lower.includes('swiss alps') || lower.includes('zermatt') || lower.includes('interlaken')) return [46.0207, 7.7491];
    if (lower.includes('patagonia')) return [-50.3380, -72.2648];
    if (lower.includes('himalayas')) return [27.9881, 86.9250];
    if (lower.includes('rocky mountain')) return [40.3428, -105.6836];
    if (lower.includes('andes') || lower.includes('machu picchu') || lower.includes('cusco')) return [-13.1631, -72.5450];
    if (lower.includes('fuji')) return [35.3606, 138.7274];
    if (lower.includes('dolomite')) return [46.4337, 11.8462];
    if (lower.includes('kilimanjaro')) return [-3.0674, 37.3556];
    if (lower.includes('santorini')) return [36.3932, 25.4615];
    if (lower.includes('phuket')) return [7.8804, 98.3922];
    if (lower.includes('cancún') || lower.includes('cancun')) return [21.1619, -86.8515];
    if (lower.includes('antarctic')) return [-75.2509, 0.0000];
    if (lower.includes('sahara')) return [25.0000, 0.0000];
    if (lower.includes('atacama')) return [-23.8634, -69.1328];
    if (lower.includes('namib')) return [-24.8463, 15.8946];
    if (lower.includes('gobi')) return [44.0000, 105.0000];
    if (lower.includes('rub') || lower.includes('khali')) return [20.0000, 50.0000];
    if (lower.includes('kyoto')) return [35.0116, 135.7681];
    
    return [20.0, 0.0];
  };

  const [weather, setWeather] = useState(destination.weather);
  const [weatherSource, setWeatherSource] = useState('simulation');
  const [dailyForecast, setDailyForecast] = useState([
    { day: 'Monday', temp: '22°C / 15°C', condition: 'Sunny', suggestions: 'Excellent conditions for morning coastal walks. UV levels are very high; apply sun protection.' },
    { day: 'Tuesday', temp: '21°C / 14°C', condition: 'Partly Cloudy', suggestions: 'Great weather for urban sightseeing. Wind gusts may pick up slightly in the afternoon.' },
    { day: 'Wednesday', temp: '19°C / 12°C', condition: 'Showers', suggestions: 'Intermittent precipitation expected. Ideal afternoon for checking out the museum structures and food halls.' },
    { day: 'Thursday', temp: '20°C / 13°C', condition: 'Mild Breeze', suggestions: 'Calm and mild day. Optimal conditions for a hiking route or visiting structural landmarks.' },
    { day: 'Friday', temp: '23°C / 16°C', condition: 'Tropical Sun', suggestions: 'Exceptionally warm and bright day. Take plenty of hydration on outdoor walk corridors.' },
    { day: 'Saturday', temp: '24°C / 17°C', condition: 'Sunny & Perfect', suggestions: 'Peak weekend illumination. Exceptional evening sunset window for landscape views.' },
    { day: 'Sunday', temp: '22°C / 15°C', condition: 'Grey Overcast', suggestions: 'High clouds and low visibility. Perfect temperature for shopping arrays or a spa retreat.' }
  ]);
  const [activeWeatherDayIdx, setActiveWeatherDayIdx] = useState(0);
  const [savedAttractionIds, setSavedAttractionIds] = useState([]);
  const [itineraryAttractionIds, setItineraryAttractionIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const {
    geoCoords,
    attractions,
    hospitals,
    uiState,
    error,
    isBackgroundValidating,
    retryFetch,
    loadDetailsForPlace
  } = useGeoapifyTravel(destination);

  const { imageUrl: premiumImage } = usePremiumImage(destination.name, destination.country, null, attractions);
  destination.image = premiumImage;

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`saved-attractions-${destination.id}`) || '[]');
    setSavedAttractionIds(saved);
    const itin = JSON.parse(localStorage.getItem(`itinerary-attractions-${destination.id}`) || '[]');
    setItineraryAttractionIds(itin);
  }, [destination]);

  const toggleSaveAttraction = (attractionId) => {
    let saved = JSON.parse(localStorage.getItem(`saved-attractions-${destination.id}`) || '[]');
    if (saved.includes(attractionId)) {
      saved = saved.filter(id => id !== attractionId);
      showToast("Removed from saved attractions");
    } else {
      saved.push(attractionId);
      showToast("Saved to your trip!");
    }
    localStorage.setItem(`saved-attractions-${destination.id}`, JSON.stringify(saved));
    setSavedAttractionIds(saved);
  };

  const toggleItineraryAttraction = (attractionId) => {
    let itin = JSON.parse(localStorage.getItem(`itinerary-attractions-${destination.id}`) || '[]');
    if (itin.includes(attractionId)) {
      itin = itin.filter(id => id !== attractionId);
      showToast("Removed from itinerary");
    } else {
      itin.push(attractionId);
      showToast("Added to your itinerary!");
    }
    localStorage.setItem(`itinerary-attractions-${destination.id}`, JSON.stringify(itin));
    setItineraryAttractionIds(itin);
  };

  const focusOnMap = (lat, lng, name) => {
    const map = window.destinationLeafletMap;
    if (map) {
      map.setView([lat, lng], 15);
      if (window.destinationMapMarkers) {
        const marker = window.destinationMapMarkers.find(m => {
          const latlng = m.getLatLng();
          return Math.abs(latlng.lat - lat) < 0.0001 && Math.abs(latlng.lng - lng) < 0.0001;
        });
        if (marker) {
          marker.openPopup();
        }
      }
      document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const [liveRates, setLiveRates] = useState({});
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [hotelsSource, setHotelsSource] = useState('simulation');
  const [transitJourneys, setTransitJourneys] = useState([]);
  const [transitLoading, setTransitLoading] = useState(true);
  const [transitSource, setTransitSource] = useState('simulation');

  const activeWeather = useMemo(() => {
    if (dailyForecast && dailyForecast[activeWeatherDayIdx]) {
      const dayData = dailyForecast[activeWeatherDayIdx];
      const tempClean = dayData.temp.includes('/') ? dayData.temp.split('/')[0].trim() : dayData.temp;
      return {
        temp: tempClean,
        condition: dayData.condition
      };
    }
    return {
      temp: weather.temp,
      condition: weather.condition
    };
  }, [dailyForecast, activeWeatherDayIdx, weather]);

  destination.weather = {
    ...weather,
    temp: activeWeather.temp,
    condition: activeWeather.condition
  };

  const [visaChecked, setVisaChecked] = useState(false);
  const [visaNationality, setVisaNationality] = useState('United States');
  const [visaData, setVisaData] = useState({
    requirement: '',
    duration: '',
    color: 'yellow',
    criticalInfo: '',
    checklist: [],
    isLoading: false,
    isLive: false
  });
  const [mapHotspot, setMapHotspot] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsSource, setNewsSource] = useState('simulation');
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImg, setLightboxImg] = useState('');
  const { images: galleryImages, loading: loadingGallery } = useDestinationGallery(destination.name, destination.country);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (!galleryImages || galleryImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [galleryImages]);

  // Live Translation / Phrasebook states
  const [translationInput, setTranslationInput] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translationPhonetic, setTranslationPhonetic] = useState('');
  const [activePhraseCat, setActivePhraseCat] = useState('greetings');
  const [audioPlayingIndex, setAudioPlayingIndex] = useState(null);
  const [detectedLang, setDetectedLang] = useState('');
  const [originalLang, setOriginalLang] = useState('Auto-Detect');
  const [targetLang, setTargetLang] = useState('');
  const [lastUpdatedTime, setLastUpdatedTime] = useState('');

  // Secure Insurance Vault states
  const [insuranceProvider, setInsuranceProvider] = useState(localStorage.getItem(`insurance-provider-${destination.id}`) || '');
  const [insurancePolicy, setInsurancePolicy] = useState(localStorage.getItem(`insurance-policy-${destination.id}`) || '');
  const [insuranceContact, setInsuranceContact] = useState(localStorage.getItem(`insurance-contact-${destination.id}`) || '');
  const [insuranceSaved, setInsuranceSaved] = useState(!!localStorage.getItem(`insurance-provider-${destination.id}`));



  // PDF Guide Export states
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStepText, setDownloadStepText] = useState('');
  


  // Fetch live exchange rates from ExchangeRate-API
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('ExchangeRate-API failed');
      })
      .then(data => {
        if (data && data.rates) {
          const rates = { ...data.rates, USD: 1.0 };
          setLiveRates(rates);
          if (data.time_last_update_utc) {
            setLastUpdatedTime(new Date(data.time_last_update_utc).toLocaleString());
          } else {
            setLastUpdatedTime(new Date().toLocaleString());
          }
        }
      })
      .catch(err => {
        console.warn("Could not load live rates, utilizing database fallback:", err);
      });
  }, []);

  // Fetch live news from NewsAPI.org
  useEffect(() => {
    let active = true;
    setNewsLoading(true);
    
    async function loadNews() {
      try {
        const query = `${destination.name} ${destination.country} travel`;
        const res = await fetchLiveNews(query);
        if (active) {
          setAlerts(res.articles);
          setNewsSource(res.source);
          setNewsLoading(false);
        }
      } catch (err) {
        console.warn("Live news fetch failed, falling back to simulated advisories:", err);
        if (active) {
          const simulated = getDynamicAlerts(destination);
          setAlerts(simulated);
          setNewsSource('simulation');
          setNewsLoading(false);
        }
      }
    }

    loadNews();
    return () => {
      active = false;
    };
  }, [destination]);

  // Fetch live weather from Open-Meteo API (No key required)
  useEffect(() => {
    let active = true;
    setActiveWeatherDayIdx(0);
    
    async function loadWeather() {
      try {
        let coords = getDestinationCoords(destination);
        let lat = coords[0];
        let lng = coords[1];
        
        // Dynamically geocode if fallback [20.0, 0.0] is returned (ensures free, correct weather for custom entries)
        if (lat === 20.0 && lng === 0.0 && !destination.name.toLowerCase().includes('sahara') && !destination.name.toLowerCase().includes('desert')) {
          try {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination.name + ', ' + destination.country)}&count=1&language=en&format=json`;
            const geoRes = await fetch(geoUrl);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              if (geoData && geoData.results && geoData.results.length > 0) {
                lat = parseFloat(geoData.results[0].latitude);
                lng = parseFloat(geoData.results[0].longitude);
              }
            }
          } catch (geoErr) {
            console.warn("Dynamic weather geocoding failed, using static coordinates:", geoErr);
          }
        }
        
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Weather API Error: ${response.status}`);
        
        const data = await response.json();
        
        if (data && data.current && data.daily) {
          if (active) {
            // Map current weather
            const currentMapped = mapWmoCode(data.current.weather_code);
            const offsetHours = typeof data.utc_offset_seconds === 'number' ? data.utc_offset_seconds / 3600 : 0;
            const timezoneStr = data.timezone ? `${data.timezone} (UTC${offsetHours >= 0 ? '+' : ''}${offsetHours})` : destination.timezone;
            setWeather({
              temp: `${Math.round(data.current.temperature_2m)}°C`,
              condition: currentMapped.condition,
              humidity: `${data.current.relative_humidity_2m}%`,
              airQuality: destination.weather.airQuality || 'Excellent',
              timezone: timezoneStr
            });
            
            // Map 7-day forecast
            const forecastData = data.daily.time.map((dateStr, idx) => {
              const maxTemp = Math.round(data.daily.temperature_2m_max[idx]);
              const minTemp = Math.round(data.daily.temperature_2m_min[idx]);
              const mapped = mapWmoCode(data.daily.weather_code[idx]);
              return {
                day: getDayName(dateStr),
                temp: `${maxTemp}°C / ${minTemp}°C`,
                condition: mapped.condition,
                suggestions: getWeatherSuggestion(mapped.condition, maxTemp)
              };
            });
            
            setDailyForecast(forecastData);
            setWeatherSource('api');
          }
        }
      } catch (err) {
        console.warn("Live weather fetch failed, using simulated defaults:", err.message);
        if (active) {
          setWeather(destination.weather);
          setWeatherSource('simulation');
          // Reset forecast to simulated defaults
          const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const tempVal = parseInt(destination.weather.temp) || 20;
          const conditionVal = destination.weather.condition || 'Sunny';
          
          const defaultForecast = daysOfWeek.map((day, idx) => {
            const max = tempVal + Math.round((Math.sin(idx) * 3));
            const min = max - 6 - Math.round(Math.cos(idx) * 2);
            return {
              day,
              temp: `${max}°C / ${min}°C`,
              condition: conditionVal,
              suggestions: getWeatherSuggestion(conditionVal, max)
            };
          });
          setDailyForecast(defaultForecast);
        }
      }
    }

    loadWeather();
    return () => {
      active = false;
    };
  }, [destination]);

  // Fetch live hotels from Amadeus API
  useEffect(() => {
    let active = true;
    setHotelsLoading(true);
    
    async function loadHotels() {
      try {
        const res = await fetchLiveHotels(destination.name, destination.country);
        if (active) {
          setHotels(res.hotels);
          setHotelsSource(res.source);
          setHotelsLoading(false);
        }
      } catch (err) {
        console.warn("Hotel fetch failed, falling back to simulated base:", err);
        if (active) {
          setHotels(simulateHotels(destination.name, destination.country));
          setHotelsSource('simulation');
          setHotelsLoading(false);
        }
      }
    }

    loadHotels();
    return () => {
      active = false;
    };
  }, [destination]);

  // Fetch transit routes from Navitia API
  useEffect(() => {
    let active = true;
    setTransitLoading(true);

    async function loadTransit() {
      try {
        const coords = getDestinationCoords(destination);
        const lat = coords[0];
        const lng = coords[1];
        
        // Offset by ~0.03 for a representative transit routing from nearby hub
        const fromLat = lat - 0.03;
        const fromLng = lng - 0.03;

        const res = await fetchLiveTransitJourneys(fromLat, fromLng, lat, lng, destination.name);
        if (active) {
          setTransitJourneys(res.journeys);
          setTransitSource(res.source);
          setTransitLoading(false);
        }
      } catch (err) {
        console.warn("Transit fetch failed, falling back to simulated journeys:", err);
        if (active) {
          const coords = getDestinationCoords(destination);
          const lat = coords[0];
          const lng = coords[1];
          const simulated = simulateTransitJourneys(lat - 0.03, lng - 0.03, lat, lng, destination.name);
          setTransitJourneys(simulated);
          setTransitSource('simulation');
          setTransitLoading(false);
        }
      }
    }

    loadTransit();
    return () => {
      active = false;
    };
  }, [destination]);

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Check passport validity (min 6 months)', category: 'documents', checked: true },
    { id: 2, text: 'Apply for visa or print eVisa approval', category: 'documents', checked: false },
    { id: 3, text: 'Confirm hotel bookings & transfer details', category: 'documents', checked: false },
    { id: 4, text: 'Purchase comprehensive travel insurance', category: 'documents', checked: true },
    { id: 5, text: 'Adapter plug for local power sockets', category: 'electronics', checked: false },
    { id: 6, text: 'Power bank & charging cables', category: 'electronics', checked: true },
    { id: 7, text: 'Weather-appropriate clothing', category: 'clothing', checked: false },
    { id: 8, text: 'Comfortable walking shoes', category: 'clothing', checked: true },
    { id: 9, text: 'Local currency cash & active credit cards', category: 'finance', checked: false },
  ]);

  const checkedCount = checklist.filter((item) => item.checked).length;
  const progressPct = Math.round((checkedCount / checklist.length) * 100);

  const toggleChecklistItem = (itemId) => {
    setChecklist(
      checklist.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Currency Converter state
  const [fromAmount, setFromAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('JPY');
  const [convertedAmount, setConvertedAmount] = useState(0);

  const dynamicCurrencies = useMemo(() => {
    const currencyDetails = {
      'ISK': { name: 'Icelandic Króna', symbol: 'kr' },
      'NOK': { name: 'Norwegian Krone', symbol: 'kr' },
      'DKK': { name: 'Danish Krone', symbol: 'kr' },
      'EGP': { name: 'Egyptian Pound', symbol: 'E£' },
      'MXN': { name: 'Mexican Peso', symbol: '$' },
    };

    let list = [...currencies];
    if (toCurrency && !list.some(c => c.code === toCurrency)) {
      const info = currencyDetails[toCurrency] || { name: `${toCurrency} Currency`, symbol: toCurrency };
      list.push({ code: toCurrency, name: info.name, symbol: info.symbol, rate: 1 });
    }
    if (fromCurrency && !list.some(c => c.code === fromCurrency)) {
      const info = currencyDetails[fromCurrency] || { name: `${fromCurrency} Currency`, symbol: fromCurrency };
      list.push({ code: fromCurrency, name: info.name, symbol: info.symbol, rate: 1 });
    }
    return list;
  }, [toCurrency, fromCurrency]);

  const getRate = (code) => {
    if (liveRates[code]) return liveRates[code];
    return dynamicCurrencies.find((c) => c.code === code)?.rate || 1;
  };

  const getSymbol = (code) => {
    return dynamicCurrencies.find((c) => c.code === code)?.symbol || '$';
  };

  useEffect(() => {
    const fromRate = getRate(fromCurrency);
    const toRate = getRate(toCurrency);
    const converted = (fromAmount / fromRate) * toRate;
    const finalVal = converted.toFixed(2);
    setConvertedAmount(finalVal);
  }, [fromAmount, fromCurrency, toCurrency, liveRates, dynamicCurrencies]);

  useEffect(() => {
    const country = destination.country ? destination.country.toLowerCase() : '';
    const id = destination.id ? destination.id.toLowerCase() : '';
    if (id === 'tokyo' || id === 'kyoto' || country.includes('japan')) {
      setToCurrency('JPY');
    } else if (country.includes('united kingdom') || country.includes('uk') || id === 'london') {
      setToCurrency('GBP');
    } else if (country.includes('switzerland')) {
      setToCurrency('CHF');
    } else if (['paris', 'rome', 'barcelona', 'santorini', 'munich'].includes(id) || country.includes('france') || country.includes('italy') || country.includes('spain') || country.includes('greece') || country.includes('portugal') || country.includes('germany') || country.includes('netherlands') || country.includes('belgium') || country.includes('austria') || country.includes('ireland')) {
      setToCurrency('EUR');
    } else if (id === 'dubai' || country.includes('uae') || country.includes('emirates')) {
      setToCurrency('AED');
    } else if (id === 'bali' || country.includes('indonesia')) {
      setToCurrency('IDR');
    } else if (country.includes('saudi') || country.includes('arabia')) {
      setToCurrency('SAR');
    } else if (country.includes('pakistan')) {
      setToCurrency('PKR');
    } else if (country.includes('india')) {
      setToCurrency('INR');
    } else if (country.includes('thailand')) {
      setToCurrency('THB');
    } else if (country.includes('egypt')) {
      setToCurrency('EGP');
    } else if (country.includes('turkey') || country.includes('türkiye')) {
      setToCurrency('TRY');
    } else if (country.includes('australia')) {
      setToCurrency('AUD');
    } else if (country.includes('new zealand')) {
      setToCurrency('NZD');
    } else if (country.includes('korea')) {
      setToCurrency('KRW');
    } else if (country.includes('iceland')) {
      setToCurrency('ISK');
    } else if (country.includes('singapore')) {
      setToCurrency('SGD');
    } else if (country.includes('brazil')) {
      setToCurrency('BRL');
    } else if (country.includes('mexico')) {
      setToCurrency('MXN');
    } else if (country.includes('south africa')) {
      setToCurrency('ZAR');
    } else if (country.includes('norway')) {
      setToCurrency('NOK');
    } else if (country.includes('malaysia')) {
      setToCurrency('MYR');
    } else if (country.includes('china') || country.includes('hong kong')) {
      setToCurrency('CNY');
    } else {
      setToCurrency('USD');
    }
  }, [destination]);

  const getDynamicAlerts = (dest) => {
    const city = dest.name;
    const region = dest.region || 'Scenic Highlands';
    const country = dest.country || 'Global';
    
    return [
      { 
        id: 1, 
        title: `${country} Digital Tourist Entry Portal Synced`, 
        type: 'info', 
        desc: `The Ministry of Foreign Affairs in ${country} has officially integrated dynamic fast-track travel authorization gates, reducing transit arrivals checkpoint processing times to under 3 minutes.`, 
        time: '15 mins ago' 
      },
      { 
        id: 2, 
        title: `${city} Tourism Board Launches Green Corridors`, 
        type: 'event', 
        desc: `Official tourism announcements in ${city} verify the expansion of 15 new pedestrian-only cultural walks and eco-friendly heritage cycles winding through the historic core.`, 
        time: '2 hours ago' 
      },
      { 
        id: 3, 
        title: `Optimal Climate & Walkability Advisory`, 
        type: 'weather', 
        desc: `Local meteorological stations in ${city} report optimal clear skies and gentle regional breeze. Recommended sunset photography window open between 6:15 PM and 6:45 PM. Carry light hydration.`, 
        time: '4 hours ago' 
      },
      { 
        id: 4, 
        title: `Smart EV Electric Bus Ticketing System Active`, 
        type: 'info', 
        desc: `Local transport updates: City transit operators have launched complete mobile-tap ticketing across all electric buses linking ${city} historic landmarks and hotel zones.`, 
        time: '6 hours ago' 
      },
      { 
        id: 5, 
        title: `Tourist Precinct Safety & Security Sentinel`, 
        type: 'event', 
        desc: `Safety advisories: Security details have been reinforced in central crowded plazas and shopping alleys. Travelers are advised to secure personal pockets and utilize officially registered taxi applications.`, 
        time: '1 day ago' 
      }
    ];
  };

  const getDestinationCoords = (dest) => {
    const destName = (dest.name || '').toLowerCase().trim();
    const destCountry = (dest.country || '').toLowerCase().trim().replace(/ /g, '_');
    
    // Check city database by country
    const countryCities = cityDatabase[destCountry];
    if (countryCities) {
      const match = countryCities.find(c => c.name.toLowerCase() === destName);
      if (match) return [match.lat, match.lng];
    }
    
    // Check all cities globally
    for (const key in cityDatabase) {
      const match = cityDatabase[key].find(c => c.name.toLowerCase() === destName);
      if (match) return [match.lat, match.lng];
    }
    
    // Fallback
    return getCoordinates(dest.name);
  };

  const mapWmoCode = (code) => {
    if (code === 0) return { condition: 'Sunny', icon: 'Sun' };
    if ([1, 2, 3].includes(code)) return { condition: 'Partly Cloudy', icon: 'Cloud' };
    if ([45, 48].includes(code)) return { condition: 'Foggy', icon: 'Cloud' };
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { condition: 'Rainy', icon: 'CloudRain' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Snowy', icon: 'CloudSnow' };
    if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', icon: 'CloudRain' };
    return { condition: 'Pleasant', icon: 'Sun' };
  };

  const getWeatherSuggestion = (condition, tempMax) => {
    const cond = condition.toLowerCase();
    if (cond.includes('clear') || cond.includes('sunny')) {
      return `Beautiful sunny day. Excellent conditions for outdoor sightseeing and sightseeing tours. Recommended UV index is high, apply sun protection.`;
    }
    if (cond.includes('cloud') || cond.includes('pleasant') || cond.includes('mild') || cond.includes('fog')) {
      return `Mild, pleasant overcast conditions. Perfect for walking tours, taking photographs, and exploring local street food markets.`;
    }
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower') || cond.includes('thunderstorm')) {
      return `Intermittent rain or precipitation expected. Ideal day to explore museums, cafes, and indoor historical landmarks. Bring an umbrella.`;
    }
    if (cond.includes('snow') || cond.includes('freeze')) {
      return `Cold temperatures and snow showers. Wrap up in warm layers, and check transport schedules before traveling. Great day for alpine views.`;
    }
    return `Pleasant conditions. Dress in comfortable layers and carry light hydration during outdoor sightseeing routes.`;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Curated country regional mapping
  const isCountryDestination = (dest) => {
    const cId = dest.id.toLowerCase();
    return cId === 'switzerland' || cId === 'norway' || cId === 'new-zealand' || cId === 'costa-rica' || cId === 'pakistan' || cId === 'spain' || cId === 'thailand' || cId === 'turkey' || cId === 'egypt' || cId === 'italy' || cId === 'france' || cId === 'united-kingdom' || cId === 'saudi-arabia' || cId === 'japan' || cId === 'india' || cId === 'brazil';
  };

  const getCountryRegions = (dest) => {
    const cId = dest.id.toLowerCase();
    if (cId === 'switzerland') {
      return [
        { name: 'Zurich', type: 'Urban Luxury & Clockwork', time: 'Base City', activity: 'Explore the historic Bahnhofstrasse, lakeside plazas, and medieval Altstadt.' },
        { name: 'Interlaken', type: 'Adventure & Lakes Valley', time: '1.5 hrs by Train', activity: 'Skydive over Swiss lakes, ride cogwheel railways, and explore Lauterbrunnen waterfalls.' },
        { name: 'Zermatt', type: 'Alpine Peaks & Off-grid Sanctuary', time: '2 hrs by Train', activity: 'Hike near the majestic Matterhorn, ride the Gornergrat railway, and breathe carbon-free alpine air.' },
        { name: 'Geneva', type: 'Lakeside Science & Diplomacy', time: '2.5 hrs by Train', activity: 'Stroll past the massive Jet d\'Eau fountain, visit CERN, and tour watchmaking galleries.' }
      ];
    }
    if (cId === 'costa-rica') {
      return [
        { name: 'San José', type: 'Cultural Gateway', time: 'Base City', activity: 'Visit the National Theatre, explore local gold museums, and sample organic coffee.' },
        { name: 'Arenal Volcano', type: 'Thermal Springs & Volcanoes', time: '2.5 hrs by Road', activity: 'Hike active volcanic trails, traverse hanging forest bridges, and soak in natural hot springs.' },
        { name: 'Monteverde', type: 'Mystical Cloud Forest Canopy', time: '3 hrs by Road', activity: 'Embark on world-class zip-line adventures and explore pristine cloud forest biodiversity.' },
        { name: 'Manuel Antonio', type: 'Jungle Coast & White Sands', time: '3.5 hrs by Road', activity: 'Spot sloths and monkeys in the lush rainforest bordering spectacular white sand beaches.' }
      ];
    }
    if (cId === 'norway') {
      return [
        { name: 'Oslo', type: 'Modern Nordic Design', time: 'Base City', activity: 'Visit the Opera House, Vigeland Sculpture Park, and the new Munch Museum.' },
        { name: 'Bergen', type: 'Fjord Gateway & Hanseatic Wharf', time: '6 hrs by Scenic Rail', activity: 'Stroll through colorful Bryggen wooden alleys, ride the funicular, and scan dynamic fjords.' },
        { name: 'Flåm', type: 'Epic Glacier Fjord Valley', time: '2 hrs by Ferry/Rail', activity: 'Ride the world-famous Flåmsbana mountain train and explore sheer cliffs by boat.' },
        { name: 'Lofoten Islands', type: 'Arctic Peaks & Fishing Villages', time: '1.5 hrs by Flight', activity: 'Photograph red fisherman cabins, hike iconic ridge trails, and watch the Northern Lights.' }
      ];
    }
    if (cId === 'new-zealand') {
      return [
        { name: 'Auckland', type: 'Harbor Volcanic Hub', time: 'Base City', activity: 'Explore vibrant harbor cafes, scale the Sky Tower, and ferry to Waiheke wine estates.' },
        { name: 'Rotorua', type: 'Geothermal Wonders & Maori Culture', time: '3 hrs by Road', activity: 'Explore bubbling mud pools, active geysers, and experience traditional Maori Hangi dinners.' },
        { name: 'Queenstown', type: 'The Adventure Capital', time: '1.5 hrs by Flight', activity: 'Skydive, bungee jump, ride the Shotover jet, or ski in the Remarkables.' },
        { name: 'Milford Sound', type: 'Glacial Fjord Sanctuary', time: '4 hrs by Scenic Coach', activity: 'Cruise through majestic glacial fjords, towering waterfalls, and spot fur seals.' }
      ];
    }
    if (cId === 'japan') {
      return [
        { name: 'Tokyo', type: 'Neon Skyscrapers & Spiritual Shrines', time: 'Base City', activity: 'Explore Shibuya Crossing, ascend Tokyo Skytree, and stroll through Meiji Shrine and historic Senso-ji temple.' },
        { name: 'Kyoto', type: 'Ancient Temple & Bamboo Wilderness', time: '2 hrs by Bullet Train', activity: 'Visit Kinkaku-ji (Golden Pavilion), hike through Fushimi Inari Torii gates, and walk the Arashiyama Bamboo Grove.' },
        { name: 'Osaka', type: 'Neon Nightlife & Legendary Street Food', time: '30 mins by Rail', activity: 'Indulge in takoyaki and okonomiyaki in Dotonbori, explore Osaka Castle, and ride the Umeda Sky Ferris wheel.' },
        { name: 'Nara', type: 'UNESCO Giant Buddha & Sacred Bowing Deer', time: '45 mins by Rail', activity: 'Feed tame deer in Nara Park and marvel at the colossal bronze Buddha statue at Todai-ji Temple.' }
      ];
    }
    if (cId === 'india') {
      return [
        { name: 'Delhi', type: 'Metropolitan & Mughal Heritage Hub', time: 'Base City', activity: 'Visit the historic Red Fort, scale Qutub Minar, and dine on spicy parathas in Old Delhi Chandni Chowk.' },
        { name: 'Agra & Jaipur', type: 'The Iconic Golden Triangle Landmarks', time: '3-4 hrs by Expressway', activity: 'Witness the sunrise over the breathtaking Taj Mahal, explore Agra Fort, and tour the pink palaces of Jaipur.' },
        { name: 'Mumbai', type: 'Vibrant Coastal Boulevard & Financial Central', time: '2 hrs by Flight', activity: 'Walk through the Gateway of India, take a sunset drive along Marine Drive, and explore Elephanta Caves.' },
        { name: 'Goa & Kerala', type: 'Tropical Beaches & Tranquil Backwaters', time: '1.5 hrs by Flight', activity: 'Relax on sandy beaches, tour historic Portuguese churches in Goa, and cruise Kerala backwaters in a traditional houseboat.' }
      ];
    }
    if (cId === 'pakistan') {
      return [
        { name: 'Lahore', type: 'Mughal Architectural Capital & Food streets', time: 'Base City', activity: 'Visit the historic Badshahi Mosque, Lahore Fort, Liberty Market, and feast at Fort Road Food Street.' },
        { name: 'Islamabad', type: 'Scenic Green Foothills & Monumental Squares', time: '4 hrs by Motorway', activity: 'Breathe fresh air at Margalla Hills, visit Faisal Mosque, and capture monument panoramas at Shakarparian.' },
        { name: 'Hunza Valley', type: 'High Altitude Peaks & Ancient Silk Road Forts', time: '1 hr Flight + Road', activity: 'Explore Altit and Baltit forts, boat across turquoise Attabad Lake, and watch sunset at Eagle\'s Nest.' },
        { name: 'Skardu', type: 'Cold Desert Sand Dunes & High Mountain Lakes', time: '1 hr Scenic Flight', activity: 'Tour the Shangrila Resort, cross the Katpana Cold Desert, and drive through the high-altitude Deosai Plains.' }
      ];
    }
    return [
      { name: `Capital Region of ${dest.name}`, type: 'Metropolitan & Heritage Center', time: 'Base City', activity: 'Tour historical royal monuments, national galleries, and try authentic central street food.' }
    ];
  };

  const getLocalEvents = (dest) => {
    const lowerId = dest.id.toLowerCase();
    if (lowerId.includes('zurich') || lowerId.includes('swiss') || lowerId.includes('switzerland')) {
      return [
        { title: 'Zurich Film Festival', date: 'Sept 24 - Oct 4', type: 'Festival', desc: 'Premium international cinema premieres, glitzy red carpets, and director Q&A panels centered around Bellevue.' },
        { title: 'Street Parade Lake Zurich', date: 'August 8', type: 'Concert / Music', desc: 'The world\'s largest techno and electronic music street demonstration, winding across the lake basin with 100+ decorated trucks.' },
        { title: 'Zurich Christkindlimarkt', date: 'Nov 26 - Dec 24', type: 'Christmas Market', desc: 'Europe\'s largest indoor Christmas market located at the central railway terminal, featuring a 15-meter tall Swarovski crystal tree.' }
      ];
    }
    if (lowerId.includes('mecca') || lowerId.includes('makkah') || lowerId.includes('medina') || lowerId.includes('madinah')) {
      return [
        { title: 'Hajj Pilgrimage Season', date: 'Dynamic (Lunar Calendar)', type: 'Religious / Gathering', desc: 'The world\'s largest annual congregational assembly, strictly requiring electronic permit validation and biometric cards.' },
        { title: 'Souq Okaz Cultural Fair', date: 'October - November', type: 'Cultural / Market', desc: 'A historic re-creation of the ancient desert caravan bazaar, featuring traditional poetry, Bedouin crafts, and horse shows.' },
        { title: 'Ramadan Congregational Gatherings', date: 'Dynamic (Lunar Month)', type: 'Spiritual / Gathering', desc: 'Exceptional evening congregations, dynamic public fast-breaking tables, and extended public transit operating cycles.' }
      ];
    }
    if (lowerId.includes('amazon') || lowerId.includes('rainforest')) {
      return [
        { title: 'Parintins Folklore Festival', date: 'June 26 - June 28', type: 'Cultural Pageant', desc: 'An exceptionally vibrant annual celebration held along the Amazon river channels, featuring the theatrical Boi-Bumbá boat pageants.' },
        { title: 'World Forest Conservation Week', date: 'September 12 - 18', type: 'Eco Summit', desc: 'International sustainability workshops, guided bird-banding tours, and indigenous-led tree plantation circles in Manaus.' },
        { title: 'Pirarucu Sustainable Harvest Festival', date: 'October 5 - 10', type: 'Village Gathering', desc: 'Traditional river community gatherings celebrating the sustainable seasonal harvest of the giant Amazonian Pirarucu fish.' }
      ];
    }
    return [
      { title: `${dest.name} Summer Art Exhibition`, date: 'June - August', type: 'Exhibition', desc: 'Boutique street galleries and interactive modern art installations winding through the central historical plazas.' },
      { title: 'Local Farmers & Craft Market', date: 'Every Saturday', type: 'Market', desc: 'A lively, highly popular local market where regional farmers, bakers, and artisans gather to present organic delicacies and handmade crafts.' },
      { title: 'Historical Monuments Heritage Week', date: 'April 15 - 22', type: 'Festival / Closure', desc: 'Special free entry gates to all primary heritage sites, accompanied by nightly light projection shows and outdoor orchestras.' }
    ];
  };


  const isWildernessDestination = (dest) => {
    if (!dest || !dest.id) return false;
    const lowerId = dest.id.toLowerCase();
    return lowerId.includes('amazon') || 
           lowerId.includes('rainforest') || 
           lowerId.includes('wilderness') || 
           lowerId.includes('volcano') || 
           lowerId.includes('nature') || 
           lowerId.includes('hunza') || 
           lowerId.includes('skardu') || 
           lowerId.includes('zermatt') || 
           lowerId.includes('costa-rica');
  };

  const getDynamicHotels = (dest) => {
    const cLower = (dest.country || '').toLowerCase();
    const nLower = (dest.name || '').toLowerCase();
    const idLower = (dest.id || '').toLowerCase();

    // Tokyo / Japan
    if (idLower.includes('tokyo') || nLower.includes('tokyo')) {
      return [
        {
          name: 'Aman Tokyo',
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
          tag: 'Luxury Oasis',
          rating: 4.9,
          reviews: 840,
          desc: 'A sanctuary atop Otemachi Tower, blending traditional Japanese design with contemporary luxury.',
          amenities: ['Spa', 'Indoor Pool', 'Fine Dining', 'City Views'],
          price: 1200
        },
        {
          name: 'Park Hyatt Tokyo',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
          tag: 'Iconic Premium',
          rating: 4.8,
          reviews: 1250,
          desc: 'High-altitude luxury in Shinjuku, famous for its breathtaking panoramas and legendary New York Bar.',
          amenities: ['Sky Bar', 'Fitness Center', 'Library', 'Jazz Lounge'],
          price: 750
        },
        {
          name: 'The Tokyo Station Hotel',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
          tag: 'Heritage Classic',
          rating: 4.7,
          reviews: 980,
          desc: 'Located inside the iconic Tokyo Station building, offering classic European elegance and rich heritage.',
          amenities: ['Historic building', 'Free WiFi', 'Breakfast Buffet', 'Concierge'],
          price: 450
        }
      ];
    }

    // Switzerland / Zurich / Zermatt
    if (cLower.includes('switzerland') || idLower.includes('switzerland') || nLower.includes('zurich') || nLower.includes('zermatt')) {
      return [
        {
          name: 'The Dolder Grand (Zurich)',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
          tag: 'Palace Luxury',
          rating: 4.9,
          reviews: 720,
          desc: 'A city resort situated in elevated surroundings, offering views of Zurich, the lake, and the Alps.',
          amenities: ['4,000m² Spa', 'Michelin Star Dining', 'Art Collection', 'Helipad'],
          price: 950
        },
        {
          name: 'The Omnia (Zermatt)',
          image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=600&q=80',
          tag: 'Alpine Mountain Lodge',
          rating: 4.8,
          reviews: 410,
          desc: 'A contemporary interpretation of the classic mountain lodge, perched on a rock high above Zermatt.',
          amenities: ['Matterhorn Views', 'Wellness Center', 'Outdoor Whirlpool', 'Ski-in/Ski-out'],
          price: 680
        },
        {
          name: 'Hotel Schweizerhof (Lucerne)',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
          tag: 'Historic Luxury',
          rating: 4.7,
          reviews: 830,
          desc: 'A family-owned 5-star hotel directly on the shores of Lake Lucerne, rich in music and festival history.',
          amenities: ['Lake Views', 'Award-Winning Spa', 'Pianist Bar', 'Central Location'],
          price: 400
        }
      ];
    }

    // Paris / France
    if (cLower.includes('france') || nLower.includes('paris')) {
      return [
        {
          name: 'Ritz Paris',
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
          tag: 'Palace Luxury',
          rating: 4.9,
          reviews: 1100,
          desc: 'One of the world\'s most legendary hotels on Place Vendôme, famous for its French art de vivre.',
          amenities: ['Private Garden', 'Chanel Spa', 'Bar Hemingway', 'Michelin Dining'],
          price: 1500
        },
        {
          name: 'Hôtel Plaza Athénée',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
          tag: 'Fashion & Luxury',
          rating: 4.8,
          reviews: 950,
          desc: 'Located on Avenue Montaigne, featuring signature red awnings and breathtaking views of the Eiffel Tower.',
          amenities: ['Dior Spa', 'Eiffel Views', 'Courtyard Garden', 'Chauffeur Service'],
          price: 1100
        },
        {
          name: 'Les Bains Paris',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
          tag: 'Boutique Chic',
          rating: 4.6,
          reviews: 640,
          desc: 'A historic bathhouse turned bohemian-chic boutique hotel, capturing the artistic pulse of Le Marais.',
          amenities: ['Indoor Pool', 'Vibrant Bar', 'Art Gallery', 'Boutique Design'],
          price: 380
        }
      ];
    }

    // Dubai / UAE
    if (cLower.includes('emirates') || cLower.includes('uae') || nLower.includes('dubai')) {
      return [
        {
          name: 'Burj Al Arab Jumeirah',
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
          tag: 'Ultra Luxury',
          rating: 4.9,
          reviews: 1450,
          desc: 'The global icon of Arabian luxury, designed in the shape of a sail, offering world-class luxury service.',
          amenities: ['Private Beach', '24-karat Gold iPads', 'Helipad', 'Butler Service'],
          price: 1600
        },
        {
          name: 'One&Only The Palm',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
          tag: 'Boutique Resort',
          rating: 4.8,
          reviews: 610,
          desc: 'An exclusive beachside oasis on the peninsula of Palm Jumeirah, blending Moorish and Andalusian design.',
          amenities: ['Private Beach', 'Overwater Cabanas', 'Guerlain Spa', 'Michelin Chef Dining'],
          price: 900
        },
        {
          name: 'Rove Downtown Dubai',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
          tag: 'Modern Value',
          rating: 4.6,
          reviews: 3200,
          desc: 'A trendy, social hub located right in the heart of Downtown Dubai, steps from the Burj Khalifa.',
          amenities: ['Outdoor Pool', '24-hour Gym', 'Bespoke Art', 'Self-service Laundromat'],
          price: 120
        }
      ];
    }

    // London / UK
    if (cLower.includes('united kingdom') || cLower.includes('uk') || nLower.includes('london')) {
      return [
        {
          name: 'The Savoy',
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
          tag: 'Edwardian Classic',
          rating: 4.8,
          reviews: 1950,
          desc: 'A landmark of British luxury since 1889, located on the Thames, famous for afternoon tea and the American Bar.',
          amenities: ['Butler Service', 'Historic American Bar', 'Indoor Pool', 'River Views'],
          price: 850
        },
        {
          name: 'The Ned',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
          tag: 'Historic & Social',
          rating: 4.7,
          reviews: 1400,
          desc: 'Set in a historic former bank building, featuring a member\'s club, roof pool, and 10 dynamic restaurants.',
          amenities: ['Rooftop Pool', 'Vault Bar', 'Boxing Gym', 'Gourmet Food Hall'],
          price: 420
        },
        {
          name: 'CitizenM Tower of London',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
          tag: 'Modern Boutique',
          rating: 4.5,
          reviews: 4200,
          desc: 'Affordable luxury hotel overlooking the Tower of London, featuring high-tech room controls and rooftop bars.',
          amenities: ['Rooftop Terrace', 'Self Check-in', 'IPad Controls', '24/7 Dining'],
          price: 180
        }
      ];
    }

    // Pakistan / Lahore / Islamabad / Hunza
    if (cLower.includes('pakistan') || nLower.includes('lahore') || nLower.includes('islamabad') || nLower.includes('hunza')) {
      if (idLower.includes('hunza') || nLower.includes('hunza') || idLower.includes('skardu') || nLower.includes('skardu')) {
        return [
          {
            name: 'Luxus Hunza Attabad Lake Resort',
            image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=600&q=80',
            tag: 'Scenic Lakeside Lodge',
            rating: 4.8,
            reviews: 320,
            desc: 'Luxury chalets perched directly on the edge of the turquoise Attabad Lake, surrounded by Karakoram peaks.',
            amenities: ['Lakeside Deck', 'Jet Ski Rentals', 'Local Trout Dining', 'Private Balconies'],
            price: 220
          },
          {
            name: 'Serena Altit Fort Residence',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
            tag: 'Heritage Sanctuary',
            rating: 4.7,
            reviews: 150,
            desc: 'Restored royal guest rooms surrounding the historical Altit Fort garden orchard, managed by Serena Hotels.',
            amenities: ['Fort Access', 'Orchard Walks', 'Organic Tea Garden', 'Local Handicrafts Shop'],
            price: 180
          },
          {
            name: 'Shangrila Resort Skardu',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
            tag: 'Classic Alpine Cabins',
            rating: 4.6,
            reviews: 480,
            desc: 'The iconic "Heaven on Earth" resort situated around the heart-shaped Lower Kachura Lake, offering absolute alpine peace.',
            amenities: ['Lakeside Boating', 'Private Gardens', 'Fighter Jet Restaurant', 'Fruit Orchards'],
            price: 150
          }
        ];
      }
      return [
        {
          name: 'The Nishat Hotel Johar Town (Lahore)',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
          tag: 'Luxury Executive',
          rating: 4.7,
          reviews: 1250,
          desc: 'Premium modern hotel integrated with the Emporium Mall, offering state-of-the-art corporate suites.',
          amenities: ['Mall Access', 'Indoor Pool', 'Airport Shuttle', 'Executive Lounge'],
          price: 140
        },
        {
          name: 'Islamabad Serena Hotel',
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
          tag: 'Palace Heritage',
          rating: 4.8,
          reviews: 1800,
          desc: 'Combining traditional Islamic architecture with top-tier security and luxury gardens in the diplomatic enclave.',
          amenities: ['Diplomatic Security', 'Maisha Spa', 'Clay Tennis Courts', '6 Specialty Restaurants'],
          price: 210
        },
        {
          name: 'Pearl Continental Hotel Lahore',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
          tag: 'Business Icon',
          rating: 4.5,
          reviews: 2800,
          desc: 'A prominent landmark business hotel on Mall Road, offering comprehensive banqueting and dining options.',
          amenities: ['Outdoor Pool', 'Central Mall Road Location', 'Live Music Lounge', 'Free Airport Shuttle'],
          price: 110
        }
      ];
    }

    // Wilderness/Nature Default
    if (isWildernessDestination(dest)) {
      const name = dest.name || 'Wilderness';
      return [
        {
          name: `${name} Eco-Conservation Lodge`,
          image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=600&q=80',
          tag: 'Eco Luxury',
          rating: 4.8,
          reviews: 210,
          desc: 'Fully off-grid wooden chalets powered by solar energy, offering minimal footprint and expert nature guides.',
          amenities: ['Solar Power', 'Guided Safaris', 'Organic Farm Dining', 'Outdoor Deck'],
          price: 320
        },
        {
          name: `${name} Expedition Basecamp Domes`,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
          tag: 'Adventure Domes',
          rating: 4.6,
          reviews: 95,
          desc: 'High-performance geodesic dome pods situated inside prime conservation parameters, offering stargazing skies.',
          amenities: ['Heated Pods', 'Stargazing Roof', 'Expedition Kitchen', 'Satellite Comms'],
          price: 250
        },
        {
          name: `${name} Forest Treehouses`,
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
          tag: 'Canopy Boutique',
          rating: 4.7,
          reviews: 140,
          desc: 'Luxury treehouse villas suspended in the forest canopy, offering close contact with local fauna.',
          amenities: ['Suspended Deck', 'Outdoor Hot Tub', 'Wildlife Binoculars', 'Hammock Nets'],
          price: 290
        }
      ];
    }

    // Standard Default Fallback
    const name = dest.name || 'Central';
    return [
      {
        name: `The Grand ${name} Palace`,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
        tag: 'Luxury Premium',
        rating: 4.8,
        reviews: 920,
        desc: `The premier classic hotel of ${name}, offering grand suites, refined service, and convenient central landmark access.`,
        amenities: ['Rooftop Pool', 'Concierge Service', 'Luxury Spa', '24/7 Room Service'],
        price: 350
      },
      {
        name: `Hotel ${name} Cosmopolitan`,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        tag: 'Boutique Trendy',
        rating: 4.6,
        reviews: 640,
        desc: `A fashionable boutique sanctuary featuring modern loft styling, digital key systems, and a lively social atrium.`,
        amenities: ['City Skyline Views', 'Cocktail Lounge', 'Smart Room Tech', 'Bicycles Provided'],
        price: 220
      },
      {
        name: `${name} Central Transit Suites`,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
        tag: 'Strategic Value',
        rating: 4.4,
        reviews: 1450,
        desc: `Clean, modern transit rooms located directly adjacent to primary urban transit intersections and food plazas.`,
        amenities: ['Free High-Speed Wifi', '24-hour Gym', 'Self Laundry Access', 'Soundproof Rooms'],
        price: 110
      }
    ];
  };

  const getDestinationLanguage = (dest) => {
    if (!dest) return 'English';
    const cLower = (dest.country || '').toLowerCase();
    const nLower = (dest.name || '').toLowerCase();
    const idLower = (dest.id || '').toLowerCase();

    if (cLower.includes('pakistan') || idLower.includes('pakistan') || nLower.includes('lahore') || nLower.includes('islamabad')) return 'Urdu';
    if (cLower.includes('saudi') || cLower.includes('arabia') || cLower.includes('egypt') || idLower.includes('egypt') || nLower.includes('mecca') || nLower.includes('riyadh')) return 'Arabic';
    if (cLower.includes('japan') || idLower.includes('japan') || nLower.includes('tokyo') || nLower.includes('kyoto')) return 'Japanese';
    if (cLower.includes('france') || idLower.includes('france') || nLower.includes('paris')) return 'French';
    if (cLower.includes('italy') || idLower.includes('italy') || nLower.includes('rome') || nLower.includes('florence')) return 'Italian';
    if (cLower.includes('spain') || idLower.includes('spain') || nLower.includes('madrid') || nLower.includes('barcelona')) return 'Spanish';
    if (cLower.includes('costa') || idLower.includes('costa-rica') || cLower.includes('mexico')) return 'Spanish';
    if (cLower.includes('brazil') || idLower.includes('brazil') || nLower.includes('rio')) return 'Portuguese';
    if (cLower.includes('germany') || idLower.includes('germany') || cLower.includes('switzerland') || idLower.includes('switzerland') || nLower.includes('zurich')) return 'German';
    if (cLower.includes('thailand') || idLower.includes('thailand') || nLower.includes('bangkok')) return 'Thai';
    if (cLower.includes('turkey') || idLower.includes('turkey') || nLower.includes('istanbul')) return 'Turkish';
    if (cLower.includes('norway') || idLower.includes('norway') || nLower.includes('oslo')) return 'Norwegian';
    if (cLower.includes('india') || idLower.includes('india') || nLower.includes('delhi')) return 'Hindi';
    
    return 'English';
  };

  const getCuratedPhrases = (lang) => {
    const lLower = (lang || '').toLowerCase();
    
    if (lLower === 'urdu') {
      return [
        { eng: 'Hello / Peace be upon you', loc: 'Assalam-o-Alaikum (السلام علیکم)', ph: 'As-sah-lam o-alay-koom' },
        { eng: 'Thank you', loc: 'Shukriya (شکریہ)', ph: 'Shook-ree-yah' },
        { eng: 'How much is this?', loc: 'Yeh kitnay ka hai? (یہ کتنے کا ہے؟)', ph: 'Yeh kit-nay ka hai' },
        { eng: 'Where is the bathroom?', loc: 'Bathroom kahan hai? (باتھ روم کہاں ہے؟)', ph: 'Bath-room kahan hai' },
        { eng: 'Please help me', loc: 'Baraye meharbani meri madad karein (براہ مہربani میری madad کریں)', ph: 'Ba-ra-ye me-har-ba-nee me-ree ma-dad ka-rayn' }
      ];
    }
    if (lLower === 'arabic') {
      return [
        { eng: 'Hello', loc: 'Marhaban (مرحباً)', ph: 'Mar-ha-ban' },
        { eng: 'Thank you', loc: 'Shukran (شكراً)', ph: 'Shook-ran' },
        { eng: 'How much is this?', loc: 'Bikam hadha? (بكم هذا؟)', ph: 'Bi-kam ha-dha' },
        { eng: 'Where is the bathroom?', loc: 'Ayna al-hammam? (أين الحمام؟)', ph: 'Ay-nah al-ham-mam' },
        { eng: 'Please help me', loc: 'Min fadlik sa\'iduni (من فضلك ساعدوني)', ph: 'Min fad-lik sa-ee-doo-nee' }
      ];
    }
    if (lLower === 'japanese') {
      return [
        { eng: 'Hello', loc: 'Konnichiwa (こんにちは)', ph: 'Kon-nee-chee-wah' },
        { eng: 'Thank you', loc: 'Arigatou gozaimasu (ありがとうございます)', ph: 'Ah-ree-gah-toh go-zai-mas' },
        { eng: 'How much is this?', loc: 'Kore wa ikura desu ka? (これはいくらですか？)', ph: 'Ko-reh wa ee-koo-rah des kah' },
        { eng: 'Where is the bathroom?', loc: 'Toire wa doko desu ka? (トイレはどこですか？)', ph: 'Toy-reh wa do-ko des kah' },
        { eng: 'Please help me', loc: 'Tasukete kudasai (助けてください)', ph: 'Tah-soo-keh-teh koo-dah-sai' }
      ];
    }
    if (lLower === 'french') {
      return [
        { eng: 'Hello', loc: 'Bonjour', ph: 'Bon-zhoor' },
        { eng: 'Thank you', loc: 'Merci beaucoup', ph: 'Merci beaucoup' },
        { eng: 'How much is this?', loc: 'Combien ça coûte?', ph: 'Kom-byan sah koot' },
        { eng: 'Where is the bathroom?', loc: 'Où sont les toilettes?', ph: 'Oo son lay twah-let' },
        { eng: 'Please help me', loc: "S'il vous plaît, aidez-moi", ph: 'Seel voo play, ay-day mwah' }
      ];
    }
    if (lLower === 'italian') {
      return [
        { eng: 'Hello / Bye', loc: 'Ciao', ph: 'Chow' },
        { eng: 'Thank you', loc: 'Grazie mille', ph: 'Graht-zyee meel-leh' },
        { eng: 'How much is this?', loc: 'Quanto costa questo?', ph: 'Kwan-toh kos-tah kwes-toh' },
        { eng: 'Where is the bathroom?', loc: 'Dov\'è il bagno?', ph: 'Doh-veh eel bah-nyoh' },
        { eng: 'Please help me', loc: 'Per favore, mi aiuti', ph: 'Pair fah-voh-reh, mee eye-oo-tee' }
      ];
    }
    if (lLower === 'spanish') {
      return [
        { eng: 'Hello', loc: 'Hola', ph: 'Oh-lah' },
        { eng: 'Thank you', loc: 'Muchas gracias', ph: 'Moo-chas grah-syas' },
        { eng: 'How much is this?', loc: '¿Cuánto cuesta esto?', ph: 'Kwan-toh kwes-tah es-toh' },
        { eng: 'Where is the bathroom?', loc: '¿Dónde está el java?', ph: 'Don-deh es-tah eel bah-nyoh' },
        { eng: 'Please help me', loc: 'Por favor, ayúdeme', ph: 'Por fah-vor, ah-yoo-deh-meh' }
      ];
    }
    if (lLower === 'portuguese') {
      return [
        { eng: 'Hello', loc: 'Olá / Tudo bem?', ph: 'Oh-lah / Too-doo baym' },
        { eng: 'Thank you', loc: 'Muito obrigado', ph: 'Moo-ee-toh oh-bree-gah-doh' },
        { eng: 'How much is this?', loc: 'Quanto custa isto?', ph: 'Kwan-toh koos-tah ees-toh' },
        { eng: 'Where is the bathroom?', loc: 'Onde fica o banheiro?', ph: 'On-deh fee-kah oo bah-nyay-roo' },
        { eng: 'Please help me', loc: 'Por favor, ajude-me', ph: 'Por fah-vor, ah-joo-deh-meh' }
      ];
    }
    if (lLower === 'german') {
      return [
        { eng: 'Hello', loc: 'Guten Tag', ph: 'Goo-ten Tahg' },
        { eng: 'Thank you', loc: 'Vielen Dank', ph: 'Fee-len Dank' },
        { eng: 'How much is this?', loc: 'Wie viel kostet das?', ph: 'Vee feel kos-tet das' },
        { eng: 'Where is the bathroom?', loc: 'Wo ist die Toilette?', ph: 'Voh ist dee toy-let-te' },
        { eng: 'Please help me', loc: 'Bitte helfen Sie mir', ph: 'Bit-te hel-fen zee meer' }
      ];
    }
    if (lLower === 'thai') {
      return [
        { eng: 'Hello', loc: 'Sawasdee khrap/kha (สวัสดีครับ/ค่ะ)', ph: 'Sah-wahd-dee krap/kah' },
        { eng: 'Thank you', loc: 'Khop khun khrap/kha (ขอบคุณครับ/ค่ะ)', ph: 'Kop-koon krap/kah' },
        { eng: 'How much is this?', loc: 'Nee tao rai? (นี่เท่าไหร่)', ph: 'Nee tao rai' },
        { eng: 'Where is the bathroom?', loc: 'Hong nam yoo tee nai? (ห้องน้ำอยู่ที่ไหน)', ph: 'Hong-nam yoo tee nai' },
        { eng: 'Please help me', loc: 'Chuai duai (ช่วยด้วย)', ph: 'Choo-ay doo-ay' }
      ];
    }
    if (lLower === 'turkish') {
      return [
        { eng: 'Hello', loc: 'Merhaba', ph: 'Mair-hah-bah' },
        { eng: 'Thank you', loc: 'Teşekkür ederim', ph: 'Teh-sheh-kure eh-deh-rim' },
        { eng: 'How much is this?', loc: 'Bu ne kadar?', ph: 'Boo neh kah-dahr' },
        { eng: 'Where is the bathroom?', loc: 'Tuvalet nerede?', ph: 'Too-vah-let neh-reh-deh' },
        { eng: 'Please help me', loc: 'Lütfen bana yardım edin', ph: 'Loot-fen bah-nah yahr-dum eh-din' }
      ];
    }
    if (lLower === 'norwegian') {
      return [
        { eng: 'Hello', loc: 'Hallo / Hei', ph: 'Hal-lo / Hay' },
        { eng: 'Thank you', loc: 'Tusen takk', ph: 'Too-sen tahk' },
        { eng: 'How much is this?', loc: 'Hvor mye koster dette?', ph: 'Hvoor mee-eh kos-ter det-teh' },
        { eng: 'Where is the bathroom?', loc: 'Hvor er toalettet?', ph: 'Hvoor air toh-ah-let-teh' },
        { eng: 'Please help me', loc: 'Vennligst hjelp meg', ph: 'Ven-ligst yelp meg' }
      ];
    }
    if (lLower === 'hindi') {
      return [
        { eng: 'Hello', loc: 'Namaste (नमस्ते)', ph: 'Nah-mah-stay' },
        { eng: 'Thank you', loc: 'Dhanyavaad (धन्यवाद)', ph: 'Dhan-yah-vahd' },
        { eng: 'How much is this?', loc: 'Yeh kitne ka hai? (यह कितने का है?)', ph: 'Yeh kit-nay ka hai' },
        { eng: 'Where is the bathroom?', loc: 'Toilet kahan hai? (टॉयलेट कहाँ है?)', ph: 'Toy-let kahan hai' },
        { eng: 'Please help me', loc: 'Kripya meri madad karein (कृपया मेरी मदद करें)', ph: 'Krip-yah me-ree ma-dad ka-rayn' }
      ];
    }
    // English default
    return [
      { eng: 'Hello', loc: 'Hello', ph: 'Heh-loh' },
      { eng: 'Thank you', loc: 'Thank you', ph: 'Thangk yoo' },
      { eng: 'How much is this?', loc: 'How much is this?', ph: 'How much is this' },
      { eng: 'Where is the bathroom?', loc: 'Where is the bathroom?', ph: 'Where is the bathroom' },
      { eng: 'Please help me', loc: 'Please help me', ph: 'Pleez help me' }
    ];
  };

  const handleTranslationSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.preventDefault) e.preventDefault();
    if (!translationInput.trim()) return;

    const query = translationInput.trim();
    const destLang = getDestinationLanguage(destination);
    
    // UI Feedback: Show loading state
    setTranslatedText('Translating with AI...');
    setTranslationPhonetic('Syncing conversational dialect...');
    setOriginalLang('Auto-Detect');
    setDetectedLang('Detecting...');
    setTargetLang(destLang);

    // Language Code Map for Google Translate Single API
    const langMap = {
      arabic: 'ar',
      german: 'de',
      portuguese: 'pt',
      japanese: 'ja',
      italian: 'it',
      spanish: 'es',
      thai: 'th',
      indonesian: 'id',
      urdu: 'ur',
      english: 'en',
      french: 'fr',
      hindi: 'hi',
      chinese: 'zh'
    };

    const targetLangCode = langMap[destLang.toLowerCase()] || 'en';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Google Translate API failed");
      const data = await response.json();
      
      if (data && data[0]) {
        const translated = data[0].map(s => s[0]).join('');
        const detectedCode = data[2] || 'en';
        
        // Full ISO Code to Name Map for UI Display
        const isoMap = {
          'en': 'English',
          'es': 'Spanish',
          'fr': 'French',
          'de': 'German',
          'it': 'Italian',
          'pt': 'Portuguese',
          'ja': 'Japanese',
          'zh': 'Chinese',
          'ar': 'Arabic',
          'ur': 'Urdu',
          'hi': 'Hindi',
          'ru': 'Russian',
          'ko': 'Korean',
          'tr': 'Turkish',
          'nl': 'Dutch'
        };
        
        const detectedName = isoMap[detectedCode.toLowerCase()] || detectedCode.toUpperCase();
        
        setTranslatedText(translated);
        setDetectedLang(detectedName);
        setTranslationPhonetic("Live Audio Pronunciation Sync Ready");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("Google Translate client failed, utilizing offline fallback:", err);
      // Let's implement the offline fallback search in the pre-defined dictionary
      const lowerInput = query.toLowerCase();
      const dict = {
        arabic: {
          'hello': { tr: 'Marhaban (مرحباً)', ph: 'Mar-ha-ban' },
          'thank you': { tr: 'Shukran (شكراً)', ph: 'Shook-ran' },
          'where is the hotel': { tr: 'Ayna al-funduq? (أين الفندق؟)', ph: 'Ay-nah al-fun-duq' },
          'where is the toilet': { tr: 'Ayna al-hammam? (أين الحمام؟)', ph: 'Ay-nah al-ham-mam' },
          'help': { tr: 'Sa\'iduni! (ساعدونی!)', ph: 'Sa-ee-doo-nee' },
          'default_fallback': { tr: 'Ana astakshif hadha al-makan al-jamil. (أنا أستكشف هذا المكان الجميل.)', ph: 'Ana as-tak-shif' }
        },
        german: {
          'hello': { tr: 'Guten Tag', ph: 'Goo-ten Tahg' },
          'thank you': { tr: 'Danke schön', ph: 'Dan-keh shoen' },
          'where is the hotel': { tr: 'Wo ist das Hotel?', ph: 'Voh ist das hoh-tel' },
          'where is the toilet': { tr: 'Wo ist die Toilette?', ph: 'Voh ist dee toy-let-te' },
          'help': { tr: 'Ich brauche Hilfe!', ph: 'Ich brow-che' },
          'default_fallback': { tr: 'Ich erkunde diesen wunderschönen Ort.', ph: 'Ich er-koon-deh' }
        },
        japanese: {
          'hello': { tr: 'Konnichiwa (こんにちは)', ph: 'Kon-nee-chee-wah' },
          'thank you': { tr: 'Arigatou gozaimasu (ありがとうございます)', ph: 'Ah-ree-gah-toh' },
          'where is the hotel': { tr: 'Hoteru wa doko desu ka? (ホテルはどこですか？)', ph: 'Hoh-teh-roo' },
          'where is the toilet': { tr: 'Toire wa doko desu ka? (トイレはどこですか？)', ph: 'Toy-reh' },
          'help': { tr: 'Tasukete kudasai! (助けてください！)', ph: 'Tah-soo-keh-teh' },
          'default_fallback': { tr: 'Kono utsukushii basho o tansaku shite imasu.', ph: 'Kono' }
        },
        urdu: {
          'hello': { tr: 'Assalam-o-Alaikum (السلام علیکم)', ph: 'As-sah-lam o-alay-koom' },
          'thank you': { tr: 'Shukriya (شکریہ)', ph: 'Shook-ree-yah' },
          'where is the hotel': { tr: 'Hotel kahan hai? (ہوٹل کہاں ہے؟)', ph: 'Ho-tel' },
          'where is the toilet': { tr: 'Bathroom kahan hai? (باتھ روم کہاں ہے؟)', ph: 'Bath-room' },
          'help': { tr: 'Madad karo! (مدد کرو!)', ph: 'Madad' },
          'default_fallback': { tr: 'Main iss khoobsurat jagah ki sair kar raha hoon.', ph: 'Main' }
        }
      };

      const langDict = dict[destLang.toLowerCase()];
      let matchedKey = 'default_fallback';
      if (langDict) {
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) matchedKey = 'hello';
        else if (lowerInput.includes('thank')) matchedKey = 'thank you';
        else if (lowerInput.includes('hotel')) matchedKey = 'where is the hotel';
        else if (lowerInput.includes('toilet') || lowerInput.includes('bathroom')) matchedKey = 'where is the toilet';
        else if (lowerInput.includes('help')) matchedKey = 'help';
      }
      
      const res = langDict ? langDict[matchedKey] : { tr: query, ph: 'Local Sync active' };
      setTranslatedText(res.tr);
      setDetectedLang('English');
      setTranslationPhonetic(res.ph);
    }
  };

  // Secure Insurance Card handlers
  const handleSaveInsurance = (e) => {
    e.preventDefault();
    localStorage.setItem(`insurance-provider-${destination.id}`, insuranceProvider);
    localStorage.setItem(`insurance-policy-${destination.id}`, insurancePolicy);
    localStorage.setItem(`insurance-contact-${destination.id}`, insuranceContact);
    setInsuranceSaved(true);
  };

  const handleClearInsurance = () => {
    localStorage.removeItem(`insurance-provider-${destination.id}`);
    localStorage.removeItem(`insurance-policy-${destination.id}`);
    localStorage.removeItem(`insurance-contact-${destination.id}`);
    setInsuranceProvider('');
    setInsurancePolicy('');
    setInsuranceContact('');
    setInsuranceSaved(false);
  };



  // PDF Guide Export states & timers
  const triggerPdfDownload = () => {
    setShowDownloadModal(true);
    setDownloadProgress(10);
    setDownloadStepText('Initializing PDF city guide components...');
    
    setTimeout(() => {
      setDownloadProgress(40);
      setDownloadStepText('Setting up weather and location details...');
      
      setTimeout(() => {
        setDownloadProgress(75);
        setDownloadStepText('Packaging local emergency directories and translation keys...');
        
        setTimeout(() => {
          setDownloadProgress(100);
          setDownloadStepText('Guide compiled successfully! Opening print engine...');
          
          setTimeout(() => {
            setShowDownloadModal(false);
            window.print();
          }, 800);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const localEvents = getLocalEvents(destination);

  // Map Hotspots
  const hotspotAttractions = attractions && attractions.length >= 3 
    ? attractions.slice(0, 3).map(a => a.name) 
    : (destination.attractions || []);

  const mapHotspots = [
    { id: 1, name: hotspotAttractions[0] || 'Historical Landmark', x: '35%', y: '45%', desc: 'Centuries-old architectural masterwork offering majestic photo panoramas.' },
    { id: 2, name: hotspotAttractions[1] || 'Shopping Street', x: '55%', y: '30%', desc: 'Bustling modern district featuring high-end gourmet dining and fashion boutiques.' },
    { id: 3, name: hotspotAttractions[2] || 'Scenic Park', x: '70%', y: '60%', desc: 'Calming green getaway with tranquil ponds, walking routes, and scenic fields.' },
  ];

  // Custom Visa nationalities check
  const handleVisaCheck = async (e) => {
    e.preventDefault();
    setVisaChecked(true);
    setVisaData(prev => ({ ...prev, isLoading: true }));
    
    try {
      const destCountry = destination.country || 'Switzerland';
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await fetchLiveVisaRequirement(visaNationality, destCountry, todayStr);
      setVisaData({
        requirement: res.visa.requirement,
        duration: res.visa.duration,
        color: res.visa.color,
        criticalInfo: res.visa.criticalInfo,
        checklist: res.visa.checklist || simulateVisaRequirement(visaNationality, destCountry).checklist,
        isLoading: false,
        isLive: res.source === 'api' || res.source === 'cache'
      });
    } catch (err) {
      const destCountry = destination.country || 'Switzerland';
      const sim = simulateVisaRequirement(visaNationality, destCountry);
      setVisaData({
        requirement: sim.requirement,
        duration: sim.duration,
        color: sim.color,
        criticalInfo: sim.criticalInfo,
        checklist: sim.checklist,
        isLoading: false,
        isLive: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-body overflow-x-hidden transition-colors duration-500">
      <div className="print:hidden">
      
      {/* ═══════════════════════════════════════════════════════════════
           1. DESTINATION HERO BANNER (Cinematic Backdrop)
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-neutral-900 dark:bg-black">
        {/* Cinematic Backdrop Image with slow zoom slideshow */}
        <div className="absolute inset-0 z-0 select-none w-full h-full">
          {galleryImages && galleryImages.length > 0 ? (
            galleryImages.map((img, idx) => (
              <ImageWithWatermark
                key={idx}
                src={img}
                alt={`${destination.name} backdrop ${idx}`}
                className="w-full h-full object-cover"
                wrapperClassName={`absolute inset-0 w-full h-full transform transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlideIndex ? 'opacity-75 dark:opacity-50 z-10 scale-105' : 'opacity-0 z-0 scale-100'
                } animate-scale-slow`}
              />
            ))
          ) : (
            <ImageWithWatermark
              src={getCityImage(destination.name, destination.country)}
              alt={destination.name}
              className="w-full h-full object-cover"
              wrapperClassName="absolute inset-0 w-full h-full opacity-75 dark:opacity-50 animate-scale-slow transform scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 z-20" />
        </div>

        {/* Dynamic Weather Particles Layer */}
        <WeatherEffect condition={destination.weather.condition} />

        {/* Content Overlay */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16">
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            
            {/* Title & Core Summary */}
            <div className="lg:col-span-7 space-y-5 text-left text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white text-xs font-medium backdrop-blur-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                <Compass className="w-3.5 h-3.5 text-[var(--accent)] animate-spin-slow" />
                <span className="tracking-wide">Destination Discovery #{destination.rank}</span>
              </div>
              
              <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.75)] flex flex-wrap items-center gap-4">
                <span>{destination.name}</span>
                <button
                  onClick={toggleDestFavorite}
                  className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 ${destFavorited ? 'bg-red-500/80 border-2 border-red-400/50 shadow-lg shadow-red-500/30' : 'bg-white/10 border-2 border-white/20 hover:bg-white/20 hover:border-white/30'}`}
                  title={destFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-5 h-5 transition-all duration-300 ${destFavorited ? 'text-white fill-white scale-110' : 'text-white/80'}`} />
                </button>
              </h1>
              
              <p className="text-base sm:text-lg text-neutral-100 dark:text-neutral-200 max-w-2xl font-light leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                {destination.description}
              </p>
            </div>

            {/* Premium AI Dashboard Card */}
            <div className="lg:col-span-5 w-full">
              <div className="glass-card p-6 sm:p-7 relative overflow-hidden">
                {/* Accent indicator line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--accent)]" />
                
                <h3 className="text-xs font-heading uppercase tracking-wider text-[var(--accent)] mb-4 flex items-center justify-between font-bold">
                  <span>AI Travel Dashboard</span>
                  <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl text-left">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">Current Temp</p>
                    <p className="text-lg font-bold flex items-center gap-1.5 mt-1 font-heading text-[var(--text-primary)]">
                      <Sun className="w-4 h-4 text-[var(--accent)]" />
                      {weather.temp || destination.weather.temp}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl text-left">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">Time Zone</p>
                    <p className="text-sm font-semibold mt-1.5 text-[var(--text-primary)] truncate">{weather.timezone || destination.timezone}</p>
                  </div>
                  
                  <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl text-left">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">Safety Index</p>
                    <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)]">
                      <Shield className="w-3 h-3 text-[var(--accent)]" /> {destination.safety}
                    </span>
                  </div>
                  
                  <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl text-left">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">Best Season</p>
                    <p className="text-xs font-semibold mt-2 text-[var(--text-primary)] truncate" title={destination.bestTime}>{destination.bestTime}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--border)] flex flex-wrap gap-4 items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Est. Daily Budget</span>
                    <p className="text-xl font-heading font-normal text-[var(--text-primary)] mt-0.5">{destination.budget.daily} <span className="text-xs font-light text-[var(--text-secondary)]">/ day</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={triggerPdfDownload}
                      className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-premium"
                    >
                      <Download className="w-3.5 h-3.5 text-[var(--accent)] animate-bounce-subtle" />
                      <span>PDF Guide</span>
                    </button>
                    <Link
                      to="/budget-planner"
                      className="btn-sunset px-4 py-2.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-premium"
                    >
                      <span>Finances</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Location Watermark bottom right */}
        <div className="absolute bottom-8 right-8 z-30 select-none pointer-events-none text-right hidden md:block animate-fade-in">
          <span className="text-[9px] font-mono tracking-[0.2em] text-white/40 block uppercase leading-none">LANDSCAPE FRAMEWAY</span>
          <span className="font-heading text-lg font-light text-white/80 mt-1.5 block leading-tight tracking-wide drop-shadow-lg">
            {destination.name}, {destination.country}
          </span>
        </div>
      </section>

      {/* ─── Minimal Segmented Navigator ─── */}
      <div className="sticky top-20 z-40 w-full bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)] py-4 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth justify-start md:justify-center text-xs">
          {[
            { id: 'weather', label: 'Weather', icon: Sun },
            { id: 'visa', label: 'Visa', icon: Globe },
            { id: 'safety', label: 'Safety Protocols', icon: Shield },
            { id: 'must-visit', label: 'Attractions', icon: MapPin },
            { id: 'map', label: 'Geomap Simulator', icon: Map },
            { id: 'hotels', label: 'Luxury Stays', icon: Building2 },
            { id: 'checklist', label: 'AI Packing', icon: CheckSquare },
            { id: 'news', label: 'Alerts Feed', icon: Info },
            { id: 'currency', label: 'Currency Exchange', icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                const target = document.getElementById(tab.id);
                if (target) {
                  const offset = 120;
                  const bodyRect = document.body.getBoundingClientRect().top;
                  const elementRect = target.getBoundingClientRect().top;
                  const elementPosition = elementRect - bodyRect;
                  const offsetPosition = elementPosition - offset;
                  
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all whitespace-nowrap font-medium"
            >
              <tab.icon className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
           2. CINEMATIC AI WEATHER EXPERIENCE SYSTEM
         ═══════════════════════════════════════════════════════════════ */}
      <section id="weather" className="section-padding bg-[var(--bg-primary)] border-b border-[var(--border)] relative overflow-hidden transition-all duration-1000">
        
        {/* Subtle Dynamic Ambient Weather Glow Overlay */}
        <div className={`absolute inset-0 pointer-events-none opacity-20 dark:opacity-15 transition-all duration-1000 blur-[130px] z-0 ${
          weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('tropical')
            ? 'bg-gradient-to-tr from-blue-600 via-indigo-950 to-slate-900'
            : weather.condition.toLowerCase().includes('snow') || weather.condition.toLowerCase().includes('crisp')
            ? 'bg-gradient-to-tr from-cyan-400 via-sky-950 to-zinc-900'
            : weather.condition.toLowerCase().includes('fog') || weather.condition.toLowerCase().includes('mist') || weather.condition.toLowerCase().includes('cloudy')
            ? 'bg-gradient-to-tr from-slate-500 via-zinc-800 to-stone-900'
            : 'bg-gradient-to-tr from-amber-500 via-amber-950 to-orange-950'
        }`} />

        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.2em]">
              <Sun className="w-3.5 h-3.5 animate-spin-slow" /> Environmental Simulator
            </span>
            <h2 className="section-title">
              Luxury Weather <span className="italic font-light text-[var(--text-secondary)] dark:text-slate-400">Simulation System</span>
            </h2>
            <p className="section-subtitle">
              Step into a cinematic ambient simulator that recreates the live climate parameters of {destination.name} to help you feel the environment before you land.
            </p>
          </div>

          {/* Interactive Simulation Dashboard Wrapper */}
          <div className="w-full">
            <UnifiedWeatherDashboard
              location={`${destination.name} Climate`}
              currentWeather={weather}
              dailyForecast={dailyForecast}
              destination={destination}
              activeDayIdx={activeWeatherDayIdx}
              setActiveDayIdx={setActiveWeatherDayIdx}
            />
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           2A. CURATED SEASONAL EVENTS CALENDAR WIDGET
         ═══════════════════════════════════════════════════════════════ */}
      <section id="events" className="section-padding bg-[var(--bg-primary)] border-t border-[var(--border)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-4">
              <Calendar className="w-3.5 h-3.5" /> Seasonal Tracker
            </span>
            <h2 className="section-title text-center">
              Local Events & Festivals
            </h2>
            <p className="section-subtitle">
              Plan your travel dates around vibrant spectacles, local artisan markets, traditional gatherings, and regional closures in {destination.name}.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {localEvents.map((event, idx) => (
              <div 
                key={idx}
                className="glass-card p-6 text-left flex flex-col justify-between space-y-4 hover:border-[var(--accent)]/35 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-500/20 to-orange-500/20" />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-heading">
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)]">
                      {event.type}
                    </span>
                    <span className="font-mono text-[var(--text-muted)] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[var(--accent)]" /> {event.date}
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent)] transition-colors">{event.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">{event.desc}</p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center text-[10px] text-[var(--text-muted)] font-medium">
                  <span>Advisory: Open to Public</span>
                  <span className="text-[var(--accent)] font-semibold flex items-center gap-1">Curated ✨</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           3. VISA & ENTRY REQUIREMENTS
         ═══════════════════════════════════════════════════════════════ */}
      <section id="visa" className="section-padding bg-[var(--bg-secondary)] border-y border-[var(--border)] relative overflow-hidden">
        {/* Immersive Border Protocol Premium Background Watermark & Line Art Deck */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          {/* Ambient radial lighting glows */}
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(46,91,255,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(46,91,255,0.09)_0%,transparent_70%)] blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.02)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)] blur-[60px]" />

          {/* Dotted Flight Arcs & Continent Silhouettes behind text */}
          <svg 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[75%] max-w-[800px] h-[90%] opacity-[0.55] dark:opacity-[0.25] text-slate-350 dark:text-slate-800 transition-colors duration-500" 
            viewBox="0 0 1000 600" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.2"
          >
            {/* Concentric curved grid/latitude lines */}
            <path d="M 100 480 A 1200 1200 0 0 1 1100 480" strokeDasharray="3 6" className="text-slate-200 dark:text-white/[0.02]" />
            <path d="M 100 370 A 1200 1200 0 0 1 1100 370" strokeDasharray="4 8" className="text-slate-200 dark:text-white/[0.03]" />
            <path d="M 100 260 A 1200 1200 0 0 1 1100 260" strokeDasharray="5 10" className="text-slate-200 dark:text-white/[0.04]" />
            
            {/* Flight curves */}
            <path d="M 500 220 Q 600 130 700 190" stroke="url(#visaFlightGrad)" strokeWidth="1.5" strokeDasharray="3 5" className="opacity-40" />
            <path d="M 700 190 Q 800 110 900 230" stroke="url(#visaFlightGrad)" strokeWidth="1.5" strokeDasharray="3 5" className="opacity-40" />
            <path d="M 400 300 Q 550 180 700 190" stroke="url(#visaFlightGrad)" strokeWidth="1.5" strokeDasharray="3 5" className="opacity-30" />
            
            <defs>
              <linearGradient id="visaFlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2E5BFF" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#4E8BFF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2E5BFF" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Stylized world continents outlines */}
            {/* Europe */}
            <path d="M 400 120 C 430 110 470 125 490 150 C 500 175 440 200 415 190 C 390 180 385 140 400 120 Z" fill="currentColor" className="opacity-[0.12] dark:opacity-[0.18]" />
            {/* Asia / Eurasia */}
            <path d="M 490 130 C 580 90 760 100 850 130 C 900 150 920 190 880 240 C 840 290 700 315 640 300 C 580 285 540 240 500 210 C 480 190 475 150 490 130 Z" fill="currentColor" className="opacity-[0.12] dark:opacity-[0.18]" />
            {/* Africa */}
            <path d="M 410 240 C 440 220 510 210 540 240 C 570 270 580 320 560 365 C 540 410 515 440 490 465 C 480 470 470 450 470 410 C 470 370 415 325 405 290 C 395 265 400 250 410 240 Z" fill="currentColor" className="opacity-[0.12] dark:opacity-[0.18]" />

            {/* Subtle floating checkmark emblem in top left of map */}
            <g transform="translate(680, 150)" className="opacity-15">
              <rect x="0" y="0" width="16" height="16" rx="3" stroke="currentColor" fill="none" strokeWidth="1" />
              <path d="M 4 8 L 7 11 L 12 5" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </g>
            <g transform="translate(740, 200)" className="opacity-10">
              <rect x="0" y="0" width="20" height="12" rx="2" stroke="currentColor" fill="none" strokeWidth="1" />
              <line x1="4" y1="4" x2="16" y2="4" stroke="currentColor" strokeWidth="1" />
              <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1" />
            </g>
          </svg>

          {/* Premium Vector Line Art: Passport Deck & Verification Stamp */}
          <div className="absolute right-[5%] bottom-[5%] w-[380px] h-[240px] hidden md:block z-0">
            {/* Tilted Passport Stamp stack */}
            <div className="absolute bottom-[20px] right-[230px] transform -rotate-[18deg] opacity-[0.25] dark:opacity-[0.35] transition-transform duration-500 hover:rotate-[-12deg]">
              <div className="border border-slate-400 dark:border-slate-700 px-4 py-1.5 rounded-[6px] font-mono text-[9px] font-bold tracking-[0.25em] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5 bg-[var(--bg-secondary)] shadow-sm">
                <span>PASSPORT</span>
              </div>
            </div>
            
            <div className="absolute bottom-[55px] right-[180px] transform rotate-[12deg] opacity-[0.2] dark:opacity-[0.3] transition-transform duration-500 hover:rotate-[8deg]">
              <div className="border border-slate-400 dark:border-slate-700 px-4 py-1.5 rounded-[6px] font-mono text-[9px] font-bold tracking-[0.25em] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5 bg-[var(--bg-secondary)] shadow-sm">
                <span>PASSPORT</span>
              </div>
            </div>

            <div className="absolute bottom-[-10px] right-[170px] transform -rotate-[5deg] opacity-[0.3] dark:opacity-[0.4] transition-transform duration-500 hover:rotate-[-2deg]">
              <div className="border border-slate-400 dark:border-slate-700 px-5 py-2 rounded-[8px] font-mono text-[10px] font-bold tracking-[0.3em] text-slate-450 dark:text-slate-500 flex items-center justify-center gap-1.5 bg-[var(--bg-secondary)] shadow-sm">
                <span>PASSPORT</span>
              </div>
            </div>

            {/* High-Fidelity Outline Passport Document */}
            <svg 
              className="absolute right-[80px] bottom-[20px] w-[95px] h-[130px] opacity-[0.28] dark:opacity-[0.38] text-slate-400 dark:text-slate-600 transition-all duration-500 hover:scale-105 hover:opacity-[0.35] dark:hover:opacity-[0.48]" 
              viewBox="0 0 100 140" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2"
            >
              {/* Passport cover border */}
              <rect x="2" y="2" width="96" height="136" rx="8" strokeWidth="1.5" />
              {/* Decorative inner line */}
              <rect x="6" y="6" width="88" height="128" rx="6" strokeWidth="0.8" strokeDasharray="1.5 2.5" />
              
              {/* Mini Emblem Shield/Globe in center */}
              <circle cx="50" cy="55" r="18" strokeWidth="1" />
              <path d="M 32 55 L 68 55" strokeWidth="0.8" />
              <path d="M 50 37 L 50 73" strokeWidth="0.8" />
              <path d="M 37 45 C 44 48 56 48 63 45" strokeWidth="0.8" />
              <path d="M 37 65 C 44 62 56 62 63 65" strokeWidth="0.8" />
              <path d="M 44 39 C 48 48 48 62 44 71" strokeWidth="0.8" />
              <path d="M 56 39 C 52 48 52 62 56 71" strokeWidth="0.8" />
              
              {/* Document details / passport details rows */}
              <line x1="20" y1="95" x2="80" y2="95" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="20" y1="107" x2="65" y2="107" strokeWidth="1" strokeLinecap="round" />
              <line x1="20" y1="117" x2="50" y2="117" strokeWidth="1" strokeLinecap="round" />
            </svg>

            {/* Glowing verified badge overlapping the passport document bottom right */}
            <div className="absolute right-[50px] bottom-[10px] w-12 h-12 rounded-full border-2 border-slate-350 dark:border-slate-650 bg-[var(--bg-secondary)] flex items-center justify-center shadow-lg opacity-[0.35] dark:opacity-[0.55] transition-all duration-500 hover:scale-110">
              <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center bg-green-500/[0.04]">
                <svg className="w-4 h-4 text-slate-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Bottom-right four-pointed sparkle star exactly matching the 2nd screenshot */}
            <div className="absolute right-[10px] bottom-[-20px] animate-pulse-glow">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-650 opacity-[0.3] dark:opacity-[0.45]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center justify-between">
            
            <div className="lg:w-1/2 space-y-8 text-left z-10 relative">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest">
                <Globe className="w-3.5 h-3.5" /> Border Protocol
              </span>
              <h2 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-none text-slate-900 dark:text-white">
                Visa & Entry Verification
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light text-base max-w-xl">
                Verify absolute compliance before departure. Use our immediate passport check tool based on local border registries to confirm visa waivers, validity minimums, and custom health protocols.
              </p>

              {/* Embassy Links - Ultra-Premium Outline Action Chips Container */}
              <div className="pt-4 space-y-3.5 text-left">
                <h4 className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold font-heading flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" /> Consulate & Border Portals
                </h4>
                <div className="flex flex-wrap gap-3">
                  <a href="#" className="px-5 py-2.5 rounded-full bg-white dark:bg-white/[0.02] hover:bg-[var(--accent)]/[0.04] text-slate-700 dark:text-slate-350 hover:text-[var(--accent)] border border-slate-200 dark:border-white/[0.08] hover:border-[var(--accent)]/30 transition-all duration-300 flex items-center gap-2 group shadow-sm backdrop-blur-md">
                    <span className="text-xs font-semibold tracking-wide">Official e-Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)] transform group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="#" className="px-5 py-2.5 rounded-full bg-white dark:bg-white/[0.02] hover:bg-[var(--accent)]/[0.04] text-slate-700 dark:text-slate-350 hover:text-[var(--accent)] border border-slate-200 dark:border-white/[0.08] hover:border-[var(--accent)]/30 transition-all duration-300 flex items-center gap-2 group shadow-sm backdrop-blur-md">
                    <span className="text-xs font-semibold tracking-wide">Customs Declaration</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)] transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Visa Checker Mockup - Ultra-Premium Floating Interactive Input Card */}
            {/* Visa Checker Mockup - Ultra-Premium Floating Interactive Input Card */}
            <div className="lg:w-1/2 w-full text-left z-10 relative">
              <div className="relative">
                <div className={!user ? "filter blur-[16px] pointer-events-none select-none transition-all duration-500" : ""}>
                  <div className="backdrop-blur-3xl bg-white/75 dark:bg-[#0b1329]/40 border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
                    {/* Subtle soft cinematic studio background glow inside the card */}
                    <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-cyan-500/[0.03] dark:bg-cyan-500/[0.06] blur-[60px]" />
                    
                    {/* Visual Passport Icon Frame Watermark - Ultra Clean Alignment */}
                    <div className="absolute top-[-10px] right-[-10px] p-2 opacity-[0.03] dark:opacity-[0.06] pointer-events-none select-none">
                      <Globe className="w-40 h-40 text-slate-400" />
                    </div>

                    <h3 className="text-md font-heading font-medium tracking-wide mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                      <Shield className="w-4.5 h-4.5 text-[var(--accent)]" /> Border Registry Scanner
                    </h3>
                    <form onSubmit={handleVisaCheck} className="space-y-6">
                      <div className="space-y-2.5">
                        <label className="block text-[9px] uppercase tracking-widest text-slate-600 dark:text-slate-400 font-bold font-heading flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-[var(--accent)]" /> Select Passport Nationality
                        </label>
                        <div className="relative">
                          <select
                            value={visaNationality}
                            onChange={(e) => {
                              setVisaNationality(e.target.value);
                              setVisaChecked(false);
                            }}
                            className="w-full bg-white dark:bg-[#060c18]/60 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] focus:border-[var(--accent)]/55 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-0 font-medium transition-all duration-300 text-sm cursor-pointer appearance-none shadow-sm"
                          >
                            {countries.map((c) => (
                              <option key={c.name} value={c.name} className="bg-white dark:bg-[#0b1329] text-slate-900 dark:text-slate-200">
                                {c.flag} {c.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.08)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_30px_rgba(255,255,255,0.15)] transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                      >
                        <span>Check Passport Authorization</span>
                        <ArrowRight className="w-4 h-4 text-white dark:text-slate-950" />
                      </button>
                      
                      {visaChecked && (
                        <div className="mt-6 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-left animate-fade-in space-y-4">
                          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                            <div className="flex items-center gap-2 text-[var(--accent)]">
                              <Award className="w-5 h-5" />
                              <span className="font-bold text-[10px] font-heading uppercase tracking-wider">AI Policy Report</span>
                            </div>
                            {visaData.isLoading ? (
                              <div className="w-12 h-3 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
                            ) : visaData.isLive ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-500 font-mono">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                API Synced
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-500 font-mono">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Sandbox Active
                              </span>
                            )}
                          </div>
                          
                          {visaData.isLoading ? (
                            <div className="space-y-2 animate-pulse">
                              <div className="w-full h-4 bg-slate-200 dark:bg-white/5 rounded" />
                              <div className="w-2/3 h-4 bg-slate-200 dark:bg-white/5 rounded" />
                            </div>
                          ) : (
                            <>
                              <div className="space-y-2">
                                <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed font-body">
                                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] mr-2 ${
                                    visaData.color === 'green' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                                    visaData.color === 'red' ? 'bg-red-500/15 text-red-600 dark:text-red-400' :
                                    'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                  }`}>
                                    {visaData.requirement}
                                  </span>
                                  <span className="text-[var(--text-secondary)] font-normal">
                                    Stay allowed: <strong className="text-[var(--text-primary)]">{visaData.duration}</strong>.
                                  </span>
                                </p>
                                <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                                  {visaData.criticalInfo}
                                </p>
                              </div>
                              
                              <div className="pt-3 border-t border-[var(--border)] space-y-2.5">
                                <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-wider font-heading">Critical Parameters & Checklist:</p>
                                <ul className="text-xs text-[var(--text-secondary)] space-y-2.5 pl-1">
                                  {visaData.checklist?.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 font-body">
                                      <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                                        {idx === 0 ? <Clock className="w-3.5 h-3.5" /> : idx === 1 ? <Ticket className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                                      </div>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </form>
                  </div>
                </div>
                {!user && renderSectionLock('Border Registry Scanner')}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           3.5 LOCAL TRANSPORTATION HUB
         ═══════════════════════════════════════════════════════════════ */}
      <section id="transit" className="section-padding bg-[var(--bg-secondary)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-500">
        {/* Subtle grid background for high-end feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20 select-none">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span>Transportation Hub</span>
            </div>
            <h2 className="section-title">
              Local Transit <span className="italic font-light text-[var(--text-secondary)] dark:text-slate-400">Directory.</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              Navigate {destination.name} like an expert. Compare high-efficiency budget options, premium chauffeured transfers, and vital ride-hailing applications.
            </p>
          </div>

          {/* Cheaper vs Luxury Side-by-Side Cards */}
          <div className="relative">
            <div className={!user ? "filter blur-[16px] pointer-events-none select-none transition-all duration-500" : ""}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* 1. Cheapest Option Card (Budget/Public Transit) */}
                {(() => {
                  const cheaper = getTransportDataForDest(destination).cheaper;
                  const isBus = cheaper.type.toLowerCase().includes('bus') || cheaper.type.toLowerCase().includes('shuttle');
                  return (
                    <div className="group glass-card p-6 sm:p-8 rounded-[32px] border border-[var(--border)] text-left relative overflow-hidden flex flex-col justify-between transition-all duration-300">
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-cyan-400" />
                      
                      <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm">
                              {isBus ? <Car className="w-5.5 h-5.5" /> : <Train className="w-5 h-5 text-blue-500" />}
                            </div>
                            <div>
                              <h3 className="font-heading text-base font-bold text-luxury-primary dark:text-white leading-tight">Budget Transit</h3>
                              <span className="text-[9px] font-mono text-slate-450 uppercase tracking-wider block mt-0.5">cheaper way</span>
                            </div>
                          </div>
                          <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-tight shrink-0">
                            {cheaper.price}
                          </span>
                        </div>

                        {/* Body */}
                        <div className="space-y-2">
                          <h4 className="font-heading text-lg font-bold text-luxury-primary dark:text-white leading-snug">
                            {cheaper.type}
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400 text-sm font-light font-body leading-relaxed">
                            {cheaper.desc}
                          </p>
                        </div>
                      </div>

                      {/* Foot Tip */}
                      <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] flex items-start gap-3 text-xs text-slate-600 dark:text-slate-350 select-text">
                        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="leading-relaxed font-light font-body">
                          <strong className="font-medium text-slate-900 dark:text-white mr-1">Pro Tip:</strong> {cheaper.tip}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Luxury Option Card (Private/Exclusive Transit) */}
                {(() => {
                  const luxury = getTransportDataForDest(destination).luxury;
                  return (
                    <div className="group glass-card p-6 sm:p-8 rounded-[32px] border border-[var(--border)] text-left relative overflow-hidden flex flex-col justify-between transition-all duration-300">
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 to-indigo-500" />
                      
                      <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-sm">
                              <Car className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-heading text-base font-bold text-luxury-primary dark:text-white leading-tight">Private Transfer</h3>
                              <span className="text-[9px] font-mono text-slate-450 uppercase tracking-wider block mt-0.5">premium way</span>
                            </div>
                          </div>
                          <span className="bg-purple-500/15 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-tight shrink-0">
                            {luxury.price}
                          </span>
                        </div>

                        {/* Body */}
                        <div className="space-y-2">
                          <h4 className="font-heading text-lg font-bold text-luxury-primary dark:text-white leading-snug">
                            {luxury.type}
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400 text-sm font-light font-body leading-relaxed">
                            {luxury.desc}
                          </p>
                        </div>
                      </div>

                      {/* Foot Tip */}
                      <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] flex items-start gap-3 text-xs text-slate-600 dark:text-slate-350 select-text">
                        <Info className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                        <p className="leading-relaxed font-light font-body">
                          <strong className="font-medium text-slate-900 dark:text-white mr-1">Pro Tip:</strong> {luxury.tip}
                        </p>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Ride-Hailing Apps subsection */}
              {(() => {
                const apps = getTransportDataForDest(destination).apps;
                if (!apps || apps.length === 0) return null;
                return (
                  <div className="mt-8 pt-8 border-t border-[var(--border)] select-none">
                    <h4 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-4 font-heading">Ride-Hailing & Navigation Apps</h4>
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {apps.map((app, appIdx) => (
                        <div 
                          key={appIdx} 
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200/40 dark:border-white/[0.03] hover:border-blue-500/30 hover:bg-slate-100/30 dark:hover:bg-white/[0.04] hover:shadow-lg transition-all duration-300 flex items-start gap-3 text-left cursor-default shadow-sm"
                        >
                          <TransportAppLogo name={app.name} className="w-8 h-8 shrink-0 rounded-lg shadow-sm" />
                          <div className="space-y-0.5">
                            <strong className="font-heading font-bold text-xs text-luxury-primary dark:text-white block leading-tight">
                              {app.name}
                            </strong>
                            <span className="text-[10px] text-slate-450 dark:text-slate-500 font-light leading-relaxed font-body block">
                              {app.purpose}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
            {!user && renderSectionLock('Transit & Logistics')}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           4. EMERGENCY CONTACTS & SAFETY GUIDELINES
         ═══════════════════════════════════════════════════════════════ */}
      <section id="safety" className="section-padding bg-[var(--bg-primary)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 select-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-4">
              <Shield className="w-3.5 h-3.5" /> Emergency Hub
            </span>
            <h2 className="section-title text-center">
              Safety Dispatch & <span className="italic font-light text-[var(--text-secondary)] dark:text-slate-400">Support.</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              Explore with absolute peace of mind. We gather primary local hotlines, public service coordinates, tourism support offices, and essential cultural etiquettes to keep on your mobile dashboard.
            </p>
          </div>

          <div className="relative">
            <div className={!user ? "filter blur-[16px] pointer-events-none select-none transition-all duration-500" : ""}>
              <div className="flex flex-col lg:flex-row gap-16 items-start justify-between">
                
                {/* Left Column: Customs & Culture */}
                <div className="lg:w-1/2 space-y-4 text-left w-full">
                  <h4 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold font-heading">Culture Protocol & Customs</h4>
                  
                  <div className="p-5 rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] space-y-5 text-left">
                    
                    {/* Etiquette Note */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-500 flex items-center justify-center shrink-0">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-[var(--text-primary)] font-bold text-xs font-heading">Local Custom & Etiquette Note</strong>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-light font-body leading-relaxed">{destination.culture}</p>
                      </div>
                    </div>

                    {/* Secured Stays */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-500 flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-[var(--text-primary)] font-bold text-xs font-heading">Secured Stays & Credentials</strong>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-light font-body leading-relaxed">Always register digital itineraries with emergency contacts and keep secure cloud copies of travel credentials locked.</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Emergency Hotline Grid */}
                <div className="lg:w-1/2 w-full text-left">
                  <div className="glass-card p-6 sm:p-8 relative">
                    
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
                      <h3 className="text-lg font-heading font-normal text-[var(--text-primary)] flex items-center gap-2">
                        <Phone className="w-4.5 h-4.5 text-[var(--accent)] animate-pulse" /> Emergency Hotline Directory
                      </h3>
                      <span className="text-[9px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">Active Service</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {(() => {
                        const em = getEmergencyContacts(destination.country);
                        return [
                          { title: 'Police Department', num: em.police, desc: 'Direct public protection response', icon: Shield, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/5' },
                          { title: 'Medical / Ambulance', num: em.ambulance, desc: 'Urgent medical operations dispatch', icon: Activity, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/5' },
                          { title: 'Tourist Assistance', num: '+800 1200 450', desc: em.note || 'Dedicated visitor support desk', icon: Compass, color: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-500/5' },
                          { title: 'Rescue & Fire Control', num: em.fire, desc: 'Emergency rescue operations unit', icon: AlertTriangle, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/5' },
                        ];
                      })().map((item, index) => {
                        const AlertIcon = item.icon;
                        return (
                          <div key={index} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/20 transition-all select-none group flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <p className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold font-heading">{item.title}</p>
                              <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                                <AlertIcon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                              </div>
                            </div>
                            <p className="text-xl font-heading font-bold text-[var(--text-primary)] tabular-nums mt-3">{item.num}</p>
                            <p className="text-[10px] text-[var(--text-secondary)] leading-normal font-light mt-1 font-body">{item.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Consulate Block */}
                    <div className="mt-6 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-secondary)] leading-relaxed flex gap-3 text-left">
                      <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0 border border-[var(--accent)]/25">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-[var(--text-primary)] font-bold block font-heading mb-0.5">Regional Consulate District</strong>
                        <span className="font-body font-light">Diplomatic Avenue, Central Sector, {destination.name}. Services are processed Monday through Friday, 09:00 AM - 03:00 PM.</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
            {!user && renderSectionLock('Emergency & Safety Info')}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           4A. HEALTH & MEDICAL DIRECTORY
         ═══════════════════════════════════════════════════════════════ */}
      <section id="health-vault" className="section-padding bg-[var(--bg-secondary)] border-y border-[var(--border)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-4">
              <HeartPulse className="w-3.5 h-3.5" /> Medical Dispatch
            </span>
            <h2 className="section-title text-center">
              Health & Medical Directory
            </h2>
            <p className="section-subtitle">
              Locate verified healthcare centers, emergency contacts, and urgent-care facilities near your destination.
            </p>
          </div>

          <div className="relative">
            <div className={!user ? "filter blur-[16px] pointer-events-none select-none transition-all duration-500" : ""}>
              <div className="glass-card p-6 sm:p-8 text-left">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                    <h3 className="text-base font-heading font-normal text-[var(--text-primary)] flex items-center gap-2">
                      <HeartPulse className="w-4.5 h-4.5 text-[var(--accent)] animate-pulse" /> Nearest Healthcare Centers
                    </h3>
                    <span className="text-[9px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">
                      24/7 Verified
                    </span>
                  </div>

                  <HospitalSection
                    hospitals={hospitals}
                    uiState={uiState}
                    retryFetch={retryFetch}
                    focusOnMap={focusOnMap}
                    onExpand={loadDetailsForPlace}
                  />
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-amber-500/[0.03] border border-amber-500/15 flex items-start gap-3.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                  <Info className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="font-light">
                    <strong className="font-bold text-[var(--text-primary)]">Emergency Travel Advice:</strong> Always carry your medical records and travel insurance details. Contact local emergency services (dial 911/112/999) for immediate medical assistance.
                  </p>
                </div>
              </div>
            </div>
            {!user && renderSectionLock('Health & Medical Directory')}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           5. MUST VISIT LOCATIONS
         ═══════════════════════════════════════════════════════════════ */}
      <section id="must-visit" className="section-padding bg-[var(--bg-secondary)] border-t border-[var(--border)] relative overflow-hidden">
        {/* Subtle Luxury Architectural Lines / Skyline Background Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          {/* Subtle warm glow behind attractions */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(46,91,255,0.02)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(46,91,255,0.05)_0%,transparent_70%)] blur-[100px]" />
          
          <svg className="absolute bottom-[-10px] inset-x-0 w-full h-[30%] min-h-[120px] opacity-[0.08] dark:opacity-[0.15] text-slate-350 dark:text-slate-700" viewBox="0 0 1200 200" fill="none" stroke="currentColor" strokeWidth="1">
            {/* Elegant minimalist structural vectors / abstract arches */}
            <path d="M 50 200 L 50 120 A 40 40 0 0 1 130 120 L 130 200" />
            <path d="M 180 200 L 180 80 A 60 60 0 0 1 300 80 L 300 200" />
            <path d="M 350 200 L 350 140 A 30 30 0 0 1 410 140 L 410 200" />
            <path d="M 460 200 L 460 60 A 80 80 0 0 1 620 60 L 620 200" />
            <path d="M 670 200 L 670 110 L 740 50 L 810 110 L 810 200" />
            <path d="M 860 200 L 860 130 A 45 45 0 0 1 950 130 L 950 200" />
            <path d="M 1000 200 L 1000 70 A 70 70 0 0 1 1140 70 L 1140 200" />
            
            {/* Dotted lines/arcs above architecture */}
            <path d="M 0 100 Q 300 20 600 80" strokeDasharray="3 6" />
            <path d="M 600 80 Q 900 140 1200 40" strokeDasharray="3 6" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-4 font-bold">
              <MapPin className="w-3.5 h-3.5" /> Must Visit
            </span>
            <h2 className="section-title text-center">
              Must Visit Attractions
            </h2>
            <p className="section-subtitle text-center">
              Explore the city's highest-rated landmarks, heritage sites, viewpoints, and amusement parks curated from real-time geographic data.
            </p>
          </div>

          <div className="relative">
            <div className={!user ? "filter blur-[16px] pointer-events-none select-none transition-all duration-500" : ""}>
              <AttractionsGrid
                destination={destination}
                attractions={attractions}
                uiState={uiState}
                retryFetch={retryFetch}
                savedAttractionIds={savedAttractionIds}
                itineraryAttractionIds={itineraryAttractionIds}
                toggleSaveAttraction={toggleSaveAttraction}
                toggleItineraryAttraction={toggleItineraryAttraction}
                focusOnMap={focusOnMap}
                isBackgroundValidating={isBackgroundValidating}
              />
            </div>
            {!user && renderSectionLock('Must-Visit Attractions')}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           5a. YOUTUBE TRAVEL EXPERIENCE SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <YouTubeTravelSection 
        destination={destination.name} 
        category={destination.name.toLowerCase().includes('makkah') || destination.name.toLowerCase().includes('madinah') ? 'religious' : 'general'}
      />

      {/* ═══════════════════════════════════════════════════════════════
           5b. PREMIUM DESTINATION IMAGE GALLERY
         ═══════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-[var(--bg-primary)] border-t border-[var(--border)] relative overflow-hidden text-left">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-4">
              <Camera className="w-3.5 h-3.5" /> Visual Showcase
            </span>
            <h2 className="section-title text-center">
              Cinematic Sights of {destination.name}
            </h2>
            <p className="section-subtitle text-center">
              Explore 3 to 5 stunning high-resolution captures of iconic landmarks, natural scenery, and cultural life.
            </p>
          </div>

          {loadingGallery ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-video sm:aspect-square rounded-2xl sm:rounded-3xl bg-slate-200 dark:bg-white/[0.04] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setLightboxImg(img);
                    setShowLightbox(true);
                  }}
                  className="group relative rounded-2xl sm:rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-square bg-slate-100 dark:bg-dark-300 border border-[var(--border)] cursor-pointer shadow-premium hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  <ImageWithWatermark 
                    src={img} 
                    alt={`${destination.name} sight ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    wrapperClassName="w-full h-full bg-transparent border-none rounded-none shadow-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-5">
                    <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-white font-mono">View Full HD Photo</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           6. INTERACTIVE MAP PREVIEW
         ═══════════════════════════════════════════════════════════════ */}
      <section id="map" className="section-padding bg-[var(--bg-primary)] border-b border-[var(--border)] relative overflow-hidden">
        {/* Minimalist Backdrop */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <div className="absolute top-[40%] left-0 w-full max-w-[500px] h-[300px] rounded-full bg-[radial-gradient(circle_at_center,rgba(46,91,255,0.015)_0%,transparent_70%)] blur-[80px] pointer-events-none overflow-hidden" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <MapPanel
            geoCoords={geoCoords}
            destination={destination}
            attractions={attractions}
            hospitals={hospitals}
            mapHotspot={mapHotspot}
            setMapHotspot={setMapHotspot}
            mapHotspots={mapHotspots}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           7. BEST HOTELS & STAYS
         ═══════════════════════════════════════════════════════════════ */}
      <section id="hotels" className="section-padding bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" /> Accommodations
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                hotelsSource === 'simulation'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-450'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${hotelsSource === 'simulation' ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                <span>{hotelsSource === 'simulation' ? 'Sandbox Stays' : 'Live Stays Synced'}</span>
              </span>
            </div>
            <h2 className="section-title text-center">
              {isWildernessDestination(destination) ? "Wilderness Lodges & Expedition Basecamps" : "Premium Hotels & Strategic Stays"}
            </h2>
            <p className="section-subtitle">
              {isWildernessDestination(destination) 
                ? `Secure ecological lodges and professional basecamp domes cross-referenced for carbon-footprint safety, permit compliance, and local wildlife proximity in ${destination.name}.`
                : `Secure accommodations thoroughly cross-referenced for quality index scores, guest comfort, structural sustainability, and local transit.`
              }
            </p>
          </div>

          <div className="relative">
            <div className={!user ? "filter blur-[16px] pointer-events-none select-none transition-all duration-500" : ""}>
              {hotelsLoading ? (
                <div className="grid lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="glass-card border border-[var(--border)] overflow-hidden flex flex-col justify-between text-left duration-300 animate-pulse bg-white/20 dark:bg-white/[0.01] rounded-[24px]"
                    >
                      <div className="h-52 w-full bg-slate-200/60 dark:bg-slate-800/60" />
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="h-3.5 w-16 bg-slate-200/60 dark:bg-slate-800/60 rounded" />
                            <div className="h-3.5 w-24 bg-slate-200/60 dark:bg-slate-800/60 rounded" />
                          </div>
                          <div className="h-6 w-3/4 bg-slate-200/60 dark:bg-slate-800/60 rounded" />
                          <div className="space-y-2">
                            <div className="h-3 w-full bg-slate-200/60 dark:bg-slate-800/60 rounded" />
                            <div className="h-3 w-5/6 bg-slate-200/60 dark:bg-slate-800/60 rounded" />
                          </div>
                        </div>
                        <div className="pt-4 border-t border-[var(--border)] space-y-4">
                          <div className="flex gap-2">
                            <div className="h-5 w-16 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
                            <div className="h-5 w-16 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
                            <div className="h-5 w-16 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <div className="space-y-1">
                              <div className="h-2 w-12 bg-slate-200/60 dark:bg-slate-800/60 rounded" />
                              <div className="h-6 w-20 bg-slate-200/60 dark:bg-slate-800/60 rounded" />
                            </div>
                            <div className="h-9 w-24 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                  {hotels.map((hotel, index) => (
                    <div
                      key={index}
                      className="glass-card-hover hover:border-[var(--accent)]/30 overflow-hidden flex flex-col justify-between text-left duration-300"
                    >
                      {/* Image & tag */}
                      <div className="h-52 w-full relative overflow-hidden select-none">
                        <ImageWithWatermark 
                          src={hotel.image} 
                          alt={hotel.name} 
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                          wrapperClassName="w-full h-full bg-transparent border-none rounded-none shadow-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/10 to-transparent" />
                        <span className="absolute top-4 left-4 bg-[var(--accent)] text-white font-heading text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {hotel.tag}
                        </span>
                      </div>

                      {/* Info block */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-heading font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1 text-[var(--accent)]"><Star className="w-3.5 h-3.5 fill-current" /> {hotel.rating}</span>
                            <span>{hotel.reviews} Guest Reviews</span>
                          </div>
                          <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] line-clamp-1">{hotel.name}</h3>
                          <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">{hotel.desc}</p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-[var(--border)] space-y-4">
                          {/* Amenities tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {hotel.amenities.map((am, idx) => (
                              <span key={idx} className="text-[10px] bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] px-2.5 py-0.5 rounded-full font-medium">
                                {am}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <span className="text-[10px] text-[var(--text-secondary)] block uppercase tracking-wider">Best Est Rate</span>
                              <span className="text-2xl font-heading font-normal text-[var(--text-primary)] tabular-nums mt-0.5 block">${hotel.price} <span className="text-xs text-[var(--text-secondary)] font-light">/ night</span></span>
                            </div>
                            <a 
                              href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ', ' + destination.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-sunset px-5 py-2.5 rounded-full text-xs font-medium flex items-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-premium"
                            >
                              <span>Book Stay</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {!user && renderSectionLock('Recommended Stays')}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           8. TRAVEL ESSENTIALS & CHECKLIST
         ═══════════════════════════════════════════════════════════════ */}
      <section id="checklist" className="section-padding bg-[var(--bg-primary)] relative overflow-hidden">
        {/* High-End Outline Suitcase Travel Watermark & Conveyor Systems Backdrop */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          {/* Subtle ambient light */}
          <div className="absolute top-[30%] right-[10%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.02)_0%,transparent_75%)] dark:bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_0%,transparent_75%)] blur-[80px]" />
          
          <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] hidden lg:block opacity-[0.28] dark:opacity-[0.18] text-slate-350 dark:text-slate-800">
            <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2">
              {/* Dotted conveyor trails connecting elements */}
              <path d="M 20 40 C 50 40, 40 85, 60 85" strokeWidth="0.8" strokeDasharray="3 5" className="text-[var(--accent)]" />
              <path d="M 140 115 C 160 115, 150 160, 180 160" strokeWidth="0.8" strokeDasharray="3 5" className="text-emerald-500/30" />
              <path d="M 140 70 C 170 70, 160 30, 180 30" strokeWidth="0.8" strokeDasharray="3 5" className="text-amber-500/30" />
              <path d="M 30 140 C 50 140, 40 100, 60 100" strokeWidth="0.8" strokeDasharray="3 5" className="text-[var(--accent)]/30" />
              
              {/* Suitcase body */}
              <rect x="55" y="55" width="90" height="75" rx="12" />
              {/* Bumpers */}
              <rect x="55" y="55" width="16" height="16" rx="3" strokeWidth="0.8" fill="none" />
              <rect x="129" y="55" width="16" height="16" rx="3" strokeWidth="0.8" fill="none" />
              <rect x="55" y="114" width="16" height="16" rx="3" strokeWidth="0.8" fill="none" />
              <rect x="129" y="114" width="16" height="16" rx="3" strokeWidth="0.8" fill="none" />
              
              {/* Handles */}
              <path d="M 85 55 L 85 43 A 3 3 0 0 1 88 40 L 112 40 A 3 3 0 0 1 115 43 L 115 55" strokeWidth="1.5" />
              <path d="M 90 55 L 90 47 A 1 1 0 0 1 91 46 L 109 46 A 1 1 0 0 1 110 47 L 110 55" strokeWidth="0.8" />
              
              {/* Structural bands */}
              <line x1="78" y1="55" x2="78" y2="130" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="122" y1="55" x2="122" y2="130" strokeWidth="0.8" strokeDasharray="2 2" />

              {/* Passport Icon - Rotated at top-left */}
              <g transform="translate(15, 20) rotate(-15)" className="text-[var(--accent)] opacity-80">
                <rect x="0" y="0" width="22" height="30" rx="3" strokeWidth="1.2" />
                <line x1="4" y1="6" x2="18" y2="6" strokeWidth="0.8" />
                <circle cx="11" cy="17" r="4.5" strokeWidth="0.8" />
                <path d="M 9 17 L 13 17 M 11 15 L 11 19" strokeWidth="0.6" />
              </g>
              
              {/* Power Adapter Icon - Rotated at bottom-left */}
              <g transform="translate(18, 125) rotate(12)" className="text-slate-400 opacity-70">
                <rect x="0" y="0" width="24" height="24" rx="4" strokeWidth="1.2" />
                {/* Plugs */}
                <line x1="8" y1="-4" x2="8" y2="0" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="-4" x2="16" y2="0" strokeWidth="1.5" strokeLinecap="round" />
                {/* USB ports */}
                <rect x="6" y="8" width="12" height="4" rx="1" strokeWidth="0.8" />
                <line x1="12" y1="16" x2="12" y2="20" strokeWidth="1" strokeLinecap="round" />
              </g>
              
              {/* Camera Icon - Rotated at top-right */}
              <g transform="translate(158, 20) rotate(15)" className="text-amber-500 opacity-70">
                <rect x="0" y="4" width="28" height="18" rx="3" strokeWidth="1.2" />
                <path d="M 8 4 L 11 1 L 17 1 L 20 4" strokeWidth="1.2" />
                <circle cx="14" cy="13" r="4.5" strokeWidth="1.2" />
              </g>
              
              {/* T-Shirt Icon - Rotated at bottom-right */}
              <g transform="translate(155, 125) rotate(-10)" className="text-emerald-500 opacity-70">
                <path d="M 5 0 L 10 3 L 15 0 L 20 3 L 18 8 L 15 7 L 15 20 L 5 20 L 5 7 L 2 8 Z" strokeWidth="1.2" strokeLinejoin="round" />
              </g>
              
              {/* Checklist circles & checks scattered */}
              <circle cx="95" cy="18" r="2.5" className="fill-blue-500/20 stroke-blue-500" strokeWidth="0.8" />
              <circle cx="165" cy="85" r="2" className="fill-amber-500/20 stroke-amber-500" strokeWidth="0.8" />
              <circle cx="42" cy="90" r="2.5" className="fill-emerald-500/20 stroke-emerald-500" strokeWidth="0.8" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center justify-between">
            
            <div className="lg:w-1/2 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
                <CheckSquare className="w-3.5 h-3.5" /> Luggage Check
              </span>
              <h2 className="section-title text-left">
                Smart Packing Checklist
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed font-light">
                Never omit vital documents or adapter adapters. Our intelligent packing engine designs customized luggage checklists calibrated specifically to {destination.name}'s current forecasts.
              </p>

              {/* Progress Box */}
              <div className="p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-3.5 text-left shadow-premium">
                <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-heading">
                  <span>Luggage Checklist Status</span>
                  <span className="text-[var(--accent)] font-mono font-bold text-xs">{progressPct}% Packed</span>
                </div>
                
                {/* Horizontal Progress Bar */}
                <div className="h-2 w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                
                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed font-light">
                  Ensure all identity approvals and customs registrations are compiled before checking heavy luggage.
                </p>
              </div>
            </div>

            {/* Interactive Checklist Dashboard */}
            <div className="lg:w-1/2 w-full">
              <div className="glass-card p-6 sm:p-8 text-left">
                <h3 className="text-lg font-heading font-normal mb-5 text-[var(--text-primary)]">Luggage Checklist</h3>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-2 no-scrollbar">
                  {checklist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`w-full flex items-center gap-4 p-3.5 rounded-[18px] border text-left transition-all ${
                        item.checked 
                          ? 'bg-[var(--accent)]/[0.03] border-[var(--accent)]/20 text-[var(--text-secondary)]' 
                          : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        item.checked 
                          ? 'bg-[var(--accent)] text-white scale-105' 
                          : 'border-2 border-neutral-300 dark:border-neutral-700 bg-[var(--bg-primary)]'
                      }`}>
                        {item.checked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-medium ${item.checked ? 'line-through opacity-50' : ''}`}>{item.text}</p>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--accent)] block mt-0.5">{item.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           8A. LIVE TRANSLATION & PHRASEBOOK WIDGET
         ═══════════════════════════════════════════════════════════════ */}
      <section id="translation" className="section-padding bg-[var(--bg-secondary)] border-t border-[var(--border)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-4">
              <Languages className="w-3.5 h-3.5" /> Language Hub
            </span>
            <h2 className="section-title text-center">
              Live Translation & Phrasebook
            </h2>
            <p className="section-subtitle">
              Easily break through communication barriers in {destination.name}. Browse localized traveler phrases or simulate dynamic translations in <strong className="text-[var(--text-primary)]">{getDestinationLanguage(destination)}</strong>.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Local Phrasebook Deck */}
            <div className="col-span-12 lg:col-span-7 glass-card p-6 sm:p-8 flex flex-col justify-between text-left">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <h3 className="text-base font-heading font-normal text-[var(--text-primary)] flex items-center gap-2">
                    <Volume2 className="w-4.5 h-4.5 text-[var(--accent)] animate-pulse" /> Categorized Vocal Phrasebook
                  </h3>
                  <span className="text-[9px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">
                    {getDestinationLanguage(destination)} Guides
                  </span>
                </div>

                {/* Phrase Grid List */}
                <div className="space-y-3">
                  {getCuratedPhrases(getDestinationLanguage(destination)).map((phrase, pIdx) => (
                    <div 
                      key={pIdx} 
                      className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all duration-300"
                    >
                      <div className="space-y-1">
                        <p className="text-xs text-[var(--text-muted)] font-mono">{phrase.eng}</p>
                        <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{phrase.loc}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] italic font-light">Phonetic: <span className="font-mono font-normal">{phrase.ph}</span></p>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setAudioPlayingIndex(pIdx);
                          setTimeout(() => setAudioPlayingIndex(null), 1500);

                          // Web Speech Synthesis actual voice playback
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const cleanText = phrase.loc.split('(')[0].trim();
                            const utterance = new SpeechSynthesisUtterance(cleanText);
                            
                            const langMap = {
                              Arabic: 'ar-SA',
                              German: 'de-DE',
                              Portuguese: 'pt-BR',
                              Japanese: 'ja-JP',
                              Italian: 'it-IT',
                              Spanish: 'es-ES',
                              Thai: 'th-TH',
                              Indonesian: 'id-ID',
                              Urdu: 'ur-PK',
                              English: 'en-US'
                            };
                            
                            utterance.lang = langMap[getDestinationLanguage(destination)] || 'en-US';
                            window.speechSynthesis.speak(utterance);
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-sm cursor-pointer"
                      >
                        <Volume2 className={`w-4 h-4 ${audioPlayingIndex === pIdx ? 'animate-bounce' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wave simulation indicator if audio is simulated playing */}
              {audioPlayingIndex !== null && (
                <div className="mt-6 p-3 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 flex items-center justify-between text-xs text-[var(--accent)] animate-fade-in">
                  <span className="font-mono font-bold tracking-wide">PLAYING PHONETIC DIALECT SYNC...</span>
                  <div className="flex gap-0.5 h-3 items-end">
                    <span className="w-0.5 bg-[var(--accent)] animate-pulse" style={{ height: '70%', animationDelay: '0.1s' }} />
                    <span className="w-0.5 bg-[var(--accent)] animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
                    <span className="w-0.5 bg-[var(--accent)] animate-pulse" style={{ height: '40%', animationDelay: '0.3s' }} />
                    <span className="w-0.5 bg-[var(--accent)] animate-pulse" style={{ height: '80%', animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Interactive Translation Input/Output Simulator */}
            <div className="col-span-12 lg:col-span-5 glass-card p-4 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden w-full max-w-full">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-600" />
              
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
                  <h3 className="text-sm sm:text-base font-heading font-bold text-[var(--text-primary)]">Interactive AI Translator</h3>
                  <span className="text-[9px] text-[var(--text-secondary)] font-mono uppercase bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full border border-[var(--border)] shrink-0">English ➜ {getDestinationLanguage(destination)}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-bold font-heading">English Input</label>
                    <textarea
                      value={translationInput}
                      onChange={(e) => setTranslationInput(e.target.value)}
                      placeholder="Type travel phrase (e.g. 'hello', 'thank you', 'where is the hotel')..."
                      rows={3}
                      className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-xs sm:text-sm font-light leading-relaxed font-body transition-all resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleTranslationSubmit}
                    className="w-full btn-sunset py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-premium cursor-pointer"
                  >
                    <Languages className="w-4 h-4" />
                    <span>Instant Localize</span>
                  </button>
                </div>
              </div>

              {/* Translation Output Card */}
              <div className="mt-8 pt-5 border-t border-[var(--border)]">
                {translatedText ? (
                  <div className="p-5 rounded-2xl bg-[var(--accent)]/[0.03] border border-[var(--accent)]/15 space-y-3.5 text-left animate-fade-in flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-3 text-[10px] font-mono border-b border-[var(--border)] pb-2.5">
                      <div>
                        <span className="text-slate-400 block uppercase tracking-wider text-[8px] font-bold">Source Language</span>
                        <span className="text-[var(--text-primary)] font-semibold">{detectedLang || 'English'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase tracking-wider text-[8px] font-bold">Target Language</span>
                        <span className="text-[var(--accent)] font-semibold">{targetLang || 'Urdu'}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--accent)] block font-mono">Original Text</span>
                        <p className="text-xs text-[var(--text-secondary)] italic">"{translationInput}"</p>
                        
                        <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--accent)] block font-mono pt-1">Translated Text</span>
                        <p className="text-base font-bold text-[var(--text-primary)] leading-relaxed">{translatedText}</p>
                        
                        {translationPhonetic && (
                          <p className="text-[10px] text-[var(--text-secondary)] italic font-light">Phonetic: <span className="font-mono font-normal text-[var(--accent)]">{translationPhonetic}</span></p>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => {
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const cleanText = translatedText.split('(')[0].trim();
                            const utterance = new SpeechSynthesisUtterance(cleanText);
                            
                            const langMap = {
                              Arabic: 'ar-SA',
                              German: 'de-DE',
                              Portuguese: 'pt-BR',
                              Japanese: 'ja-JP',
                              Italian: 'it-IT',
                              Spanish: 'es-ES',
                              Thai: 'th-TH',
                              Indonesian: 'id-ID',
                              Urdu: 'ur-PK',
                              English: 'en-US'
                            };
                            
                            utterance.lang = langMap[getDestinationLanguage(destination)] || 'en-US';
                            window.speechSynthesis.speak(utterance);
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-sm cursor-pointer shrink-0 ml-4"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-secondary)] italic font-light text-center py-4">Submit any English travel phrase above to trigger live contextual translations...</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           9. LATEST NEWS & REAL-TIME ALERTS
         ═══════════════════════════════════════════════════════════════ */}
      <section id="news" className="section-padding bg-[var(--bg-secondary)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" /> News Sentinel
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                newsSource === 'simulation'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-450'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${newsSource === 'simulation' ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                <span>{newsSource === 'simulation' ? 'Sandbox Feed' : 'Live News Synced'}</span>
              </span>
            </div>
            <h2 className="section-title text-center">
              Real-Time Advisories & Alerts
            </h2>
            <p className="section-subtitle">
              Remain configured with direct regional advisories, transport updates, cultural shifts, and weather alerts before departure.
            </p>
          </div>

          {newsLoading ? (
            <div className="grid lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-card p-6 text-left flex flex-col justify-between space-y-4 border border-[var(--border)] bg-[var(--bg-secondary)]/50 rounded-2xl animate-pulse">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-3.5 bg-slate-200 dark:bg-white/10 rounded-full" />
                      <div className="w-16 h-3 bg-slate-200 dark:bg-white/10 rounded-full" />
                    </div>
                    <div className="w-3/4 h-5 bg-slate-200 dark:bg-white/10 rounded-lg" />
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
                      <div className="w-5/6 h-3 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center">
                    <div className="w-20 h-3 bg-slate-200 dark:bg-white/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="glass-card p-6 text-left flex flex-col justify-between space-y-4 hover:border-[var(--accent)]/30 duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-heading">
                      <span className="px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)]">
                        {alert.type}
                      </span>
                      <span>{alert.time}</span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-[var(--text-primary)] leading-snug line-clamp-2">{alert.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed line-clamp-4">{alert.desc}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center text-[9px] text-[var(--text-muted)] font-mono">
                    <span>Source: {alert.source || 'Border Transit Portal'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           10. CURRENCY EXCHANGE CALCULATOR
         ═══════════════════════════════════════════════════════════════ */}
      <section id="currency" className="section-padding bg-[var(--bg-primary)] relative overflow-hidden">
        {/* Fintech Exchange Curves & Floating Currency Symbols Backdrop */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          {/* Ambient lighting glows */}
          <div className="absolute top-[20%] left-[-5%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(46,91,255,0.02)_0%,transparent_75%)] dark:bg-[radial-gradient(circle_at_center,rgba(46,91,255,0.06)_0%,transparent_75%)] blur-[80px]" />
          
          {/* Subtle drifting graph charts */}
          <svg className="absolute left-[3%] bottom-[5%] w-[50%] max-w-[500px] h-[75%] opacity-[0.22] dark:opacity-[0.14] text-slate-350 dark:text-slate-800" viewBox="0 0 400 200" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M 0 170 Q 80 80 160 120 T 320 50 T 400 20" strokeWidth="1.8" />
            <path d="M 0 170 Q 80 80 160 120 T 320 50 T 400 20 L 400 200 L 0 200 Z" fill="url(#fintechAreaGrad)" stroke="none" className="opacity-10" />
            
            <path d="M 0 190 Q 60 130 120 160 T 240 100 T 400 60" strokeWidth="1" strokeDasharray="3 3" className="opacity-60" />
            
            {/* Coordinate mesh grids */}
            <line x1="80" y1="0" x2="80" y2="200" strokeWidth="0.5" strokeDasharray="4 6" className="opacity-40" />
            <line x1="160" y1="0" x2="160" y2="200" strokeWidth="0.5" strokeDasharray="4 6" className="opacity-40" />
            <line x1="240" y1="0" x2="240" y2="200" strokeWidth="0.5" strokeDasharray="4 6" className="opacity-40" />
            <line x1="320" y1="0" x2="320" y2="200" strokeWidth="0.5" strokeDasharray="4 6" className="opacity-40" />
            <line x1="0" y1="100" x2="400" y2="100" strokeWidth="0.5" strokeDasharray="4 6" className="opacity-40" />
            
            <defs>
              <linearGradient id="fintechAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Elegant Floating Currency Badges exactly matching the Stripe mockup */}
          <div className="absolute left-[38%] top-[25%] transform -rotate-[15deg] opacity-[0.22] dark:opacity-[0.3] transition-transform duration-500 hover:rotate-[-8deg] hidden md:block">
            <div className="border border-slate-400 dark:border-slate-700 w-10 h-10 rounded-xl flex items-center justify-center font-heading font-medium text-base text-slate-400 dark:text-slate-500 bg-[var(--bg-secondary)] shadow-sm">
              <span>$</span>
            </div>
          </div>

          <div className="absolute left-[44%] bottom-[20%] transform rotate-[18deg] opacity-[0.16] dark:opacity-[0.25] transition-transform duration-500 hover:rotate-[10deg] hidden md:block">
            <div className="border border-slate-400 dark:border-slate-700 w-10 h-10 rounded-xl flex items-center justify-center font-heading font-medium text-base text-slate-400 dark:text-slate-500 bg-[var(--bg-secondary)] shadow-sm">
              <span>€</span>
            </div>
          </div>

          <div className="absolute left-[5%] top-[15%] transform rotate-[8deg] opacity-[0.14] dark:opacity-[0.2] transition-transform duration-500 hover:rotate-[3deg] hidden md:block">
            <div className="border border-slate-400 dark:border-slate-700 w-10 h-10 rounded-xl flex items-center justify-center font-heading font-medium text-base text-slate-400 dark:text-slate-500 bg-[var(--bg-secondary)] shadow-sm">
              <span>¥</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center justify-between">
            
            <div className="lg:w-1/2 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5" /> Exchange Desk
              </span>
              <h2 className="section-title text-left">
                Currency Converter
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed font-light">
                Scan exchange fluctuations dynamically. Perform immediate currency conversions between local stays, dining menus, and your domestic billing currency.
              </p>

              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-secondary)] leading-relaxed text-left">
                <p>📈 <strong className="text-[var(--text-primary)]">Rate Source:</strong> Direct global backing sync ensures all currency valuations update automatically every 6 hours.</p>
              </div>
            </div>

            {/* Overhauled Modern Currency Converter UI */}
            <div className="lg:w-1/2 w-full text-left">
              <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-white/[0.08] dark:bg-black/40 bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl">
                {/* Glow effects */}
                <div className="absolute top-[-30px] right-[-30px] w-28 h-28 rounded-full bg-[var(--accent)]/10 blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
                  <div>
                    <h3 className="text-base font-heading font-semibold text-[var(--text-primary)]">Real-Time Currency Broker</h3>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-light">Live Interbank Exchange Rates</p>
                  </div>
                  {/* Synced Badge Removed */}
                </div>

                <div className="space-y-4 relative">
                  {/* From Card */}
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-white/[0.08] flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">You Pay</label>
                      <input
                        type="number"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(Number(e.target.value))}
                        className="w-full bg-transparent text-[var(--text-primary)] font-bold font-mono text-2xl outline-none border-none p-0 focus:ring-0 focus:outline-none"
                      />
                    </div>
                    
                    <div className="shrink-0">
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-white/[0.08] px-3.5 py-2 rounded-xl focus:outline-none font-semibold text-xs sm:text-sm shadow-sm transition-all"
                      >
                        {dynamicCurrencies.map((c) => (
                          <option key={c.code} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                      <span className="block text-right text-[10px] text-[var(--text-secondary)] mt-1 font-mono">{getSymbol(fromCurrency)}</span>
                    </div>
                  </div>

                  {/* Swap Line & Live Rate Pill */}
                  <div className="relative flex items-center justify-center my-[-10px] z-10">
                    <div className="absolute inset-x-0 h-px bg-white/[0.08]" />
                    <div className="relative px-4 py-1.5 rounded-full bg-[var(--bg-primary)] border border-white/[0.08] text-[10px] font-mono text-[var(--text-secondary)] font-semibold shadow-md flex items-center gap-1.5">
                      <span>1 {fromCurrency}</span>
                      <span className="text-[var(--accent)] font-bold">➜</span>
                      <span>{((Math.pow(getRate(fromCurrency), -1)) * getRate(toCurrency)).toFixed(4)} {toCurrency}</span>
                    </div>
                  </div>

                  {/* To Card */}
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-white/[0.08] flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">You Receive</label>
                      <div className="text-2xl font-bold font-mono text-[var(--accent)] select-all truncate">
                        {convertedAmount}
                      </div>
                    </div>
                    
                    <div className="shrink-0">
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-white/[0.08] px-3.5 py-2 rounded-xl focus:outline-none font-semibold text-xs sm:text-sm shadow-sm transition-all"
                      >
                        {dynamicCurrencies.map((c) => (
                          <option key={c.code} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                      <span className="block text-right text-[10px] text-[var(--text-secondary)] mt-1 font-mono">{getSymbol(toCurrency)}</span>
                    </div>
                  </div>

                  {/* Metadata and Sync Times */}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           9. CATEGORIZED WORLDWIDE TRAVEL DIRECTORY
         ═══════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-[var(--bg-secondary)] border-t border-[var(--border)] relative z-20">
        <div className="max-w-7xl mx-auto px-4 text-left">
          <div className="mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-4">
              <Compass className="w-3.5 h-3.5" /> Global Escapes
            </span>
            <h2 className="section-title text-left">
              Categorized Travel Directory
            </h2>
            <p className="section-subtitle text-left max-w-xl mx-0">
              Browse our handpicked list of worldwide destinations categorized by travel style and interest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mappedCategories.map((cat) => (
              <div 
                key={cat.id} 
                className="p-6 rounded-[28px] bg-white dark:bg-[#081125] border border-[var(--border)] shadow-sm hover:border-[var(--accent)]/20 transition-all duration-300 space-y-4 text-left"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/25 flex-shrink-0">
                    {getCategoryIcon(cat.id, "w-5 h-5")}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">{cat.name}</h3>
                    <p className="text-[10px] text-[var(--text-secondary)]">{cat.description}</p>
                  </div>
                </div>
                
                {/* List of destinations in the category */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {cat.destinations.map((dest, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => {
                        const targetId = dest.toLowerCase().replace(/ /g, '-');
                        navigate(`/destination/${targetId}`);
                      }}
                      className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 cursor-pointer transition-all duration-200"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div> {/* Close print:hidden */}

      {/* Luxury Travel Brochure PDF Print Layout */}
      <div className="hidden print:block w-full text-left bg-white text-slate-900 font-sans p-8">
        
        {/* Cover Page */}
        <div className="page-break flex flex-col justify-between min-h-[96vh] border-[6px] border-double border-amber-600/35 p-10 rounded-[36px] bg-white relative overflow-hidden animate-fade-in">
          {/* Background monogram letter */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <span className="text-[28rem] font-serif font-extralight text-amber-600/[0.03] select-none leading-none opacity-40">
              {destination.name ? destination.name.charAt(0).toUpperCase() : 'T'}
            </span>
          </div>

          {/* Subtle design accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/10 rounded-full -translate-y-32 translate-x-32 pointer-events-none border border-amber-500/5" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-50/10 rounded-full translate-y-24 -translate-x-24 pointer-events-none border border-amber-500/5" />

          {/* Cover Header */}
          <div className="text-center mt-6 relative z-10">
            <span className="text-[10px] font-bold tracking-[0.25em] text-amber-700/80 uppercase block mb-3 font-mono">
              ★ Curated Travel Guide & Excursion Companion ★
            </span>
            <h1 className="text-5xl font-extralight tracking-widest text-slate-900 uppercase leading-none mb-2 font-serif">
              {destination.name}
            </h1>
            <span className="text-base font-light text-amber-600 tracking-[0.2em] uppercase block">
              {destination.country}
            </span>
            <div className="w-20 h-[1.5px] bg-amber-500/50 mx-auto mt-4" />
          </div>

          {/* Editorial Visual Banner */}
          {destination.image && (
            <div className="my-5 relative z-10 w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center avoid-break">
              <img 
                src={destination.image} 
                alt={destination.name} 
                className="w-full h-full object-cover grayscale-[15%] sepia-[10%] contrast-[95%] brightness-[96%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
            </div>
          )}

          {/* Description */}
          <div className="max-w-xl mx-auto text-center my-4 relative z-10">
            <p className="text-xs leading-relaxed text-slate-500 font-light italic px-6">
              "{destination.description}"
            </p>
          </div>

          {/* Bento Grid Profile */}
          <div className="grid grid-cols-3 gap-3.5 mt-4 relative z-10">
            <div className="p-3.5 bg-amber-50/10 border border-amber-600/10 rounded-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500/30" />
              <span className="text-[8.5px] uppercase tracking-wider text-amber-800/80 font-bold flex items-center gap-1 font-mono">
                <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Safety Index
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">{destination.safety}</span>
            </div>
            <div className="p-3.5 bg-amber-50/10 border border-amber-600/10 rounded-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500/30" />
              <span className="text-[8.5px] uppercase tracking-wider text-amber-800/80 font-bold flex items-center gap-1 font-mono">
                <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Est. Budget
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">{destination.budget.daily}</span>
            </div>
            <div className="p-3.5 bg-amber-50/10 border border-amber-600/10 rounded-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500/30" />
              <span className="text-[8.5px] uppercase tracking-wider text-amber-800/80 font-bold flex items-center gap-1 font-mono">
                <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Best Season
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">{destination.bestTime}</span>
            </div>
            <div className="p-3.5 bg-amber-50/10 border border-amber-600/10 rounded-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500/30" />
              <span className="text-[8.5px] uppercase tracking-wider text-amber-800/80 font-bold flex items-center gap-1 font-mono">
                <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Language
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block truncate">{getDestinationLanguage(destination)}</span>
            </div>
            <div className="p-3.5 bg-amber-50/10 border border-amber-600/10 rounded-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500/30" />
              <span className="text-[8.5px] uppercase tracking-wider text-amber-800/80 font-bold flex items-center gap-1 font-mono">
                <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Time Zone
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block truncate">{weather.timezone || destination.timezone || 'UTC'}</span>
            </div>
            <div className="p-3.5 bg-amber-50/10 border border-amber-600/10 rounded-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500/30" />
              <span className="text-[8.5px] uppercase tracking-wider text-amber-800/80 font-bold flex items-center gap-1 font-mono">
                <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
                Temperature
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">{weather.temp || destination.weather.temp}</span>
            </div>
          </div>

          <div className="text-center mt-6 text-[8.5px] text-slate-400 font-mono tracking-widest relative z-10">
            COMPILED IN JUNE 2026 • TRIP-READY.COM
          </div>
        </div>

        {/* Page 2: Curated Attractions */}
        <div className="page-break border-[6px] border-double border-amber-600/35 p-10 rounded-[36px] bg-white min-h-[96vh] flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h2 className="text-2xl font-light tracking-wide text-slate-900 uppercase font-serif">
                Curated Attractions & Landmarks
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1 font-mono">
                Top locations handpicked for cultural, historic, and aesthetic significance
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {attractions && attractions.slice(0, 10).map((spot, idx) => (
                <div key={idx} className="p-4 border border-slate-200/80 rounded-2xl flex gap-3.5 avoid-break bg-amber-50/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-[4px] h-full bg-amber-600/35" />
                  
                  {/* Big Number Index */}
                  <div className="text-3xl font-extralight text-amber-600/80 font-serif shrink-0 select-none leading-none pt-1">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[7.5px] bg-amber-600/5 text-amber-800 border border-amber-600/15 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                          {spot.category || 'Sight'}
                        </span>
                        <span className="text-[9px] font-bold text-amber-600 flex items-center gap-0.5 select-none">
                          ★★★★★
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 mt-2 line-clamp-1 font-serif">{spot.name}</h3>
                      <p className="text-[9.5px] text-slate-500 mt-1 line-clamp-3 leading-relaxed font-light">
                        {spot.description || `A premier destination representing the best of local ${spot.category ? spot.category.toLowerCase() : 'cultural'} sights.`}
                      </p>
                    </div>
                    {spot.address && (
                      <p className="text-[8px] text-slate-400 font-mono mt-3 border-t border-slate-100 pt-2 truncate">
                        <MapPin className="inline-block mr-1 text-[var(--accent)]" size={10} />{spot.address}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center text-[9px] text-slate-400 font-mono mt-4">
            {destination.name} TRAVEL GUIDE • PAGE 2
          </div>
        </div>

        {/* Page 3: Emergency, Phrases & Checklist */}
        <div className="border-[6px] border-double border-amber-600/35 p-10 rounded-[36px] bg-white min-h-[96vh] flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h2 className="text-2xl font-light tracking-wide text-slate-900 uppercase font-serif">
                Travel Vault & Essentials
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1 font-mono">
                Vital emergency contacts, local phrase translations, and checklist
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Left Col: Emergency Contacts & Weather */}
              <div className="space-y-5">
                {/* Emergency Contacts */}
                <div className="p-4 border border-amber-600/15 rounded-2xl bg-amber-50/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-rose-500/35" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200/80 pb-2 mb-3 flex items-center gap-1.5 font-mono">
                    <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    Emergency Directory
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider font-mono">Police</span>
                      <span className="text-[10.5px] font-bold text-slate-800 block mt-0.5">{destination.emergency?.police || '112'}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider font-mono">Ambulance</span>
                      <span className="text-[10.5px] font-bold text-slate-800 block mt-0.5">{destination.emergency?.ambulance || '112'}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider font-mono">Fire Brigade</span>
                      <span className="text-[10.5px] font-bold text-slate-800 block mt-0.5">{destination.emergency?.fire || '112'}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider font-mono">Tourist Info</span>
                      <span className="text-[10.5px] font-bold text-slate-800 block mt-0.5 truncate">{destination.emergency?.info || '112'}</span>
                    </div>
                  </div>
                </div>


                {/* Weather Forecast */}
                <div className="p-5 border border-amber-600/15 rounded-2xl bg-amber-50/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-500/45" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200/80 pb-2 mb-3 flex items-center gap-1.5 font-mono">
                    <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
                    5-Day Forecast Grid
                  </h3>
                  <div className="space-y-2">
                    {dailyForecast && dailyForecast.slice(0, 5).map((day, idx) => {
                      const condLower = day.condition.toLowerCase();
                      const isClear = condLower.includes('sunny') || condLower.includes('clear') || condLower.includes('fair');
                      const isRain = condLower.includes('rain') || condLower.includes('drizzle') || condLower.includes('shower');
                      const isStorm = condLower.includes('storm') || condLower.includes('thunder');
                      
                      return (
                        <div key={idx} className="flex justify-between items-center text-[10.5px] border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                          <span className="font-semibold text-slate-650 w-20">{day.day}</span>
                          <span className="text-slate-500 font-mono text-[9.5px] flex-1 text-left flex items-center gap-1">
                            {isClear ? (
                              <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m12.72-12.72l-1.41 1.41"/></svg>
                            ) : isRain ? (
                              <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25M8 16v6m4-6v6m4-6v6"/></svg>
                            ) : isStorm ? (
                              <svg className="w-3.5 h-3.5 text-slate-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 16.9A5 5 0 0018 8h-1.26A8 8 0 104 16.25M13 22l-3-6h6l-3 6"/></svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25"/></svg>
                            )}
                            {day.condition}
                          </span>
                          <span className="font-bold text-slate-800 font-mono">{day.temp}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Col: Translation Guide */}
              <div className="p-5 border border-amber-600/15 rounded-2xl bg-amber-50/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-600/35" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200/80 pb-2 mb-3 flex items-center gap-1.5 font-mono">
                  <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  Local Phrasebook ({getDestinationLanguage(destination)})
                </h3>
                <div className="space-y-3">
                  {getCuratedPhrases(getDestinationLanguage(destination)).slice(0, 6).map((phrase, idx) => (
                    <div key={idx} className="text-left border-b border-amber-600/10 pb-2 last:border-0 last:pb-0">
                      <span className="text-[9px] text-slate-450 font-mono block">{phrase.eng}</span>
                      <span className="text-[11.5px] font-bold text-slate-800 block mt-0.5">{phrase.loc}</span>
                      <span className="text-[9px] text-slate-550 italic block">Phonetic: {phrase.ph}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes Lined Section */}
            <div className="mt-6 border border-amber-600/15 p-5 rounded-2xl bg-amber-50/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-600/35" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200/80 pb-2 mb-4 text-left font-mono flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Travel Notes & Itinerary Planner
              </h3>
              <div className="space-y-4 py-2">
                <div className="w-full h-[1px] bg-amber-600/15" />
                <div className="w-full h-[1px] bg-amber-600/15" />
                <div className="w-full h-[1px] bg-amber-600/15" />
                <div className="w-full h-[1px] bg-amber-600/15" />
                <div className="w-full h-[1px] bg-amber-600/15" />
                <div className="w-full h-[1px] bg-amber-600/15" />
              </div>
            </div>
          </div>
          <div className="text-center text-[9px] text-slate-400 font-mono mt-4">
            {destination.name} TRAVEL GUIDE • PAGE 3
          </div>
        </div>
        {!user && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/10 dark:bg-black/40 px-6">
            <div className="w-full max-w-xl bg-white/20 dark:bg-dark-300/60 backdrop-blur-2xl border border-white/10 dark:border-white/[0.08] rounded-[36px] shadow-[0_24px_60px_rgba(0,0,0,0.5)] p-10 text-center space-y-6">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-luxury-primary dark:text-white">
                Unlock Your Personalized Travel Experience
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-350 font-light leading-relaxed max-w-md mx-auto">
                Create a free TripReady account to access complete attractions, AI recommendations, personalized itineraries, travel insights, emergency contact details, nearby hospital lookups, and local transit guides.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link 
                  to="/auth" 
                  state={{ mode: 'signup', from: location.pathname }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-tr from-[var(--accent)] to-indigo-600 text-white font-semibold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Create Free Account
                </Link>
                <Link 
                  to="/auth" 
                  state={{ from: location.pathname }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 dark:bg-white/[0.04] border border-white/10 text-luxury-primary dark:text-white font-semibold text-xs hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

/**
 * Helper to resolve timezone dynamically based on country data registry.
 */
const findTimezoneForCountry = (countryName) => {
  if (!countryName) return 'Local Time';
  const cleanName = countryName.toLowerCase().trim().replace(/ /g, '_');
  
  // Direct match by key (e.g. switzerland, south_africa)
  if (countriesData[cleanName] && countriesData[cleanName].basic?.timezones) {
    return countriesData[cleanName].basic.timezones;
  }
  
  // Case-insensitive search by name property
  for (const key in countriesData) {
    const c = countriesData[key];
    if (c.name && c.name.toLowerCase() === countryName.toLowerCase()) {
      if (c.basic?.timezones) return c.basic.timezones;
    }
  }
  
  return 'Local Time';
};

export default function DestinationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dbDestination, setDbDestination] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);

  const setEnrichedDbDestination = (destObj) => {
    if (!destObj) {
      setDbDestination(destObj);
      return;
    }
    const lowerId = destObj.id ? destObj.id.toLowerCase().replace(/[-_]/g, '') : '';
    const kbKey = Object.keys(attractionKnowledgeBase).find(key => {
      const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      return lowerId === normKey || lowerId.includes(normKey) || normKey.includes(lowerId) || (lowerId === 'sf' && normKey === 'sanfrancisco') || (lowerId === 'saintlouis' && normKey === 'stlouis');
    });

    if (kbKey && attractionKnowledgeBase[kbKey]) {
      const enriched = { ...destObj };
      enriched.attractions = attractionKnowledgeBase[kbKey].map(attr => attr.name);
      if (realCityFoodAndTransit[kbKey]) {
        enriched.foods = realCityFoodAndTransit[kbKey].foods;
        enriched.transport = realCityFoodAndTransit[kbKey].transports;
      }
      setDbDestination(enriched);
    } else {
      setDbDestination(destObj);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setDbLoading(true);

    function parseSplitSlug(slug) {
      const match = slug.match(/-(\d+)$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const baseSlug = slug.substring(0, slug.lastIndexOf(`-${match[1]}`));
        return { baseSlug, index };
      }
      return { baseSlug: slug, index: 0 };
    }

    async function loadFromDb() {
      // 1. Check if it's in the static topDestinations first
      const existing = topDestinations.find((d) => d.id === id);
      if (existing) {
        if (isMounted) {
          setEnrichedDbDestination(existing);
          setDbLoading(false);
        }
        return;
      }

      // Check extraDestinationsData
      const extra = extraDestinationsData[id];
      if (extra) {
        const extraKey = id.replace(/-/g, ' ');
        const nameCap = extraKey.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const destObj = {
          id: id,
          name: nameCap,
          country: extra.country,
          flag: extra.flag,
          rank: 'Curated',
          image: getCityImage(nameCap, extra.country),
          preview: extra.preview,
          description: `${nameCap} is a spectacular world-class destination. ${extra.preview} From local hospitality to breathtaking views, it represents the absolute peak of adventure and relaxation.`,
          weather: { temp: '20°C', condition: 'Sunny', humidity: '55%', airQuality: 'Excellent' },
          bestTime: extra.bestTime,
          budget: { daily: extra.budget, hotel: '$80-250', food: '$20-60', transport: '$10-25' },
          safety: 'Very Safe',
          timezone: findTimezoneForCountry(extra.country),
          attractions: ['Primary Heritage Site', 'Scenic Panoramic Deck', 'Central Market Square'],
          foods: ['Regional Delicacy', 'Traditional Pastry', 'Heritage Stew'],
          transport: ['Local Metro System', 'Private Car Service', 'Scenic Hiking Trails'],
          culture: 'A warm smile is customary. Respect historical landmarks and local natural preservation rules.',
          visa: 'Visa-free entry or immediate visa on arrival provided for most international travelers.'
        };
        if (isMounted) {
          setEnrichedDbDestination(destObj);
          setDbLoading(false);
        }
        return;
      }

      try {
        const { baseSlug, index: splitIdx } = parseSplitSlug(id);

        // Query all database tables in parallel to optimize DB load latency
        const [cityRes, countryRes, stateRes, attractionRes] = await Promise.all([
          supabase.from('cities').select('*, countries(flag)').eq('slug', id).maybeSingle(),
          supabase.from('countries').select('*').eq('slug', id).maybeSingle(),
          supabase.from('states').select('*').eq('slug', id).maybeSingle(),
          supabase.from('attractions').select('*, cities(name, country_name)').eq('slug', baseSlug).maybeSingle()
        ]);

        const cityData = cityRes.data;
        const countryData = countryRes.data;
        const stateData = stateRes.data;
        const attractionData = attractionRes.data;

        if (cityData) {
          const countryFlag = cityData.countries?.flag || '🌍';
          const nameCap = cityData.name;
          const destObj = {
            id: id,
            name: nameCap,
            country: cityData.country_name,
            flag: countryFlag,
            rank: 'City Guide',
            image: getCityImage(nameCap, cityData.country_name),
            preview: `An extraordinary, culturally rich journey to the heart of ${cityData.name}, ${cityData.country_name}.`,
            description: `${nameCap} is a spectacular city located in ${cityData.state_name ? cityData.state_name + ', ' : ''}${cityData.country_name}. It represents a beautiful combination of deep heritage, local warmth, and stunning urban landscapes.`,
            weather: { temp: '25°C', condition: 'Sunny & Warm', humidity: '52%', airQuality: 'Good' },
            bestTime: 'October - April',
            budget: { daily: '$90-220', hotel: '$60-180', food: '$20-50', transport: '$10-25' },
            safety: 'Safe & Welcoming',
            timezone: findTimezoneForCountry(cityData.country_name),
            attractions: [`Historic ${nameCap} Center`, `Scenic ${nameCap} Overlook`, `Central ${nameCap} Culture Square`, `Heritage Museum of ${cityData.country_name}`],
            foods: ['Traditional Specialty', 'Local Spiced Stew', 'Signature Pastry'],
            transport: ['Local Transit System', 'Chauffeured Car Charter', 'Walkable Boulevards'],
            culture: `Respect local customs and dress codes in ${cityData.country_name}. A friendly smile and basic courtesy go a long way.`,
            visa: `eVisa or visa-free entry is provided for most international travelers to ${cityData.country_name}.`
          };
          if (isMounted) {
            setEnrichedDbDestination(destObj);
            setDbLoading(false);
          }
          return;
        }

        if (countryData) {
          const nameCap = countryData.name;
          const destObj = {
            id: id,
            name: nameCap,
            country: nameCap,
            flag: countryData.flag || '🌍',
            rank: 'Country Guide',
            image: getCityImage(nameCap, nameCap),
            preview: `Explore the vibrant regions, nature, and heritage of ${nameCap}.`,
            description: `${nameCap} is a stunning country located in the continent of ${countryData.continent || 'the world'}. It offers travelers a diverse range of scenic destinations, rich culture, and historic landmarks.`,
            weather: { temp: '22°C', condition: 'Clear Skies', humidity: '55%', airQuality: 'Excellent' },
            bestTime: 'September - May',
            budget: { daily: '$100-250', hotel: '$70-200', food: '$25-60', transport: '$12-30' },
            safety: 'Very Safe',
            timezone: findTimezoneForCountry(countryData.name),
            attractions: [`Capital City of ${countryData.capital || 'Nation'}`, `Scenic National Parks`, `Historic Cultural Sites`, `Local Heritage Landmarks`],
            foods: ['National Delicacy', 'Traditional Spiced Rice', 'Popular Street Snack'],
            transport: ['National Rail & Intercity Buses', 'Domestic Flight Connections', 'Car Rentals'],
            culture: `Be mindful of regional customs. Courteous behavior and respect for local traditions are highly appreciated.`,
            visa: `Visa requirements vary by nationality. Check official government channels for ${nameCap} prior to travel.`
          };
          if (isMounted) {
            setEnrichedDbDestination(destObj);
            setDbLoading(false);
          }
          return;
        }

        if (stateData) {
          const nameCap = stateData.name;
          const destObj = {
            id: id,
            name: nameCap,
            country: stateData.country_name,
            flag: '🏛️',
            rank: 'State Guide',
            image: getCityImage(nameCap, stateData.country_name),
            preview: `Discover the scenic cities and landmarks of ${nameCap} state.`,
            description: `${nameCap} is a state/region located in ${stateData.country_name}. It holds a unique cultural identity with numerous cities and attractions waiting to be explored.`,
            weather: { temp: '23°C', condition: 'Partly Cloudy', humidity: '50%', airQuality: 'Good' },
            bestTime: 'Year-Round',
            budget: { daily: '$90-220', hotel: '$60-180', food: '$20-50', transport: '$10-25' },
            safety: 'Safe & Welcoming',
            timezone: findTimezoneForCountry(stateData.country_name),
            attractions: [`Explore ${nameCap} State Capital`, `Local Regional Sights`, `Central State Parks`],
            foods: ['Regional Delicacy', 'Local Specialties'],
            transport: ['State Highways', 'Local Public Transport'],
            culture: `Standard cultural protocols of ${stateData.country_name} apply.`,
            visa: `eVisa or visa-free entry is provided for most international travelers to ${stateData.country_name}.`
          };
          if (isMounted) {
            setEnrichedDbDestination(destObj);
            setDbLoading(false);
          }
          return;
        }

        if (attractionData) {
          const { baseSlug, index: splitIdx } = parseSplitSlug(id);
          let nameCap = attractionData.name;
          
          let cleanName = nameCap.replace(/\s+/g, ' ').trim();
          if (/^1\.\s+/.test(cleanName)) {
            cleanName = cleanName.replace(/^1\.\s+/, '');
          }
          
          if (/\s+\d+\.\s+/.test(cleanName)) {
            const parts = cleanName.split(/\s+\d+\.\s+/).map(p => p.trim()).filter(Boolean);
            if (splitIdx < parts.length) {
              nameCap = parts[splitIdx];
            }
          }
          
          const cityName = attractionData.cities?.name || 'Local City';
          const countryName = attractionData.cities?.country_name || 'Global';
          
          let parsedDesc = {};
          try {
            if (attractionData.description && attractionData.description.startsWith('{')) {
              parsedDesc = JSON.parse(attractionData.description);
            }
          } catch (e) {
            // Ignore
          }

          const destObj = {
            id: id,
            name: nameCap,
            country: countryName,
            flag: '📍',
            rank: 'Attraction Guide',
            image: parsedDesc.image || getCityImage(nameCap, countryName),
            latitude: attractionData.latitude,
            longitude: attractionData.longitude,
            preview: parsedDesc.seoDescription || `Visit the iconic ${nameCap} attraction in ${cityName}.`,
            description: parsedDesc.description || attractionData.description || `${nameCap} is a famous ${attractionData.category || 'landmark'} located in ${cityName}, ${countryName}.`,
            weather: { temp: '24°C', condition: 'Sunny & Pleasant', humidity: '48%', airQuality: 'Excellent' },
            bestTime: 'Morning / Late Afternoon',
            budget: { daily: '$50-150', hotel: '$60-180', food: '$20-50', transport: '$10-25' },
            safety: 'Very Safe',
            timezone: findTimezoneForCountry(countryName),
            attractions: [nameCap, `Sightseeing around ${cityName}`],
            foods: ['Local Street Food', 'Signature Sips'],
            transport: ['Walkable Area', 'Local Cab Hailing'],
            culture: `Please respect the monument/attraction rules, keep the environment clean, and follow guidelines.`,
            visa: `eVisa or visa-free entry is provided for most international travelers to ${countryName}.`
          };
          if (isMounted) {
            setEnrichedDbDestination(destObj);
            setDbLoading(false);
          }
          return;
        }

        // 6. Dynamic AI Fallback Builder
        const parsedId = id ? id.replace(/-/g, ' ') : '';
        const nameCap = parsedId.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const matchedCountry = countries.find(c => 
          c.cities.some(city => city.toLowerCase() === parsedId.toLowerCase())
        ) || { name: 'Worldwide', flag: '🌍' };

        const fallbackObj = {
          id: id || 'custom',
          name: nameCap || 'Curated Destination',
          country: matchedCountry.name,
          flag: matchedCountry.flag,
          rank: 'AI Curated',
          image: getCityImage(nameCap, matchedCountry.name),
          preview: `An extraordinary, culturally rich journey to the heart of ${matchedCountry.name}.`,
          description: `${nameCap} is a spectacular world-class destination located in ${matchedCountry.name}. It represents a beautiful combination of deep heritage, local warmth, and stunning scenic landscapes, providing an unforgettable travel experience for adventurers and leisure seekers alike.`,
          weather: { temp: '26°C', condition: 'Sunny & Pleasant', humidity: '50%', airQuality: 'Excellent' },
          bestTime: 'October - April',
          budget: { daily: '$90-220', hotel: '$60-180', food: '$20-50', transport: '$10-25' },
          safety: 'Safe & Welcoming',
          timezone: findTimezoneForCountry(matchedCountry.name),
          attractions: [`Historic ${nameCap} Center`, `Scenic ${nameCap} Overlook`, `Central ${nameCap} Culture Square`, `Heritage Museum of ${matchedCountry.name}`],
          foods: ['Traditional Specialty', 'Local Spiced Stew', 'Signature Pastry'],
          transport: ['Local Transit System', 'Chauffeured Car Charter', 'Walkable Boulevards'],
          culture: `Respect local customs and dress codes. A friendly smile and basic courtesy go a long way.`,
          visa: `eVisa or visa-free entry is provided for most international travelers to ${matchedCountry.name}.`
        };

        if (isMounted) {
          setEnrichedDbDestination(fallbackObj);
          setDbLoading(false);
        }
      } catch (e) {
        console.error("Failed to load details from Supabase:", e);
        // Fallback on error
        const parsedId = id ? id.replace(/-/g, ' ') : '';
        const nameCap = parsedId.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const fallbackObj = {
          id: id || 'custom',
          name: nameCap,
          country: 'Worldwide',
          flag: '🌍',
          rank: 'AI Curated',
          image: getCityImage(nameCap, 'Worldwide'),
          preview: `An extraordinary journey.`,
          description: `${nameCap} is a spectacular destination.`,
          weather: { temp: '25°C', condition: 'Sunny', humidity: '50%', airQuality: 'Excellent' },
          bestTime: 'October - April',
          budget: { daily: '$90-220', hotel: '$60-180', food: '$20-50', transport: '$10-25' },
          safety: 'Safe & Welcoming',
          timezone: 'Local Time',
          attractions: [`Historic ${nameCap} Center`],
          foods: ['Local Food'],
          transport: ['Local Transit'],
          culture: `Respect local customs.`,
          visa: `Check visa entry guidelines.`
        };
        if (isMounted) {
          setEnrichedDbDestination(fallbackObj);
          setDbLoading(false);
        }
      }
    }

    loadFromDb();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (dbLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)] text-[var(--text-primary)] pt-32">
        <div className="max-w-md text-center space-y-6 bg-white dark:bg-[#071125] p-10 rounded-[32px] border border-slate-100 dark:border-white/[0.04] shadow-premium">
          <div className="w-16 h-16 border-4 border-t-[var(--accent)] border-slate-200 dark:border-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="font-heading text-2xl font-bold">Loading Destination Guide...</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
            Retrieving destination analytics & weather charts...
          </p>
        </div>
      </div>
    );
  }

  return <DestinationPageContent destination={dbDestination} />;
}
