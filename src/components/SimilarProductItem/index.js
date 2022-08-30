import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {
    imageUrl,
    title,
    price,
    description,
    availability,
    brand,
    totalReviews,
    similarProducts,
    rating,
  } = details
  return (
    <li className="similar-item">
      <img
        className="similar-pro-img"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <h1 className="sim-pro-title">{title}</h1>
      <p className="brand">{brand}</p>
      <div className="rating-price-container">
        <p className="sim-pro-price">Rs {price}/-</p>
        <div className="rating-box-similar">
          <p>{rating}</p>
          <img
            className="star-img"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
