import { observable, action, computed, set } from 'mobx';
import { Product } from 'api/lcbo';
import { TruncatedProduct } from 'api/lcbo'


const WISHLIST_KEY = 'wishlist_v1'

interface WishlistProduct extends TruncatedProduct {
    isNew?: boolean;
}

/* 
    TODO
    possibly when saving, pull rehydrate localstorage data before saving
    in order to maintain state between tabs (otherwise will lose saved)
    if saving on multiple tabs
*/

export class Wishlist {
    @observable saved: Map<number, TruncatedProduct | WishlistProduct>;

    constructor() {
        const data = localStorage.getItem(WISHLIST_KEY)
        if (data) {
            try {
                const d = JSON.parse(data)
                this.saved = new Map(d)
            } catch (err) {
                console.error('Error loading wishlist store', err)
                this.saved = new Map()
            }
        } else {
            this.saved = new Map()
        }
    }

    toggle = (product: Product) => {
        const id = product.id
        if (this.saved.has(id)) {
            this.saved.delete(id)
        } else {
            this.saved.set(id, Wishlist.truncateProduct(product))
        }
        // this._save()
    }

    static truncateProduct(p: Product): WishlistProduct {
        return {
            id: p.id,
            name: p.name,
            image_thumb_url: p.image_thumb_url,
            price_in_cents: p.price_in_cents,
            package: p.package,
            isNew: true
        }
    }

    clear = () => {
        this.saved.clear()
        this._save()
    }

    exists = (productID: number): boolean => {
        this.saved.has(productID)
    }

    _save() {
        const data = this.saved
        const d: [number, TruncatedProduct][] = []
        data.forEach((val, key) => {
            delete val.isNew;
            d.push([key, val])
        })
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(d))
    }
}

const wishlist = new Wishlist()

export default wishlist
