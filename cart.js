// 🛒 INITIALIZE GLOBAL CART STATE FROM LOCALSTORAGE (Persistent across pages)
let cart = JSON.parse(localStorage.getItem('greenaura_cart')) || [];

// 🔁 RUN INITIAL SETUP WHEN THE PAGE LOADS
document.addEventListener('DOMContentLoaded', () => {
    syncCartUI();
});

// ➕ FUNCTION: ADD AN ITEM TO THE BASKET
function addToCart(name, price) {
    // Check if item already exists in basket
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    // Save state, update UI, and slide open the drawer to show the item was added
    saveCart();
    syncCartUI();
    toggleCartDrawer(true);
}

// ➖ FUNCTION: REMOVE AN ITEM FROM THE BASKET
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    syncCartUI();
}

// 🔄 FUNCTION: SYNC DATA TO ALL VISUAL COUNTERS & PANELS
function syncCartUI() {
    // 1. Update all navbar indicator badge bubbles (handles header counters on all pages)
    const badges = document.querySelectorAll('.cart-btn span');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badges.forEach(badge => {
        badge.textContent = totalItems;
    });

    // 2. Render items inside the Drawer Panel
    const listPanel = document.getElementById('cartItemsList');
    if (!listPanel) return; // Guard clause if element doesn't exist on current page

    listPanel.innerHTML = ''; // Clear layout structure placeholders

    if (cart.length === 0) {
        listPanel.innerHTML = `
            <div style="text-align: center; color: #9ca3af; padding: 40px 0;">
                <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; margin-bottom: 10px; display: block;"></i>
                Your basket is empty
            </div>`;
        document.getElementById('drawerSubtotal').textContent = 'RM 0.00';
        return;
    }

    let subtotal = 0;

    // Loop through arrays and append raw structural card strings
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        listPanel.innerHTML += `
            <div style="display: flex; gap: 15px; align-items: center; padding-bottom: 15px; border-bottom: 1px solid #f3f4f6;">
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0 0 4px 0; font-size: 0.95rem; color: #111827; font-weight: 600;">${item.name}</h4>
                    <div style="font-size: 0.85rem; color: #6b7280;">RM ${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <div style="font-weight: 700; color: #00a86b; font-size: 0.95rem; white-space: nowrap;">RM ${itemTotal.toFixed(2)}</div>
                <button onclick="removeFromCart('${item.name}')" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 5px; font-size: 1rem;">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;
    });

    // Update Subtotal View Element
    document.getElementById('drawerSubtotal').textContent = `RM ${subtotal.toFixed(2)}`;
}

// 📂 FUNCTION: PERSIST DATA INTO LOCAL STORAGE
function saveCart() {
    localStorage.setItem('greenaura_cart', JSON.stringify(cart));
}

// 🎛️ FUNCTION: CONTROL DRAWER VISIBILITY ANIMATIONS
function toggleCartDrawer(isOpen) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    
    if (!drawer || !overlay) return;

    if (isOpen) {
        drawer.style.right = '0';
        overlay.style.display = 'block';
    } else {
        drawer.style.right = '-450px';
        overlay.style.display = 'none';
    }
}

// 🔒 FUNCTION: SANDBOX SECURE CHECKOUT REDIRECT ROUTER
function launchSandboxCheckout() {
    if (cart.length === 0) {
        alert("Your basket is empty! Add items from the Marketplace first.");
        return;
    }
    // Closes the cart drawer panel
    toggleCartDrawer(false);
    
    // Safely takes the window to our custom secure payment details viewport page
    window.location.href = "checkout.html";
}