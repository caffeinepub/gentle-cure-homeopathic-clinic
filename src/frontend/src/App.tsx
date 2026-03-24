import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Award,
  Baby,
  BarChart3,
  Brain,
  CheckCircle,
  ChevronDown,
  Clock,
  FlaskConical,
  Globe,
  HeartPulse,
  Leaf,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  SiFacebook,
  SiInstagram,
  SiLinkedin,
  SiWhatsapp,
} from "react-icons/si";
import { toast } from "sonner";
import { ConsultationType, InquiryStatus, PaymentStatus } from "./backend.d";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useBookConsultation,
  useCreateCheckoutSession,
  useDeleteInquiry,
  useGetBookings,
  useGetInquiries,
  useIsAdmin,
  useSubmitInquiry,
  useUpdateBookingPaymentStatus,
  useUpdateInquiryStatus,
} from "./hooks/useQueries";

// ── Currency Context ──────────────────────────────────────────────────────────
type Currency = "INR" | "USD" | "EUR" | "GBP";
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};
const FEES: Record<string, Record<Currency, string>> = {
  initial: { INR: "₹2,000", USD: "$25", EUR: "€23", GBP: "£20" },
  followup: { INR: "₹1,000", USD: "$13", EUR: "€12", GBP: "£11" },
};
const CurrencyCtx = createContext<{
  currency: Currency;
  setCurrency: (c: Currency) => void;
}>({
  currency: "INR",
  setCurrency: () => {},
});
const useCurrency = () => useContext(CurrencyCtx);

// ── Testimonials data ─────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    country: "India",
    condition: "Chronic Migraine",
    quote:
      "After 8 years of debilitating migraines with no lasting relief from conventional medicine, Dr. Bhati's treatment gave me my life back within 6 months. Truly miraculous.",
  },
  {
    name: "David Thompson",
    country: "United Kingdom",
    condition: "Psoriasis",
    quote:
      "The online consultation was seamless and professional. My psoriasis of 12 years has cleared by 90% after following Dr. Bhati's prescribed remedies. Highly recommended.",
  },
  {
    name: "Aisha Al-Rashid",
    country: "UAE",
    condition: "Thyroid Disorder",
    quote:
      "I was skeptical about homeopathy but Dr. Bhati's expertise and patient explanations convinced me. My thyroid levels are now normal for the first time in 5 years.",
  },
  {
    name: "Maria Santos",
    country: "Canada",
    condition: "Childhood Asthma",
    quote:
      "My 7-year-old son used to have asthma attacks every month. After treatment with Dr. Bhati, it has been 14 months without a single episode. Forever grateful.",
  },
  {
    name: "John Kowalski",
    country: "USA",
    condition: "Anxiety & Depression",
    quote:
      "The holistic approach Dr. Bhati takes is unlike anything I experienced before. The constitutional remedy he prescribed changed not just my anxiety, but my entire outlook on life.",
  },
];

// ── Countries served ──────────────────────────────────────────────────────────
const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "UAE",
  "Germany",
  "Singapore",
  "Malaysia",
  "South Africa",
  "New Zealand",
  "Netherlands",
  "Sweden",
  "Kenya",
  "Nigeria",
];

