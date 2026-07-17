import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 font-mono text-xs uppercase tracking-wide text-signal">
          // contact
        </div>
        <h2 className="mb-3 font-display text-3xl font-medium text-paper">
          Open an order.
        </h2>
        <p className="mb-8 font-body text-sm text-muted">
          Whether it's a role, a project, or a question about a strategy — drop a message
          and I'll get back to you.
        </p>
        <ContactForm />
      </div>
    </section>
  );
}
