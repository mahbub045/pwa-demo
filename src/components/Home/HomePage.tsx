"use client";

import React, { useEffect, useMemo, useState } from "react";

const LOCAL_STORAGE_KEY = "visitorNames";
const SESSION_KEY = "hasSubmittedNameThisSession";

function getStoredNames(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((n) => typeof n === "string")
      : [];
  } catch {
    return [];
  }
}

function saveNames(names: string[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(names));
  } catch {
    // ignore write errors
  }
}

const HomePage: React.FC = () => {
  const [names, setNames] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setNames(getStoredNames());
    const askedThisSession =
      typeof window !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY) === "true";
    setIsModalOpen(!askedThisSession);
  }, []);

  const visitorCountLabel = useMemo(() => {
    const count = names.length;
    if (count === 0) return "No visitors yet";
    if (count === 1) return "1 visitor";
    return `${count} visitors`;
  }, [names.length]);

  function normalizeName(value: string): string {
    return value.trim().replace(/\s+/g, " ");
  }

  function handleSubmit() {
    const normalized = normalizeName(nameInput);
    if (!normalized) {
      setError("Please enter your name");
      return;
    }

    const exists = names.some(
      (n) => n.toLowerCase() === normalized.toLowerCase()
    );
    if (exists) {
      setError("This name is already on the list");
      return;
    }

    const updated = [normalized, ...names];
    setNames(updated);
    saveNames(updated);
    setIsModalOpen(false);
    setNameInput("");
    setError("");

    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // ignore
    }
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-slate-50 to-violet-50 text-slate-900">
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-white/70 p-8 shadow-xl ring-1 ring-black/5 backdrop-blur">
          <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-fuchsia-400/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-indigo-400/30 blur-3xl" />

          <div className="relative">
            <h1 className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Visitor List
            </h1>
            <p className="mt-2 text-sm text-slate-600">{visitorCountLabel}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setError("");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:cursor-pointer hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25a.75.75 0 01.75.75v8.25H21a.75.75 0 010 1.5h-8.25V21a.75.75 0 01-1.5 0v-8.25H3a.75.75 0 010-1.5h8.25V3a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
                Add your name
              </button>

              {names.length > 0 && (
                <button
                  onClick={() => {
                    setNames([]);
                    saveNames([]);
                    setError("");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm  hover:cursor-pointer hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Clear list
                </button>
              )}
            </div>

            <div className="mt-8">
              {names.length === 0 ? (
                <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
                  <div>
                    <p className="text-base font-medium text-slate-700">
                      Be the first to sign the book
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Add your name to get started.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {names.map((n) => (
                    <li
                      key={n}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow">
                        <span className="text-sm font-bold">
                          {n.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {n}
                        </p>
                        <p className="text-xs text-slate-500">Signed visitor</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
            <button
              aria-label="Close"
              onClick={() => {
                setIsModalOpen(false);
                setError("");
                try {
                  sessionStorage.setItem(SESSION_KEY, "true");
                } catch {
                  // ignore
                }
              }}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:cursor-pointer hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-slate-900">
              What is your name?
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              We will add it to the visitor list.
            </p>

            <div className="mt-4">
              <label
                htmlFor="name"
                className="text-xs font-medium text-slate-700"
              >
                Name
              </label>
              <input
                id="name"
                autoFocus
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="Enter your name"
              />
              {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setError("");
                  try {
                    sessionStorage.setItem(SESSION_KEY, "true");
                  } catch {
                    // ignore
                  }
                }}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Not now
              </button>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add name
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;
