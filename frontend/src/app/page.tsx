"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ticket {
  id: number;
  title: string;
  description: string;
  submitted_by: string;
  status: string;
  urgency_level: string | null;
  severity_score: number | null;
  reasoning: string | null;
  created_at: string;
}

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/tickets/`);
      if (res.ok) {
        const data = await res.json();
        const sortedData = data.sort((a: Ticket, b: Ticket) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setTickets(sortedData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(() => {
      fetchTickets(false); 
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/tickets/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          submitted_by: submittedBy,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        setSubmittedBy("");
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 p-10 max-w-[1300px] w-full mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[1.8rem] font-semibold text-[#c9d1d9]">Overview</h2>
        <div className="flex gap-4">
          <button 
            className="px-5 py-2.5 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2 bg-transparent border border-border text-textPrimary hover:bg-border" 
            onClick={() => fetchTickets(true)}
          >
            Refresh
          </button>
          <button 
            className="px-5 py-2.5 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2 bg-accent hover:bg-accentHover text-white" 
            onClick={() => setIsModalOpen(true)}
          >
            + Tiket Baru
          </button>
        </div>
      </div>

      {loading && tickets.length === 0 ? (
        <div className="text-center py-16 px-8 text-textSecondary bg-transparent border-2 border-dashed border-border rounded-xl">
          <h3 className="text-white mb-2 text-lg">Loading tiket</h3>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 px-8 text-textSecondary bg-transparent border-2 border-dashed border-border rounded-xl">
          <h3 className="text-white mb-2 text-lg">Tidak Ada Tiket Ditemukan</h3>
          <p>Buat tiket baru untuk memulai AI Triage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
          {tickets.map((t) => {
            const urgency = t.urgency_level?.toLowerCase() || '';
            const status = t.status.toLowerCase();
            
            return (
            <Link href={`/tickets/${t.id}`} key={t.id} className="no-underline">
              <div className="bg-panel border border-border rounded-xl p-6 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-transform duration-200 h-full cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:border-[#484f58] flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-[1.15rem] font-semibold mb-1 text-white leading-[1.3]">{t.title}</h3>
                    <div className="text-[0.8rem] text-textSecondary">Oleh {t.submitted_by} &bull; #{t.id}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[0.7rem] font-semibold uppercase tracking-[0.5px] inline-block border ${
                    status === 'pending' ? 'bg-[#d29922]/10 text-warning border-[#d29922]/30' : 'bg-[#2ea043]/10 text-success border-[#2ea043]/30'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-[#8b949e] text-[0.9rem] line-clamp-3 mt-2 flex-1">{t.description}</p>
                
                <div className="mt-auto pt-4 border-t border-border flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-[0.85rem]">
                    <span className="text-textSecondary font-medium">Urgensi</span>
                    <span className={`px-2 py-0.5 rounded-full text-[0.7rem] font-semibold uppercase tracking-[0.5px] inline-block border ${
                      urgency === 'high' ? 'bg-[#f85149]/10 text-danger border-[#f85149]/30' : 
                      urgency === 'medium' ? 'bg-[#d29922]/10 text-warning border-[#d29922]/30' : 
                      urgency === 'low' ? 'bg-[#58a6ff]/10 text-accent border-[#58a6ff]/30' : 'bg-transparent text-textSecondary border-border'
                    }`}>
                      {t.urgency_level || "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[0.85rem]">
                    <span className="text-textSecondary font-medium">Skor Keparahan</span>
                    <span className="font-semibold text-white">
                      {t.severity_score !== null ? t.severity_score : "-"} / 10
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )})}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-black/60 backdrop-blur-[4px] flex justify-center items-center z-[1000] animate-fadeIn" onClick={() => setIsModalOpen(false)}>
          <div className="bg-[#161b22] w-full max-w-[500px] rounded-xl border border-border p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Buat Tiket Baru</h3>
              <button className="bg-transparent border-none text-textSecondary text-3xl cursor-pointer transition-colors hover:text-white leading-none" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-textPrimary">Judul</label>
                <input
                  required
                  type="text"
                  className="w-full bg-background border border-border text-white rounded-md p-3 text-[0.95rem] transition-colors focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="E.g. Database is down"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-textPrimary">Deskripsi</label>
                <textarea
                  required
                  className="w-full min-h-[100px] resize-y bg-background border border-border text-white rounded-md p-3 text-[0.95rem] transition-colors focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-textPrimary">Email / Nama Pengirim</label>
                <input
                  required
                  type="text"
                  className="w-full bg-background border border-border text-white rounded-md p-3 text-[0.95rem] transition-colors focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="your@email.com"
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" className="px-5 py-2.5 rounded-md text-sm font-medium transition-colors bg-transparent border border-[#30363d] text-white hover:bg-border" onClick={() => setIsModalOpen(false)}>
                  Batalkan
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-md text-sm font-medium transition-colors bg-accent text-white hover:bg-accentHover disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
