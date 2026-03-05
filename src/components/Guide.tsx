import { useLanguage } from '../i18n/LanguageContext';
import { sampleDDL, sampleTables } from '../data/sampleData';
import TablePreview from './TablePreview';

export default function Guide() {
  const { t } = useLanguage();

  return (
    <div className="mt-16 space-y-16">
      {/* How to Use */}
      <section>
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          {t.guideTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '1', title: t.guideStep1Title, desc: t.guideStep1Desc, icon: '📄' },
            { step: '2', title: t.guideStep2Title, desc: t.guideStep2Desc, icon: '📤' },
            { step: '3', title: t.guideStep3Title, desc: t.guideStep3Desc, icon: '📊' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-[#2D3748] border border-[#4A5568] rounded-xl p-6 text-center"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#4DB8B0] text-white text-sm font-bold mb-3">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-[#A0AEC0] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          {t.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: t.feature1Title, desc: t.feature1Desc, icon: '🔍' },
            { title: t.feature2Title, desc: t.feature2Desc, icon: '📋' },
            { title: t.feature3Title, desc: t.feature3Desc, icon: '🔗' },
            { title: t.feature4Title, desc: t.feature4Desc, icon: '⬇️' },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-[#2D3748] border border-[#4A5568] rounded-xl p-5"
            >
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[#A0AEC0] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Example */}
      <section>
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          {t.exampleTitle}
        </h2>

        {/* Sample DDL */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-[#A0AEC0] mb-3">{t.exampleDDLLabel}</h3>
          <div className="bg-[#1A202C] border border-[#4A5568] rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm text-[#E2E8F0] font-mono whitespace-pre leading-relaxed">
              {sampleDDL}
            </pre>
          </div>
        </div>

        {/* Sample Result */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-[#A0AEC0] mb-3">{t.exampleResultLabel}</h3>
          <TablePreview tables={sampleTables} />
        </div>

        {/* CTA */}
        <p className="text-center text-[#4DB8B0] font-semibold text-lg">
          {t.exampleCTA}
        </p>
      </section>

      {/* About */}
      <section className="bg-[#2D3748] border border-[#4A5568] rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          {t.aboutTitle}
        </h2>
        <p className="text-[#A0AEC0] text-center leading-relaxed max-w-3xl mx-auto">
          {t.aboutDesc}
        </p>
      </section>
    </div>
  );
}
