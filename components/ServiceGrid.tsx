"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Brain,
  MessageSquareText,
  HeartPulse,
  Activity,
  Users,
  Trees,
  ArrowUpRight,
} from "lucide-react";

interface DBService {
  id: string;
  name: string;
  price: number;
  description: string;
  slots: number;
  requiresChildData: boolean;
  customFields: any;
}

interface ServiceItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  ageRange: string;
  description: string;
  badgeText: string;
  badgeVariant: "default" | "secondary" | "yellow" | "outline";
  price: number;
  slots: number;
}

interface ServiceGridProps {
  dbServices?: DBService[];
}

const STATIC_ASSETS: { [key: string]: { icon: React.ReactNode; ageRange: string } } = {
  "daycare-harian": {
    icon: <Brain className="h-6 w-6 text-current" />,
    ageRange: "Usia: 3 Bulan - 5 Tahun",
  },
  "paud-terintegrasi": {
    icon: <MessageSquareText className="h-6 w-6 text-current" />,
    ageRange: "Usia: 2 - 6 Tahun",
  },
  "biro-psikologi": {
    icon: <HeartPulse className="h-6 w-6 text-current" />,
    ageRange: "Usia: 0 - 10 Tahun",
  },
  "program-parenting": {
    icon: <Activity className="h-6 w-6 text-current" />,
    ageRange: "Usia: Untuk Orang Tua",
  },
  "kelas-gymnastic": {
    icon: <Users className="h-6 w-6 text-current" />,
    ageRange: "Usia: 1 - 8 Tahun",
  },
  "aviary": {
    icon: <Trees className="h-6 w-6 text-current" />,
    ageRange: "Usia: 1 - 10 Tahun",
  },
};

