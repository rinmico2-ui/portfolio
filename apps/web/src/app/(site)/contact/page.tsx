import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/animated/reveal";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";
import { getDb } from "@/lib/store";

export const metadata = { title: "Contact" };
export const dynamic = "force-dynamic";

export default function ContactPage() {
  const profile = getDb().profile;
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description="Have a project, internship, or collaboration in mind? I'd be glad to hear from you."
      />
      <div className="mt-10 grid gap-12 md:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <dl className="space-y-6">
            {profile.email && (
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-[15px] hover:text-teal">
                    <Mail size={15} /> {profile.email}
                  </a>
                </dd>
              </div>
            )}
            {profile.phone && (
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">Phone</dt>
                <dd className="mt-1">
                  <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-[15px] hover:text-teal">
                    <Phone size={15} /> {profile.phone}
                  </a>
                </dd>
              </div>
            )}
            {profile.location && (
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">Location</dt>
                <dd className="mt-1 inline-flex items-center gap-2 text-[15px]">
                  <MapPin size={15} /> {profile.location}
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