// ── Services data ─────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: <HeartPulse className="w-7 h-7" />,
    title: "Chronic Disease Treatment",
    desc: "Comprehensive care for diabetes, hypertension, arthritis, thyroid disorders, and other long-term conditions with natural homeopathic remedies.",
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: "Online International Consultation",
    desc: "Secure video and chat consultations for patients worldwide. Medicines delivered to your door anywhere in the world.",
  },
  {
    icon: <Baby className="w-7 h-7" />,
    title: "Pediatric Homeopathy",
    desc: "Gentle, safe, and effective treatment for children's health issues including recurrent infections, behavioral concerns, and developmental support.",
  },
  {
    icon: <Leaf className="w-7 h-7" />,
    title: "Women's Health",
    desc: "Specialized care for PCOD/PCOS, menstrual disorders, menopausal symptoms, hormonal imbalances, and fertility challenges.",
  },
  {
    icon: <Sparkles className="w-7 h-7" />,
    title: "Skin & Hair Conditions",
    desc: "Effective treatment for eczema, psoriasis, acne, hair fall, alopecia, and other dermatological conditions from their root cause.",
  },
  {
    icon: <Brain className="w-7 h-7" />,
    title: "Mental & Emotional Wellbeing",
    desc: "Constitutional treatment for anxiety, depression, stress, insomnia, and emotional trauma using classical homeopathic principles.",
  },
];

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What is homeopathy and how does it work?",
    a: "Homeopathy is a 200-year-old system of medicine based on the principle of 'like cures like.' Ultra-diluted natural substances stimulate the body's own healing mechanisms. It treats the whole person — physical, mental, and emotional — rather than just symptoms.",
  },
  {
    q: "How does an online consultation work?",
    a: "You book through our website and pay securely online. Dr. Bhati conducts a detailed 60-minute consultation via video call, taking your complete case history. Medicines are then prescribed and shipped internationally within 3-5 business days.",
  },
  {
    q: "How long does homeopathic treatment take?",
    a: "Duration depends on the nature and chronicity of the disease. Acute conditions may resolve in days to weeks. Chronic conditions typically require 3–12 months of treatment. Dr. Bhati provides monthly follow-ups to monitor progress.",
  },
  {
    q: "Are homeopathic medicines safe? Any side effects?",
    a: "Homeopathic remedies are prepared through serial dilution and are non-toxic. They are safe for all ages including infants, pregnant women, and the elderly, with no known side effects or drug interactions.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit and debit cards through our secure Stripe payment gateway. International patients can pay in USD, EUR, or GBP. Indian patients can pay in INR via card, UPI, or net banking.",
  },
  {
    q: "What should I expect at my first appointment?",
    a: "Your initial consultation is 60 minutes. Dr. Bhati will take a comprehensive case history covering your chief complaint, medical history, lifestyle, dietary habits, and mental-emotional state. This holistic analysis forms the basis of your individualized prescription.",
  },
];

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [showAdmin, setShowAdmin] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    // Check admin URL param
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("admin") === "true" ||
      window.location.pathname === "/admin"
    ) {
      setShowAdmin(true);
    }
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <CurrencyCtx.Provider value={{ currency, setCurrency }}>
      <div className="min-h-screen bg-background text-foreground">
        <Toaster richColors position="top-right" />
        <Navbar
          scrolled={navScrolled}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
          onBook={() => setBookingOpen(true)}
        />
        {showAdmin ? (
          <AdminDashboard onClose={() => setShowAdmin(false)} />
        ) : (
          <main>
            <HeroSection onBook={() => setBookingOpen(true)} />
            <AboutSection />
            <ServicesSection />
            <HowItWorksSection />
            <InternationalSection onBook={() => setBookingOpen(true)} />
            <TestimonialsSection />
            <FAQSection />
            <ContactSection />
            <Footer onBook={() => setBookingOpen(true)} />
          </main>
        )}
        <BookingModal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
        />
        <WhatsAppButton />
      </div>
    </CurrencyCtx.Provider>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({
  scrolled,
  mobileOpen,
  setMobileOpen,
  onBook,
}: {
  scrolled: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  onBook: () => void;
}) {
  const { currency, setCurrency } = useCurrency();
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "International", href: "#international" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-elegant"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="flex flex-col leading-none"
          data-ocid="nav.link"
        >
          <span className="font-serif text-xl font-semibold text-primary">
            Gentle Cure
          </span>
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            Homeopathic Clinic
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              data-ocid="nav.link"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Currency toggle */}
          <Select
            value={currency}
            onValueChange={(v) => setCurrency(v as Currency)}
          >
            <SelectTrigger className="w-24 h-8 text-xs" data-ocid="nav.select">
              <Globe className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["INR", "USD", "EUR", "GBP"] as Currency[]).map((c) => (
                <SelectItem key={c} value={c}>
                  {CURRENCY_SYMBOLS[c]} {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={onBook}
            className="bg-primary text-primary-foreground hover:bg-forest-dark"
            data-ocid="nav.primary_button"
          >
            Book Consultation
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="container px-4 py-4 flex flex-col gap-4">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium py-2 border-b border-border/50 text-foreground/80 hover:text-primary transition-colors"
                  data-ocid="nav.link"
                >
                  {l.label}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <Select
                  value={currency}
                  onValueChange={(v) => setCurrency(v as Currency)}
                >
                  <SelectTrigger
                    className="w-28 h-8 text-xs"
                    data-ocid="nav.select"
                  >
                    <Globe className="w-3 h-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["INR", "USD", "EUR", "GBP"] as Currency[]).map((c) => (
                      <SelectItem key={c} value={c}>
                        {CURRENCY_SYMBOLS[c]} {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    onBook();
                  }}
                  className="bg-primary text-primary-foreground flex-1"
                  data-ocid="nav.primary_button"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({ onBook }: { onBook: () => void }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      data-ocid="hero.section"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-clinic-bg.dim_1600x900.jpg"
          alt="Gentle Cure Homeopathic Clinic"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Badge className="mb-6 bg-accent/20 text-accent-foreground border-accent/40 px-4 py-1">
              <Leaf className="w-3 h-3 mr-1" /> Certified Homeopathic Excellence
            </Badge>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-foreground">
              Heal From Within.
              <span className="block hero-gradient-text italic">
                Naturally.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/75 leading-relaxed mb-10 max-w-xl">
              Expert homeopathic care for chronic conditions by Dr. Kshitej
              Bhati, BHMS, MD. Online consultations available worldwide for
              international patients.
            </p>

            <div className="flex flex-wrap gap-4 mb-14">
              <Button
                size="lg"
                onClick={onBook}
                className="bg-primary text-primary-foreground hover:bg-forest-dark text-base px-8 shadow-elegant"
                data-ocid="hero.primary_button"
              >
                Book a Consultation <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary/40 text-primary hover:bg-primary/10 text-base px-8"
                data-ocid="hero.secondary_button"
              >
                <a href="#about">
                  Learn More <ChevronDown className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6">
              {[
                {
                  icon: <Award className="w-5 h-5" />,
                  label: "20+ Years Experience",
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  label: "10,000+ Patients Healed",
                },
                {
                  icon: <Globe className="w-5 h-5" />,
                  label: "Worldwide Consultations",
                },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 text-sm text-foreground/70"
                >
                  <span className="text-accent">{b.icon}</span>
                  <span className="font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── About Section ─────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section
      id="about"
      className="section-pad bg-card"
      data-ocid="about.section"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-accent/40 shadow-gold">
                <img
                  src="/assets/generated/dr-bhati-portrait.dim_400x400.jpg"
                  alt="Dr. Kshitej Bhati"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating credential badge */}
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-elegant">
                <div className="text-2xl font-bold font-serif">20+</div>
                <div className="text-xs opacity-80">Years Practice</div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
              Meet Your Doctor
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
              Dr. Kshitej Bhati
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              BHMS | MD (Homeopathy) | Fellow, Indian Institute of Homeopathy
            </p>
            <div className="gold-divider mb-6" />
            <p className="text-foreground/75 leading-relaxed mb-6">
              With over two decades of dedicated practice, Dr. Kshitej Bhati has
              established himself as one of India's most respected classical
              homeopaths. His holistic approach addresses not just the disease,
              but the whole person — understanding the intricate connection
              between body, mind, and spirit.
            </p>
            <p className="text-foreground/75 leading-relaxed mb-8">
              Specializing in chronic and lifestyle diseases, Dr. Bhati has
              successfully treated thousands of patients from across 15
              countries, earning a reputation for results where conventional
              medicine has struggled.
            </p>

            {/* Credentials */}
            <div className="space-y-3 mb-8">
              {[
                "BHMS from Mumbai Homeopathic Medical College",
                "MD (Homeopathy) — Chronic Diseases Specialization",
                "Fellow, Indian Institute of Classical Homeopathy",
                "Member, Council of Homeopathic Medicine, India",
              ].map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-3 text-sm text-foreground/80"
                >
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "20+", label: "Years" },
                { value: "10K+", label: "Patients" },
                { value: "15", label: "Countries" },
                { value: "94%", label: "Success Rate" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center p-3 rounded-xl bg-muted"
                >
                  <div className="font-serif text-2xl font-bold text-primary">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Services Section ──────────────────────────────────────────────────────────
function ServicesSection() {
  return (
    <section id="services" className="section-pad" data-ocid="services.section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            What We Treat
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Specializations
          </h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive homeopathic care across a wide spectrum of health
            conditions, treating root causes rather than suppressing symptoms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-lift bg-card rounded-2xl p-8 border border-border shadow-xs group"
              data-ocid={`services.item.${i + 1}`}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {s.icon}
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      icon: <FlaskConical className="w-8 h-8" />,
      title: "Book Your Consultation",
      desc: "Choose your preferred date and time, complete the secure online booking form, and pay through our safe payment gateway.",
    },
    {
      num: "02",
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Detailed Case Analysis",
      desc: "Dr. Bhati conducts an in-depth 60-minute consultation covering your complete medical, mental, and emotional history.",
    },
    {
      num: "03",
      icon: <HeartPulse className="w-8 h-8" />,
      title: "Personalized Treatment & Follow-ups",
      desc: "Receive your individualized homeopathic prescription with medicines shipped worldwide and monthly follow-up consultations.",
    },
  ];

  return (
    <section
      className="section-pad bg-primary text-primary-foreground overflow-hidden relative"
      data-ocid="howitworks.section"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-accent -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            Simple Process
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
              data-ocid={`howitworks.item.${i + 1}`}
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-white/20" />
              )}
              <div className="w-20 h-20 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                {s.icon}
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-accent text-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {s.num.slice(1)}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">
                {s.title}
              </h3>
              <p className="text-primary-foreground/75 text-sm leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── International Section ─────────────────────────────────────────────────────
function InternationalSection({ onBook }: { onBook: () => void }) {
  const { currency } = useCurrency();

  return (
    <section
      id="international"
      className="section-pad bg-muted/50"
      data-ocid="international.section"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            Global Care
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Healing Knows No Borders
          </h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            Dr. Bhati has successfully treated patients from over 15 countries.
            Our online consultation platform makes world-class homeopathic care
            accessible anywhere.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Fee table */}
          <div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Consultation Fees
            </h3>
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-elegant">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5">
                    <TableHead className="font-semibold text-foreground">
                      Consultation Type
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Duration
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-right">
                      Fee ({currency})
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow data-ocid="fees.item.1">
                    <TableCell className="font-medium">
                      Initial Consultation
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      60 minutes
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary text-lg">
                      {FEES.initial[currency]}
                    </TableCell>
                  </TableRow>
                  <TableRow data-ocid="fees.item.2">
                    <TableCell className="font-medium">
                      Follow-up Consultation
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      30 minutes
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary text-lg">
                      {FEES.followup[currency]}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * Fees shown in {currency}. Currency conversion is approximate.
              Secure payment via Stripe.
            </p>
            <Button
              onClick={onBook}
              className="mt-6 bg-primary text-primary-foreground hover:bg-forest-dark"
              data-ocid="international.primary_button"
            >
              Book International Consultation{" "}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Countries & process */}
          <div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Countries We Serve
            </h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {COUNTRIES.map((c) => (
                <Badge
                  key={c}
                  variant="secondary"
                  className="text-xs py-1 px-3"
                >
                  {c}
                </Badge>
              ))}
            </div>

            <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
              Online Consultation Process
            </h3>
            <div className="space-y-3">
              {[
                "Book & pay securely online",
                "Receive calendar invite with video link",
                "60-min consultation with Dr. Bhati",
                "Prescription sent via email within 24 hours",
                "Medicines dispatched via international courier (3-7 days)",
                "Monthly follow-up via video call",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-foreground/80">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="section-pad" data-ocid="testimonials.section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            Patient Stories
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lives Transformed
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-elegant relative"
              data-ocid={`testimonials.item.${activeIdx + 1}`}
            >
              <Quote className="absolute top-8 left-8 w-8 h-8 text-accent/30" />
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-serif text-2xl font-bold text-primary">
                      {TESTIMONIALS[activeIdx].name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-4 h-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="text-foreground/80 text-lg leading-relaxed italic mb-6">
                    "{TESTIMONIALS[activeIdx].quote}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">
                      {TESTIMONIALS[activeIdx].name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {TESTIMONIALS[activeIdx].condition} ·{" "}
                      {TESTIMONIALS[activeIdx].country}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((t, i) => (
              <button
                type="button"
                key={t.name}
                onClick={() => setActiveIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  i === activeIdx
                    ? "bg-primary w-6"
                    : "bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Testimonial ${i + 1}`}
                data-ocid={"testimonials.toggle"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ Section ───────────────────────────────────────────────────────────────
function FAQSection() {
  return (
    <section className="section-pad bg-muted/30" data-ocid="faq.section">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            Common Questions
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        <Accordion
          type="single"
          collapsible
          className="space-y-3"
          data-ocid="faq.panel"
        >
          {FAQS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-elegant"
              data-ocid={`faq.item.${i + 1}`}
            >
              <AccordionTrigger className="font-serif text-base font-medium text-foreground hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ── Contact Section ───────────────────────────────────────────────────────────
function ContactSection() {
  const { mutateAsync: submitInquiry, isPending } = useSubmitInquiry();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    condition: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitInquiry(form);
      setSubmitted(true);
      toast.success(
        "Inquiry submitted! We'll get back to you within 24 hours.",
      );
    } catch {
      toast.error("Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <section id="contact" className="section-pad" data-ocid="contact.section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            Get In Touch
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Contact Us
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-8">
              Clinic Information
            </h3>
            <div className="space-y-6">
              {[
                {
                  icon: <MapPin className="w-5 h-5" />,
                  label: "Address",
                  value:
                    "XYZ Medical Complex, Bandra West, Mumbai, Maharashtra 400050, India",
                },
                {
                  icon: <Phone className="w-5 h-5" />,
                  label: "Phone",
                  value: "+91-XXXXXXXXXX",
                },
                {
                  icon: <Mail className="w-5 h-5" />,
                  label: "Email",
                  value: "info@drkshitejbhati.com",
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  label: "Hours",
                  value: "Mon–Sat: 10:00 AM – 7:00 PM IST",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-foreground/85 text-sm">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-8" />

            <div>
              <p className="text-sm font-medium text-foreground mb-4">
                Connect With Us
              </p>
              <div className="flex gap-3">
                {[
                  {
                    icon: <SiWhatsapp className="w-5 h-5" />,
                    href: "https://wa.me/91XXXXXXXXXX",
                    label: "WhatsApp",
                    color: "hover:text-green-600",
                  },
                  {
                    icon: <SiInstagram className="w-5 h-5" />,
                    href: "#",
                    label: "Instagram",
                    color: "hover:text-pink-600",
                  },
                  {
                    icon: <SiFacebook className="w-5 h-5" />,
                    href: "#",
                    label: "Facebook",
                    color: "hover:text-blue-600",
                  },
                  {
                    icon: <SiLinkedin className="w-5 h-5" />,
                    href: "#",
                    label: "LinkedIn",
                    color: "hover:text-blue-700",
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground transition-colors ${s.color}`}
                    data-ocid="contact.link"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Inquiry form */}
          <div className="bg-card rounded-2xl border border-border p-8 shadow-elegant">
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Send an Inquiry
            </h3>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
                data-ocid="contact.success_state"
              >
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h4 className="font-serif text-xl font-semibold text-foreground mb-2">
                  Inquiry Received!
                </h4>
                <p className="text-muted-foreground text-sm">
                  Thank you for reaching out. Dr. Bhati's team will contact you
                  within 24 hours.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setSubmitted(false)}
                  data-ocid="contact.secondary_button"
                >
                  Send Another
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inq-name" className="text-xs font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="inq-name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                      placeholder="Your name"
                      className="mt-1"
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inq-email" className="text-xs font-medium">
                      Email *
                    </Label>
                    <Input
                      id="inq-email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                      placeholder="your@email.com"
                      className="mt-1"
                      data-ocid="contact.input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inq-phone" className="text-xs font-medium">
                      Phone
                    </Label>
                    <Input
                      id="inq-phone"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-1"
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="inq-country"
                      className="text-xs font-medium"
                    >
                      Country *
                    </Label>
                    <Input
                      id="inq-country"
                      value={form.country}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, country: e.target.value }))
                      }
                      required
                      placeholder="Your country"
                      className="mt-1"
                      data-ocid="contact.input"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="inq-condition"
                    className="text-xs font-medium"
                  >
                    Health Condition / Query *
                  </Label>
                  <Input
                    id="inq-condition"
                    value={form.condition}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, condition: e.target.value }))
                    }
                    required
                    placeholder="Brief description of condition"
                    className="mt-1"
                    data-ocid="contact.input"
                  />
                </div>
                <div>
                  <Label htmlFor="inq-message" className="text-xs font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="inq-message"
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Tell us more about your health concerns..."
                    rows={4}
                    className="mt-1"
                    data-ocid="contact.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-forest-dark"
                  data-ocid="contact.submit_button"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Inquiry"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { mutateAsync: bookConsultation, isPending: isBooking } =
    useBookConsultation();
  const { mutateAsync: createCheckout, isPending: isCheckout } =
    useCreateCheckoutSession();
  const [step, setStep] = useState<"form" | "processing">("form");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    condition: "",
    date: "",
    consultationType: "online" as "online" | "inPerson",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    try {
      const checkoutUrl = await createCheckout({
        items: [
          {
            productName: "Online Consultation - Dr. Kshitej Bhati",
            currency: "inr",
            quantity: 1n,
            priceInCents: 200000n,
            productDescription: "60-minute homeopathic consultation",
          },
        ],
        successUrl: `${window.location.origin}/booking-success`,
        cancelUrl: `${window.location.origin}/booking-cancel`,
      });
      await bookConsultation({
        patientName: form.name,
        email: form.email,
        phone: form.phone,
        consultationType:
          form.consultationType === "online"
            ? ConsultationType.online
            : ConsultationType.inPerson,
        preferredDate: form.date,
        stripeSessionId: null,
      });
      window.location.href = checkoutUrl;
    } catch {
      setStep("form");
      toast.error("Booking failed. Please try again or contact us directly.");
    }
  };

  const isPending = isBooking || isCheckout;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="booking.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground">
            Book a Consultation
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            With Dr. Kshitej Bhati, BHMS, MD
          </p>
        </DialogHeader>

        {step === "processing" ? (
          <div
            className="flex flex-col items-center py-12 gap-4"
            data-ocid="booking.loading_state"
          >
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-foreground font-medium">
              Preparing your secure checkout...
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Please don't close this window. You'll be redirected to complete
              payment.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bk-name" className="text-xs font-medium">
                  Full Name *
                </Label>
                <Input
                  id="bk-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  placeholder="Your full name"
                  className="mt-1"
                  data-ocid="booking.input"
                />
              </div>
              <div>
                <Label htmlFor="bk-email" className="text-xs font-medium">
                  Email *
                </Label>
                <Input
                  id="bk-email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  placeholder="your@email.com"
                  className="mt-1"
                  data-ocid="booking.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bk-phone" className="text-xs font-medium">
                  Phone *
                </Label>
                <Input
                  id="bk-phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                  placeholder="+1 XXX XXX XXXX"
                  className="mt-1"
                  data-ocid="booking.input"
                />
              </div>
              <div>
                <Label htmlFor="bk-country" className="text-xs font-medium">
                  Country *
                </Label>
                <Input
                  id="bk-country"
                  value={form.country}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, country: e.target.value }))
                  }
                  required
                  placeholder="Your country"
                  className="mt-1"
                  data-ocid="booking.input"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bk-condition" className="text-xs font-medium">
                Chief Complaint / Condition *
              </Label>
              <Textarea
                id="bk-condition"
                value={form.condition}
                onChange={(e) =>
                  setForm((p) => ({ ...p, condition: e.target.value }))
                }
                required
                placeholder="Briefly describe your main health concern"
                rows={3}
                className="mt-1"
                data-ocid="booking.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bk-date" className="text-xs font-medium">
                  Preferred Date *
                </Label>
                <Input
                  id="bk-date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1"
                  data-ocid="booking.input"
                />
              </div>
              <div>
                <Label className="text-xs font-medium">
                  Consultation Type *
                </Label>
                <Select
                  value={form.consultationType}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      consultationType: v as "online" | "inPerson",
                    }))
                  }
                >
                  <SelectTrigger className="mt-1" data-ocid="booking.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online (Video Call)</SelectItem>
                    <SelectItem value="inPerson">In-Person (Mumbai)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 text-sm">
              <div className="flex items-center gap-2 text-foreground font-medium mb-1">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Secure Payment via Stripe
              </div>
              <p className="text-muted-foreground text-xs">
                Initial Consultation fee: ₹2,000. You'll be redirected to
                Stripe's secure payment page.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-forest-dark"
              data-ocid="booking.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full"
              data-ocid="booking.cancel_button"
            >
              Cancel
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
function AdminDashboard({ onClose }: { onClose: () => void }) {
  const { login, clear, identity, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: inquiries, isLoading: loadingInq } = useGetInquiries();
  const { data: bookings, isLoading: loadingBook } = useGetBookings();
  const { mutate: updateInqStatus } = useUpdateInquiryStatus();
  const { mutate: updateBookStatus } = useUpdateBookingPaymentStatus();
  const { mutate: deleteInquiry } = useDeleteInquiry();
  const [activeTab, setActiveTab] = useState<"inquiries" | "bookings">(
    "inquiries",
  );

  const isLoggedIn = loginStatus === "success" && !!identity;

  return (
    <div className="min-h-screen bg-background pt-20" data-ocid="admin.page">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage inquiries and bookings
            </p>
          </div>
          <div className="flex gap-3">
            {isLoggedIn ? (
              <Button
                variant="outline"
                onClick={() => clear()}
                className="gap-2"
                data-ocid="admin.secondary_button"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            ) : (
              <Button
                onClick={() => login()}
                className="bg-primary text-primary-foreground gap-2"
                data-ocid="admin.primary_button"
              >
                <LogIn className="w-4 h-4" /> Sign In with Internet Identity
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={onClose}
              data-ocid="admin.close_button"
            >
              ← Back to Site
            </Button>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="text-center py-24" data-ocid="admin.section">
            <LogIn className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
              Authentication Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Sign in with Internet Identity to access the admin dashboard.
            </p>
            <Button
              onClick={() => login()}
              className="bg-primary text-primary-foreground"
              data-ocid="admin.primary_button"
            >
              Sign In with Internet Identity
            </Button>
          </div>
        ) : checkingAdmin ? (
          <div
            className="flex justify-center py-24"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !isAdmin ? (
          <div className="text-center py-24" data-ocid="admin.error_state">
            <ShieldCheck className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
              Access Denied
            </h2>
            <p className="text-muted-foreground">
              You don't have administrator privileges to access this dashboard.
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: <MessageCircle className="w-5 h-5" />,
                  label: "Total Inquiries",
                  value: inquiries?.length ?? 0,
                },
                {
                  icon: <BarChart3 className="w-5 h-5" />,
                  label: "Total Bookings",
                  value: bookings?.length ?? 0,
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  label: "New Inquiries",
                  value:
                    inquiries?.filter((i) => i.status === InquiryStatus.new_)
                      .length ?? 0,
                },
                {
                  icon: <CheckCircle className="w-5 h-5" />,
                  label: "Paid Bookings",
                  value:
                    bookings?.filter(
                      (b) => b.paymentStatus === PaymentStatus.paid,
                    ).length ?? 0,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {s.icon}
                  </div>
                  <div>
                    <div className="font-serif text-2xl font-bold text-foreground">
                      {s.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("inquiries")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "inquiries"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="admin.tab"
              >
                Inquiries ({inquiries?.length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "bookings"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="admin.tab"
              >
                Bookings ({bookings?.length ?? 0})
              </button>
            </div>

            {activeTab === "inquiries" && (
              <div
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs"
                data-ocid="admin.table"
              >
                {loadingInq ? (
                  <div
                    className="flex justify-center py-12"
                    data-ocid="admin.loading_state"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : !inquiries?.length ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.empty_state"
                  >
                    No inquiries yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inquiries.map((inq, i) => (
                          <TableRow
                            key={inq.id.toString()}
                            data-ocid={`admin.row.${i + 1}`}
                          >
                            <TableCell className="font-medium">
                              {inq.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {inq.email}
                            </TableCell>
                            <TableCell>{inq.country}</TableCell>
                            <TableCell className="max-w-xs truncate text-sm">
                              {inq.condition}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={inq.status}
                                onValueChange={(v) =>
                                  updateInqStatus({
                                    id: inq.id,
                                    status: v as InquiryStatus,
                                  })
                                }
                              >
                                <SelectTrigger
                                  className="w-32 h-7 text-xs"
                                  data-ocid="admin.select"
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={InquiryStatus.new_}>
                                    New
                                  </SelectItem>
                                  <SelectItem value={InquiryStatus.contacted}>
                                    Contacted
                                  </SelectItem>
                                  <SelectItem value={InquiryStatus.converted}>
                                    Converted
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteInquiry(inq.id)}
                                className="text-destructive hover:text-destructive h-7 px-2"
                                data-ocid="admin.delete_button"
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "bookings" && (
              <div
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs"
                data-ocid="admin.table"
              >
                {loadingBook ? (
                  <div
                    className="flex justify-center py-12"
                    data-ocid="admin.loading_state"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : !bookings?.length ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.empty_state"
                  >
                    No bookings yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Patient</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Preferred Date</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((bk, i) => (
                          <TableRow
                            key={bk.id.toString()}
                            data-ocid={`admin.row.${i + 1}`}
                          >
                            <TableCell className="font-medium">
                              {bk.patientName}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {bk.email}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  bk.consultationType ===
                                  ConsultationType.online
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {bk.consultationType === ConsultationType.online
                                  ? "Online"
                                  : "In-Person"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {bk.preferredDate}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={bk.paymentStatus}
                                onValueChange={(v) =>
                                  updateBookStatus({
                                    bookingId: bk.id,
                                    status: v as PaymentStatus,
                                  })
                                }
                              >
                                <SelectTrigger
                                  className="w-28 h-7 text-xs"
                                  data-ocid="admin.select"
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={PaymentStatus.pending}>
                                    Pending
                                  </SelectItem>
                                  <SelectItem value={PaymentStatus.paid}>
                                    Paid
                                  </SelectItem>
                                  <SelectItem value={PaymentStatus.failed}>
                                    Failed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  bk.paymentStatus === PaymentStatus.paid
                                    ? "default"
                                    : bk.paymentStatus === PaymentStatus.failed
                                      ? "destructive"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {bk.paymentStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ onBook }: { onBook: () => void }) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? window.location.hostname
      : "drkshitejbhati.com";

  return (
    <footer
      className="bg-primary text-primary-foreground"
      data-ocid="footer.section"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-serif text-2xl font-semibold mb-1">
              Gentle Cure
            </div>
            <div className="text-xs text-primary-foreground/60 tracking-widest uppercase mb-4">
              Homeopathic Clinic
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm">
              Expert homeopathic care for chronic and lifestyle diseases by Dr.
              Kshitej Bhati. Serving patients worldwide for over 20 years.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                {
                  icon: <SiWhatsapp className="w-4 h-4" />,
                  href: "https://wa.me/91XXXXXXXXXX",
                },
                { icon: <SiInstagram className="w-4 h-4" />, href: "#" },
                { icon: <SiFacebook className="w-4 h-4" />, href: "#" },
                { icon: <SiLinkedin className="w-4 h-4" />, href: "#" },
              ].map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                  data-ocid="footer.link"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <div className="space-y-2">
              {["#about", "#services", "#international", "#contact"].map(
                (href) => (
                  <a
                    key={href}
                    href={href}
                    className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    data-ocid="footer.link"
                  >
                    {href.replace("#", "").charAt(0).toUpperCase() +
                      href.replace("#", "").slice(1)}
                  </a>
                ),
              )}
              <button
                type="button"
                onClick={onBook}
                className="block text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                data-ocid="footer.primary_button"
              >
                Book Consultation →
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase mb-4">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Bandra West, Mumbai, Maharashtra 400050, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91-XXXXXXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@drkshitejbhati.com</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <p>
            © {year} Gentle Cure Homeopathic Clinic. Dr. Kshitej Bhati. All
            rights reserved.
          </p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── WhatsApp Floating Button ───────────────────────────────────────────────────
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/91XXXXXXXXXX"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Chat on WhatsApp"
      data-ocid="whatsapp.button"
    >
      <SiWhatsapp className="w-6 h-6" />
    </a>
  );
}
