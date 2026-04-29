"use client";

import { CheckCircle, XCircle, Target, Lightbulb } from "lucide-react";
import styles from "./ResultsView.module.css";

export default function ResultsView({ data }) {
  if (!data) return null;

  const { score, matchedSkills, missingSkills, feedback, actionPlan } = data;

  // Simple SVG circle animation for the score
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.topSection}>
        {/* Score Card */}
        <div className="glass-panel animate-fade-in delay-100">
          <div className={styles.scoreCard}>
            <div className={styles.scoreRing}>
              <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: "rotate(-90deg)" }}>
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke="var(--primary-color)"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                />
              </svg>
              <div className={styles.scoreText}>{score}%</div>
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Match Score</h3>
            <p className={styles.scoreLabel}>
              {score >= 80 ? "Great fit! You have a high chance of getting an interview." :
               score >= 50 ? "Good potential, but some key areas need improvement." :
               "Significant gaps found. Consider upskilling or tweaking your resume."}
            </p>
          </div>
        </div>

        {/* Skills Section */}
        <div className={`glass-panel ${styles.skillsSection} animate-fade-in delay-200`}>
          <div className={styles.skillGroup}>
            <h3 style={{ color: "var(--success-color)" }}>
              <CheckCircle size={20} />
              Matched Skills
            </h3>
            <div className={styles.badges}>
              {matchedSkills?.length > 0 ? (
                matchedSkills.map((skill, i) => (
                  <span key={i} className={`${styles.badge} ${styles.matched}`}>
                    {skill}
                  </span>
                ))
              ) : (
                <span className={styles.scoreLabel}>No significant matching skills found.</span>
              )}
            </div>
          </div>

          <div className={styles.skillGroup}>
            <h3 style={{ color: "var(--error-color)" }}>
              <XCircle size={20} />
              Missing Skills
            </h3>
            <div className={styles.badges}>
              {missingSkills?.length > 0 ? (
                missingSkills.map((skill, i) => (
                  <span key={i} className={`${styles.badge} ${styles.missing}`}>
                    {skill}
                  </span>
                ))
              ) : (
                <span className={styles.scoreLabel}>You have all the required skills!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className={`glass-panel animate-fade-in delay-300`}>
        <div className={styles.feedbackSection}>
          <h3>
            <Target size={24} />
            Experience Gaps & Feedback
          </h3>
          <div className={styles.feedbackGrid}>
            {feedback?.map((item, index) => (
              <div key={index} className={styles.feedbackCard}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.actionPlan} animate-fade-in delay-300`}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", color: "var(--accent-color)" }}>
            <Lightbulb size={24} />
            Action Plan
          </h3>
          <ul className={styles.actionPlanList}>
            {actionPlan?.map((step, index) => (
              <li key={index} className={styles.actionPlanItem}>
                <span className={styles.actionPlanNumber}>{index + 1}</span>
                <p style={{ margin: 0, color: "var(--text-primary)" }}>{step}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
