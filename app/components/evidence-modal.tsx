"use client";

import { useEffect, useId, useRef } from "react";

export function EvidenceModal({ close, save }: { close: () => void; save: () => void }) {
  const dialogRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const claimHelpId = useId();

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>("button, input, select, textarea")?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [close]);

  return <div className="modal-backdrop" onMouseDown={close}>
    <form ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="evidence-modal" onMouseDown={(event) => event.stopPropagation()} onSubmit={(event) => { event.preventDefault(); save(); }}>
      <button type="button" className="modal-close" aria-label="Close evidence dialog" onClick={close}>×</button>
      <span className="eyebrow">RECORD LEARNING EVIDENCE</span>
      <h2 id={titleId}>Connect engineering work to an academic claim</h2>
      <p id={descriptionId}>Describe what the artifact proves, how it was verified and which outcome it supports. This records learning work—not attendance or time spent.</p>
      <label>Related assignment<select><option>DS-904 · Full-stack integration and test readiness</option><option>DS-905 · API contract and PostgreSQL integration</option><option>DS-907 · End-to-end quality-gate revision</option></select></label>
      <label>Evidence category<select><option>Code or pull request</option><option>API or data contract</option><option>Automated test report</option><option>Technical documentation</option><option>Critical reflection</option></select></label>
      <label>Academic claim<textarea required minLength={30} aria-describedby={claimHelpId} placeholder="Explain the decision, implementation, verification result or professional competency this evidence demonstrates…" /><small id={claimHelpId}>Include the decision or outcome, the verification method, and what the artifact demonstrates.</small></label>
      <label className="upload-box"><input type="file" accept=".pdf,.zip,.json,.yaml,.yml,.md,.txt,.doc,.docx" /><span className="upload-symbol" aria-hidden="true">↑</span><b>Select evidence file</b><small>Prototype only · PDF, source archive, test report, specification or document</small></label>
      <div className="button-row"><button type="button" onClick={close}>Cancel</button><button className="primary-button" type="submit">Save evidence</button></div>
    </form>
  </div>;
}
