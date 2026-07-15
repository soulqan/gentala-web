"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export default function FAQAccordion() {
  const faqs = [
    {
      question: "Berapa usia anak yang bisa mendaftar di Gentala?",
      answer: "Kami melayani program stimulasi dan terapi untuk anak mulai usia 6 bulan hingga 10 tahun. Setiap program dan aktivitas dirancang khusus menyesuaikan tahapan tumbuh kembang serta profil sensorik unik buah hati Anda."
    },
    {
      question: "Bagaimana alur pendaftaran pertama kali?",
      answer: "Proses pendaftaran dimulai dengan konsultasi dan sesi penilaian (assessment) awal oleh psikolog anak kami. Hal ini bertujuan untuk mengidentifikasi kebutuhan tumbuh kembang anak secara tepat, sehingga kami dapat merancang program stimulus yang personal dan efektif."
    },
    {
      question: "Berapa lama durasi untuk setiap sesi terapi?",
      answer: "Setiap sesi berdurasi total 60 menit, terdiri dari 50 menit aktivitas stimulasi/terapi langsung bersama anak dan terapis, serta 10 menit sesi edukasi, tanya jawab, dan pemberian arahan program rumah (home program) bagi orang tua."
    },
    {
      question: "Apakah orang tua boleh mendampingi anak di ruang terapi?",
      answer: "Untuk mengoptimalkan fokus anak selama terapi, aktivitas umumnya dilakukan secara mandiri bersama terapis. Namun, orang tua dapat memantau jalannya terapi melalui cermin satu arah (one-way mirror) di ruang tunggu atau layar monitor yang telah kami sediakan."
    },
    {
      question: "Bagaimana jika anak rewel atau belum mau berinteraksi?",
      answer: "Seluruh terapis kami memiliki latar belakang profesional serta tersertifikasi untuk menangani regulasi emosi anak. Kami menggunakan metode pendekatan yang persuasif, lembut, serta berbasis bermain (play-based approach) untuk membangun kenyamanan anak terlebih dahulu."
    }
  ]

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center justify-center bg-brand-teal/5 p-3 rounded-2xl w-fit mb-4">
            <HelpCircle className="h-6 w-6 text-brand-teal" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Pertanyaan Umum (FAQ)
          </h2>
          <div className="h-1 w-12 bg-brand-sage rounded-full mb-4" />
          <p className="text-slate-600 font-light text-sm sm:text-base">
            Informasi lengkap seputar program, metode stimulasi, dan mekanisme pendaftaran di Gentala.
          </p>
        </div>

        {/* Accordion List */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-xs border border-slate-100">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="last:border-0 py-2">
                <AccordionTrigger className="text-base sm:text-lg font-semibold tracking-tight hover:no-underline hover:text-brand-teal text-slate-800 transition-colors py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 font-light leading-relaxed text-sm sm:text-base pb-6 pt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
