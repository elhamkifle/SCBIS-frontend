'use client';

import * as React from 'react';
import { useState, useRef } from 'react';

interface PopoverProps {
  children: React.ReactNode;
}

export function Popover({ children }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="relative">
      {React.Children.map(children, (child) =>
        React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen })
      )}
    </div>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export function PopoverTrigger({ children, asChild, isOpen, setIsOpen }: PopoverTriggerProps) {
  const trigger = asChild ? children : <button>{children}</button>;

  return React.cloneElement(trigger as React.ReactElement<any>, {
    onClick: () => setIsOpen && setIsOpen(!isOpen),
  });
}

interface PopoverContentProps {
  children: React.ReactNode;
  isOpen?: boolean;
  className?: string;
  align?: string; // Added className prop
}

export function PopoverContent({ children, isOpen, className, align }: PopoverContentProps) {
    const alignmentClass = align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'mx-auto';
  return isOpen ? (
    <div className={`absolute bg-white shadow-md ${className}`}>{children}</div>
  ) : null;
}