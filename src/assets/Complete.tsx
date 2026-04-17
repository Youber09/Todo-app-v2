

const Complete = ({hidden} : {hidden: boolean}) => {
  return (
    <svg
    className={`size-[3vw] absolute translate-[-50%] ${hidden ? `hidden` : ``}`}
    
    xmlns="http://www.w3.org/2000/svg"
    width="800"
    height="800"
    fill="#fff"
    viewBox="0 0 24 24"
    strokeWidth={10}
  >
    <g id="Interface / Line_Xl">
      <path
      className="rotate-45 origin-center"

        id="Vector"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        d="M12 21V3"
      ></path>
    </g>
    <g id="Interface / Line_Xl">
      <path
      className="-rotate-45 origin-center"

        id="Vector"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        d="M12 21V3"
      ></path>
    </g>
  </svg>
  )
}

export default Complete