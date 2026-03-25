'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Search, Settings, Grid, Key, FileText } from 'lucide-react';
import { useResponsive, useTouchDevice } from '@/hooks/useResponsive';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { isMobile } = useResponsive();
  const isTouch = useTouchDevice();
  const navRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const navItems = [
    { href: '/collections', label: 'Collections', icon: Grid },
    { href: '/api-access', label: 'API', icon: Key },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '#features', label: 'Features', icon: Zap },
    { href: '/docs', label: 'Docs', icon: FileText },
  ];

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Navigation Panel */}
          <motion.div
            ref={navRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-xl border-l border-white/10 z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold text-lg">Menu</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="p-3 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors">
                        <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">
                          Navigate to {item.label.toLowerCase()}
                        </div>
                      </div>
                      <Search className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>WebScrapeX v1.0</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Mobile-optimized button component
export function MobileButton({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) {
  const isTouch = useTouchDevice();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${isTouch ? 'active:scale-95' : 'hover:scale-105'}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// Mobile-optimized input component
export function MobileInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  style,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={cn(
        "w-full h-12 px-4 rounded-xl",
        "bg-transparent",
        "text-foreground placeholder:text-muted-foreground/40",
        "focus:outline-none",
        "text-base font-medium",
        className
      )}
      style={{ fontSize: '16px', ...style }}
    />
  );
}