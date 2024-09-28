/* eslint-disable react/prop-types */
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

/**
 *
 * @component
 * @param {Object} props
 * @param {Object} props.product
 * @param {string} props.product.name
 * @param {string} props.product.slug
 * @param {string} props.product.image
 * @param {string[]} props.product.images
 * @param {string} props.product.brand
 * @param {string} props.product.category
 * @param {string} props.product.description
 * @param {number} props.product.price
 * @param {number} props.product.countInStock
 * @param {number} props.product.rating
 * @param {number} props.product.numReviews
 */
function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const {
    cart: { cartItems },
  } = state;
  return (
    <Card>
      <Link to={`/product/${product.id}`}>
        <img src={product.img} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        {/* <Rating rating={product.rating} numReviews={product.numReviews} /> */}
        {/* <Card.Text>${product.price}</Card.Text> */}
        {/* {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )} */}
      </Card.Body>
    </Card>
  );
}
export default Product;
