import { useRef, useState } from "react";

function getLocalizedText(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] ?? value?.en ?? value?.ru ?? "";
}

export default function CaseStudyGallery({
  images,
  language,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const dialogRef = useRef(null);
  const previewRef = useRef(null);
  const viewportRef = useRef(null);

  if (!images?.length) return null;

  const ru = language === "ru";
  const image = images[activeIndex];
  const alt = getLocalizedText(image.alt, language);

  function changeSlide(index) {
    const next = Math.max(
      0,
      Math.min(images.length - 1, index),
    );

    setActiveIndex(next);
    setZoomed(false);

    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
      viewportRef.current.scrollLeft = 0;
    }
  }

  function openLightbox() {
    setZoomed(false);
    dialogRef.current?.showModal();
  }

  function closeLightbox() {
    dialogRef.current?.close();
  }

  return (
    <div
      className="case-study-carousel"
      role="region"
      aria-label={
        ru ? "Галерея QRumiX" : "QRumiX gallery"
      }
    >
      <figure className="case-study-carousel__figure">
        <div className="case-study-carousel__stage">
          <button
            ref={previewRef}
            type="button"
            className="case-study-carousel__preview"
            onClick={openLightbox}
            aria-label={
              ru
                ? `Увеличить скриншот: ${alt}`
                : `Enlarge screenshot: ${alt}`
            }
          >
            <img
              className="case-study-carousel__image"
              src={image.src}
              alt={alt}
              loading="lazy"
              decoding="async"
            />

            <span className="case-study-carousel__hint">
              <span aria-hidden="true">⤢</span>{" "}
              {ru
                ? "Нажми для просмотра"
                : "Click to enlarge"}
            </span>
          </button>
        </div>

        <figcaption className="case-study-carousel__caption">
          {alt}
        </figcaption>
      </figure>

      <div className="case-study-carousel__controls">
        <button
          type="button"
          className="case-study-carousel__arrow"
          disabled={activeIndex === 0}
          aria-label={
            ru ? "Предыдущий" : "Previous"
          }
          onClick={() => changeSlide(activeIndex - 1)}
        >
          ←
        </button>

        <span
          className="case-study-carousel__counter"
          role="status"
          aria-live="polite"
        >
          {activeIndex + 1} / {images.length}
        </span>

        <button
          type="button"
          className="case-study-carousel__arrow"
          disabled={activeIndex === images.length - 1}
          aria-label={
            ru ? "Следующий" : "Next"
          }
          onClick={() => changeSlide(activeIndex + 1)}
        >
          →
        </button>
      </div>

      <div
        className="case-study-carousel__dots"
        role="group"
        aria-label={
          ru ? "Выбор скриншота" : "Select screenshot"
        }
      >
        {images.map((item, index) => (
          <button
            key={item.src}
            type="button"
            className={
              index === activeIndex
                ? "case-study-carousel__dot case-study-carousel__dot--active"
                : "case-study-carousel__dot"
            }
            aria-label={
              ru
                ? `Скриншот ${index + 1}`
                : `Screenshot ${index + 1}`
            }
            aria-pressed={index === activeIndex}
            onClick={() => changeSlide(index)}
          />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="case-study-lightbox"
        aria-label={
          ru
            ? "Просмотр скриншота QRumiX"
            : "QRumiX screenshot viewer"
        }
        onClose={() => {
          setZoomed(false);
          previewRef.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            changeSlide(activeIndex - 1);
          }

          if (event.key === "ArrowRight") {
            event.preventDefault();
            changeSlide(activeIndex + 1);
          }
        }}
      >
        <div className="case-study-lightbox__toolbar">
          <span>
            {activeIndex + 1} / {images.length}
          </span>

          <div className="case-study-lightbox__actions">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => changeSlide(activeIndex - 1)}
              aria-label={ru ? "Назад" : "Previous"}
            >
              ←
            </button>

            <button
              type="button"
              disabled={activeIndex === images.length - 1}
              onClick={() => changeSlide(activeIndex + 1)}
              aria-label={ru ? "Далее" : "Next"}
            >
              →
            </button>

            <button
              type="button"
              aria-pressed={zoomed}
              onClick={() => setZoomed((value) => !value)}
            >
              {zoomed
                ? ru ? "Уместить" : "Fit"
                : "100%"}
            </button>

            <button
              type="button"
              onClick={closeLightbox}
              aria-label={ru ? "Закрыть" : "Close"}
            >
              ✕
            </button>
          </div>
        </div>

        <div
          ref={viewportRef}
          className={
            zoomed
              ? "case-study-lightbox__viewport case-study-lightbox__viewport--zoomed"
              : "case-study-lightbox__viewport"
          }
        >
          <img
            src={image.src}
            alt={alt}
            decoding="async"
          />
        </div>
      </dialog>
    </div>
  );
}
