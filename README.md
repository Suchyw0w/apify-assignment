# Product Scraper

A Node.js application that scrapes products from an e-commerce API by splitting price ranges to overcome API result limits.

## Features

- Recursive price range splitting to fetch all products
- REST API mode for on-demand scraping
- Local mode for processing data from JSON files
- Swagger API documentation
- Built with Express.js

## How It Works

The scraper handles large product datasets by:
1. Fetching products within a price range
2. If results exceed the API limit (1000 items), it splits the range in half
3. Recursively processes each half until all products are retrieved

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Suchyw0w/apify-assignment.git
cd apify-assignment
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure env variables:**

Create a `config/.env` file:
```env
APP_PORT=
API_URL=
MIN_PRICE=
MAX_PRICE=
```

## Usage

### Option 1: API Mode

REST API:
```bash
npm run api
```

The server will start on `http://localhost:APP_PORT`

**Make API requests:**
```bash
# Scrape all products (default range: $0 - $100,000)
GET http://localhost:APP_PORT/api/v1/scraper/products

# Scrape products in a specific price range
GET http://localhost:APP_PORT/api/v1/scraper/products?minPrice=0&maxPrice=5000
```

**API docs:**

Navigate to:
```
http://localhost:APP_PORT/api/v1/docs
```

### Option 2: Local Mode

Process products from a local JSON file:
```bash
npm run local
```

This will:
- Read data from `data/products.json`
- Process the products using the same logic
- Print results

## Project Structure
```
product-scraper/
├── config/
│   └── .env                    # Environment variables
│   └── swagger.js              # Swagger configuration
├── controllers/
│   └── scraper.js              # Scraping logic
├── data/
│   └── products.json           # Local data source
├── middlewares/
│   └── asyncHandler.js         # Async error handler
├── routes/
│   └── scraper.js              # API routes
├── scripts/
│   └── scrapeLocal.js          # Local script
├── app.js                      # Express app configuration
├── server.js                   # Server entry point
└── package.json
```

## Requirements

- Node.js >= 14.x
- npm or yarn

## Dependencies

- **express** - Web framework
- **dotenv** - Environment variables
- **helmet** - Security headers
- **morgan** - HTTP request logger
- **swagger-jsdoc** - Swagger docs
- **swagger-ui-express** - Swagger docs
