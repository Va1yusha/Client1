Vue.component('product-review', {
    template: `
   <form class="review-form" @submit.prevent="onSubmit">
   
 <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
     <ul>
       <li v-for="error in errors">{{ error }}</li>
     </ul>
</p>

 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>

 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>

 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>
 
 <p>
    <label>Would you recommend this product?</label>
    <label>
      <input type="radio" value="yes" v-model="recommendation"> Yes
    </label>
    <label>
      <input type="radio" value="no" v-model="recommendation"> No
    </label>
 </p>

 <p>
   <input type="submit" value="Submit"> 
 </p>
</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommendation: null,
            errors: []
        }
    },
    methods:{
        onSubmit() {
            this.errors = [];
            if(this.name && this.review && this.rating && this.recommendation) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommendation = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommendation) this.errors.push("Recommendation required.")
            }
        }
    },
});
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
     <div>
         <h2>Details:</h2>
         <ul>
             <li v-for="detail in details" :key="detail">{{ detail }}</li>
         </ul>
     </div>
     `
});
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
   <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <p>{{ sale }}</p>
            <a v-bind:href="link">More products like this</a>
            <p v-if="inStock">In Stock</p>
            <p v-else style="text-decoration: line-through">Out of Stock</p>
            <span v-if="onSale">On Sale</span>
            <product-details :details="details"></product-details>
            <p>Shipping: {{ shipping }}</p>
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)">
            </div>
            <h2>Sizes:</h2>
            <ul>
                <li v-for="size in sizes" :key="sizes">{{ size }}</li>
            </ul>
            <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">
                Add to cart
            </button>
            <button v-on:click="removeFromCart">Remove from cart</button>
        </div>
        
        <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
              <li v-for="review in reviews" :key="review.name">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
              <p>Recommended: {{ review.recommendation }}</p>
              </li>
            </ul>
        </div>
        <product-review @review-submitted="addReview"></product-review>
    </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            altText: "A pair of socks",
            inStock: true,
            onSale: false,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            selectedVariant: 0,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart(id) {
            this.$emit('remove-from-cart');
            if (this.cart > 0) {
                this.cart -= 1;
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        },
        updateRemoveFromCart() {
            if (this.cart > 0) {
                this.cart -= 1;
            }
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            return this.onSale ? `${this.brand} ${this.product} on sale!` : `${this.brand} ${this.product} on not sale.`;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },
    }
})
let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        updateRemoveFromCart(id) {
            if (this.cart.length > 0) {
                this.cart.pop(id);
            }
        },
    }
})
