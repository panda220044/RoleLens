"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  UploadCloud, Briefcase, Zap, Loader2, ArrowLeft,
  Users, X, ChevronRight, Trophy, AlertCircle, CheckCircle, XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./recruiter.module.css";
import ResultsView from "../components/ResultsView";

// ── helpers ────────────────────────────────────────────────────────────────

async function parsePdf(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
  if (!res.ok) throw new Error(`Failed to parse ${file.name}`);
  const data = await res.json();
  return data.text;
}

async function analyzeResume(resumeText, jobDescription) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume: resumeText, jobDescription }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Analysis failed");
  }
  return res.json();
}

function scoreClass(score) {
  if (score >= 75) return styles.scoreHigh;
  if (score >= 45) return styles.scoreMid;
  return styles.scoreLow;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function RecruiterPortal() {
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState([]); // File objects
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, name: "" });
  const [candidates, setCandidates] = useState([]); // processed results
  const [selectedIdx, setSelectedIdx] = useState(null); // which card is expanded
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // ── File management ────────────────────────────────────────────────────

  const addFiles = useCallback((newFiles) => {
    const pdfs = Array.from(newFiles).filter(
      (f) => f.type === "application/pdf" || f.name.endsWith(".pdf")
    );
    if (pdfs.length === 0) {
      setError("Only PDF files are accepted.");
      return;
    }
    setError("");
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      const unique = pdfs.filter((f) => !existing.has(f.name));
      return [...prev, ...unique];
    });
  }, []);

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Drag & Drop ────────────────────────────────────────────────────────

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // ── Batch Analysis ─────────────────────────────────────────────────────

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste the job description first.");
      return;
    }
    if (files.length === 0) {
      setError("Please upload at least one resume PDF.");
      return;
    }

    setError("");
    setIsProcessing(true);
    setSelectedIdx(null);
    setCandidates([]);

    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length, name: file.name });

      // Add a placeholder card that shows "analyzing…"
      results.push({ name: file.name, status: "processing", data: null, error: null });
      setCandidates([...results]);

      try {
        const text = await parsePdf(file);
        const data = await analyzeResume(text, jobDescription);
        results[i] = { name: file.name, status: "done", data, error: null };
      } catch (err) {
        results[i] = { name: file.name, status: "error", data: null, error: err.message };
      }

      setCandidates([...results]);

      // Small delay between calls to respect rate limits
      if (i < files.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    setIsProcessing(false);
    setProgress({ current: 0, total: 0, name: "" });
  };

  // Sort done candidates by score descending for ranking
  const rankedCandidates = [...candidates]
    .map((c, originalIdx) => ({ ...c, originalIdx }))
    .sort((a, b) => {
      const sa = a.data?.score ?? -1;
      const sb = b.data?.score ?? -1;
      return sb - sa;
    });

  const doneCount = candidates.filter((c) => c.status === "done").length;
  const hasDashboard = candidates.length > 0;

  // ── Selected detail view ───────────────────────────────────────────────

  if (selectedIdx !== null && candidates[selectedIdx]?.data) {
    const c = candidates[selectedIdx];
    return (
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: "100%" }}
        >
          <button className={styles.backButton} onClick={() => setSelectedIdx(null)}>
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700 }}>{c.name}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Match Score: <strong style={{ color: "var(--primary-color)" }}>{c.data.score}%</strong>
            </p>
          </div>
          <ResultsView data={c.data} />
        </motion.div>
      </div>
    );
  }

  // ── Main view ──────────────────────────────────────────────────────────

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        <motion.div
          key="recruiter-main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          {/* Header */}
          <header className={styles.hero}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              <ArrowLeft size={16} /> Back to portals
            </Link>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div style={{ background: "linear-gradient(135deg, var(--accent-color), var(--secondary-color))", width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={26} color="white" />
              </div>
              <h1 className={`${styles.title} gradient-text`}>Recruiter Portal</h1>
            </div>
            <p className={styles.subtitle}>
              Upload multiple candidate resumes and analyze them all against one job description — sequentially and reliably.
            </p>
          </header>

          {/* Input Panel + File list */}
          <div className={styles.mainGrid}>
            {/* Left: Job description */}
            <div className={`glass-panel ${styles.inputPanel}`}>
              <div className={styles.sectionHeader}>
                <Briefcase size={20} /> Job Description
              </div>
              <textarea
                className={`input-field ${styles.textArea}`}
                placeholder="Paste the full job description here…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Right: Resume upload */}
            <div className={`glass-panel ${styles.inputPanel}`}>
              <div className={styles.sectionHeaderBlue}>
                <UploadCloud size={20} /> Candidate Resumes
              </div>

              {/* Drop Zone */}
              <div
                className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <UploadCloud size={44} color={isDragging ? "var(--primary-color)" : "var(--text-secondary)"} />
                <span className={styles.dropZoneLabel}>
                  Click or drag & drop PDF files here
                </span>
                <span className={styles.dropZoneSub}>
                  Select multiple resumes at once — we'll process them one by one
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  className={styles.fileInput}
                  ref={fileInputRef}
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className={styles.fileList}>
                  {files.map((f, i) => (
                    <div key={i} className={styles.filePill}>
                      <CheckCircle size={15} color="var(--success-color)" style={{ flexShrink: 0 }} />
                      <span className={styles.filePillName}>{f.name}</span>
                      <button className={styles.removeFile} onClick={() => removeFile(i)} disabled={isProcessing}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action */}
          <div className={styles.actionSection}>
            <button
              className={styles.accentButton}
              onClick={handleAnalyze}
              disabled={isProcessing}
              id="analyze-batch-btn"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                  Processing {progress.current} of {progress.total}…
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Analyze {files.length > 0 ? `${files.length} Resume${files.length > 1 ? "s" : ""}` : "Resumes"}
                </>
              )}
            </button>

            {/* Progress bar */}
            {isProcessing && progress.total > 0 && (
              <div className={styles.progressContainer}>
                <div className={styles.progressLabel}>
                  Analyzing: <strong>{progress.name}</strong>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {error && <div className={styles.errorText}>{error}</div>}
          </div>

          {/* Dashboard */}
          {hasDashboard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ width: "100%" }}
            >
              <div className={styles.dashboardHeader}>
                <h2 className={styles.dashboardTitle}>
                  <Trophy size={24} color="var(--warning-color)" />
                  Candidate Rankings
                </h2>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  {doneCount} of {candidates.length} analyzed
                </span>
              </div>

              <div className={styles.candidateGrid}>
                {rankedCandidates.map((c, rank) => {
                  const isProcessing = c.status === "processing";
                  const isError = c.status === "error";
                  const isDone = c.status === "done";

                  return (
                    <motion.div
                      key={c.originalIdx}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, delay: rank * 0.05 }}
                      className={[
                        styles.candidateCard,
                        isDone ? "" : styles.processingCard,
                        isError ? styles.errorCard : "",
                        selectedIdx === c.originalIdx ? styles.candidateCardSelected : "",
                      ].join(" ")}
                      onClick={() => isDone && setSelectedIdx(c.originalIdx)}
                    >
                      {/* Rank Badge — only for done */}
                      {isDone && (
                        <span className={styles.rankBadge}>#{rank + 1}</span>
                      )}

                      {/* Top row */}
                      <div className={styles.cardTop}>
                        <span className={styles.candidateName}>{c.name}</span>

                        {isProcessing && (
                          <Loader2 size={28} color="var(--primary-color)" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} />
                        )}
                        {isError && (
                          <AlertCircle size={28} color="var(--error-color)" style={{ flexShrink: 0 }} />
                        )}
                        {isDone && (
                          <div className={`${styles.scoreBadge} ${scoreClass(c.data.score)}`}>
                            {c.data.score}%
                          </div>
                        )}
                      </div>

                      {/* Mini skill chips */}
                      {isDone && (
                        <div className={styles.miniSkills}>
                          {c.data.matchedSkills?.slice(0, 4).map((s, i) => (
                            <span key={i} className={`${styles.miniBadge} ${styles.miniBadgeMatched}`}>{s}</span>
                          ))}
                          {c.data.missingSkills?.slice(0, 3).map((s, i) => (
                            <span key={i} className={`${styles.miniBadge} ${styles.miniBadgeMissing}`}>{s}</span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className={styles.cardFooter}>
                        {isProcessing && <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Analyzing, please wait…</>}
                        {isError && <><AlertCircle size={14} color="var(--error-color)" /> {c.error}</>}
                        {isDone && <><ChevronRight size={14} /> Click to view full report</>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
