export const CircleArrowRight = () => {
  return (
    <svg width="50" height="50">
      <rect width="50" height="50" rx="50" ry="50" fill="rgb(218, 218, 218, 0.5)" />
      <rect width="25" height="4" rx="4" ry="4" x="22" y="-12" style={{stroke:"black",fill:"black",transform:"rotate(45deg)"}} />
      <rect width="25" height="4" rx="4" ry="4" x="-13" y="43" style={{stroke:"black",fill:"black",transform:"rotate(-45deg)"}} />
    </svg>
  )
}

export const CircleArrowLeft = () => {
  return (
    <svg width="50" height="50">
      <rect width="50" height="50" rx="50" ry="50" fill="rgb(218, 218, 218, 0.5)" />
      <rect width="25" height="4" rx="4" ry="4" x="-11" y="23" style={{stroke:"black",fill:"black",transform:"rotate(-45deg)"}} />
      <rect width="25" height="4" rx="4" ry="4" x="25" y="8" style={{stroke:"black",fill:"black",transform:"rotate(45deg)"}} />
    </svg>
  )
}




