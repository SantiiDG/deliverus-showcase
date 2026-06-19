// --- Application State Manager ---
const AppState = {
    currentRole: 'owner', // 'owner', 'customer'
    currentView: 'dashboard',
    
    // Mock Database
    restaurants: [
        { id: 1, name: 'Bella Italia', shippingCosts: 2.0, status: 'accepting', category: 'Italian' },
        { id: 2, name: 'Burger Heaven', shippingCosts: 3.5, status: 'accepting', category: 'Fast Food' }
    ],
    
    products: [
        { id: 1, name: 'Margherita Pizza', price: 8.5, availability: true, restaurantId: 1 },
        { id: 2, name: 'Lasagna Classica', price: 11.0, availability: true, restaurantId: 1 },
        { id: 3, name: 'Tiramisu Dessert', price: 4.5, availability: true, restaurantId: 1 },
        { id: 4, name: 'Double Cheese Burger', price: 9.0, availability: true, restaurantId: 2 },
        { id: 5, name: 'Crispy French Fries', price: 3.5, availability: true, restaurantId: 2 }
    ],
    
    orders: [
        { id: 1, restaurantName: 'Bella Italia', totalPrice: 19.5, shippingCosts: 0.0, status: 'delivered', address: 'Calle Reina Mercedes 12', itemsCount: 2, itemsText: '1x Margherita Pizza, 1x Lasagna Classica' }
    ],
    
    // Owner Analytics
    analytics: {
        yesterdayOrders: 4,
        pendingOrders: 0,
        todaysServedOrders: 1,
        invoicedToday: 19.50
    },
    
    // Customer Cart
    cart: []
};

// --- DOM References & Initializations ---
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initRoleSelector();
    initArchitectureTabs();
    
    // Initial Render
    renderCurrentView();
});

// --- View Router / Controller ---
function renderCurrentView() {
    const container = document.getElementById('app-view-container');
    if (!container) return;
    
    // Clear content
    container.innerHTML = '';
    
    switch(AppState.currentView) {
        case 'dashboard':
            renderDashboardView(container);
            break;
        case 'menu':
            renderMenuView(container);
            break;
        case 'orders':
            renderOrdersView(container);
            break;
        case 'order-food':
            renderOrderFoodView(container);
            break;
        default:
            renderDashboardView(container);
    }
}

// --- Navigation Controller ---
function initNavigation() {
    updateSidebar();
}

function updateSidebar() {
    const sidebar = document.getElementById('sidebar-menu-container');
    if (!sidebar) return;
    
    sidebar.innerHTML = '';
    
    let menuHTML = '';
    if (AppState.currentRole === 'owner') {
        menuHTML = `
            <button class="menu-item ${AppState.currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
                <i class="fa-solid fa-chart-simple"></i> Analytics Dashboard
            </button>
            <button class="menu-item ${AppState.currentView === 'menu' ? 'active' : ''}" data-view="menu">
                <i class="fa-solid fa-utensils"></i> Restaurant Menu
            </button>
            <button class="menu-item ${AppState.currentView === 'orders' ? 'active' : ''}" data-view="orders">
                <i class="fa-solid :not(#deliverus-sidebar-menu) fa-list-check"></i> Manage Orders
            </button>
        `;
    } else {
        menuHTML = `
            <button class="menu-item ${AppState.currentView === 'order-food' ? 'active' : ''}" data-view="order-food">
                <i class="fa-solid fa-pizza-slice"></i> Food Catalog & Cart
            </button>
            <button class="menu-item ${AppState.currentView === 'orders' ? 'active' : ''}" data-view="orders">
                <i class="fa-solid fa-clock-rotate-left"></i> My Orders
            </button>
        `;
    }
    
    sidebar.innerHTML = menuHTML;
    
    // Bind listeners
    const menuButtons = sidebar.querySelectorAll('.menu-item');
    menuButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            menuButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            AppState.currentView = e.currentTarget.getAttribute('data-view');
            renderCurrentView();
        });
    });
}

function initRoleSelector() {
    const select = document.getElementById('role-select');
    const badge = document.getElementById('current-user-badge');
    
    if (select && badge) {
        select.addEventListener('change', (e) => {
            AppState.currentRole = e.target.value;
            
            if (AppState.currentRole === 'owner') {
                badge.innerText = 'Restaurant Owner';
                AppState.currentView = 'dashboard';
            } else {
                badge.innerText = 'Customer (Order)';
                AppState.currentView = 'order-food';
            }
            
            updateSidebar();
            renderCurrentView();
        });
    }
}

