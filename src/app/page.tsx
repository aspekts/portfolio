import Receiver from '@/components/Receiver';
import { Guide, NowBar, OffAir, Rotation, Shelf, Sign } from '@/components/Sections';

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to the receiver</a>
      <header className="masthead">
        <p className="logo">Aspekts</p>
        <nav aria-label="Sections">
          <a href="#guide">Work</a>
          <a href="#shelf">Music</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="/assets/resume.pdf">CV</a>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="receiver" aria-label="Aspekts FM receiver">
          <div className="identity">
            <h1>Marcus <br />Kamuntu</h1>
            <p className="role">Software engineer and founder. I collect music and make things.</p>
            <p className="intro">
              Right now I&apos;m building Sendix, which helps SEND teams turn vague support plans into specific ones.
              Everything else about me is on this dial.
            </p>
            <p className="hint"><b>Drag the dial below.</b> Press Listen: every station plays a different side of my music.</p>
          </div>
          <Receiver />
        </section>

        <Guide />
        <Shelf />
        <Rotation />
        <OffAir />
      </main>
      <Sign />
      <NowBar />
    </>
  );
}
