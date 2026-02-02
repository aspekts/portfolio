import { Mail, Github, Linkedin, FileText } from 'lucide-react';
import SectionTitle from './SectionTitle';
import AnimateOnScroll from './AnimateOnScroll';

const Contact = () => {
  const contactMethods = [
    {
      icon: <Mail className="text-purple-400" size={24} />,
      label: 'Email',
      value: 'mail@aspekts.dev',
      href: 'mailto:mail@aspekts.dev'
    },
    {
      icon: <Github className="text-purple-400" size={24} />,
      label: 'GitHub',
      value: '@aspekts',
      href: 'https://github.com/aspekts'
    },
    {
      icon: <Linkedin className="text-purple-400" size={24} />,
      label: 'LinkedIn',
      value: 'Marcus Kamuntu',
      href: 'https://linkedin.com/in/mkamuntu'
    }
  ];

  return (
    <section id="contact" className="bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle symbol="#" title="Get in Touch" />
        </AnimateOnScroll>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimateOnScroll>
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.href}
                  className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-400 transition-colors"
                >
                  {method.icon}
                  <div>
                    <p className="text-sm text-gray-400">{method.label}</p>
                    <p className="text-white">{method.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 text-balance">Download Resume</h3>
              <p className="text-gray-300 mb-6 text-pretty">
                Get a detailed overview of my experience, skills, and qualifications.
              </p>
              <a
                href="../assets/resume.pdf"
                download
                className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md transition-colors"
              >
                <FileText size={20} />
                Download CV
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
};

export default Contact;