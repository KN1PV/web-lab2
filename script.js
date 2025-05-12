class ShoppingCart {
    constructor() {
        this.items = [];
        this.cartElement = document.getElementById('cartItems');
        this.cartCountElement = document.querySelector('.cart-count');
        this.cartTotalElement = document.getElementById('cartTotal');
        this.emptyCartElement = document.getElementById('emptyCart');
        
        this.cartBtn = document.querySelector('.cart-btn');
        this.closeCartBtn = document.getElementById('closeCart');
        this.cartModal = document.getElementById('cartModal');
        
        this.cartBtn.addEventListener('click', this.openCart.bind(this));
        this.closeCartBtn.addEventListener('click', this.closeCart.bind(this));
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const price = parseFloat(button.getAttribute('data-price'));
                const image = button.getAttribute('data-image'); // Додано атрибут для зображення
                
                this.addToCart(id, name, price, image); // Додано параметр image
                this.updateCart();
                
                this.showNotification(`Товар "${name}" додано в кошик!`);
            });
        });
    }
    
    addToCart(id, name, price, image) {
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id,
                name,
                price,
                image, // Додано зображення до об'єкта товару
                quantity: 1
            });
        }
    }
    
    removeFromCart(id) {
        this.items = this.items.filter(item => item.id !== id);
    }
    
    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity = quantity > 0 ? quantity : 1;
        }
    }
    
    updateCart() {
        this.updateCartCount();
        this.updateCartItems();
        this.updateCartTotal();
    }
    
    updateCartCount() {
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        this.cartCountElement.textContent = totalItems;
    }
    
    updateCartItems() {
        this.cartElement.innerHTML = '';
        
        if (this.items.length === 0) {
            this.emptyCartElement.style.display = 'block';
            return;
        }
        
        this.emptyCartElement.style.display = 'none';
        
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            itemElement.innerHTML = `
                <div class="item-details">
                    <img src="${item.image}" alt="${item.name}" class="product-image" style="width: 50px; height: 50px;">
                    <h3>${item.name}</h3>
                    <p>Ціна: ${item.price} грн</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">Видалити</button>
            `;
            
            this.cartElement.appendChild(itemElement);
        });
        
        this.addCartEventListeners();
    }
    
    addCartEventListeners() {
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = this.items.find(item => item.id === id);
                if (item) {
                    item.quantity = Math.max(1, item.quantity - 1);
                }
                this.updateCart();
            });
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = this.items.find(item => item.id === id);
                if (item) {
                    item.quantity += 1;
                }
                this.updateCart();
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', () => {
                const id = input.getAttribute('data-id');
                const quantity = parseInt(input.value) || 1;
                this.updateQuantity(id, quantity);
                this.updateCart();
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                this.removeFromCart(id);
                this.updateCart();
            });
        });
    }
    
    updateCartTotal() {
        const total = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        this.cartTotalElement.textContent = `Загалом: ${total.toFixed(2)} грн`;
    }
    
    openCart() {
        this.cartModal.style.display = 'flex';
    }
    
    closeCart() {
        this.cartModal.style.display = 'none';
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}
        
// Ініціалізація кошика
const cart = new ShoppingCart();