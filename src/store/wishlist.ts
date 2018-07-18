import { observable, action, computed } from 'mobx';

class Wishlist {
    @action toggleItem = (id: string) => {
        console.log('would toggle item on wishlist', id)
    }
}

const wishlist = new Wishlist()

export default wishlist
