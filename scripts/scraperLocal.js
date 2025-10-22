const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({
  path: path.join(__dirname, "../config/.env"),
});

// Data source - simulates API response
const data = require("../data/products.json");

// Fetches products from local JSON for a specific price range
async function fetchProductsLocal(minPrice, maxPrice) {
  // Filter products within price range
  const filteredProducts = data.products.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );
  // Simulate API structure
  return {
    total: filteredProducts.length,
    count: filteredProducts.length,
    products: filteredProducts,
  };
}

// Recursively fetches all products by splitting price ranges
async function scrapeProductsLocal(minPrice, maxPrice, products = []) {
  console.log(`Range: $${minPrice} - $${maxPrice}`);

  const data = await fetchProductsLocal(minPrice, maxPrice);

  // If total is within the limit
  if (data.total <= parseInt(process.env.MAX_RESULTS)) {
    products.push(...data.products);
    return products;
  }

  // If total exceeds limit -> split the range
  if (data.total > parseInt(process.env.MAX_RESULTS)) {
    console.log(
      `Range has ${data.total} products - limit: ${parseInt(
        process.env.MAX_RESULTS
      )} -> Splitting`
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
    await scrapeProductsLocal(minPrice, midPrice, products); // From min eg (0) - splitted price eg (50000)
    await scrapeProductsLocal(midPrice + 1, maxPrice, products); // From splitted price eg (50000) + 1 (overlapping with first half) - max eg (100000)

    return products;
  }

  return products;
}

async function main() {
  try {
    console.log("Local scrape started\n");

    // Get minPrice & maxPrice from .env file or use default values if not set
    const minPrice = parseInt(process.env.MIN_PRICE) || 0;
    const maxPrice = parseInt(process.env.MAX_PRICE) || 100000;

    // 'Call API
    const products = await scrapeProductsLocal(minPrice, maxPrice);

    console.log(`Scrape done - Total products: ${products.length}\n`);

    if (products.length === 0) {
      console.log("No products found in the specified price range");
      process.exit(0);
    }

    // Print results
    console.log(`Products: ${JSON.stringify(products, null, 1)}`);
    process.exit(0);
  } catch (error) {
    console.error("Error during scraping:", error.message);
    process.exit(1);
  }
}

// After loading -> call main function
main();
