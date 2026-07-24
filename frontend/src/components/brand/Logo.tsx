interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M16 3L27 9.25V18.75L16 29L5 18.75V9.25L16 3Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M10.5 13.25H21.5V20H10.5V13.25Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M12.5 13.25V11.5C12.5 9.56 14.06 8 16 8C17.94 8 19.5 9.56 19.5 11.5V13.25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 16.25V18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
