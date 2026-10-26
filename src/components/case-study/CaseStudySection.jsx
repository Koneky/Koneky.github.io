
export default function CaseStudySection({
  title,
  content,
  children,
  callout = false,
}) {
  const hasContent =
    typeof content === "string" &&
    content.trim().length > 0;

  const hasChildren =
    children !== null &&
    children !== undefined &&
    children !== false;

  if (!hasContent && !hasChildren) {
    return null;
  }

  const className = callout
    ? "case-study-section case-study-section--callout"
    : "case-study-section";

  return (
    <section className={className}>
      <h2 className="case-study-section__title">
        {title}
      </h2>

      {hasContent && (
        <p className="case-study-section__content">
          {content}
        </p>
      )}

      {hasChildren && children}
    </section>
  );
}
