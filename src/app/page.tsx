import Link from "next/link";

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>Zest</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>Money, but make it a vibe.</p>

      <Link href="/onboarding" className="btn-primary">
        Get Started
      </Link>
    </main>
  );
}
