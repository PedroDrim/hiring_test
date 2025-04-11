import PropTypes from "prop-types"
import { useSpring } from "@react-spring/web"
import { CardContainer, CardInner, CardFront, CardBack } from "../Utils/CardStyles"

// Card Component
const Card = ({ size, card, handleClick, flipped, matched }) => {
    const { transform } = useSpring({
      transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
      config: { tension: 500, friction: 30 },
    })
  
    return (
      <CardContainer size={size} onClick={handleClick}>
        <CardInner style={{ transform }}>
          <CardFront>
            <img src={card.image} alt="Card front" style={{ width: "140%", height: "140%" }} />
          </CardFront>
          <CardBack>
            <img src="/images/Back2.png" alt="Card back" style={{ width: "140%", height: "140%" }} />
          </CardBack>
        </CardInner>
      </CardContainer>
    )
}
  
Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,

  handleClick: PropTypes.func.isRequired,
  flipped: PropTypes.bool.isRequired,
  matched: PropTypes.bool.isRequired,
}
  
export default Card  