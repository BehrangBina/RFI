import { FadeIn } from '../components/animations/FadeIn';
import { StaggerContainer } from '../components/animations/StaggerContainer';
import { ScaleIn } from '../components/animations/ScaleIn';
import { ActivityCard } from '../components/about/ActivityCard';
import { CallToActionItem } from '../components/about/CallToActionItem';

const About = () => {
  const activities = [
    {
      title: 'Cultural & Community Engagement',
      description: 'We organise cultural and educational events, Persian festival stalls, and community gatherings that celebrate our heritage while fostering unity and cultural awareness across Australia.',
      icon: '🎭'
    },
    {
      title: 'Welfare & Support Services',
      description: 'We provide welfare support for migrants, youth, and seniors, alongside educational programs and partnerships with nonprofits.',
      icon: '🤝'
    },
    {
      title: 'Advocacy & Public Awareness',
      description: 'Running information booths in collaboration with the global 100 Cities for Iran initiative at 100cities.org to amplify the message of His Imperial Highness Crown Prince Reza Pahlavi and to combat antisemitism and all forms of hate in Australia.',
      icon: '📢'
    },
    {
      title: 'Human Rights & Democratic Change',
      description: 'Partnering with other Iranian Australian and allied organisations on advocacy campaigns that highlight human rights, women\'s rights, and the need for democratic change in Iran.',
      icon: '⚖️'
    }
  ];

  const callToActions = [
    'Protect civilians by degrading the regime\'s repressive capabilities, including measures targeted at IRGC command-and-control and leadership structures.',
    'Maintain and strengthen maximum economic pressure: freeze assets, enforce sanctions, and disrupt illicit logistics such as ghost tankers.',
    'Break the regime\'s information blockade by enabling secure, unrestricted internet access across Iran (e.g., Starlink and other resilient communication tools).',
    'Hold perpetrators accountable: expel diplomats involved in abuse and pursue legal remedies against those responsible for crimes against humanity.',
    'Demand the immediate and unconditional release of all political prisoners.',
    'Prepare for a democratic transition by committing to recognise a legitimate transitional government when such a moment arrives.'
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <FadeIn direction="down" className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Rise For Iran</h1>
        <div className="h-1 w-24 bg-[#46A2B9] mx-auto rounded-full"></div>
      </FadeIn>

      {/* Core Activities Section */}
      <section className="mb-16">
        <FadeIn delay={0.2}>
          <h2 className="text-3xl font-bold text-white mb-6">Core Activities</h2>
          <hr className="border-gray-700 mb-8" />
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <ActivityCard {...activity} />
            </FadeIn>
          ))}
        </StaggerContainer>
      </section>

      {/* Mission Statement */}
      <ScaleIn delay={0.3}>
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-lg p-8 mb-12 border border-gray-700">
          <p className="text-gray-200 text-lg leading-relaxed text-center font-serif italic">
            We proudly and unequivocally support His Imperial Highness Crown Prince Reza Pahlavi as the legitimate
            opposition leader against the Islamic Republic regime.
            We believe his vision reflects the true aspirations of the Iranian people for freedom, secular democracy,
            human rights, human dignity,
            and the restoration of Iran's national sovereignty and territorial integrity. We adopt his principles and
            code of conduct as the moral and practical
            framework for everything we do.
            By living these values here in Melbourne and across Australia, we strengthen our local communities while
            contributing to the global movement for a free,
            democratic, and secular Iran.
          </p>
        </div>
      </ScaleIn>

      {/* Vision Statement */}
      <FadeIn direction="up" delay={0.4}>
        <div className="bg-[#46A2B9]/20 border-2 border-[#46A2B9] rounded-lg p-8 mb-16">
          <p className="text-xl md:text-2xl text-center text-white font-bold italic">
            We rise for liberty, dignity, safety, and hope for Iran, for Australia, and for the world.
          </p>
        </div>
      </FadeIn>

      {/* Call to Action Section */}
      <section className="mb-12">
        <FadeIn delay={0.5}>
          <h5 className="text-2xl text-[#5bc0de] mb-6 leading-relaxed">
            As His Royal Highness Crown Prince Reza Pahlavi has said, the world can help us achieve our shared vision of a free Iran.
            We respectfully ask the international community to take the following six practical steps:
          </h5>
        </FadeIn>

        <StaggerContainer>
          <ol className="space-y-2 mb-8">
            {callToActions.map((action, index) => (
              <FadeIn key={index} delay={0.6 + index * 0.1}>
                <CallToActionItem number={index + 1} text={action} />
              </FadeIn>
            ))}
          </ol>
        </StaggerContainer>

        <FadeIn delay={1.3}>
          <p className="text-gray-200 text-lg italic border-l-4 border-[#46A2B9] pl-4">
            Supporting the Iranian people is not charity nor unwarranted interference. Global stability depends on the removal of this brutal regime.
          </p>
        </FadeIn>
      </section>

      {/* Footer Disclaimer */}
      <FadeIn direction="up" delay={1.4}>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h5 className="text-white font-semibold mb-3">Disclaimer</h5>
          <p className="text-gray-400 text-sm">
            Rise For Iran is an independent organisation with no affiliation to any political party or government.
            All views expressed on this website represent the organisation alone and should not be interpreted as the position
            of any other group or entity.
          </p>
        </div>
      </FadeIn>
      </div>
    </div>
  );
};

export default About;
