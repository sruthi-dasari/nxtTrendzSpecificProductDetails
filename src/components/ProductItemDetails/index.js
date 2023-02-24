import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productData: [],
    count: 1,
  }

  componentDidMount() {
    console.log('In componentDidMount()')
    this.getProductItemData()
  }

  getProductItemData = async () => {
    console.log('In getProductItemData()')
    this.setState({apiStatus: apiStatusConstants.loading})

    console.log('apiStatus should change to loading')
    const {apiStatus} = this.state
    console.log(apiStatus)

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const {match} = this.props
    const {params} = match
    const {id} = params
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    const data = await response.json()

    if (response.ok === false) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    } else {
      const formattedData = eachItem => ({
        availability: eachItem.availability,
        brand: eachItem.brand,
        description: eachItem.description,
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        price: eachItem.price,
        rating: eachItem.rating,
        style: eachItem.style,
        title: eachItem.title,
        totalReviews: eachItem.total_reviews,
      })

      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(eachItem =>
          formattedData(eachItem),
        ),
      }

      this.setState({
        productData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b68ff" height={80} width={80} />
    </div>
  )

  renderSuccessView = () => {
    const {productData, count} = this.state

    const {
      imageUrl,
      title,
      price,
      totalReviews,
      rating,
      description,
      availability,
      brand,
      similarProducts,
    } = productData

    const onClickPlus = () => {
      this.setState(prevState => ({
        count: prevState.count + 1,
      }))
    }

    const onClickMinus = () => {
      if (count > 0) {
        this.setState(prevState => ({
          count: prevState.count - 1,
        }))
      }
    }

    return (
      <div className="product-item-details-container">
        <img src={imageUrl} alt="product" className="product-img" />
        <div className="product-details-container">
          <h1 className="product-name">{title}</h1>
          <p className="product-price">Rs {price}/-</p>
          <div className="rating-reviews-container">
            <div className="rating-container">
              <p className="rating-text">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt=""
                className="product-star-img"
              />
            </div>
            <p className="reviews-text">{totalReviews} Reviews</p>
          </div>
          <p className="product-description">{description}</p>
          <div className="available-brand-container">
            <p className="available-and-brand-heading">Available:</p>
            <p className="available-and-brand-text">{availability}</p>
          </div>
          <div className="available-brand-container">
            <p className="available-and-brand-heading">Brand: </p>
            <p className="available-and-brand-text">{brand}</p>
          </div>
          <hr className="seperator" />
          <div className="count-container">
            <button
              data-testid="minus"
              type="button"
              className="plus-minus-btn"
            >
              <BsDashSquare className="plus-minus-img" onClick={onClickMinus} />
            </button>
            <p className="count-text">{count}</p>
            <button data-testid="plus" type="button" className="plus-minus-btn">
              <BsPlusSquare className="plus-minus-img" onClick={onClickPlus} />
            </button>
          </div>
          <button type="button" className="add-to-cart-btn">
            ADD TO CART
          </button>

          <h1>Similar Products</h1>
          {similarProducts.map(eachItem => (
            <SimilarProductItem productDetail={eachItem} key={eachItem.id} />
          ))}
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    // const onClickContinueShopping = () => {}

    <div className="product-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products">
        <button
          className="continue-shopping-btn"
          type="button"
          // onClick={onClickContinueShopping}
        >
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderViewContainer = () => {
    console.log('In renderViewContainer()')
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.loading:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
    console.log('In render()')
    const {apiStatus} = this.state
    console.log(apiStatus)
    return (
      <div>
        <Header />
        {this.renderViewContainer()}
      </div>
    )
  }
}

export default ProductItemDetails
