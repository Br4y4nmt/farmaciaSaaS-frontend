type IconProps = {
  className?: string
  size?: number
}

export default function InfoIcon({
  className = '',
  size = 16,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="10" cy="10" r="8" fill="currentColor" />

      <path
        d="M10 8.8V14"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle cx="10" cy="5.9" r="1" fill="white" />
    </svg>
  )
}