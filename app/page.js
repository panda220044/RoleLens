"use client";

import Link from "next/link";
import { User, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container} style={{ justifyContent: 'center', minHeight: '80vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <header className={styles.hero} style={{ marginBottom: '3rem' }}>
          <h1 className={`${styles.title} gradient-text animate-fade-in`}>
            RoleLens
          </h1>
          <p className={`${styles.subtitle} animate-fade-in delay-100`} style={{ maxWidth: '600px', margin: '0 auto' }}>
            Choose your portal to get started. Whether you are a candidate optimizing your resume, 
            or a recruiter screening multiple applicants, RoleLens has you covered.
          </p>
        </header>

        <div className="animate-fade-in delay-200" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '900px' }}>
          {/* Candidate Portal Card */}
          <Link href="/student" style={{ flex: '1 1 300px', minWidth: '300px' }}>
            <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'white' }}>
                <User size={40} />
              </div>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>Candidate Portal</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', flexGrow: 1 }}>
                Analyze a single resume against a job description to get personalized feedback and improve your chances.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: '600' }}>
                Enter Portal <ArrowRight size={20} />
              </div>
            </div>
          </Link>

          {/* Recruiter Portal Card */}
          <Link href="/recruiter" style={{ flex: '1 1 300px', minWidth: '300px' }}>
            <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--secondary-color))', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'white' }}>
                <Users size={40} />
              </div>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>Recruiter Portal</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', flexGrow: 1 }}>
                Upload multiple resumes at once to batch process and rank candidates against a single job description.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', fontWeight: '600' }}>
                Enter Portal <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
