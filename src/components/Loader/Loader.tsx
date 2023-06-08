interface LoaderProps {
  type: 'small' | 'fullscreen'
}

export const Loader = ({ type }: LoaderProps) => {
  let style: React.CSSProperties = {
    shapeRendering: 'auto',
    background: 'none',
    display: 'block'
  }

  // TODO: replace switch case with something else
  switch (type) {
    case 'small': {
      style = {
        ...style,
        width: 70,
        height: 70
      }
      break
    }

    case 'fullscreen': {
      style = {
        ...style,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 'auto'
      }
      break
    }

    default: {
      // Ensure we catch every case
      const exhaustiveCheck: never = type
      throw new Error(exhaustiveCheck)
    }
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={style}
      width="98px" height="98px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <circle cx="50" cy="50" fill="none" stroke="#e7a3ff" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" style={{ transition: 'none' }}>
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.3513513513513513s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
      </circle>
    </svg>
  )
}
