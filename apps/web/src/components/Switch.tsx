type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
};

export default function Switch({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      aria-label={label ?? 'toggle'}
      onClick={() => onChange(!checked)}
      className={`inline-flex cursor-pointer h-7 w-12 items-center rounded-full px-1 transition ${
        checked ? 'bg-[var(--brand-yellow)]' : 'bg-[var(--divider)]'
      }`}
    >
      <span
        className={`h-6 w-6 rounded-full bg-white transition-transform transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
