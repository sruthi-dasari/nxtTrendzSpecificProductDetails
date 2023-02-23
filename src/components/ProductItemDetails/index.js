import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productData: [],
  }

  componentDidMount() {
    this.getProductItemData()
  }

  getProductItemData = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

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

  loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b68ff" height={80} width={80} />
    </div>
  )

  renderSuccessView = () => {
    const {productData} = this.state

    const {imageUrl, title, price, totalReviews, rating, description, availability, brand, similarProducts} = productData

        return(
              <div className="product-item-details-container">
        <img src="" />
        <h1></h1>
        <h1></h1>
        <div>
          <div></div>
          <p></p>
        </div>
        <p></p>
        <div></div>
        <div></div>
        <hr />
        <div></div>
        <button></button>
        <h1></h1>
        {similarProducts.map(eachItem => 
            <SimilarProducts productDetail = {eachItem} key = {eachItem.id}/>
        )}
      </div>
        )
    }
  }

  renderViewContainer = () => {
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
    return <div>{this.renderViewContainer()}</div>
  }
}

export default ProductItemDetails
