import { observable, action, computed } from 'mobx';

const RECENTLY_VIEWED_KEY = 'recent_view_v1'
const HISTORY_LENGTH = 5

interface TruncatedProduct {
    id: number;
    name: string;
    image_thumb_url: string;
    price_in_cents: number;
    package: string;
}

class RecentlyViewed {
    @observable products: TruncatedProduct[];

    constructor() {
        const products = localStorage.getItem(RECENTLY_VIEWED_KEY)
        if (products) {
            try {
                const p = JSON.parse(products)
                this.products = p
            } catch (err) {
                console.error('Error loading recently viewed store', err)
                this.products = []
            }
        } else {
            this.products = []
        }
    }

    add(product: TruncatedProduct) {
        let products = this.products.slice()

        const exists = products.find(p => p.id === product.id)
        if (exists){
            // remove product from history and move to front
            const index = products.indexOf(exists)
            products.splice(index, 1)
        }
        // add product to front of history
        products.unshift(product)
        products = products.slice(0, HISTORY_LENGTH)
        this.products = products

        this._save(products)
    }

    clear = () => {
        this.products = [];
        this._save([])
    }
    
    _save(products: TruncatedProduct[]){
        localStorage.setItem(
            RECENTLY_VIEWED_KEY,
            JSON.stringify(products)
        )
    }
}

export default new RecentlyViewed()
