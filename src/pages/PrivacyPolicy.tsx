import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl font-bold text-white mb-8">{t.privacyPolicy}</h1>

        {lang === 'ko' ? (
          <div className="space-y-8 text-[#CBD5E0] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. 개요</h2>
              <p>
                TableSpec(이하 "서비스")은 사용자의 개인정보를 중요하게 생각합니다.
                본 개인정보처리방침은 서비스 이용 시 수집되는 정보와 그 활용 방식에 대해 설명합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. 수집하는 정보</h2>
              <p className="mb-2">TableSpec은 최소한의 정보만을 수집합니다:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>파일 데이터:</strong> 업로드된 DDL SQL 파일은 브라우저 내에서만 처리되며, 서버로 전송되거나 저장되지 않습니다.</li>
                <li><strong>언어 설정:</strong> 선택한 언어(EN/KO)가 브라우저의 localStorage에 저장됩니다.</li>
                <li><strong>쿠키 및 광고:</strong> Google AdSense를 통해 광고가 표시되며, Google은 관심 기반 광고를 위해 쿠키를 사용할 수 있습니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. 클라이언트 측 처리</h2>
              <p>
                모든 DDL 파일 파싱, 테이블 명세서 생성, ERD 시각화는 사용자의 브라우저에서 직접 수행됩니다.
                업로드한 파일의 내용은 외부 서버로 전송되지 않으며, 세션이 종료되면 메모리에서 자동으로 삭제됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. 제3자 서비스</h2>
              <p className="mb-2">본 서비스는 다음과 같은 제3자 서비스를 사용합니다:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Google AdSense:</strong> 광고 제공을 위해 사용됩니다. Google의 개인정보처리방침은 <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#4DB8B0] hover:underline">여기</a>에서 확인하실 수 있습니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. 쿠키</h2>
              <p>
                TableSpec 자체는 쿠키를 사용하지 않지만, Google AdSense가 광고 목적으로 쿠키를 설정할 수 있습니다.
                사용자는 브라우저 설정을 통해 쿠키를 관리하거나 비활성화할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. 데이터 보안</h2>
              <p>
                모든 파일 처리가 클라이언트 측에서 이루어지므로, 사용자의 데이터가 인터넷을 통해 전송될 위험이 없습니다.
                이는 설계상 가장 안전한 개인정보 보호 방식입니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. 아동 개인정보 보호</h2>
              <p>
                본 서비스는 13세 미만의 아동으로부터 고의로 개인정보를 수집하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. 방침 변경</h2>
              <p>
                본 개인정보처리방침은 변경될 수 있으며, 변경 시 이 페이지를 통해 공지합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. 문의</h2>
              <p>
                개인정보 관련 문의사항은{' '}
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
              <h2 className="text-lg font-semibold text-white mb-3">1. Overview</h2>
              <p>
                TableSpec ("the Service") values your privacy.
                This Privacy Policy explains what information is collected when you use the Service and how it is used.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>
              <p className="mb-2">TableSpec collects minimal information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>File Data:</strong> Uploaded DDL SQL files are processed entirely in your browser. No file data is sent to or stored on any server.</li>
                <li><strong>Language Preference:</strong> Your selected language (EN/KO) is saved in your browser's localStorage.</li>
                <li><strong>Cookies & Advertising:</strong> Ads are served through Google AdSense. Google may use cookies for interest-based advertising.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Client-Side Processing</h2>
              <p>
                All DDL file parsing, table specification generation, and ERD visualization are performed directly in your browser.
                Your uploaded file content is never transmitted to any external server and is automatically cleared from memory when your session ends.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Third-Party Services</h2>
              <p className="mb-2">This Service uses the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Google AdSense:</strong> Used for serving advertisements. Google's privacy policy can be found <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#4DB8B0] hover:underline">here</a>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Cookies</h2>
              <p>
                TableSpec itself does not use cookies, but Google AdSense may set cookies for advertising purposes.
                You can manage or disable cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Data Security</h2>
              <p>
                Since all file processing occurs on the client side, there is no risk of your data being transmitted over the internet.
                This is the most secure approach to data privacy by design.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Children's Privacy</h2>
              <p>
                This Service does not knowingly collect personal information from children under the age of 13.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Changes to This Policy</h2>
              <p>
                This Privacy Policy may be updated from time to time. Any changes will be posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
              <p>
                For privacy-related inquiries, please contact us at{' '}
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
