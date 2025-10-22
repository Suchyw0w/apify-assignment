const express = require("express");
const router = express.Router();

const {
    scrapeAllProducts
} = require("../controllers/scraper");

/**
 * @swagger
 * /api/v1/scraper/products:
 *   get:
 *     summary: Scrape all products from the API
 *     description: Recursively scrapes products by splitting price ranges when results exceed the API limit
 *     tags:
 *       - Scraper
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Minimum price range (default 0)
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *           default: 100000
 *         description: Maximum price range (default 100000)
 *     responses:
 *       200:
 *         description: Successfully scraped products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 150
 *                 products:
 *                   type: array
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Minimal price can't be higher than maximum price"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.route("/products").get(scrapeAllProducts);

module.exports = router;