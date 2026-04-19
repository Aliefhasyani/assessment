"use client";

import { useEffect, useState } from "react";

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

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTickets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <main>
      <div className="dashboard-header">
        <h2>Ticket Triage Overview</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn refresh-btn" onClick={fetchTickets}>
            Refresh
          </button>
          <button className="btn" onClick={() => setIsModalOpen(true)}>
            + New Ticket
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Loading tickets...</h3>
        </div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <h3>No Tickets Found</h3>
          <p>Create a new ticket to get started with the AI Triage.</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((t) => (
            <div key={t.id} className="panel ticket-card">
              <div className="ticket-header">
                <div>
                  <h3 className="ticket-title">{t.title}</h3>
                  <div className="ticket-meta">By {t.submitted_by} • #{t.id}</div>
                </div>
                <span className={`badge ${t.status.toLowerCase()}`}>
                  {t.status}
                </span>
              </div>
              <p className="ticket-body">{t.description}</p>
              
              <div className="ticket-footer">
                <div className="analysis-row">
                  <span className="analysis-label">Urgency</span>
                  <span className={`badge ${t.urgency_level?.toLowerCase() || ''}`}>
                    {t.urgency_level || "Pending"}
                  </span>
                </div>
                <div className="analysis-row">
                  <span className="analysis-label">Severity Score</span>
                  <span className="analysis-value">
                    {t.severity_score !== null ? t.severity_score : "-"} / 10
                  </span>
                </div>
                {t.reasoning && (
                  <div className="analysis-row" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '0.5rem', gap: '0.35rem' }}>
                    <span className="analysis-label" style={{ fontSize: '0.8rem' }}>AI Reasoning:</span>
                    <span style={{ fontSize: '0.85rem', color: '#c9d1d9', fontStyle: 'italic', lineHeight: 1.5 }}>
                      &quot;{t.reasoning}&quot;
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Ticket</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  required
                  type="text"
                  className="form-input"
                  placeholder="E.g. Database is down"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  required
                  className="form-textarea"
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Submitted By (Email/Name)</label>
                <input
                  required
                  type="text"
                  className="form-input"
                  placeholder="your@email.com"
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem" }}>
                <button type="button" className="btn" style={{ background: "transparent", border: "1px solid #30363d" }} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn" disabled={isSubmitting}>
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
