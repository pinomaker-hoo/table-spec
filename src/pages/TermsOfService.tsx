import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import Footer from '../components/Footer';

export default function TermsOfService() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#1A202C] flex flex-col">
      {/* Header */}
      <header className="bg-[#2D3748] border-b border-[#4A5568]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="TableSpec" className="w-8 h-8 rounded" />
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">TableSpec</h1>
              <p className="text-xs text-[#A0AEC0]">{t.subtitle}</p>
            </div>
          </Link>
          <div className="flex items-center border border-[#4A5568] rounded-lg overflow-hidden text-sm">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 transition-colors ${
                lang === 'en'
                  ? 'bg-[#4DB8B0] text-white'
                  : 'text-[#A0AEC0] hover:text-white hover:bg-[#4A5568]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ko')}
              className={`px-3 py-1.5 transition-colors ${
                lang === 'ko'
                  ? 'bg-[#4DB8B0] text-white'
                  : 'text-[#A0AEC0] hover:text-white hover:bg-[#4A5568]'
              }`}
            >
              KO
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-white mb-8">{t.termsOfService}</h1>

        {lang === 'ko' ? (
          <div className="space-y-8 text-[#CBD5E0] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. 서비스 소개</h2>
              <p>
                TableSpec은 DDL(Data Definition Language) SQL 파일을 분석하여 테이블 명세서와 ERD(Entity Relationship Diagram)를
                자동으로 생성하는 무료 웹 기반 도구입니다. 본 서비스를 이용함으로써 아래 이용약관에 동의하게 됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. 서비스 이용</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>본 서비스는 무료로 제공되며, 별도의 회원가입 없이 이용할 수 있습니다.</li>
                <li>사용자는 DDL SQL 파일을 업로드하여 테이블 명세서와 ERD를 생성하고 다운로드할 수 있습니다.</li>
                <li>모든 파일 처리는 사용자의 브라우저에서 수행되며, 서버로 데이터가 전송되지 않습니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. 지원 SQL 문법</h2>
              <p>
                TableSpec은 MySQL, PostgreSQL, Oracle 등 주요 SQL 문법의 CREATE TABLE 구문을 지원합니다.
                그러나 모든 SQL 문법이나 벤더별 확장 구문을 완벽하게 지원하는 것을 보장하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. 면책 조항</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>본 서비스는 "있는 그대로" 제공되며, 파싱 결과의 정확성이나 완전성을 보장하지 않습니다.</li>
                <li>생성된 명세서나 ERD를 실무에 사용하기 전에 반드시 검증하시기 바랍니다.</li>
                <li>서비스 이용으로 인해 발생하는 직접적, 간접적 손해에 대해 책임지지 않습니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. 지적 재산권</h2>
              <p>
                사용자가 업로드하는 DDL 파일과 생성된 결과물에 대한 권리는 사용자에게 있습니다.
                TableSpec 서비스 자체의 디자인, 코드, 로고 등에 대한 지적 재산권은 개발자에게 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. 서비스 변경 및 중단</h2>
              <p>
                서비스는 사전 통지 없이 변경, 일시 중단 또는 종료될 수 있습니다.
                서비스 변경이나 중단으로 인한 손해에 대해 책임지지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. 금지 행위</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>서비스의 정상적인 운영을 방해하는 행위</li>
                <li>자동화된 도구를 사용하여 서비스에 과도한 부하를 주는 행위</li>
                <li>서비스를 불법적인 목적으로 이용하는 행위</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. 약관 변경</h2>
              <p>
                본 이용약관은 변경될 수 있으며, 변경 시 이 페이지를 통해 공지합니다.
                변경된 약관에 동의하지 않는 경우 서비스 이용을 중단해야 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. 문의</h2>
              <p>
                이용약관에 관한 문의사항은{' '}
                <a href="mailto:inhoo987654321@gmail.com" className="text-[#4DB8B0] hover:underline">
                  inhoo987654321@gmail.com
                </a>
                으로 연락해주세요.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-8 text-[#CBD5E0] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Service Description</h2>
              <p>
                TableSpec is a free web-based tool that analyzes DDL (Data Definition Language) SQL files
                to automatically generate table specifications and ERD (Entity Relationship Diagrams).
                By using this Service, you agree to the following terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Use of Service</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>This Service is provided free of charge and requires no registration.</li>
                <li>Users can upload DDL SQL files to generate and download table specifications and ERDs.</li>
                <li>All file processing is performed in the user's browser; no data is transmitted to any server.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Supported SQL Dialects</h2>
              <p>
                TableSpec supports CREATE TABLE statements from major SQL dialects including MySQL, PostgreSQL, and Oracle.
                However, complete support for all SQL syntaxes or vendor-specific extensions is not guaranteed.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Disclaimer</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>This Service is provided "as is" without warranty of any kind regarding the accuracy or completeness of parsing results.</li>
                <li>Please verify generated specifications and ERDs before using them in production environments.</li>
                <li>We are not liable for any direct or indirect damages arising from the use of this Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Intellectual Property</h2>
              <p>
                Users retain all rights to the DDL files they upload and the generated outputs.
                Intellectual property rights for the TableSpec service itself, including its design, code, and logo, belong to the developer.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Service Modifications</h2>
              <p>
                The Service may be modified, suspended, or discontinued at any time without prior notice.
                We are not responsible for any damages resulting from service changes or interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Prohibited Activities</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Interfering with the normal operation of the Service</li>
                <li>Using automated tools to place excessive load on the Service</li>
                <li>Using the Service for any illegal purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Changes to Terms</h2>
              <p>
                These Terms of Service may be updated from time to time. Any changes will be posted on this page.
                If you do not agree with the updated terms, you should discontinue use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
              <p>
                For inquiries regarding these Terms of Service, please contact us at{' '}
                <a href="mailto:inhoo987654321@gmail.com" className="text-[#4DB8B0] hover:underline">
                  inhoo987654321@gmail.com
                </a>.
              </p>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
