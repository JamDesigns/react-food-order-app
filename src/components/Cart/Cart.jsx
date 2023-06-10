import { useContext, useState, Fragment } from "react";

import Modal from "../UI/Modal";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
import useHttp from "../../hooks/use-https";
import CircleLoader from "react-spinners/CircleLoader";

import classes from "./Cart.module.css";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#53f553",
};

const Cart = (props) => {
  const [isDidSubmit, setIsDidSubmit] = useState(false);
  const { isLoading, error, sendRequest: sentCartRequest } = useHttp();

  const [isCheckout, setIsCheckout] = useState(false);

  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const clearCartHandler = () => {
    cartCtx.clearCart();
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = (userData) => {
    sentCartRequest({
      url: "https://react-http-26100-default-rtdb.europe-west1.firebasedatabase.app/orders.json",
      method: "POST",
      body: {
        user: userData,
        orderedItems: cartCtx.items,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    cartCtx.clearCart();
    setIsCheckout(false);
    setIsDidSubmit(true);
  };

  const modalActions = (
    <div className={classes.actions}>
      {hasItems && (
        <button className={classes["button--alt"]} onClick={clearCartHandler}>
          Clear Cart
        </button>
      )}
      <button
        className={`${
          isDidSubmit || !hasItems ? classes.button : classes["button--alt"]
        }`}
        onClick={props.onHideCart}
      >
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          id={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const onCancelCheckoutHandler = () => {
    setIsCheckout(false);
  };

  let content = (
    <Fragment>
      {hasItems ? (
        cartItems
      ) : (
        <div className={classes["cart-empty"]}>Your cart is empty</div>
      )}
      <div
        className={`${classes.total} ${!hasItems ? classes["cart-empty"] : ""}`}
      >
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout
          onCancel={onCancelCheckoutHandler}
          onConfirm={submitOrderHandler}
        />
      )}
      {!isCheckout && modalActions}
    </Fragment>
  );

  if (isLoading) {
    content = (
      <CircleLoader
        color={"#53f553"}
        loading={isLoading}
        cssOverride={override}
        aria-label="Loading meals..."
        data-testid="loader"
      />
    );
  }

  if (error) {
    content = (
      <Fragment>
        <p className={classes.invalid}>{error}</p>
      </Fragment>
    );
  }

  if (isDidSubmit) {
    content = (
      <Fragment>
        <p className={classes["cart-empty"]}>Successfully sent the order!</p>
        {modalActions}
      </Fragment>
    );
  }

  return (
    <Modal onClick={props.onHideCart}>
      <div className={classes.title}>{props.title}</div>
      {content}
    </Modal>
  );
};

export default Cart;
