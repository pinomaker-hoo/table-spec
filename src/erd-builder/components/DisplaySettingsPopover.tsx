import { useERDBuilder } from '../context';
import { useLanguage } from '../../i18n/LanguageContext';
import type { NodeDisplayOptions } from '../types';

interface Props {
  onClose: () => void;
}

export default function DisplaySettingsPopover({ onClose }: Props) {
  const { state, dispatch } = useERDBuilder();
  const { t } = useLanguage();
  const opts = state.displayOptions;

  const toggle = (key: keyof NodeDisplayOptions) => {
    dispatch({ type: 'SET_DISPLAY_OPTIONS', payload: { [key]: !opts[key] } });
  };

  const items: { key: keyof NodeDisplayOptions; label: string }[] = [
    { key: 'showDataType', label: t.displayDataType },
    { key: 'showConstraints', label: t.displayConstraints },
    { key: 'showNullable', label: t.displayNullable },
    { key: 'showDefault', label: t.displayDefault },
    { key: 'showComment', label: t.displayComment },
    { key: 'showUnique', label: t.displayUnique },
    { key: 'showAutoIncrement', label: t.displayAutoIncrement },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      {/* Popover */}
      <div className="absolute right-0 top-full mt-1 z-50 bg-[#2D3748] border border-[#4A5568] rounded-lg shadow-xl p-3 w-56">
        <div className="text-[10px] text-[#718096] uppercase tracking-wider mb-2">{t.displaySettings}</div>
        <div className="space-y-1.5">
          {items.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-xs text-[#E2E8F0] cursor-pointer hover:text-white group">
              <input
                type="checkbox"
                checked={opts[key]}
                onChange={() => toggle(key)}
                className="w-3.5 h-3.5 rounded border-[#4A5568] bg-[#1A202C] text-[#4DB8B0] focus:ring-[#4DB8B0] focus:ring-1 cursor-pointer"
              />
              <span className="group-hover:text-white transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
