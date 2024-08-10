import { useEffect, useState } from "react";
import "./styles.css";

export default function LoadMoreData() {
  // States to manage loading, fetched products, count for pagination, and button disable state
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [disableButton, setDisableButton] = useState(false);

  // Function to fetch products from the API
  async function fetchProducts() {
    try {
      setLoading(true); // Set loading to true before the fetch starts
      const response = await fetch(
        `https://dummyjson.com/products?limit=20&skip=${
          count === 0 ? 0 : count * 20
        }`
      );

      const result = await response.json();

      // If products are fetched successfully, append them to the existing products
      if (result && result.products && result.products.length) {
        setProducts((prevData) => [...prevData, ...result.products]);
        setLoading(false); // Set loading to false after products are fetched
      }

      console.log(result);
    } catch (e) {
      console.log(e);
      setLoading(false); // Set loading to false in case of an error
    }
  }

  // useEffect to fetch products whenever the count changes
  useEffect(() => {
    fetchProducts();
  }, [count]); // Fetches new products when 'count' changes (pagination)

  // useEffect to disable the button if 100 products have been loaded
  useEffect(() => {
    if (products && products.length === 100) setDisableButton(true);
  }, [products]); // Checks product count and disables the button when 100 products are reached

  // Show loading message when data is being fetched
  if (loading) {
    return <div>Loading data ! Please wait.</div>;
  }

  return (
    <div className="load-more-container">
      <div className="product-container">
        {/* Maps over products to display each product */}
        {products && products.length
          ? products.map((item) => (
              <div className="product" key={item.id}>
                <img src={item.thumbnail} alt={item.title} />
                <p>{item.title}</p>
              </div>
            ))
          : null}
      </div>
      <div className="button-container">
        {/* Button to load more products, which is disabled after 100 products */}
        <button disabled={disableButton} onClick={() => setCount(count + 1)}>
          Load More Products
        </button>
        {/* Display a message when the button is disabled */}
        {disableButton ? <p>You have reached 100 products</p> : null}
      </div>
    </div>
  );
}
