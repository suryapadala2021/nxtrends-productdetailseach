// Write your code here
import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header/index'
import SimilarProductItem from '../SimilarProductItem/index'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.inProgress,
    productDetails: {},
    productCount: 1,
  }

  componentDidMount() {
    this.getProduct()
  }

  incCount = () => {
    this.setState(prev => ({productCount: prev.productCount + 1}))
  }

  decCount = () => {
    const {productCount} = this.state
    if (productCount > 1) {
      this.setState(prev => ({productCount: prev.productCount - 1}))
    }
  }

  restartShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  getProduct = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params
    const i = id.split(':')
    const api = `https://apis.ccbp.in/products/${i[1]}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(api, options)

    if (response.ok) {
      const data = await response.json()

      const update = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        availability: data.availability,
        brand: data.brand,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(each => ({
          id: each.id,
          imageUrl: each.image_url,
          title: each.title,
          price: each.price,
          description: each.description,
          availability: each.availability,
          brand: each.brand,
          totalReviews: each.total_reviews,
          similarProducts: each.similar_products,
          rating: each.rating,
        })),
        rating: data.rating,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        productDetails: update,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  loadingView = () => (
    <div className="product-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  successView = () => {
    const {productDetails, productCount} = this.state
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
    } = productDetails
    return (
      <div className="product-details-container">
        <div className="product-details-lg">
          <img className="product-img" src={imageUrl} alt="product" />
          <div>
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-review-box">
              <div className="rating-box">
                <p>{rating}</p>
                <img
                  className="star-img"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p className="review-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="availability">
              Available:{' '}
              <span className="product-description">{availability}</span>
            </p>
            <p className="availability">
              Brand: <span className="product-description">{brand}</span>
            </p>
            <hr />
            <div className="product-count-container">
              <button
                testid="minus"
                onClick={this.decCount}
                className="count-btn"
                type="button"
              >
                <BsDashSquare />
              </button>
              <p className="product-count">{productCount}</p>
              <button
                testid="plus"
                onClick={this.incCount}
                className="count-btn"
                type="button"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="cart-btn" type="button">
              ADD TO CART{' '}
            </button>
          </div>
        </div>
        <div className="similar-product-lg">
          <h1 className="similar-product-heading">Similar Products</h1>
          <ul className="similar-products-container">
            {similarProducts.map(each => (
              <SimilarProductItem key={each.id} details={each} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  failureView = () => (
    <div className="failure-view">
      <img
        className="fail-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button
        onClick={this.restartShopping}
        className="continue-shopping-btn"
        type="button"
      >
        Continue Shopping
      </button>
    </div>
  )

  getProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.loadingView()

      case apiStatusConstants.success:
        return this.successView()
      default:
        return this.failureView()
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.getProductDetails()}
      </div>
    )
  }
}
export default ProductItemDetails
