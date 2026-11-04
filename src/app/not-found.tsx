import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="lost">
      <h1>Dead air.</h1>
      <p>Nothing is broadcasting on this frequency.</p>
      <p><Link href="/">Back to the dial</Link></p>
    </main>
  );
}
