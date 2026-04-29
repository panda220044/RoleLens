"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { UploadCloud, FileText, Briefcase, Zap, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../page.module.css";
import ResultsView from "../components/ResultsView";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
        setResumeText(`[File attached: ${selectedFile.name}]`);
        setError("");
      } else {
        setError("Please upload a valid PDF file.");
      }
    }
  };

  const handleAnalyze = async () => {
    if ((!resumeText && !file) || !jobDescription) {
      setError("Please provide both your resume and the job description.");
      return;
    }
    
    setError("");
    setIsAnalyzing(true);
    
    try {
      let finalResumeText = resumeText;
      
      // If a file is attached, we need to extract text from it first
      // Since it's a client side, we'll send it to an API route to parse
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        const parseRes = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });
        
        if (!parseRes.ok) throw new Error("Failed to parse PDF");
        const parseData = await parseRes.json();
        finalResumeText = parseData.text;
      }
      
      // Call the main analysis API
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: finalResumeText,
          jobDescription,
        }),
      });
      
      if (!analyzeRes.ok) {
        const errData = await analyzeRes.json();
        throw new Error(errData.error || "Analysis failed");
      }
      
      const data = await analyzeRes.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong during analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setResults(null);
  };

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div
            key="input-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <header className={styles.hero}>
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                <ArrowLeft size={16} /> Back to portals
              </Link>
              <h1 className={`${styles.title} gradient-text animate-fade-in`}>
                Candidate Portal
              </h1>
              <p className={`${styles.subtitle} animate-fade-in delay-100`}>
                Stop guessing why you were rejected. Get AI-powered, actionable feedback 
                by comparing your resume directly against the job description.
              </p>
            </header>

            <div className={`${styles.formGrid} animate-fade-in delay-200`}>
              {/* Resume Section */}
              <div className={`${styles.inputSection} glass-panel`}>
                <div className={styles.sectionHeader}>
                  <FileText size={24} />
                  <h2>Your Resume</h2>
                </div>
                
                <div 
                  className={styles.fileUploadArea}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud size={48} color="var(--primary-color)" />
                  <div>
                    <span style={{ fontWeight: 600 }}>Click to upload PDF</span> or drag and drop
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className={styles.fileInput} 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
                
                <div className={styles.orDivider}>OR PASTE TEXT</div>
                
                <textarea
                  className={`input-field ${styles.textArea}`}
                  placeholder="Paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    if (file) setFile(null); // Clear file if they start typing
                  }}
                />
              </div>

              {/* Job Description Section */}
              <div className={`${styles.inputSection} glass-panel`}>
                <div className={styles.sectionHeader}>
                  <Briefcase size={24} />
                  <h2>Job Description</h2>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                  Paste the full job description you are targeting.
                </p>
                <textarea
                  className={`input-field ${styles.textArea}`}
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  style={{ flexGrow: 1 }}
                />
              </div>
            </div>

            <div className={`${styles.actionSection} animate-fade-in delay-300`}>
              <button 
                className="primary-button" 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Generate Feedback
                  </>
                )}
              </button>
              {error && <div className={styles.errorText}>{error}</div>}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <button 
              onClick={resetForm}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "2rem", background: "none", fontSize: "1rem", fontWeight: "500", cursor: "pointer" }}
              onMouseOver={(e) => e.currentTarget.style.color = 'white'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <ArrowLeft size={20} />
              Back to Input
            </button>
            <ResultsView data={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
