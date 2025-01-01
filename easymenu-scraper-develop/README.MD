# V1

Scenarios:

### Google Maps

- [ ] Has multiple options for "place an order". Example: https://maps.app.goo.gl/T6DhsTq45KF1pwLM6, https://maps.app.goo.gl/sXQi7s5yPLagLwpN6
- [ ] Has justeat for "place an order". Example: https://maps.app.goo.gl/T6DhsTq45KF1pwLM6
- [ ] Has deliveroo for "place an order". Example: https://maps.app.goo.gl/Acp4JxkY1eo8zrQk6
- [ ] Has glovo for "place an order". Example: https://maps.app.goo.gl/VUL7LCGeebXPLeVu8

- [ ] Has custom for "Menu". Example: http://www.osterialuponero.it/menu/

- [ ] Add resturant hours

### API

- GET Details from Google Maps - using google maps link and store in database `/api/scraper/googleMaps?url=https://maps.app.goo.gl/aa3PoHhZkznK3f5z8`
- GET Details from Glovo Italy - using glovo link and store in database `/api/scraper/glovo?url=https://glovoapp.com/it/en/torino/girarrosti-santa-rita-tor`
- GET Details from Just Eat - using Just Eat and store in database `/api/scraper/justeat?url=https%3A%2F%2Fwww.justeat.it%2Frestaurants-burrito-bar---bologna-bologna%2Fmenu`

Get image

- POST (generate image from chatgpt and store in R2. Retusn R2 link) `/api/generate-image?q="cofffee with milk"` (todo: update API URL)

# V2

- GET Scrape with params `/api/scraper/run?googleMapsLink=maps.google.com/whatever&externalMenuLink=justeat.it/restaurants-pizzeria-san-marco-venezia/menu` (saif)

  - googleMapsLink
  - externalMenuLink
  - strategy
  - imagesStrategy

- GET Formatted Resturant Data By resturant ID `/api/resturant?q=24` (aashir)

  - id (supabase ID)
  - Example data `scripts/mockFormattedResturantData.js`

- GET All Resturants (only return ID and name) `/api/resturant/all` (aashir)
