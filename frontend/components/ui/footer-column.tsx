import {
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import Link from 'next/link';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.796.056 1.03.047 1.77.21 2.4.456a5.14 5.14 0 011.884 1.226A5.14 5.14 0 0121.6 7.62c.246.63.409 1.37.456 2.4.047 1.01.056 1.365.056 3.796s-.01 2.784-.056 3.796c-.047 1.03-.21 1.77-.456 2.4a5.14 5.14 0 01-1.226 1.884 5.14 5.14 0 01-1.884 1.226c-.63.246-1.37.409-2.4.456-1.01.047-1.365.056-3.796.056s-2.784-.01-3.796-.056c-1.03-.047-1.77-.21-2.4-.456a5.14 5.14 0 01-1.884-1.226 5.14 5.14 0 01-1.226-1.884c-.246-.63-.409-1.37-.456-2.4C2.01 15.626 2 15.271 2 12.83s.01-2.784.056-3.796c.047-1.03.21-1.77.456-2.4a5.14 5.14 0 011.226-1.884A5.14 5.14 0 017.62 2.4c.63-.246 1.37-.409 2.4-.456 1.01-.047 1.365-.056 3.796-.056zm-.018 1.986c-2.41 0-2.7.01-3.648.053-.896.041-1.382.19-1.706.316a3.15 3.15 0 00-1.168.76 3.15 3.15 0 00-.76 1.168c-.126.324-.275.81-.316 1.706C4.664 9.07 4.654 9.36 4.654 11.77s.01 2.7.053 3.648c.041.896.19 1.382.316 1.706a3.15 3.15 0 00.76 1.168c.324.475.76.76 1.168.76.324.126.81.275 1.706.316.948.043 1.238.053 3.648.053s2.7-.01 3.648-.053c.896-.041 1.382-.19 1.706-.316a3.15 3.15 0 001.168-.76 3.15 3.15 0 00.76-1.168c.126-.324.275-.81.316-1.706.043-.948.053-1.238.053-3.648s-.01-2.7-.053-3.648c-.041-.896-.19-1.382-.316-1.706a3.15 3.15 0 00-.76-1.168 3.15 3.15 0 00-1.168-.76c-.324-.126-.81-.275-1.706-.316-.948-.043-1.238-.053-3.648-.053zm0 2.827a4.957 4.957 0 100 9.913 4.957 4.957 0 000-9.913zm0 7.927a2.97 2.97 0 110-5.94 2.97 2.97 0 010 5.94zm5.553-7.514a1.188 1.188 0 11-2.376 0 1.188 1.188 0 012.376 0z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const data = {
  facebookLink: '#',
  instaLink: '#',
  twitterLink: '#',
  githubLink: '#',
  services: {
    schoolAdmin: '/auth/school-admin-login',
    studentHub: '/auth/student-login',
    superAdmin: '/superadmin',
    register: '/auth/register-school',
  },
  about: {
    features: '#features',
    solutions: '#solutions',
    portals: '#portals',
    pricing: '#pricing',
  },
  help: {
    faqs: '#',
    support: '#',
    livechat: '#',
  },
  contact: {
    email: 'support@eduverse.com',
    phone: '+1 (800) 555-0199',
    address: 'San Francisco, California, USA',
  },
  company: {
    name: 'EduVerse',
    description:
      'Pioneering modern education management systems for a smarter, unified, and connected global classroom.',
    logo: '',
  },
};

const socialLinks = [
  { icon: FacebookIcon, label: 'Facebook', href: data.facebookLink },
  { icon: InstagramIcon, label: 'Instagram', href: data.instaLink },
  { icon: TwitterIcon, label: 'Twitter', href: data.twitterLink },
  { icon: GithubIcon, label: 'GitHub', href: data.githubLink },
];

const aboutLinks = [
  { text: 'Core Features', href: data.about.features },
  { text: 'Solutions', href: data.about.solutions },
  { text: 'Portal Overview', href: data.about.portals },
  { text: 'Pricing & Licensing', href: data.about.pricing },
];

const serviceLinks = [
  { text: 'School Admin Dashboard', href: data.services.schoolAdmin },
  { text: 'Student Learning Hub', href: data.services.studentHub },
  { text: 'Super Admin Command', href: data.services.superAdmin },
  { text: 'Register Institution', href: data.services.register },
];

const helpfulLinks = [
  { text: 'User Manual', href: data.help.faqs },
  { text: 'System Status', href: data.help.support },
  { text: 'Live Support Chat', href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="bg-transparent mt-16 w-full border-t border-[#464554]/10">
      <div className="mx-auto max-w-[1280px] px-8 pt-16 pb-6 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-white flex items-center justify-center gap-3 sm:justify-start">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8083ff] to-[#6f00be] shadow-[0_0_15px_rgba(128,131,255,0.3)]">
                <span className="font-hanken font-bold text-sm text-white">EV</span>
              </div>
              <span className="text-xl font-bold font-hanken">
                {data.company.name}
              </span>
            </div>

            <p className="text-[#c7c4d7] mt-6 max-w-md text-center text-xs leading-relaxed sm:max-w-xs sm:text-left font-medium font-hanken">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8 text-[#c7c4d7]/70">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-[#c0c1ff] transition-colors"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left font-hanken">
              <p className="text-sm font-bold text-[#c0c1ff] uppercase tracking-wider">Company</p>
              <ul className="mt-8 space-y-4 text-xs">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-[#c7c4d7] hover:text-white transition-colors"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left font-hanken">
              <p className="text-sm font-bold text-[#c0c1ff] uppercase tracking-wider">Portals</p>
              <ul className="mt-8 space-y-4 text-xs">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-[#c7c4d7] hover:text-white transition-colors"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left font-hanken">
              <p className="text-sm font-bold text-[#c0c1ff] uppercase tracking-wider">Resources</p>
              <ul className="mt-8 space-y-4 text-xs font-medium">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className={`${
                        hasIndicator
                          ? 'group flex justify-center gap-1.5 sm:justify-start'
                          : 'text-[#c7c4d7] hover:text-white transition-colors'
                      }`}
                    >
                      <span className="text-[#c7c4d7] group-hover:text-white transition-colors">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2 mt-1">
                          <span className="bg-[#c0c1ff] absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-[#c0c1ff] relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left font-hanken">
              <p className="text-sm font-bold text-[#c0c1ff] uppercase tracking-wider">Contact</p>
              <ul className="mt-8 space-y-4 text-xs font-medium">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-2 sm:justify-start text-[#c7c4d7] hover:text-white transition-colors"
                      href="#"
                    >
                      <Icon className="text-[#c0c1ff] size-4 shrink-0 shadow-sm" />
                      {isAddress ? (
                        <address className="text-[#c7c4d7] -mt-0.5 flex-1 not-italic transition-colors hover:text-white">
                          {text}
                        </address>
                      ) : (
                        <span className="text-[#c7c4d7] flex-1 transition-colors hover:text-white">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#464554]/10 pt-6 font-hanken">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-xs text-[#c7c4d7]/60">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-[#c7c4d7]/60 mt-4 text-xs transition sm:order-first sm:mt-0 font-medium">
              &copy; 2026 {data.company.name} LMS Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
