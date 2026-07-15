"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  MessageSquareText,
  HeartPulse,
  Activity,
  Users,
  Trees,
  ArrowUpRight,
} from "lucide-react";

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  ageRange: string;
  description: string;
  badgeText: string;
  badgeVariant: "default" | "secondary" | "yellow" | "outline";
  link: string;
}

export default function ServiceGrid() {
  const services: ServiceItem[] = [
    {
      icon: <Brain className="h-6 w-6 text-current" />,
      title: "Daycare Harian",
      ageRange: "Usia: 3 Bulan - 5 Tahun",
      description:
        "Layanan penitipan anak intensif selama jam kerja yang dikelola oleh pengasuh profesional dan terlatih. Fokus pada keamanan, pemenuhan nutrisi seimbang, serta rutinitas harian yang mendukung kemandirian anak.",
      badgeText: "Sisa 2 Kursi",
      badgeVariant: "yellow",
      link: "/register?service=sensory",
    },
    {
      icon: <MessageSquareText className="h-6 w-6 text-current" />,
      title: "PAUD Terintegrasi",
      ageRange: "Usia: 2 - 6 Tahun",
      description:
        "Pendidikan usia dini dengan kurikulum bermain sambil belajar yang dirancang khusus berbasis tahapan tumbuh kembang. Mengembangkan aspek kognitif, motorik, sosial, dan emosional anak secara seimbang.",
      badgeText: "Sisa 1 Slot",
      badgeVariant: "yellow",
      link: "/register?service=speech",
    },
    {
      icon: <HeartPulse className="h-6 w-6 text-current" />,
      title: "Biro Psikologi",
      ageRange: "Usia: 0 - 10 Tahun",
      description:
        "Pusat layanan deteksi dini, asesmen tumbuh kembang, serta konsultasi mendalam bersama psikolog dan terapis anak profesional (okupasi/wicara) untuk memetakan potensi dan mengatasi hambatan anak sejak dini.",
      badgeText: "Slot Terbatas",
      badgeVariant: "yellow",
      link: "/register?service=psychology",
    },
    {
      icon: <Activity className="h-6 w-6 text-current" />,
      title: "Program Parenting",
      ageRange: "Usia: Untuk Orang Tua",
      description:
        "Kelas edukasi dan workshop interaktif khusus orang tua untuk membangun pola asuh (parenting) yang efektif, menyelaraskan program stimulasi di rumah, serta memperkuat ikatan emosional keluarga.",
      badgeText: "Tersedia",
      badgeVariant: "yellow",
      link: "/register?service=motoric",
    },
    {
      icon: <Users className="h-6 w-6 text-current" />,
      title: "Kelas Gymnastic",
      ageRange: "Usia: 1 - 8 Tahun",
      description:
        "Program aktivitas fisik terstruktur untuk memenuhi dan mengoptimalkan kebutuhan gerak motorik kasar anak. Dipandu oleh instruktur terlatih dalam lingkungan yang aman untuk melatih kelenturan, kekuatan, dan keseimbangan.",
      badgeText: "Sisa 3 Kursi",
      badgeVariant: "yellow",
      link: "/register?service=social",
    },
    {
      icon: <Trees className="h-6 w-6 text-current" />,
      title: "Aviary",
      ageRange: "Usia: 1 - 10 Tahun",
      description:
        "Fasilitas stimulasi eksklusif di lingkungan semi-alami yang dirancang untuk mengasah kepekaan panca indera (sensori) anak lewat eksplorasi langsung dengan alam, tanaman, dan hewan dalam suasana yang menenangkan.",
      badgeText: "Best Value",
      badgeVariant: "yellow",
      link: "/register?service=parenting",
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Layanan Unggulan <span className="text-brand-teal">Gentala</span>
          </h2>
          <div className="h-1 w-12 bg-brand-sage rounded-full mb-4" />
          <p className="text-slate-600 font-light max-w-xl">
            Program komprehensif yang dirancang secara individual sesuai dengan
            profil sensorik dan kebutuhan unik tumbuh kembang setiap buah hati.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="flex flex-col h-full bg-white relative overflow-hidden group transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_20px_50px_rgba(13,92,102,0.12)] hover:border-brand-teal/20"
            >
              <CardHeader className="flex-row items-center justify-between pb-4">
                <div className="bg-brand-teal/5 text-brand-teal p-3 rounded-2xl group-hover:bg-brand-teal group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <Badge
                  variant={service.badgeVariant}
                  className="font-semibold text-[11px] tracking-wide"
                >
                  {service.badgeText}
                </Badge>
              </CardHeader>

              <CardContent className="flex-grow">
                <CardTitle className="mb-1 text-[19px] font-bold text-slate-800 tracking-tight">
                  {service.title}
                </CardTitle>
                <div className="text-xs font-semibold text-brand-teal mb-3 bg-brand-teal/5 w-fit px-2.5 py-0.5 rounded-full">
                  {service.ageRange}
                </div>
                <CardDescription className="text-slate-500 font-light leading-relaxed text-sm">
                  {service.description}
                </CardDescription>
              </CardContent>

              <CardFooter className="pt-4 border-t border-slate-50 mt-auto">
                <Link
                  href={service.link}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal group-hover:translate-x-1 transition-transform duration-300"
                >
                  Info Detail & Jadwal
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
