import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Mail, MapPin, Send } from 'lucide-react';
import { profile } from '../data/portfolio.js';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';

const empty = { name: '', email: '', subject: '', message: '', company: '' };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverError, setServerError] = useState('');

  const update = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.errors || {});
        setServerError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('sent');
      setForm(empty);
    } catch {
      setServerError('Network error — please check your connection and try again.');
      setStatus('error');
    }
  };

  const field = (name, label, { textarea, ...props } = {}) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {textarea ? (
        <textarea name={name} value={form[name]} onChange={update} rows={5} className="input resize-none" {...props} />
      ) : (
        <input name={name} value={form[name]} onChange={update} className="input" {...props} />
      )}
      <AnimatePresence>
        {errors[name] && (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 block text-xs text-rose-500"
          >
            {errors[name]}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );

  return (
    <section id="contact" className="relative py-28">
      <div className="absolute inset-x-0 bottom-0 -z-10 mx-auto h-80 max-w-4xl rounded-full bg-accent/10 blur-[140px]" />
      <div className="container-x">
        <SectionHeading
          eyebrow="05 — Contact"
          title="Let's build"
          highlight="something great"
          subtitle="Have a project in mind or just want to say hi? My inbox is always open."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <Reveal x={-40} y={0}>
            <div className="glass flex h-full flex-col gap-6 p-8">
              <h3 className="text-2xl font-semibold">Get in touch</h3>
              <p className="text-muted">
                I usually reply within 24 hours. Open to freelance work, internships and full-time roles.
              </p>
              <a href={`mailto:${profile.email}`} className="group flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent transition group-hover:scale-110">
                  <Mail size={20} />
                </span>
                <span>
                  <span className="block text-xs text-muted">Email</span>
                  <span className="break-all font-medium group-hover:text-accent">{profile.email}</span>
                </span>
              </a>
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent2/15 text-accent2">
                  <MapPin size={20} />
                </span>
                <span>
                  <span className="block text-xs text-muted">Location</span>
                  <span className="font-medium">{profile.location}</span>
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal x={40} y={0}>
            <form onSubmit={submit} noValidate className="glass relative overflow-hidden p-8">
              <AnimatePresence>
                {status === 'sent' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-card/95 p-8 text-center backdrop-blur"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    >
                      <CheckCircle2 size={64} className="text-accent" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold">Message sent!</h3>
                    <p className="text-muted">Thanks for reaching out — I'll get back to you soon.</p>
                    <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-2">
                      Send another
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid gap-5 sm:grid-cols-2">
                {field('name', 'Name', { placeholder: 'Juan Dela Cruz', autoComplete: 'name', required: true })}
                {field('email', 'Email', { type: 'email', placeholder: 'you@email.com', autoComplete: 'email', required: true })}
              </div>
              <div className="mt-5">{field('subject', 'Subject', { placeholder: 'Project inquiry' })}</div>
              <div className="mt-5">
                {field('message', 'Message', { textarea: true, placeholder: 'Tell me about your project…', required: true })}
              </div>
              {/* honeypot: hidden from humans */}
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={update}
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden
              />

              {serverError && <p className="mt-4 text-sm text-rose-500">{serverError}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={status === 'sending'}
                className="btn-primary mt-6 w-full disabled:opacity-70"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send message
                  </>
                )}
              </motion.button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
