

const PRICE_FORMAT = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2
})

export function price(priceInCents: number){
    return PRICE_FORMAT.format(priceInCents / 100)
}