import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#2D3748] border-t border-[#4A5568] mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="TableSpec" className="w-6 h-6 rounded" />
              <span className="text-white font-bold">TableSpec</span>
            </div>
            <p className="text-sm text-[#A0AEC0] leading-relaxed">
              {t.footerAbout}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">{t.footerLinks}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-[#A0AEC0] hover:text-[#4DB8B0] transition-colors"
                >
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-[#A0AEC0] hover:text-[#4DB8B0] transition-colors"
                >
                  {t.termsOfService}
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer */}
          <div>
            <h4 className="text-white font-semibold mb-3">{t.footerDeveloper}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/pinomaker-hoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#A0AEC0] hover:text-[#4DB8B0] transition-colors inline-flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  pinomaker-hoo
                </a>
              </li>
              <li>
                <a
                  href="mailto:inhoo987654321@gmail.com"
                  className="text-sm text-[#A0AEC0] hover:text-[#4DB8B0] transition-colors inline-flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  inhoo987654321@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-[#4A5568] text-center text-sm text-[#718096]">
          © {new Date().getFullYear()} TableSpec. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