function initArchitectureTabs() {
    const tabs = document.querySelectorAll('.arch-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            const targetId = e.target.getAttribute('data-tab');
            document.querySelectorAll('.arch-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// ==========================================
// RENDERERS FOR INDIVIDUAL SIMULATOR VIEWS
// ==========================================

// --- VIEW: Dashboard ---
function renderDashboardView(container) {
    const activeOrders = AppState.orders.filter(o => o.status !== 'delivered').length;
    const servedOrders = AppState.analytics.todaysServedOrders;
    const pendingOrders = AppState.orders.filter(o => o.status === 'pending').length;
    
    container.innerHTML = `
        <h3 class="view-title">Analytics Dashboard</h3>
        <p class="view-subtitle">Business intelligence metrics representing database counts and query operations.</p>
        
        <div class="dashboard-stats">
            <div class="dashboard-card">
                <div class="card-icon-container orange"><i class="fa-solid fa-clock"></i></div>
                <div>
                    <div class="dash-card-val">${pendingOrders}</div>
                    <div class="dash-card-lbl">Pending Orders</div>
                </div>
            </div>
            <div class="dashboard-card">
                <div class="card-icon-container blue"><i class="fa-solid fa-hourglass-half"></i></div>
                <div>
                    <div class="dash-card-val">${activeOrders}</div>
                    <div class="dash-card-lbl">Orders in Process</div>
                </div>
            </div>
            <div class="dashboard-card">
                <div class="card-icon-container green"><i class="fa-solid fa-circle-check"></i></div>
                <div>
                    <div class="dash-card-val">${servedOrders}</div>
                    <div class="dash-card-lbl">Today's Served</div>
                </div>
            </div>
            <div class="dashboard-card">
                <div class="card-icon-container"><i class="fa-solid fa-wallet"></i></div>
                <div>
                    <div class="dash-card-val">${AppState.analytics.invoicedToday.toFixed(2)}€</div>
                    <div class="dash-card-lbl">Invoiced Today</div>
                </div>
            </div>
        </div>
        
        <div class="panel-block" style="margin-top: 25px;">
            <h4><i class="fa-solid fa-chart-line"></i> SQL Aggregated Invoicing Metrics (Sequelize SUM)</h4>
            <p class="dash-card-lbl" style="margin-bottom:15px;">Simulating sequelize query: <code>db.Order.sum('totalPrice', { where: { status: 'delivered', date: today } })</code></p>
            <div style="font-size: 1.1rem; display:flex; flex-direction:column; gap:8px;">
                <span>Yesterday's Final Volume: <strong>${AppState.analytics.yesterdayOrders} orders</strong></span>
                <span>Service Charge Rule (BR1): <strong>Orders > 10€ get FREE Shipping</strong></span>
            </div>
        </div>
    `;
}

// --- VIEW: Menu ---
function renderMenuView(container) {
    let productsRows = AppState.products.map(prod => {
        const rest = AppState.restaurants.find(r => r.id === prod.restaurantId);
        return `
            <tr>
                <td><strong>${prod.id}</strong></td>
                <td>${prod.name}</td>
                <td>${prod.price.toFixed(2)}€</td>
                <td>${rest ? rest.name : 'Unknown'}</td>
                <td><span class="table-badge ${prod.availability ? 'success' : 'danger'}">${prod.availability ? 'Available' : 'Unavailable'}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="toggleProductAvailability(${prod.id})">
                        <i class="fa-solid fa-rotate"></i> Toggle Status
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <div class="pets-top-actions">
            <div>
                <h3 class="view-title">Restaurant Products Menu</h3>
                <p class="view-subtitle">Add products, configure prices, and toggle menu availability.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="toggleAddProductForm(true)">
                <i class="fa-solid fa-plus"></i> Add Product
            </button>
        </div>
        
        <div id="add-product-form-container" style="display:none; margin-bottom: 25px;" class="panel-block">
            <h4><i class="fa-solid fa-pizza-slice"></i> New Product details</h4>
            <form onsubmit="handleProductSubmit(event)">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="prod-name">Product Name</label>
                        <input type="text" id="prod-name" required placeholder="E.g. Carbonara Pizza">
                    </div>
                    <div class="form-group">
                        <label for="prod-price">Price (€)</label>
                        <input type="number" id="prod-price" step="0.01" required placeholder="9.50">
                    </div>
                    <div class="form-group">
                        <label for="prod-rest">Restaurant</label>
                        <select id="prod-rest">
                            ${AppState.restaurants.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:15px;">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="toggleAddProductForm(false)">Cancel</button>
                    <button type="submit" class="btn btn-primary btn-sm">Save Product</button>
                </div>
            </form>
        </div>
        
        <div class="panel-block">
            <table class="panel-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Restaurant</th>
                        <th>Availability</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${productsRows}
                </tbody>
            </table>
        </div>
    `;
}

window.toggleAddProductForm = function(show) {
    const form = document.getElementById('add-product-form-container');
    if (form) form.style.display = show ? 'block' : 'none';
};

window.handleProductSubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('prod-name').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const restaurantId = parseInt(document.getElementById('prod-rest').value);
    
    const newId = AppState.products.length + 1;
    AppState.products.push({ id: newId, name, price, availability: true, restaurantId });
    
    alert(`"${name}" successfully added to the restaurant's menu.`);
    renderCurrentView();
};

window.toggleProductAvailability = function(prodId) {
    const prod = AppState.products.find(p => p.id === prodId);
    if (prod) {
        prod.availability = !prod.availability;
        renderCurrentView();
    }
};

// --- VIEW: Orders ---
function renderOrdersView(container) {
    let ordersRows = AppState.orders.map(order => {
        let actionBtn = '';
        if (AppState.currentRole === 'owner') {
            if (order.status === 'pending') {
                actionBtn = `<button class="btn btn-primary btn-sm" onclick="transitionOrder(${order.id}, 'in process')">Accept Order</button>`;
            } else if (order.status === 'in process') {
                actionBtn = `<button class="btn btn-primary btn-sm" onclick="transitionOrder(${order.id}, 'sent')">Send Order</button>`;
            } else if (order.status === 'sent') {
                actionBtn = `<button class="btn btn-success btn-sm" onclick="transitionOrder(${order.id}, 'delivered')">Mark Delivered</button>`;
            }
        }
        
        let statusBadge = '';
        if (order.status === 'pending') statusBadge = 'pending';
        else if (order.status === 'delivered') statusBadge = 'success';
        else statusBadge = 'info';

        return `
            <div class="ticket-item" style="margin-bottom: 15px;">
                <div class="ticket-header">
                    <span class="ticket-id">Order ID: #${order.id} - ${order.restaurantName}</span>
                    <span class="ticket-priority-badge status-${order.status}" style="background:rgba(255,255,255,0.05);">${order.status.toUpperCase()}</span>
                </div>
                <div class="ticket-desc" style="font-size:0.9rem; margin-top:5px;">
                    Items: <strong>${order.itemsText}</strong><br>
                    Delivery Address: <em>${order.address}</em>
                </div>
                <div class="ticket-sla-stats" style="margin-top:10px;">
                    <span>Subtotal: ${order.totalPrice.toFixed(2)}€</span>
                    <span>Shipping costs: ${order.shippingCosts.toFixed(2)}€</span>
                    <span>Total charge: <strong>${(order.totalPrice + order.shippingCosts).toFixed(2)}€</strong></span>
                </div>
                ${actionBtn ? `<div style="display:flex; justify-content:flex-end; margin-top:10px;">${actionBtn}</div>` : ''}
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <h3 class="view-title">${AppState.currentRole === 'owner' ? 'Manage Orders' : 'My Orders Record'}</h3>
        <p class="view-subtitle">Track incoming food requests and change their state through the lifecycle pipeline.</p>
        
        <div class="itsm-tickets-panel">
            ${ordersRows.length > 0 ? ordersRows : '<p style="text-align:center; padding: 20px;" class="dash-card-lbl">No orders placed yet.</p>'}
        </div>
    `;
}

window.transitionOrder = function(orderId, newStatus) {
    const order = AppState.orders.find(o => o.id === orderId);
    if (!order) return;
    
    order.status = newStatus;
    
    if (newStatus === 'delivered') {
        AppState.analytics.todaysServedOrders += 1;
        AppState.analytics.invoicedToday += (order.totalPrice + order.shippingCosts);
    }
    
    renderCurrentView();
};

// --- VIEW: Food Catalog ---
function renderOrderFoodView(container) {
    let foodCards = AppState.products.filter(p => p.availability).map(prod => {
        const rest = AppState.restaurants.find(r => r.id === prod.restaurantId);
        return `
            <div class="room-card" style="padding: 15px; text-align: left; position:relative;">
                <h5>${prod.name}</h5>
                <p class="dash-card-lbl" style="font-size: 0.8rem; margin: 4px 0;">Restaurant: ${rest ? rest.name : 'Unknown'}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                    <span style="font-weight:700;">${prod.price.toFixed(2)}€</span>
                    <button class="btn btn-primary btn-sm" style="padding:4px 10px; font-size:0.75rem;" onclick="addToCart(${prod.id})">
                        <i class="fa-solid fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Cart details
    let cartHTML = '';
    if (AppState.cart.length === 0) {
        cartHTML = '<p class="dash-card-lbl" style="text-align:center; padding:15px;">Your cart is empty.</p>';
    } else {
        let subtotal = 0;
        let itemsList = AppState.cart.map(item => {
            const prod = AppState.products.find(p => p.id === item.productId);
            const total = prod.price * item.quantity;
            subtotal += total;
            return `
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; padding: 6px 0; border-bottom:1px solid rgba(255,255,255,0.03);">
                    <span>${item.quantity}x ${prod.name}</span>
                    <span>${total.toFixed(2)}€</span>
                </div>
            `;
        }).join('');
        
        // Apply BR1: if subtotal > 10, shipping = 0, else 2€
        const shipping = subtotal > 10 ? 0 : 2.0;
        const finalPrice = subtotal + shipping;
        
        cartHTML = `
            <div style="margin-bottom:15px;">
                ${itemsList}
            </div>
            <div style="font-size: 0.85rem; border-top:1px solid rgba(255,255,255,0.06); padding-top:10px; display:flex; flex-direction:column; gap:4px;">
                <div style="display:flex; justify-content:space-between;"><span>Subtotal:</span><span>${subtotal.toFixed(2)}€</span></div>
                <div style="display:flex; justify-content:space-between;"><span>Shipping Cost:</span><span>${shipping === 0 ? 'FREE' : shipping.toFixed(2) + '€'}</span></div>
                <div style="display:flex; justify-content:space-between; font-weight:700; font-size: 0.95rem; margin-top:5px; color:#ff7a00;">
                    <span>Total charge:</span><span>${finalPrice.toFixed(2)}€</span>
                </div>
            </div>
            
            <form onsubmit="checkoutCart(event)" style="margin-top: 15px;">
                <div class="form-group" style="margin-bottom:12px;">
                    <label for="cart-address" style="font-size:0.75rem;">Delivery Address</label>
                    <input type="text" id="cart-address" required placeholder="E.g. Calle Reina Mercedes 12">
                </div>
                <button type="submit" class="btn btn-primary btn-sm" style="width:100%; justify-content:center; background:#ff7a00; box-shadow:0 4px 10px rgba(255,122,0,0.25);">
                    <i class="fa-solid fa-credit-card"></i> Confirm Order
                </button>
            </form>
        `;
    }

    container.innerHTML = `
        <h3 class="view-title">Food Catalog & Cart</h3>
        <p class="view-subtitle">Choose dishes from local restaurants and configure your cart following business rules.</p>
        
        <div class="dashboard-details-grid">
            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 15px; max-height:450px; overflow-y:auto; padding-right:5px;">
                ${foodCards}
            </div>
            
            <div class="panel-block" style="align-self: flex-start;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h4 style="margin-bottom:0;"><i class="fa-solid fa-shopping-cart"></i> Cart Summary</h4>
                    ${AppState.cart.length > 0 ? `<button class="btn btn-secondary btn-sm" style="padding:2px 8px; font-size:0.7rem;" onclick="clearCart()">Clear</button>` : ''}
                </div>
                ${cartHTML}
            </div>
        </div>
    `;
}

window.addToCart = function(prodId) {
    const prod = AppState.products.find(p => p.id === prodId);
    if (!prod) return;
    
    // BR2: Cart can only include items from the same restaurant
    if (AppState.cart.length > 0) {
        const firstCartItem = AppState.products.find(p => p.id === AppState.cart[0].productId);
        if (firstCartItem.restaurantId !== prod.restaurantId) {
            alert("Business Rule BR2 Violation:\nAn order can only include products from one restaurant. Please clear your cart first.");
            return;
        }
    }
    
    const existing = AppState.cart.find(c => c.productId === prodId);
    if (existing) {
        existing.quantity += 1;
    } else {
        AppState.cart.push({ productId: prodId, quantity: 1 });
    }
    
    renderCurrentView();
};

window.clearCart = function() {
    AppState.cart = [];
    renderCurrentView();
};

window.checkoutCart = function(e) {
    e.preventDefault();
    const address = document.getElementById('cart-address').value;
    
    // Compute total & shipping cost
    let subtotal = 0;
    let itemsTexts = [];
    AppState.cart.forEach(item => {
        const prod = AppState.products.find(p => p.id === item.productId);
        subtotal += prod.price * item.quantity;
        itemsTexts.push(`${item.quantity}x ${prod.name}`);
    });
    
    const shipping = subtotal > 10 ? 0 : 2.0;
    const firstCartItem = AppState.products.find(p => p.id === AppState.cart[0].productId);
    const rest = AppState.restaurants.find(r => r.id === firstCartItem.restaurantId);
    
    const newOrder = {
        id: AppState.orders.length + 1,
        restaurantName: rest.name,
        totalPrice: subtotal,
        shippingCosts: shipping,
        status: 'pending',
        address,
        itemsCount: AppState.cart.length,
        itemsText: itemsTexts.join(', ')
    };
    
    AppState.orders.push(newOrder);
    AppState.analytics.pendingOrders += 1;
    AppState.cart = []; // clear cart
    
    alert(`Order #${newOrder.id} successfully created! State: PENDING.\nThe restaurant owner will review it soon.`);
    renderCurrentView();
};
