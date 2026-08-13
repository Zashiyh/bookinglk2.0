"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar/navbar";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Globe2,
  Heart,
  Laptop,
  MapPin,
  Rocket,
  Search,
  Sparkles,
  Users,
  Zap,
  ChevronDown,
} from "lucide-react";
import { useMemo, useState } from "react";
import CountUP from "@/components/ui/CountUp";

type Department =
  | "All"
  | "Engineering"
  | "Design"
  | "Marketing"
  | "Operations";

type Job = {
  id: number;
  title: string;
  department: Exclude<Department, "All">;
  location: string;
  type: string;
  experience: string;
  description: string;
  featured?: boolean;
};

const jobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    department: "Engineering",
    location: "Sri Lanka / Remote",
    type: "Internship",
    experience: "Entry Level",
    description:
      "Help us build beautiful, fast and responsive travel experiences using Next.js, React, TypeScript and Tailwind CSS.",
    featured: true,
  },
  {
    id: 2,
    title: "Full Stack Developer Intern",
    department: "Engineering",
    location: "Sri Lanka / Remote",
    type: "Internship",
    experience: "Entry Level",
    description:
      "Work across frontend and backend systems while helping build the technology powering BookingLK.",
    featured: true,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    department: "Design",
    location: "Sri Lanka / Remote",
    type: "Full-time",
    experience: "Junior / Mid",
    description:
      "Design intuitive, elegant and memorable digital experiences for travelers and hotel partners.",
  },
  {
    id: 4,
    title: "Backend Developer",
    department: "Engineering",
    location: "Sri Lanka / Remote",
    type: "Full-time",
    experience: "Junior / Mid",
    description:
      "Build scalable APIs, database systems and reliable backend services for our growing platform.",
  },
  {
    id: 5,
    title: "Digital Marketing Intern",
    department: "Marketing",
    location: "Sri Lanka / Remote",
    type: "Internship",
    experience: "Entry Level",
    description:
      "Help grow BookingLK through creative campaigns, social media, content and digital marketing.",
  },
  {
    id: 6,
    title: "Travel Operations Associate",
    department: "Operations",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    experience: "Junior",
    description:
      "Work with hotels and travelers to create smooth and memorable booking experiences.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Every decision starts with making travel easier, better and more memorable.",
  },
  {
    icon: Rocket,
    title: "Move Fast",
    description:
      "We experiment, learn quickly and turn good ideas into real experiences.",
  },
  {
    icon: Sparkles,
    title: "Build Beautiful",
    description:
      "We care about the details because great products should feel as good as they work.",
  },
  {
    icon: Users,
    title: "Grow Together",
    description:
      "We share knowledge, support each other and celebrate every win as a team.",
  },
];

const benefits = [
  {
    icon: Laptop,
    title: "Flexible Work",
    description:
      "Work remotely or from a collaborative environment that helps you do your best work.",
  },
  {
    icon: Code2,
    title: "Modern Technology",
    description:
      "Build with modern technologies and solve real problems at scale.",
  },
  {
    icon: Globe2,
    title: "Real Impact",
    description:
      "Your work can directly improve how people discover and experience Sri Lanka.",
  },
  {
    icon: Zap,
    title: "Fast Growth",
    description:
      "Take ownership, learn continuously and grow alongside the company.",
  },
];

const departments: Department[] = [
  "All",
  "Engineering",
  "Design",
  "Marketing",
  "Operations",
];

