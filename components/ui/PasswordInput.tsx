"use client";

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  darkTheme?: boolean; // Permet de s'adapter au fond sombre (Login) ou clair (Config)
}

export default function PasswordInput({ 
  label, 
  value, 
  onChange, 
  placeholder = "••••••••", 
  required = false,
  darkTheme = true 
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const labelClass = darkTheme ? "text-k-stone/70" : "text-k-ink/70";
  const inputBg = darkTheme 
    ? "bg-white/5 border-white/10 text-white focus:border-k-gold/50 focus:bg-white/10 placeholder:text-white/20" 
    : "bg-white border-gray-200 text-k-ink focus:border-k-indigo focus:bg-gray-50";
  const iconColor = darkTheme ? "text-k-stone/50 hover:text-k-gold" : "text-gray-400 hover:text-k-indigo";

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-[0.65rem] font-bold tracking-widest uppercase ml-1 ${labelClass}`}>
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`w-full border rounded-xl py-3.5 pl-4 pr-11 text-sm transition-all duration-300 outline-none tracking-widest ${inputBg}`}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 transition-colors ${iconColor}`}
          title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
