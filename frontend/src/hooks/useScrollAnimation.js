// hooks/useScrollAnimation.js
import { useEffect } from "react";

export const useScrollAnimation = (isLoading) => {
  useEffect(() => {
    // Запускаем наблюдение только если загрузка завершена
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    console.log("Found elements with animate-on-scroll:", animatedElements);
    animatedElements.forEach((el) => observer.observe(el));

    // Периодически проверяем новые элементы
    const interval = setInterval(() => {
      const newElements = document.querySelectorAll(".animate-on-scroll:not(.animate-in)");
      newElements.forEach((el) => observer.observe(el));
    }, 500); // Проверяем каждые 500 мс

    return () => {
      clearInterval(interval);
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, [isLoading]); // Зависимость от isLoading
};