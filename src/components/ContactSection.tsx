"use client";

import { FormEvent, useState } from "react";
import { contact } from "@/data/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function ContactSection() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-[#07070c]/88">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          index="05"
          title="Contact"
          subtitle="コラボのご相談はこちらから"
        />

        <Reveal className="grid gap-10 lg:grid-cols-2" stagger={0.07}>
          <div className="space-y-6">
            <p className="font-mono text-sm text-muted">
              $ kumi connect --channel open
            </p>

            <div className="space-y-4">
              <ContactLink
                label="X (Twitter)"
                value={contact.xHandle}
                href={contact.x}
              />
              <DiscordCard username={contact.discord} />
            </div>

            <p className="text-xs leading-relaxed text-muted/80">
              フォーム送信は現在デモです。本番公開時は Formspree や Resend
              などと接続できます。
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm md:p-8"
          >
            <div className="space-y-4">
              <Field label="name" id="name" placeholder="お名前" />
              <Field
                label="message"
                id="message"
                placeholder="コラボの内容やご相談"
                multiline
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-accent py-3 font-mono text-xs uppercase tracking-wider text-background transition hover:bg-accent/90"
            >
              send signal
            </button>

            {sent && (
              <p className="mt-4 text-center font-mono text-xs text-accent">
                [OK] signal transmitted (demo)
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function DiscordCard({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(username);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex w-full items-center justify-between rounded-xl border border-border px-5 py-4 text-left transition hover:border-accent/30"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
          Discord
        </p>
        <p className="mt-1 text-sm text-foreground group-hover:text-accent">
          {username}
        </p>
        <p className="mt-1 text-[10px] text-muted">
          クリックでコピー（Discordでユーザー名検索）
        </p>
      </div>
      <span className="font-mono text-xs text-accent">
        {copied ? "copied!" : "copy"}
      </span>
    </button>
  );
}

function ContactLink({
  label,
  value,
  href,
  note,
}: {
  label: string;
  value: string;
  href: string;
  note?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-xl border border-border px-5 py-4 transition hover:border-accent/30"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {label}
        </p>
        <p className="mt-1 text-sm text-foreground group-hover:text-accent">
          {value}
        </p>
        {note && <p className="mt-1 text-[10px] text-muted">{note}</p>}
      </div>
      <span className="font-mono text-accent opacity-0 transition group-hover:opacity-100">
        →
      </span>
    </a>
  );
}

function Field({
  label,
  id,
  placeholder,
  multiline,
}: {
  label: string;
  id: string;
  placeholder: string;
  multiline?: boolean;
}) {
  const className =
    "w-full rounded-xl border border-border bg-background/50 px-4 py-3 font-mono text-sm text-foreground outline-none transition placeholder:text-muted/50 focus:border-accent/40";

  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-muted">
        {label}
      </label>
      {multiline ? (
        <textarea id={id} rows={4} placeholder={placeholder} className={className} />
      ) : (
        <input id={id} type="text" placeholder={placeholder} className={className} />
      )}
    </div>
  );
}
