export const VerifiedBadge = () => {
  return (
    <>
 <svg
    className="w-5 h-5 inline-block ml-2"
    viewBox="0 0 24 24"
    aria-label="Verified"
  >
    <defs>
      <mask id="tick-cutout">
        {/* Visible area */}
        <rect width="24" height="24" fill="white" />

        {/* Cut-out check */}
        <path
          d="M10.4 15.6
             7.7 12.9
             9.1 11.5
             10.4 12.8
             14.9 8.3
             16.3 9.7z"
          fill="black"
        />
      </mask>
    </defs>

    {/* Blue star badge with transparent tick */}
    <path
      mask="url(#tick-cutout)"
      fill="#0095F6"
      d="M22.5 12
         l-2.2-2.5.3-3.3
         -3.2-.7-1.7-2.8
         L12 3.9 8.3 2.7
         6.6 5.5l-3.2.7
         .3 3.3L1.5 12
         l2.2 2.5-.3 3.3
         3.2.7 1.7 2.8
         3.8-1.2 3.8 1.2
         1.7-2.8 3.2-.7
         -.3-3.3L22.5 12z"
    />
  </svg>
    </>
  )
};