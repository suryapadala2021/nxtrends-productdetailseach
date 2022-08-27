// Write your code here
import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header/index'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class ProductItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.inProgress, productDetails: {}}

  componentDidMount() {
    this.getProduct()
  }

  getProduct = async () => {
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const {match} = this.props
    const {params} = match
    const {id} = params
    const api = `https://apis.ccbp.in/products/${id[1]}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(api, options)

    if (response.ok) {
      const data = await response.json()
      console.log(data)
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
    const {productDetails} = this.state
    const {
      id,
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
        <img className="product-img" src={imageUrl} alt="product" />
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
      </div>
    )
  }

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