export default function CareersPage() {
  const [activeDepartment, setActiveDepartment] =
    useState<Department>("All");

  const [search, setSearch] = useState("");

  const [openJob, setOpenJob] = useState<number | null>(null);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesDepartment =
        activeDepartment === "All" ||
        job.department === activeDepartment;

      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query);

      return matchesDepartment && matchesSearch;
    });
  }, [activeDepartment, search]);

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
        <Navbar/>
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-black/5 dark:border-white/5">
        {/* Background */}

        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#050505]" />

          <motion.div
            animate={{
              x: [0, 80, 0],
              y: [0, -40, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[8%] top-[15%] h-72 w-72 rounded-full bg-[#D4AF37]/15 blur-[120px]"
          />

          <motion.div
            animate={{
              x: [0, -70, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[8%] top-[20%] h-96 w-96 rounded-full bg-white/[0.04] blur-[130px]"
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />
        </div>

        {/* Hero content */}

        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl items-center px-5 pb-20 pt-32 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-xl"
            >
              <BriefcaseBusiness className="h-4 w-4 text-[#F5D76E]" />
              Careers at BookingLK
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
              }}
              className="max-w-4xl text-5xl font-black tracking-[-0.05em] text-white sm:text-6xl lg:text-8xl"
            >
              Build the future
              <span className="block text-[#F5D76E]">
                of travel.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
              className="mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg"
            >
              We're building a better way for people to
              discover, book and experience Sri Lanka.
              Join us and help shape what comes next.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
              }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#open-positions"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-black transition hover:bg-[#F5D76E]"
              >
                View open positions
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#life-at-bookinglk"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/[0.08]"
              >
                Life at BookingLK
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Hero stats */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {/* Open roles */}
            <div className="px-5 py-5 text-center sm:py-6">
              <p className="flex items-center justify-center text-xl font-black text-white sm:text-2xl">
                <CountUP
                  from={0}
                  to={jobs.length}
                  separator=","
                  direction="up"
                  duration={1.5}
                />
                <span>+</span>
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-xs">
                Open roles
              </p>
            </div>

            {/* Mission */}
            <div className="px-5 py-5 text-center sm:py-6">
              <p className="text-xl font-black text-white sm:text-2xl">
                <CountUP
                  from={0}
                  to={1}
                  separator=","
                  direction="up"
                  duration={1.5}
                />
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-xs">
                Mission
              </p>
            </div>

            {/* Real impact */}
            <div className="px-5 py-5 text-center sm:py-6">
              <p className="flex items-center justify-center text-xl font-black text-white sm:text-2xl">
                <CountUP
                  from={0}
                  to={100}
                  separator=","
                  direction="up"
                  duration={1.8}
                />
                <span>%</span>
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-xs">
                Real impact
              </p>
            </div>

            {/* Possibilities */}
            <div className="px-5 py-5 text-center sm:py-6">
              <p className="text-xl font-black text-white sm:text-2xl">
                ∞
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-xs">
                Possibilities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              Why BookingLK
            </p>

            <h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              We're not just building
              <span className="text-[#B8860B] dark:text-[#F5D76E]">
                {" "}
                another booking platform.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
          >
            <p className="text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
              BookingLK is creating a technology platform
              designed around the way people actually
              travel through Sri Lanka. From discovering
              hidden destinations to finding the perfect
              stay, we're making the entire journey simpler.
            </p>

            <p className="mt-5 text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
              If you love solving meaningful problems,
              building beautiful products and working with
              people who care, you'll feel at home here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          BENEFITS
      ====================================================== */}

      <section className="border-y border-black/5 bg-zinc-50 dark:border-white/5 dark:bg-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              Work with us
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              More than a job.
            </h2>

            <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              We want you to do meaningful work, grow your
              skills and enjoy the journey along the way.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.title}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  className="group rounded-3xl border border-black/5 bg-white p-6 transition dark:border-white/5 dark:bg-[#111111]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B] transition group-hover:bg-[#D4AF37] group-hover:text-black dark:text-[#F5D76E]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-bold">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          VALUES
      ====================================================== */}

      <section
        id="life-at-bookinglk"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              Our culture
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              How we
              <span className="text-[#B8860B] dark:text-[#F5D76E]">
                {" "}
                work.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-400">
              Great products come from great teams. We
              believe in ownership, curiosity and creating
              an environment where people can do their best
              work.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.1,
                  }}
                  className="group rounded-[2rem] border border-black/5 bg-zinc-50 p-7 dark:border-white/5 dark:bg-[#111111]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B] transition group-hover:scale-105 group-hover:bg-[#D4AF37] group-hover:text-black dark:text-[#F5D76E]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-lg font-black">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          OPEN POSITIONS
      ====================================================== */}

      <section
        id="open-positions"
        className="border-y border-black/5 bg-zinc-50 dark:border-white/5 dark:bg-[#0b0b0b]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
                Join the team
              </p>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Open positions
              </h2>

              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                {filteredJobs.length} opportunities waiting
                for you.
              </p>
            </div>

            {/* Search */}

            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search jobs..."
                className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
              />
            </div>
          </div>

          {/* Department filters */}

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            {departments.map((department) => (
              <button
                key={department}
                type="button"
                onClick={() =>
                  setActiveDepartment(department)
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeDepartment === department
                    ? "bg-[#D4AF37] text-black"
                    : "border border-black/10 bg-white text-zinc-500 hover:border-[#D4AF37]/40 dark:border-white/10 dark:bg-[#111111] dark:text-zinc-400"
                }`}
              >
                {department}
              </button>
            ))}
          </div>

          {/* Jobs */}

          <div className="mt-8 space-y-3">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => {
                const isOpen = openJob === job.id;

                return (
                  <motion.div
                    layout
                    key={job.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.1,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.05,
                    }}
                    className={`overflow-hidden rounded-3xl border transition ${
                      job.featured
                        ? "border-[#D4AF37]/30 bg-[#D4AF37]/[0.04]"
                        : "border-black/5 bg-white dark:border-white/5 dark:bg-[#111111]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenJob(
                          isOpen ? null : job.id
                        )
                      }
                      className="flex w-full items-center justify-between gap-5 p-5 text-left sm:p-6 lg:p-7"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-[10px] font-bold text-[#B8860B] dark:text-[#F5D76E]">
                            {job.department}
                          </span>

                          {job.featured && (
                            <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold text-[#F5D76E] dark:bg-white dark:text-black">
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-black sm:text-xl">
                          {job.title}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <BriefcaseBusiness className="h-3.5 w-3.5" />
                            {job.type}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {job.experience}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 transition dark:border-white/10 ${
                          isOpen
                            ? "rotate-180 bg-[#D4AF37] text-black"
                            : ""
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </button>

                    {/* Expanded job */}

                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-black/5 px-5 pb-6 pt-5 dark:border-white/5 sm:px-6 lg:px-7">
                        <p className="max-w-3xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                          {job.description}
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                          <Link
                            href={`/careers/${job.id}`}
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-xs font-bold text-black transition hover:bg-[#F5D76E]"
                          >
                            View position
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </Link>

                          <a
                            href="mailto:careers@bookinglk.com"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 px-5 py-3 text-xs font-bold transition hover:border-[#D4AF37] dark:border-white/10"
                          >
                            Apply via email
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-zinc-300 p-14 text-center dark:border-white/10">
                <Search className="mx-auto h-9 w-9 text-zinc-400" />

                <h3 className="mt-4 text-lg font-bold">
                  No positions found
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Try another search or department.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveDepartment("All");
                  }}
                  className="mt-5 rounded-full bg-[#D4AF37] px-5 py-2.5 text-xs font-bold text-black"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          APPLICATION CTA
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.97,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
          }}
          className="relative overflow-hidden rounded-[2rem] bg-[#111111] p-8 sm:p-12 lg:p-16"
        >
          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, -25, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#D4AF37]/15 blur-[100px]"
          />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#F5D76E]">
                <Sparkles className="h-5 w-5" />
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Don't see your role?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/50">
                We're always interested in meeting talented
                people who believe in what we're building.
                Send us your CV and tell us how you could
                make an impact at BookingLK.
              </p>
            </div>

            <a
              href="mailto:careers@bookinglk.com"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-4 text-sm font-bold text-black transition hover:bg-[#F5D76E]"
            >
              Send your CV
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="border-t border-black/5 dark:border-white/5">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]">
            <Rocket className="h-6 w-6" />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">
            Your next chapter
            <br />
            <span className="text-[#B8860B] dark:text-[#F5D76E]">
              starts here.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Come build something meaningful with us and
            help shape the future of travel in Sri Lanka.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#open-positions"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-black transition hover:bg-[#F5D76E]"
            >
              Explore jobs
              <ArrowRight className="h-4 w-4" />
            </a>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 px-6 py-3.5 text-sm font-bold transition hover:border-[#D4AF37] dark:border-white/10"
            >
              Back to BookingLK
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}