const asyncHandler = require("../middlewares/asyncHandler");

// Fetches products from the API for a specific price range
const fetchProducts = asyncHandler(async (minPrice, maxPrice) => {
  const url = `${process.env.API_URL}?minPrice=${minPrice}&maxPrice=${maxPrice}`;
  // Call API
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Api request failed ${response.statusText}`);
  }

  const data = await response.json();

  if (!data) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return data;
});

// Recursively fetches all products by splitting price ranges
const scrapeProducts = async (minPrice, maxPrice, products = []) => {
  console.log(`Range: $${minPrice} - $${maxPrice}`);

  // Call api to fetch products
  const data = await fetchProducts(minPrice, maxPrice);

  // If total is within the limit
  if (data.total <= parseInt(process.env.MAX_RESULTS)) {
    products.push(...data.products);
    return products;
  }

  // If total exceeds limit -> split the range
  if (data.total > parseInt(process.env.MAX_RESULTS)) {
    console.log(
      `Range has ${data.total} products - limit: ${parseInt(process.env.MAX_RESULTS)} -> Splitting`
    );

    // Split the range in half
    const midPrice = Math.floor((minPrice + maxPrice) / 2);

    // Handle when we can't split further (splitted range would be the same as min/max price)
    if (midPrice === minPrice || midPrice === maxPrice) {
      console.log(`Cannot split!`);
      products.push(...data.products);
      return products;
    }

    // Fetch both splitted halves
    await scrapeProducts(minPrice, midPrice, products); // From min eg (0) - splitted price eg (50000)
    await scrapeProducts(midPrice + 1, maxPrice, products); // From splitted price eg (50000) + 1 (overlapping with first half) - max eg (100000)

    // Return results
    return products;
  }

  return products;
};

// Main function
exports.scrapeAllProducts = asyncHandler(async (req, res, next) => {
  console.log("Scrape started\n");

  const minPrice = parseInt(req.query.minPrice) || parseInt(process.env.MIN_PRICE);
  const maxPrice = parseInt(req.query.maxPrice) || parseInt(process.env.MAX_PRICE);

  if (minPrice < 0 || maxPrice < 0) {
    return res.status(400).json({
      success: false,
      message: "Prices must be positive",
    });
  }

  if (minPrice > maxPrice) {
    return res.status(400).json({
      success: false,
      message: "Minimal price can't be higher than maximum price",
    });
  }

  const products = await scrapeProducts(minPrice, maxPrice);

  console.log(`Scrape done - Total products: ${products.length}\n`);

  res
    .status(200)
    .json({ success: true, count: products.length, products: products });
});
