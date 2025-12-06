"use client";

import { useState, useEffect } from "react";

export function useXP() {
    const [xp, setXp] = useState(0);

    useEffect(() => {
        // Load initial XP
        const stored = localStorage.getItem("zest_xp");
        if (stored) {
            setXp(parseInt(stored));
        } else {
            setXp(2400); // Default starting XP
            localStorage.setItem("zest_xp", "2400");
        }

        // Listen for storage changes (to sync across tabs/components if needed)
        const handleStorageChange = () => {
            const current = localStorage.getItem("zest_xp");
            if (current) setXp(parseInt(current));
        };

        window.addEventListener("storage", handleStorageChange);
        // Custom event for same-tab updates
        window.addEventListener("zest_xp_update", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("zest_xp_update", handleStorageChange);
        };
    }, []);

    const addXP = (amount: number) => {
        const newXP = xp + amount;
        setXp(newXP);
        localStorage.setItem("zest_xp", newXP.toString());
        window.dispatchEvent(new Event("zest_xp_update"));
    };

    const spendXP = (amount: number) => {
        if (xp >= amount) {
            const newXP = xp - amount;
            setXp(newXP);
            localStorage.setItem("zest_xp", newXP.toString());
            window.dispatchEvent(new Event("zest_xp_update"));
            return true;
        }
        return false;
    };

    return { xp, addXP, spendXP };
}
