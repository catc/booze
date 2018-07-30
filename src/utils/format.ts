

const PRICE_FORMAT = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2
})

const ALCOHOL_FORMAT = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1
})

export function price(priceInCents: number){
    return PRICE_FORMAT.format(priceInCents / 100)
}

export function alcohol(alcohol: number){
    return ALCOHOL_FORMAT.format(alcohol / 100)
}

export function lcboLink(productID: number){
    return `http://www.lcbo.com/lcbo/product/sku/${productID}`
}