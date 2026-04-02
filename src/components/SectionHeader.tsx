type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
};

export function SectionHeader({ eyebrow, title, description, center = false }: SectionHeaderProps) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#b88952]">{eyebrow}</p>}
      <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">{title}</h2>
      {description && <p className="mt-4 text-sm leading-relaxed text-current/80 sm:text-base">{description}</p>}
    </div>
  );
}