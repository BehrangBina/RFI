import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const activities = [
  {
    title: 'Cultural & Community Engagement',
    body:
      'We organise cultural and educational events, Persian festival stalls, and gatherings that celebrate our heritage while fostering unity across Australia.',
  },
  {
    title: 'Welfare & Support Services',
    body:
      'Providing welfare support for migrants, youth, and seniors alongside educational programs and partnerships with nonprofits.',
  },
  {
    title: 'Advocacy & Public Awareness',
    body:
      "Running information booths with the global 100 Cities for Iran initiative at 100cities.org to amplify Crown Prince Reza Pahlavi's message and combat all forms of hate.",
  },
  {
    title: 'Human Rights & Democratic Change',
    body:
      'Partnering with Iranian Australian and allied organisations on campaigns that highlight human rights, women\'s rights, and the need for democratic change in Iran.',
  },
];

const steps = [
  'Protect civilians by degrading the regime\'s repressive capabilities and IRGC command structures.',
  'Maintain and strengthen maximum economic pressure by freezing assets, enforcing sanctions, and disrupting illicit logistics.',
  'Break the regime\'s information blockade by enabling secure, unrestricted internet access across Iran.',
  'Hold perpetrators accountable by expelling abusive diplomats and pursuing legal remedies against crimes against humanity.',
  'Demand the immediate and unconditional release of all political prisoners.',
  'Prepare for democratic transition by committing to recognise a legitimate transitional government when the moment arrives.',
];

function About() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#0b192d] via-night to-black px-6 py-20 text-white shadow-glow">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" aria-hidden />
        <div className="max-w-5xl">
          <p className="text-sm uppercase tracking-[0.4em] text-primary">About Us</p>
          <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            We rise for liberty, dignity, safety, and hope
          </h1>
          <p className="mt-6 text-lg text-white/80">
            Rise For Iran is an independent community rooted in Melbourne, amplifying the vision of His Imperial Highness Crown
            Prince Reza Pahlavi and supporting Iranians everywhere who fight for a free, secular, and democratic future.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/events" className="pill-button pill-button--primary">Discover Events</Link>
            <a href="mailto:info@riseforiran.org" className="pill-button pill-button--secondary">
              Partner With Us
            </a>
          </div>
        </div>
      </section>

      {/* Core Activities */}
      <section className="px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center text-white">
            <p className="text-sm uppercase tracking-[0.5em] text-primary">What we do</p>
            <h2 className="section-heading mt-4">Core Activities</h2>
            <p className="section-subtitle mt-4 text-white/70">
              Everything we do is anchored in community, culture, and an unshakeable demand for human rights.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {activities.map((activity, idx) => (
              <motion.article
                key={activity.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card h-full p-8 text-night"
              >
                <h3 className="text-xl font-bold text-night">{activity.title}</h3>
                <p className="mt-3 text-base text-night/80">{activity.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="px-4">
        <div className="glass-card mx-auto max-w-4xl space-y-6 p-10 text-center text-night">
          <p className="text-lg text-night/80">
            We proudly and unequivocally support His Imperial Highness Crown Prince Reza Pahlavi as the legitimate opposition
            leader against the Islamic Republic regime. His vision reflects the aspirations of the Iranian people for freedom,
            secular democracy, human rights, and the restoration of Iran's sovereignty.
          </p>
          <p className="text-lg text-night/80">
            By living these values in Melbourne and across Australia, we strengthen our communities while contributing to the
            global movement for a free Iran.
          </p>
          <p className="text-2xl font-semibold text-night">
            “We rise for liberty, dignity, safety, and hope for Iran, for Australia, and for the world.”
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-white/10 bg-white/5 p-10 text-white shadow-2xl">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-primary">Global call</p>
            <h2 className="mt-4 text-3xl font-bold text-white">Six Practical Steps for a Free Iran</h2>
            <p className="mt-2 text-white/80">
              Supporting the Iranian people is neither charity nor interference—global stability depends on removing this brutal
              regime.
            </p>
          </div>
          <ol className="mt-10 space-y-4 text-left text-white/80">
            {steps.map((step, idx) => (
              <li key={step} className="glass-card border-white/5 bg-black/20 p-5 text-white">
                <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-white">
                  {idx + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

export default About;
