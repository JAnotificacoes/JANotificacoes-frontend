"use client";

import { useSettings } from "@/hooks/useSettings";
import { Header } from "@/components/layout/Header";
import styles from "./settings.module.css";

export default function SettingsPage() {
    const { settings, loading, error, updateSetting } = useSettings();
    return (
        <div>
            
        </div>
    );
}