"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function TicketDetail() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async (showLoading = true) => {
    if (!id) return;
    if (showLoading) setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/tickets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
      } else if (res.status === 404) {
        router.push('/');
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchTicket();
    
    const interval = setInterval(() => {
      fetchTicket(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading && !ticket) {
    return (
      <main>
        <div className="py-16 px-8 text-center text-textSecondary bg-transparent border-none">
          <h3 className="text-[#c9d1d9] text-lg">Loading ticket details...</h3>
        </div>
      </main>
    );
  }

  if (!ticket) {
    return null;
  }
  
  const urgency = ticket.urgency_level?.toLowerCase() || '';
  const status = ticket.status.toLowerCase();

  return (
    <main className="max-w-[800px] mx-auto pt-8 pb-12 px-6 w-full">
      <div className="mb-8">
        <Link 
          href="/" 
          className="px-5 py-2.5 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2 bg-transparent border border-border text-textPrimary hover:bg-border"
        >
          &larr; Kembali ke Dashboard
        </Link>
      </div>
      
      <div className="bg-panel border border-border rounded-xl p-8 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-[1.8rem] font-semibold text-white mb-2">
              {ticket.title}
            </h2>
            <div className="text-[0.9rem] text-textSecondary">
              Submitted by <strong className="text-white">{ticket.submitted_by}</strong> on {new Date(ticket.created_at).toLocaleString()}
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.5px] inline-block border ${
            status === 'pending' ? 'bg-[#d29922]/10 text-warning border-[#d29922]/30' : 'bg-[#2ea043]/10 text-success border-[#2ea043]/30'
          }`}>
            {ticket.status}
          </span>
        </div>
        
        <div className="bg-[#0d1117] p-6 rounded-lg border border-[#30363d] mb-8">
          <h4 className="text-[#8b949e] mb-2 text-[0.9rem] uppercase tracking-[0.5px] font-medium">Deskripsi</h4>
          <p className="text-[#c9d1d9] leading-[1.6] whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        <div className="border-t border-[#30363d] pt-6">
          <h3 className="text-[1.2rem] font-semibold mb-4 text-white">Hasil Analisis AI</h3>
          
          {ticket.status === 'pending' ? (
            <div className="py-8 px-4 text-center text-textSecondary border-2 border-dashed border-[#30363d] rounded-lg">
              <p>AI sedang menganalisis tiket ini. Harap tunggu...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#161b22]/40 p-4 rounded-lg border border-[#30363d]">
                  <div className="text-[#8b949e] font-medium text-sm mb-2">Tingkat Urgensi</div>
                  <span className={`px-2.5 py-1 rounded-full text-[0.85rem] font-semibold uppercase tracking-[0.5px] inline-block border ${
                      urgency === 'high' ? 'bg-[#f85149]/10 text-danger border-[#f85149]/30' : 
                      urgency === 'medium' ? 'bg-[#d29922]/10 text-warning border-[#d29922]/30' : 
                      urgency === 'low' ? 'bg-[#58a6ff]/10 text-accent border-[#58a6ff]/30' : 'bg-transparent text-textSecondary border-border'
                    }`}>
                    {ticket.urgency_level}
                  </span>
                </div>
                <div className="bg-[#161b22]/40 p-4 rounded-lg border border-[#30363d]">
                  <div className="text-[#8b949e] font-medium text-sm mb-2">Tingkat Keparahan</div>
                  <div className="text-[1.25rem] font-semibold text-white">
                    {ticket.severity_score} <span className="text-[#8b949e] text-[0.9rem] font-normal">/ 10</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#161b22]/40 p-6 rounded-lg border border-[#30363d]">
                <h4 className="text-[#8b949e] mb-3 text-[0.9rem] uppercase tracking-[0.5px] font-medium">Alasan AI</h4>
                <p className="text-[#e6edf3] leading-[1.6] italic">
                  &quot;{ticket.reasoning}&quot;
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
