# Booze
Why recreate the LCBO website?
1. it lacks an extremely useful feature; actually displaying store inventories on a map (instead it just provides a list of stores)
2. add the option to save to favourites/wishlist (without having to make an account)
	- allow for grouping of products by common store locations
3. play around with typescript

### Development

#### Running locally:
1. `nvm use 8.9.4`
2. `npm run dev` and navigate to `localhost:5000`
	- may need to change lcbo api key (`api/lcbo.ts`)

#### Build
1. `npm run build`

#### Tests
1. `npm run test`
