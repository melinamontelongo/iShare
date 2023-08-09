"use client"
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { Button } from "./Button";
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
            <Button variant="ghost" className={`${resolvedTheme === "dark" && "hidden"} hover:bg-zinc-200 dark:hover:bg-zinc-800`} onClick={() => setTheme('dark')}><BsFillSunFill /></Button>
            <Button variant="ghost" className={`${resolvedTheme === "light" && "hidden"} hover:bg-zinc-200 dark:hover:bg-zinc-800`} onClick={() => setTheme('light')}><BsFillMoonFill /></Button>
        </div>
    )
}