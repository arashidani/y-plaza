'use client';

interface LayoutClientProps {
  children: React.ReactNode;
  locale?: string;
}

export function LayoutClient({ children,locale }: LayoutClientProps) {

  return (
    <>
      {children}
    </>
  );
}