"use client";

import React, { useState, useRef, useEffect } from "react";

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"bot" | "human_form">("bot");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "שלום! ברוכים הבאים ל-BOBY. איך אפשר לעזור לך היום?",
      timestamp: new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Form State for Human Agent
  const [userText, setUserText] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, mode]);

  // Close on ESC key or click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const addMessage = (sender: "bot" | "user", text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Quick Reply Answers
  const handleQuickReply = (question: string) => {
    addMessage("user", question);

    setTimeout(() => {
      if (question.includes("מזמינים")) {
        addMessage(
          "bot",
          "הזמנת יצירה מתבצעת בקלות: בוחרים פריט מהגלריה, לוחצים על 'הוספה לסל', ועוברים לקופה הבטוחה. כל היצירות נשלחות ישירות מהסטודיו של האמן עם חשבונית מס."
        );
      } else if (question.includes("משלוח")) {
        addMessage(
          "bot",
          "משלוחי האמנות שלנו מתבצעים באריזה מוגנת ומבוטחת: משלוח עד הבית תוך 3–5 ימי עסקים (משלוח חינם בקנייה מעל ₪500). יצירות לפי הזמנה (Made to Order) נשלחות בתום זמן הייצור."
        );
      } else if (question.includes("אמן")) {
        addMessage(
          "bot",
          "נשמח לצרף אותך לקהילת האמנים של BOBY! לוחצים על 'הרשמה' בראש העמוד, בוחרים 'הרשמת אמן', וממלאים את פרטי הסטודיו. לאחר אימות קצר תוכל להעלות יצירות למכירה."
        );
      } else if (question.includes("נציג")) {
        setMode("human_form");
        addMessage(
          "bot",
          "העברתי אותך לטופס פנייה ישיר לנציג. אנא רשום את השאלה ופרטי התקשרות (אימייל או טלפון) כדי שנחזור אליך בהקדם."
        );
      }
    }, 400);
  };

  // Submit Free Text or Contact Form to Live Agent
  const handleHumanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userText.trim() || !contactInfo.trim()) return;

    setIsSubmitting(true);
    addMessage("user", `${userText.trim()} (פרטי קשר: ${contactInfo.trim()})`);

    setTimeout(() => {
      setIsSubmitting(false);
      setUserText("");
      setContactInfo("");
      setMode("bot");
      addMessage("bot", "הודעתך התקבלה! נציג צוות BOBY יחזור אליך בהקדם בהתאם לפרטי הקשר שסופקו.");
    }, 500);
  };

  return (
    <div className="fixed bottom-20 end-4 z-30 md:bottom-6 md:end-6" ref={chatRef}>
      {/* Floating Chat Trigger Button - Minimalist Transparent Icon without background circle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="צ'אט תמיכה ושירות לקוחות"
        className="flex h-10 w-10 items-center justify-center bg-transparent text-text hover:scale-110 transition-transform focus-visible:outline-none p-0 border-0 shadow-none"
      >
        <span className="text-2xl drop-shadow-sm" aria-hidden="true">
          💬
        </span>
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="צ'אט תמיכה ושירות לקוחות"
          className="absolute bottom-16 end-0 flex h-[500px] max-h-[82vh] w-88 max-w-[calc(100vw-2.5rem)] flex-col rounded-panel border border-border bg-surface shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-panel bg-deep px-5 py-4 text-surface">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-lg">
                🎨
              </span>
              <div>
                <h2 className="text-small font-bold text-surface">תמיכה ושירות לקוחות BOBY</h2>
                <p className="text-caption text-surface/80">מענה מהיר ופניות לנציג</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="סגירת צ'אט"
              className="rounded-control p-1 text-surface/70 hover:bg-surface/10 hover:text-surface"
            >
              ✕
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#FAFAFA]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`rounded-panel px-4 py-2.5 text-small leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-deep text-surface rounded-te-none"
                      : "bg-sand/70 text-text border border-border/60 rounded-ts-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="mt-1 text-[11px] text-text-muted/60 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Quick Reply Action Buttons (Shown in Bot Mode) */}
            {mode === "bot" && (
              <div className="mt-2 flex flex-col gap-2 pt-2">
                <p className="text-caption font-semibold text-text-muted">שאלות נפוצות:</p>
                <button
                  type="button"
                  onClick={() => handleQuickReply("איך מזמינים יצירה?")}
                  className="rounded-control border border-border bg-surface px-3.5 py-2 text-start text-small text-text transition-colors hover:border-accent-strong hover:bg-sand"
                >
                  📦 איך מזמינים יצירה?
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickReply("מהם זמני המשלוח?")}
                  className="rounded-control border border-border bg-surface px-3.5 py-2 text-start text-small text-text transition-colors hover:border-accent-strong hover:bg-sand"
                >
                  🚚 מהם זמני המשלוח?
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickReply("איך נרשמים כאמן?")}
                  className="rounded-control border border-border bg-surface px-3.5 py-2 text-start text-small text-text transition-colors hover:border-accent-strong hover:bg-sand"
                >
                  🎨 איך נרשמים כאמן?
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickReply("דבר עם נציג אנושי")}
                  className="rounded-control bg-accent/15 border border-accent/30 px-3.5 py-2 text-start text-small font-semibold text-accent-strong transition-colors hover:bg-accent/25"
                >
                  💬 דבר עם נציג אנושי
                </button>
              </div>
            )}

            {/* Live Agent Contact Form */}
            {mode === "human_form" && (
              <form
                onSubmit={handleHumanSubmit}
                className="mt-2 flex flex-col gap-3 rounded-panel border border-border bg-surface p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-small font-bold text-text">פנייה לנציג אנושי</h3>
                  <button
                    type="button"
                    onClick={() => setMode("bot")}
                    className="text-caption text-accent-strong hover:underline"
                  >
                    ← חזרה לשאלות
                  </button>
                </div>

                <div>
                  <label htmlFor="chat-user-text" className="block mb-1 text-caption font-medium text-text">
                    השאלה או התוכן *
                  </label>
                  <textarea
                    id="chat-user-text"
                    rows={2}
                    required
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    placeholder="פרט במה נכל לעזור..."
                    className="w-full rounded-control border border-border bg-surface p-2.5 text-small placeholder:text-text-muted/60 focus:border-accent-strong focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="chat-contact" className="block mb-1 text-caption font-medium text-text">
                    פרטי התקשרות (אימייל / טלפון) *
                  </label>
                  <input
                    id="chat-contact"
                    type="text"
                    dir="ltr"
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="email@example.com / 050-1234567"
                    className="w-full rounded-control border border-border bg-surface px-3 py-2 text-small placeholder:text-text-muted/60 focus:border-accent-strong focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 rounded-control bg-btn-primary px-4 py-2 text-small font-medium text-surface transition-colors hover:bg-deep/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:opacity-50"
                >
                  {isSubmitting ? "שולח..." : "שליחת פנייה לנציג ✉️"}
                </button>
              </form>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          {mode === "bot" && (
            <div className="border-t border-border bg-surface p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (userText.trim()) {
                    handleQuickReply(userText.trim());
                    setUserText("");
                  }
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  placeholder="כתיבת הודעה או שאלה..."
                  className="flex-1 rounded-control border border-border bg-surface px-3.5 py-2 text-small placeholder:text-text-muted/60 focus:border-accent-strong focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="שליחת הודעה"
                  className="rounded-control bg-accent-strong px-3.5 py-2 text-small font-medium text-surface transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                >
                  שגר
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
