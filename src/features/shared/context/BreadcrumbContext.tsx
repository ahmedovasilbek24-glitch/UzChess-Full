"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface BreadcrumbContextValue {
    label: string | null;
    setLabel: (label: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
    const [label, setLabelState] = useState<string | null>(null);
    const setLabel = useCallback((l: string | null) => setLabelState(l), []);
    return (
        <BreadcrumbContext.Provider value={{ label, setLabel }}>
            {children}
        </BreadcrumbContext.Provider>
    );
}

export function useBreadcrumb() {
    const ctx = useContext(BreadcrumbContext);
    if (!ctx) throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
    return ctx;
}

export function useSetBreadcrumb(label: string | null | undefined) {
    const { setLabel } = useBreadcrumb();
    useEffect(() => {
        setLabel(label ?? null);
        return () => setLabel(null);
    }, [label, setLabel]);
}