"use client"
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
export default function ThemeChanger() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) {
        return null
    }
    return (
        <div>
            <button className={`${resolvedTheme === "dark" && "hidden"}`} onClick={() => setTheme('dark')}><BsFillSunFill /></button>
            <button className={`${resolvedTheme === "light" && "hidden"}`} onClick={() => setTheme('light')}><BsFillMoonFill /></button>
        </div>
    )
}