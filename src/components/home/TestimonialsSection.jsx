import { Heart, Quote, Compass } from 'lucide-react';
import { featuredTestimonials } from '../../data';
import { TestimonialsColumn } from '../ui/testimonials-columns-1';

const travelTestimonials = [
  {
    text: "Trip Ready revolutionized our travel planning, streamlining cost analysis and itineraries. The cloud-based platform keeps us productive and organized, even remotely.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Getting Trip Ready set up was smooth and quick. The customizable, user-friendly interface made mapping our team retreat effortless.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The concierge support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our global satisfaction.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "Trip Ready's seamless budget integration enhanced our travel operations and budget efficiency. Highly recommend for its intuitive interface.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust itinerary features and quick support have transformed our travel workflow, making us significantly more efficient.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined all flight checkpoints, improving overall business performance.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our international flight bookings improved with a user-friendly layout and incredibly positive team feedback.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a travel planning solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using Trip Ready, our online travel bookings and budgeting significantly improved, boosting global trip performance.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

const firstColumn = travelTestimonials.slice(0, 3);
const secondColumn = travelTestimonials.slice(3, 6);
const thirdColumn = travelTestimonials.slice(6, 9);

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-white dark:bg-[#020813] text-slate-900 dark:text-white border-t border-gray-100 dark:border-white/[0.04] relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
            <Heart className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Customer Trust</span>
          </div>
          <h2 className="section-title text-slate-900 dark:text-white">
            Travel stories, <span className="italic font-light text-slate-500 dark:text-slate-400">shared by others.</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto text-slate-500 dark:text-slate-400 text-sm mt-3 font-light">
            See what our worldwide clients and seasoned explorers have to say about planning with tripready.
          </p>
        </div>

        {/* Featured Testimonials Editorial (Breathing Room Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {featuredTestimonials.slice(0, 2).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-[#081125] border border-gray-200 dark:border-white/[0.08] p-8 sm:p-10 rounded-[28px] relative flex flex-col justify-between hover:border-[var(--accent)]/30 hover:shadow-premium transition-all text-left shadow-lg shadow-black/[0.02] dark:shadow-black/[0.2]"
            >
              <div className="absolute top-6 right-6 opacity-[0.05] dark:opacity-[0.04] text-slate-900 dark:text-white">
                <Quote className="w-16 h-16" />
              </div>

              <div className="space-y-6">
                <blockquote className="font-heading text-lg sm:text-xl font-light text-slate-800 dark:text-slate-200 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-heading font-bold text-sm shrink-0 border border-[var(--accent)]/20 shadow-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-light">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[10px] bg-gray-50 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-gray-200 dark:border-white/[0.04]">
                    <Compass className="w-3.5 h-3.5 text-[var(--accent)]" /> {testimonial.trip}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Triple Column Scrolling Grid (Framer Motion Parallax) */}
        <div className="relative">
          {/* Top & Bottom linear-gradient mask fades */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white dark:from-[#020813] to-transparent z-25 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white dark:from-[#020813] to-transparent z-25 pointer-events-none" />

          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[640px] overflow-hidden relative z-10 py-4">
            <TestimonialsColumn testimonials={firstColumn} duration={25} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={29} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={27} />
          </div>
        </div>

      </div>
    </section>
  );
}
