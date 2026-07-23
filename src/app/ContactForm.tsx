// app/ContactForm.tsx — client island for the "what are you building?" contact form.
// Mirrors the ctfg-forms/contact widget (Name / Email / message + honeypot + reCAPTCHA v2),
// but restyled to the build-site design tokens. This is a static site, so it POSTs JSON
// cross-origin to a deployed copy of the ctfg-forms/contact Express app.
"use client";
import * as React from "react";
import { Arrow } from "../components/icons";

// The ctfg-forms/contact backend, deployed at its own subdomain.
// Inlined at build time (static export); override via NEXT_PUBLIC_CONTACT_ENDPOINT.
const ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "https://contact.civictech.guide/api/contact";
// reCAPTCHA v2 site key (public). Same key as the ctfg-forms contact form; the
// build.civictech.guide domain must be added to it in the reCAPTCHA admin console.
const SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfbLt4ZAAAAAJBMYRfEvqMCgwV2TqZRcmkP0Fa5";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

declare global {
  interface Window {
    grecaptcha?: {
      render: (el: HTMLElement, opts: { sitekey: string }) => number;
      getResponse: (id?: number) => string;
      reset: (id?: number) => void;
    };
  }
}

export function ContactForm() {
  const captchaRef = React.useRef<HTMLDivElement>(null);
  const widgetId = React.useRef<number | null>(null);
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  // Load the reCAPTCHA script once and render the widget explicitly (reliable in a SPA).
  React.useEffect(() => {
    function renderWidget() {
      if (widgetId.current !== null || !captchaRef.current || !window.grecaptcha) return;
      widgetId.current = window.grecaptcha.render(captchaRef.current, { sitekey: SITE_KEY });
    }
    if (window.grecaptcha?.render) {
      renderWidget();
      return;
    }
    const id = "recaptcha-api";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
    const t = setInterval(() => {
      if (window.grecaptcha?.render) {
        clearInterval(t);
        renderWidget();
      }
    }, 200);
    return () => clearInterval(t);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const website = String(data.get("website") || ""); // honeypot

    if (!name) return setError("Please enter your name.");
    if (!email || !EMAIL_RE.test(email)) return setError("Please enter a valid email address.");
    if (!message) return setError("Please tell us what you're building.");

    const token = (window.grecaptcha && window.grecaptcha.getResponse(widgetId.current ?? undefined)) || "";
    if (!token) return setError("Please complete the reCAPTCHA.");

    setBusy(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, token, website }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) throw new Error(body.error || `Server error ${res.status}`);
      setSent(true);
    } catch (err) {
      setError("Could not send: " + (err instanceof Error ? err.message : String(err)));
      if (window.grecaptcha) window.grecaptcha.reset(widgetId.current ?? undefined);
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-[14px] bg-bg border border-border px-[15px] py-3 text-[15px] text-ink " +
    "placeholder:text-ink-faint outline-none transition-colors focus:border-primary";

  return (
    <div className="max-w-[760px] mx-auto p-8 bg-surface border border-border rounded-2xl shadow-pill max-md:p-6">
      {sent ? (
        <p className="text-center text-lg text-ink py-10">
          Thanks — we got it, and we can&apos;t wait to see what you build. 💛
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">Name</span>
            <input name="name" type="text" maxLength={200} required autoComplete="name"
                   placeholder="Your name" className={field} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">Email</span>
            <input name="email" type="email" maxLength={400} required autoComplete="email"
                   placeholder="you@example.com" className={field} />
          </label>

          <label className="flex flex-col gap-2 col-span-2 max-md:col-span-1">
            <span className="text-sm font-medium text-ink">What are you building?</span>
            <textarea name="message" maxLength={2000} required rows={5}
                      placeholder="Tell us about your project, agent, or research — and how you're using the Field Guide data."
                      className={`${field} min-h-[140px] resize-y`} />
          </label>

          {/* Honeypot — hidden from humans, bots fill it. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
            <label>Leave this field empty
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="col-span-2 max-md:col-span-1 flex flex-wrap items-center justify-between gap-4">
            <div ref={captchaRef} className="min-h-[78px]" />
            <button type="submit" disabled={busy}
              className="inline-flex items-center gap-2.5 h-[52px] px-7 rounded-pill bg-primary text-bg font-ui font-bold text-base uppercase tracking-[0.05em] transition-[transform,background-color] duration-100 hover:bg-primary-deep disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
              {busy ? "Sending…" : "Send"} <Arrow className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <p className="col-span-2 max-md:col-span-1 text-sm text-[#c0392b]" role="alert" aria-live="polite">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
