"use client";
import { useEffect, useRef } from "react";
export function Dialog({ children, onClose, title }: {
    children: React.ReactNode;
    onClose: () => void;
    title: string;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    const close = useRef(onClose);
    close.current = onClose;
    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        ref.current?.showModal();
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const focusable = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex="0"]') || []).filter(el => el.getClientRects().length > 0);
        (focusable()[0] || ref.current)?.focus();
        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                close.current();
            }
            if (event.key === "Tab") {
                const list = focusable();
                const first = list[0];
                const last = list[list.length - 1];
                if (!first) {
                    event.preventDefault();
                    return;
                }
                if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
                    event.preventDefault();
                    last.focus();
                }
                else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener("keydown", handler);
        return () => { ref.current?.close(); document.body.style.overflow = overflow; document.removeEventListener("keydown", handler); previous?.focus(); };
    }, []);
    return <dialog ref={ref} className="dialog-root" aria-label={title} onCancel={event => { event.preventDefault(); close.current(); }}>{children}</dialog>;
}
