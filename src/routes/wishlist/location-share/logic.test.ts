import {
    groups,
    containsAllProducts,
    listGroups,
    generateGroups,
    mapStoresToProducts
} from './logic'
import { Store, Product } from 'api/lcbo'
import ProductGroupList from './groups';

type products = { [productID: number]: Store[] };

describe('can generate product groups based on common stores', () => {
    test('there are common stores', () => {
        const products: products = {
            1: [newStore(100), newStore(110), newStore(120)],
            2: [newStore(130), newStore(110), newStore(140)],
            3: [newStore(130), newStore(110), newStore(150)],
            4: [newStore(130), newStore(110), newStore(100), newStore(120)],
            5: []
        }
        const groups = generateGroups(products)
    
        // group can multiple similar stores
        const actual1 = groups['1,4']
        expect(actual1).toEqual(expect.arrayContaining(['100', '120']))
    
        // group containing all products except for the one with no stores
        const actual2 = groups['1,2,3,4']
        expect(actual2).toContain('110')
    })

    test('there are no common stores', () => {
        const products: products = {
            1: [newStore(100)],
            2: [newStore(200)],
            3: [newStore(300)],
        }
        const groups = generateGroups(products)

        // there are no stores in common between the products, should return
        // an empty object
        expect(groups).toMatchObject({})
    })
})

describe('can determine if there are any stores that contain all products', () => {
    const g: groups = {
        '1,2,3': [],
        '1,2': [],
    }
    test('returns the product ids if there is a common store containing ALL products', () => {
        expect(containsAllProducts(g, 3)).toEqual('1,2,3')
    })

    test('returns undefined if there isn\'t a common store for all products', () => {
        expect(containsAllProducts(g, 4)).toEqual(undefined)
    })
})

describe('can create a list of the groups by product group string to product name', () => {
    const g: groups = {
        '1,2,3': [],
        '1,2': [],
    }
    const productsMap = {
        1: newProduct(1, 'AAA'),
        2: newProduct(2, 'BBB'),
        3: newProduct(3, 'CCC'),
    }
    const list = listGroups(g, productsMap)
    
    test('list item with all products contains all product names', () => {
        expect(list['1,2,3']).toEqual(expect.arrayContaining(['AAA', 'BBB', 'CCC']))
    })

    test('list item with only some of the items only contains their respective names', () => {
        expect(list['1,2']).toEqual(expect.arrayContaining(['AAA', 'BBB']))
        expect(list['1,2']).not.toContain('CCC')
    })
})

describe('can generate a list of common stores for a group of products (with quantities)', () => {
    const g: groups = {
        '1,2,3,4': ['110', '200'],
        '1,2': [],
    }
    const groupKey = '1,2,3,4'
    const productsToStore = {
        1: [newStore(100), newStore(110, 5), newStore(120), newStore(200, 9)],
        2: [newStore(130), newStore(110, 10), newStore(140),newStore(200, 19)],
        3: [newStore(130), newStore(110, 30), newStore(150), newStore(200, 89)],
        4: [newStore(130), newStore(110, 52), newStore(100), newStore(200, 99), newStore(120)],
    }
    const productsMap = {
        1: newProduct(1, 'AAA'),
        2: newProduct(2, 'BBB'),
        3: newProduct(3, 'CCC'),
        4: newProduct(3, 'DDD'),
    }

    const stores = mapStoresToProducts(g, groupKey, productsToStore, productsMap)

    test('correctly generates a list of stores for a group of products', () => {
        const group = g[groupKey]
        expect(stores.length).toEqual(group.length)

        for (let storeID of group){
            const store = stores.find(s => s.id.toString() === storeID)
            expect(store).toBeDefined()
        }
    })

    test('quantities are correct for each product in its respective store', () => {
        for (let store of stores){
            for (let item of store.quantities){
                const name = item[0]
                const quantity = item[1]
                
                // get product id (using name)
                const productID = Object.keys(productsMap).find(productID => productsMap[productID].name === name)
                const actualStore = productsToStore[productID].find(s => s.id === store.id)
                expect(quantity).toEqual(actualStore.quantity)
            }
        }
    })
})


/*
    helpers
*/
function newStore(id: number, quantity?: number): Store {
    return {
        id: id,
        name: '',
        latitude: 0,
        longitude: 0,
        city: '',
        quantity: quantity || 0,
        address_line_1: '',
        address_line_2: '',
        telephone: '',
    }
}

function newProduct(id: number, name: string): Product {
    return {
        id: id,
        name: name,
        origin: '',
        description: '',
        producer_name: '',
        package: '',
        alcohol_content: 0,
        is_dead: true,
        is_discontinued: true,
        price_in_cents: 0,
        regular_price_in_cents: 0,
        style: '',
        image_url: '',
        image_thumb_url: '',
        tasting_note: '',
        serving_suggestion: '',
        varietal: '',
    }
}