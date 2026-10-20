import Reveal from './Reveal.jsx';

export default function SectionHeading({ eyebrow, title, highlight, subtitle }) {
  return (
    <div className="mb-14 text-center">
      <Reveal>
        <p className="eyebrow mb-3">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="text-3xl font-bold sm:text-5xl">
          {title} <span className="text-gradient">{highlight}</span>
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-xl text-muted">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
