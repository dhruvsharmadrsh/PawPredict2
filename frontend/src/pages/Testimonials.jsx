// Updated Testimonials.jsx

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "tailwindcss/tailwind.css";

gsap.registerPlugin(ScrollTrigger);

const PAGE_SIZE = 5;
const themes = {
  dark: "bg-gradient-to-br from-gray-900 via-slate-800 to-black",
  light: "bg-gradient-to-br from-indigo-400 to-purple-700",
};

const Testimonials = ({ theme = "dark" }) => {
  const [allFeedback, setAllFeedback] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [breedFilter, setBreedFilter] = useState("All");
  const sectionRef = useRef(null);
  const quoteRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    fetch("/testimonials.json")
      .then((res) => res.json())
      .then((data) => {
        setAllFeedback(data);
        setFiltered(data);
      });
  }, []);

  const handleFilterChange = (e) => {
    const breed = e.target.value;
    setBreedFilter(breed);
    const filteredData =
      breed === "All" ? allFeedback : allFeedback.filter((f) => f.breed === breed);
    setFiltered(filteredData);
    setPage(1);
    setActiveIndex(0);
  };

  const pagedData = filtered.slice(0, page * PAGE_SIZE);

  const loadMore = () => {
    if (page * PAGE_SIZE < filtered.length) {
      setPage((p) => p + 1);
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.set(sectionRef.current.querySelectorAll(".animate-in"), {
      opacity: 0,
      y: 40,
    });
    gsap.to(sectionRef.current.querySelectorAll(".animate-in"), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }, [filtered, page]);

  useEffect(() => {
    if (!quoteRef.current) return;
    gsap.fromTo(
      quoteRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
    gsap.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, ease: "none", duration: 4, transformOrigin: "left center" }
    );
  }, [activeIndex]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        setActiveIndex((i) => Math.min(i + 1, pagedData.length - 1));
      }
      if (e.key === "ArrowUp") {
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    },
    [pagedData.length]
  );

  const breeds = ["All", ...new Set(allFeedback.map((f) => f.breed))];

  return (
    <section
      ref={sectionRef}
      className={`px-4 py-20 ${themes[theme]} overflow-hidden`}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label="Testimonials section"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-end">
          <select
            value={breedFilter}
            onChange={handleFilterChange}
            className="px-3 py-2 rounded text-gray-800"
            aria-label="Filter testimonials by dog breed"
          >
            {breeds.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center animate-in">
          <h2 className="text-4xl font-bold text-white mb-2">
            What our clients say
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            {breedFilter === "All"
              ? "Discover how customers across breeds benefit from our AI insights."
              : `Feedback from ${breedFilter} breed predictions.`}
          </p>
        </div>
        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          <div className="animate-in flex items-center min-h-[200px]">
            <div ref={quoteRef} className="relative italic text-yellow-300 text-xl">
              <span
                className="absolute -top-6 left-0 text-6xl text-yellow-500 opacity-30 select-none"
                style={{ fontFamily: "serif" }}
              >
                “
              </span>
              {pagedData[activeIndex]?.quote}
            </div>
          </div>
          <div className="space-y-4 overflow-auto" style={{ maxHeight: "400px" }}>
            {pagedData.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                  idx === activeIndex
                    ? "bg-white/90 shadow-lg"
                    : "bg-white/60 hover:bg-white/80"
                }`}
                aria-selected={idx === activeIndex}
              >
                <img
                  src={item.avatar}
                  alt={item.name}
                  className={`w-14 h-14 rounded-full border-2 transition ${
                    idx === activeIndex ? "border-yellow-400" : "border-gray-200"
                  }`}
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.position}</div>
                  <div className="flex items-center text-yellow-500 text-sm mt-1">
                    {"★".repeat(Math.round(item.accuracy))}
                    {"☆".repeat(5 - Math.round(item.accuracy))}
                  </div>
                </div>
                {idx === activeIndex && (
                  <div className="absolute left-3 bottom-0 right-3 h-1 bg-yellow-300/30 rounded">
                    <div
                      ref={progressRef}
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                      style={{ transformOrigin: "left center", transform: "scaleX(0)" }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
            {page * PAGE_SIZE < filtered.length && (
              <button
                onClick={loadMore}
                className="w-full py-2 mt-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Load More Reviews
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