export default function ServiceGrid({ dbServices = [] }: ServiceGridProps) {
  const [selectedService, setSelectedService] = React.useState<ServiceItem | null>(null);
  const router = useRouter();

  // Merge database values with matching static icons & age suitability filters
  const services: ServiceItem[] = React.useMemo(() => {
    if (dbServices && dbServices.length > 0) {
      return dbServices.map((s) => {
        const assets = STATIC_ASSETS[s.id] || {
          icon: <Activity className="h-6 w-6 text-current" />,
          ageRange: "Usia: Semua Usia",
        };

        // Determine badge message & styling dynamically based on remaining seats
        let badgeText = "Tersedia";
        let badgeVariant: "default" | "secondary" | "yellow" | "outline" = "secondary";

        if (s.slots <= 0) {
          badgeText = "Habis";
          badgeVariant = "outline";
        } else if (s.slots < 5) {
          badgeText = `Sisa ${s.slots} Kursi`;
          badgeVariant = "yellow";
        }

        return {
          id: s.id,
          icon: assets.icon,
          title: s.name,
          ageRange: assets.ageRange,
          description: s.description,
          badgeText,
          badgeVariant,
          price: s.price,
          slots: s.slots,
        };
      });
    }

    // Static fallback representation if DB records are unavailable
    return [
      {
        id: "daycare-harian",
        icon: <Brain className="h-6 w-6 text-current" />,
        title: "Daycare Harian",
        ageRange: "Usia: 3 Bulan - 5 Tahun",
        description:
          "Layanan penitipan anak intensif selama jam kerja yang dikelola oleh pengasuh profesional dan terlatih. Fokus pada keamanan, pemenuhan nutrisi seimbang, serta rutinitas harian yang mendukung kemandirian anak.",
        badgeText: "Sisa 2 Kursi",
        badgeVariant: "yellow",
        price: 1500000,
        slots: 2,
      },
      {
        id: "paud-terintegrasi",
        icon: <MessageSquareText className="h-6 w-6 text-current" />,
        title: "PAUD Terintegrasi",
        ageRange: "Usia: 2 - 6 Tahun",
        description:
          "Pendidikan usia dini dengan kurikulum bermain sambil belajar yang dirancang khusus berbasis tahapan tumbuh kembang. Mengembangkan aspek kognitif, motorik, sosial, dan emosional anak secara seimbang.",
        badgeText: "Sisa 1 Slot",
        badgeVariant: "yellow",
        price: 1200000,
        slots: 1,
      },
      {
        id: "biro-psikologi",
        icon: <HeartPulse className="h-6 w-6 text-current" />,
        title: "Biro Psikologi",
        ageRange: "Usia: 0 - 10 Tahun",
        description:
          "Pusat layanan deteksi dini, asesmen tumbuh kembang, serta konsultasi mendalam bersama psikolog dan terapis anak profesional (okupasi/wicara) untuk memetakan potensi dan mengatasi hambatan anak sejak dini.",
        badgeText: "Slot Terbatas",
        badgeVariant: "yellow",
        price: 450000,
        slots: 3,
      },
      {
        id: "program-parenting",
        icon: <Activity className="h-6 w-6 text-current" />,
        title: "Program Parenting",
        ageRange: "Usia: Untuk Orang Tua",
        description:
          "Kelas edukasi dan workshop interaktif khusus orang tua untuk membangun pola asuh (parenting) yang efektif, menyelaraskan program stimulasi di rumah, serta memperkuat ikatan emosional keluarga.",
        badgeText: "Tersedia",
        badgeVariant: "yellow",
        price: 300000,
        slots: 20,
      },
      {
        id: "kelas-gymnastic",
        icon: <Users className="h-6 w-6 text-current" />,
        title: "Kelas Gymnastic",
        ageRange: "Usia: 1 - 8 Tahun",
        description:
          "Program aktivitas fisik terstruktur untuk memenuhi dan mengoptimalkan kebutuhan gerak motorik kasar anak. Dipandu oleh instruktur terlatih dalam lingkungan yang aman untuk melatih kelenturan, kekuatan, dan keseimbangan.",
        badgeText: "Sisa 3 Kursi",
        badgeVariant: "yellow",
        price: 600000,
        slots: 3,
      },
      {
        id: "aviary",
        icon: <Trees className="h-6 w-6 text-current" />,
        title: "Aviary",
        ageRange: "Usia: 1 - 10 Tahun",
        description:
          "Fasilitas stimulasi eksklusif di lingkungan semi-alami yang dirancang untuk mengasah kepekaan panca indera (sensori) anak lewat eksplorasi langsung dengan alam, tanaman, dan hewan dalam suasana yang menenangkan.",
        badgeText: "Best Value",
        badgeVariant: "yellow",
        price: 200000,
        slots: 15,
      },
    ];
  }, [dbServices]);

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

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
              onClick={() => setSelectedService(service)}
              className="flex flex-col h-full bg-white relative overflow-hidden group transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_20px_50px_rgba(13,92,102,0.12)] hover:border-brand-teal/20 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/35"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedService(service);
                }
              }}
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
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal group-hover:translate-x-1 transition-transform duration-300">
                  Info Detail & Jadwal
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail Dialog Modal */}
      <Dialog
        open={!!selectedService}
        onOpenChange={(open) => !open && setSelectedService(null)}
      >
        <DialogContent className="max-w-md bg-white border border-slate-200/80 shadow-2xl p-6 sm:p-7 rounded-3xl animate-in fade-in duration-200">
          {selectedService && (
            <div className="space-y-5">
              <DialogHeader className="space-y-2 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="bg-brand-teal/10 text-brand-teal p-2.5 rounded-xl shrink-0">
                    {selectedService.icon}
                  </div>
                  <Badge
                    variant={selectedService.badgeVariant}
                    className="font-semibold text-[10px] uppercase tracking-wider shrink-0"
                  >
                    {selectedService.badgeText}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-extrabold text-slate-900 leading-tight">
                  {selectedService.title}
                </DialogTitle>
                <div className="text-xs font-semibold text-brand-teal bg-brand-teal/5 w-fit px-3 py-1 rounded-full">
                  {selectedService.ageRange}
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <DialogDescription className="text-xs font-light text-slate-600 leading-relaxed">
                  {selectedService.description}
                </DialogDescription>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Biaya Layanan Stimulasi
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                      {formatIDR(selectedService.price)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-light font-sans">
                      / program
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-light text-slate-500 py-1.5 px-1 border-t border-slate-100">
                  <span>Kapasitas Kursi Tersisa:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedService.slots > 0 ? `${selectedService.slots} Slot Aktif` : "Habis Terbooking"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedService(null)}
                  className="h-10 px-4 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    router.push(`/register?serviceId=${selectedService.id}`);
                  }}
                  disabled={selectedService.slots <= 0}
                  className="h-10 px-5 inline-flex items-center gap-1.5 justify-center rounded-full bg-brand-teal text-white hover:bg-brand-teal/95 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <span>{selectedService.slots > 0 ? "Daftar & Bayar Sekarang" : "Pendaftaran Penuh"}</span>
                  {selectedService.slots > 0 && <ArrowUpRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
