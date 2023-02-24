import './index.css'

const SimilarProductItem = props => {
  const {productDetail} = props
  const {imageUrl, title, brand, price, rating} = productDetail

  return (
    <div className="similar-product-item-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-img"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-product-star-img"
          />
        </div>
      </div>
    </div>
  )
}

export default SimilarProductItem
