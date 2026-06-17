/**
 * Sunshine Horticultures — Interactive Ordering Logic
 * --------------------------------------------------
 * Handles: product rendering, packaging options, quantity adjustments,
 * cart state, delivery validation, payment simulations, and receipt WhatsApp triggers.
 */

(function () {
  'use strict';

  // ===== PRODUCTS DATABASE =====
  const PRODUCTS = [
    {
      id: 'cucumber',
      name: 'Japanese Cucumber',
      description: 'Crisp & fresh, grown in the cool Cameron Highlands climate for exceptional taste and crunch.',
      image: 'images/japanese-cucumber.png',
      category: 'vines',
      prices: {
        retail: { price: 2.50, unit: '200g Retail Pack' },
        bulk: { price: 45.00, unit: '10kg Bulk Box' }
      },
      tag: 'Fresh Daily'
    },
    {
      id: 'cabbage',
      name: 'Cabbage',
      description: 'Natural & quality — dense, green cabbage heads harvested at peak maturity.',
      image: 'images/cabbage.png',
      category: 'leafy',
      prices: {
        retail: { price: 1.80, unit: '200g Retail Pack' },
        bulk: { price: 30.00, unit: '10kg Bulk Box' }
      },
      tag: 'Bestseller'
    },
    {
      id: 'tomatoes',
      name: 'Fresh Tomatoes',
      description: 'Carefully grown with natural goodness — vine-ripened for full flavour and vibrant colour.',
      image: 'images/tomatoes.png',
      category: 'vines',
      prices: {
        retail: { price: 3.00, unit: '200g Retail Pack' },
        bulk: { price: 50.00, unit: '10kg Bulk Box' }
      },
      tag: 'Popular'
    },
    {
      id: 'pakchoy',
      name: 'Si Pak Choy & Sawi',
      description: 'Fresh daily harvest — tender, nutrient-rich Asian leafy greens perfect for every kitchen.',
      image: 'images/pak-choy-sawi.png',
      category: 'leafy',
      prices: {
        retail: { price: 2.20, unit: '200g Retail Pack' },
        bulk: { price: 40.00, unit: '10kg Bulk Box' }
      },
      tag: 'Daily Harvest'
    },
    {
      id: 'combo',
      name: 'Premium Promo Combo Box',
      description: 'Get the best of Cameron Highlands in one box — a curated selection of our freshest vegetables.',
      image: 'images/combo-box.png',
      category: 'combo',
      prices: {
        retail: { price: 35.00, unit: 'Family Size (4-5kg)' },
        bulk: { price: 85.00, unit: 'Business Size (10-12kg)' }
      },
      tag: 'Promo Combo'
    }
  ];

  // ===== STATE =====
  let cart = [];
  let currentCategory = 'all';
  let activePaymentMethod = 'duitnow'; // 'duitnow' or 'fpx'
  let checkoutStep = 1; // 1: Delivery, 2: Payment, 3: Success

  // Delivery settings
  const DELIVERY_FEE = 10.00;
  const FREE_DELIVERY_THRESHOLD = 120.00;

  // Saved client details
  let orderReceiptDetails = null;

  // ===== DOM ELEMENTS =====
  const catalogGrid = document.getElementById('catalog-grid');
  const categoryTabs = document.querySelectorAll('.category-tab');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartEmptyState = document.getElementById('cart-empty');
  const cartCountPills = document.querySelectorAll('.cart-count');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartDelivery = document.getElementById('cart-delivery');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Checkout modal elements
  const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const wizardSteps = document.querySelectorAll('.step-node');
  const panelDelivery = document.getElementById('panel-delivery');
  const panelPayment = document.getElementById('panel-payment');
  const panelProcessing = document.getElementById('panel-processing');
  const panelSuccess = document.getElementById('panel-success');
  const btnBack = document.getElementById('btn-back');
  const btnContinue = document.getElementById('btn-continue');
  const deliveryForm = document.getElementById('delivery-form');
  const processingText = document.getElementById('processing-text');
  const receiptSummaryContainer = document.getElementById('receipt-summary-container');
  const btnWhatsappSend = document.getElementById('btn-whatsapp-send');

  // Payment UI selector elements
  const pmDuitnowCard = document.getElementById('pm-duitnow');
  const pmFpxCard = document.getElementById('pm-fpx');
  const panelDuitnowDetails = document.getElementById('panel-duitnow-details');
  const panelFpxDetails = document.getElementById('panel-fpx-details');
  const qrAmount = document.getElementById('qr-amount');

  // ===== INITIALIZATION =====
  function init() {
    loadCartFromLocalStorage();
    renderCatalog();
    renderCart();
    setupEventListeners();
    handleQueryString();
  }

  // Load cart
  function loadCartFromLocalStorage() {
    const stored = localStorage.getItem('sunshine_cart');
    if (stored) {
      try {
        cart = JSON.parse(stored);
      } catch (e) {
        cart = [];
      }
    }
  }

  function saveCartToLocalStorage() {
    localStorage.setItem('sunshine_cart', JSON.stringify(cart));
  }

  // ===== EVENT LISTENERS =====
  function setupEventListeners() {
    // Category filters
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category;
        renderCatalog();
      });
    });

    // Checkout Modal open/close
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      openCheckoutModal();
    });

    modalCloseBtn.addEventListener('click', () => {
      if (checkoutStep === 3) {
        closeCheckoutModal();
      } else {
        if (confirm('Are you sure you want to exit checkout? your progress will be lost.')) {
          closeCheckoutModal();
        }
      }
    });

    // Payment methods selector toggles
    pmDuitnowCard.addEventListener('click', () => selectPaymentMethod('duitnow'));
    pmFpxCard.addEventListener('click', () => selectPaymentMethod('fpx'));

    // Wizard navigation controls
    btnContinue.addEventListener('click', handleWizardNext);
    btnBack.addEventListener('click', handleWizardBack);

    // WhatsApp send receipt trigger
    btnWhatsappSend.addEventListener('click', sendOrderToWhatsApp);

    // Navbar Scroll & Hamburger menu (from main page template)
    const navbar = document.getElementById('navbar');
    function handleNavScroll() {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const spans = navToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          spans[0].style.transform = '';
          spans[1].style.opacity = '';
          spans[2].style.transform = '';
        }
      });
    }
  }

  // Handle product auto-scroll and selecting from homepage
  function handleQueryString() {
    const params = new URLSearchParams(window.location.search);
    const selectProduct = params.get('select');
    if (selectProduct) {
      // Find card container
      setTimeout(() => {
        const productCard = document.getElementById(`order-card-${selectProduct}`);
        if (productCard) {
          productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          productCard.style.boxShadow = '0 0 0 3px var(--green-400)';
          setTimeout(() => {
            productCard.style.boxShadow = '';
          }, 3000);
        }
      }, 350);
    }
  }

  // ===== RENDER CATALOG =====
  function renderCatalog() {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';

    const filtered = currentCategory === 'all' 
      ? PRODUCTS 
      : PRODUCTS.filter(p => p.category === currentCategory);

    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'order-card';
      card.id = `order-card-${product.id}`;

      // Default package type is retail
      let pkgType = 'retail';
      let currentPrice = product.prices.retail.price;
      let currentUnit = product.prices.retail.unit;

      card.innerHTML = `
        <div class="order-card-img">
          <img src="${product.image}" alt="${product.name}">
          <span class="order-card-tag">${product.tag}</span>
        </div>
        <div class="order-card-body">
          <h3>${product.name}</h3>
          <p class="order-card-desc">${product.description}</p>
          
          <div class="packaging-selector">
            <span class="packaging-label">Choose Packing Size</span>
            <div class="pkg-options" id="pkg-opts-${product.id}">
              <button type="button" class="pkg-btn active" data-type="retail">${product.prices.retail.unit.split(' ')[0]}</button>
              <button type="button" class="pkg-btn" data-type="bulk">${product.prices.bulk.unit.split(' ')[0]}</button>
            </div>
          </div>
          
          <div class="card-price-action">
            <div class="price-display">
              <span class="price-val" id="price-val-${product.id}">RM ${currentPrice.toFixed(2)}</span>
              <span class="price-unit" id="price-unit-${product.id}">${currentUnit}</span>
            </div>
            
            <div class="qty-adjuster">
              <button type="button" class="qty-btn minus" id="qty-minus-${product.id}">−</button>
              <input type="number" class="qty-input" id="qty-input-${product.id}" value="1" min="1" max="99">
              <button type="button" class="qty-btn plus" id="qty-plus-${product.id}">+</button>
            </div>
            
            <button type="button" class="add-btn" id="add-btn-${product.id}" title="Add to cart" style="margin-left: 0.5rem;">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
              </svg>
            </button>
          </div>
        </div>
      `;

      catalogGrid.appendChild(card);

      // Event listener for package options selection
      const pkgButtons = card.querySelectorAll(`.pkg-btn`);
      pkgButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          pkgButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          pkgType = btn.dataset.type;

          const selectedPrice = product.prices[pkgType].price;
          const selectedUnit = product.prices[pkgType].unit;
          
          document.getElementById(`price-val-${product.id}`).textContent = `RM ${selectedPrice.toFixed(2)}`;
          document.getElementById(`price-unit-${product.id}`).textContent = selectedUnit;
        });
      });

      // Quantity adjustments
      const qtyInput = card.querySelector(`#qty-input-${product.id}`);
      const qtyMinus = card.querySelector(`#qty-minus-${product.id}`);
      const qtyPlus = card.querySelector(`#qty-plus-${product.id}`);

      qtyMinus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val > 1) qtyInput.value = val - 1;
      });

      qtyPlus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val < 99) qtyInput.value = val + 1;
      });

      // Add to cart button trigger
      const addBtn = card.querySelector(`#add-btn-${product.id}`);
      addBtn.addEventListener('click', () => {
        const qty = parseInt(qtyInput.value) || 1;
        addToCart(product.id, pkgType, qty);
        
        // Success micro-feedback
        const originalBg = addBtn.style.background;
        addBtn.style.background = 'var(--earth-500)';
        addBtn.innerHTML = `
          <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path>
          </svg>
        `;
        setTimeout(() => {
          addBtn.style.background = '';
          addBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
            </svg>
          `;
        }, 1200);
      });
    });
  }

  // ===== CART OPERATIONS =====
  function addToCart(productId, pkgType, quantity) {
    const existing = cart.find(item => item.productId === productId && item.pkgType === pkgType);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, pkgType, quantity });
    }
    saveCartToLocalStorage();
    renderCart();
  }

  function removeFromCart(productId, pkgType) {
    cart = cart.filter(item => !(item.productId === productId && item.pkgType === pkgType));
    saveCartToLocalStorage();
    renderCart();
  }

  function updateCartQty(productId, pkgType, newQty) {
    const item = cart.find(item => item.productId === productId && item.pkgType === pkgType);
    if (item) {
      item.quantity = newQty;
      if (item.quantity <= 0) {
        removeFromCart(productId, pkgType);
      } else {
        saveCartToLocalStorage();
        renderCart();
      }
    }
  }

  function calculateCartTotals() {
    let subtotal = 0;
    cart.forEach(item => {
      const prod = PRODUCTS.find(p => p.id === item.productId);
      if (prod) {
        const itemPrice = prod.prices[item.pkgType].price;
        subtotal += itemPrice * item.quantity;
      }
    });

    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0.00 : DELIVERY_FEE;
    const total = subtotal + delivery;

    return { subtotal, delivery, total };
  }

  function renderCart() {
    if (!cartItemsList) return;
    
    // Total count of items
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountPills.forEach(pill => pill.textContent = totalCount);

    if (cart.length === 0) {
      cartItemsList.style.display = 'none';
      cartEmptyState.style.display = 'block';
      checkoutBtn.disabled = true;
      
      cartSubtotal.textContent = 'RM 0.00';
      cartDelivery.textContent = 'RM 0.00';
      cartTotal.textContent = 'RM 0.00';
      return;
    }

    cartEmptyState.style.display = 'none';
    cartItemsList.style.display = 'block';
    checkoutBtn.disabled = false;
    cartItemsList.innerHTML = '';

    cart.forEach(item => {
      const prod = PRODUCTS.find(p => p.id === item.productId);
      if (!prod) return;

      const price = prod.prices[item.pkgType].price;
      const unitLabel = prod.prices[item.pkgType].unit;
      const totalItemPrice = price * item.quantity;

      const cartItemEl = document.createElement('div');
      cartItemEl.className = 'cart-item';
      cartItemEl.innerHTML = `
        <div class="cart-item-img">
          <img src="${prod.image}" alt="${prod.name}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-title">${prod.name}</div>
          <div class="cart-item-pkg">${unitLabel}</div>
          <div class="cart-item-actions">
            <button class="cart-item-qty-btn minus-btn">−</button>
            <span class="cart-item-qty-text">${item.quantity}</span>
            <button class="cart-item-qty-btn plus-btn">+</button>
            <button class="cart-item-remove">Remove</button>
          </div>
        </div>
        <div class="cart-item-price">RM ${totalItemPrice.toFixed(2)}</div>
      `;

      // Wire events inside item element
      cartItemEl.querySelector('.minus-btn').addEventListener('click', () => {
        updateCartQty(item.productId, item.pkgType, item.quantity - 1);
      });
      cartItemEl.querySelector('.plus-btn').addEventListener('click', () => {
        updateCartQty(item.productId, item.pkgType, item.quantity + 1);
      });
      cartItemEl.querySelector('.cart-item-remove').addEventListener('click', () => {
        removeFromCart(item.productId, item.pkgType);
      });

      cartItemsList.appendChild(cartItemEl);
    });

    // Render totals
    const totals = calculateCartTotals();
    cartSubtotal.textContent = `RM ${totals.subtotal.toFixed(2)}`;
    cartDelivery.textContent = totals.delivery === 0 ? 'FREE' : `RM ${totals.delivery.toFixed(2)}`;
    cartTotal.textContent = `RM ${totals.total.toFixed(2)}`;
  }

  // ===== CHECKOUT MODAL FLOW =====
  function openCheckoutModal() {
    checkoutStep = 1;
    activePaymentMethod = 'duitnow';
    updateWizardUI();
    checkoutModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // stop page scrolling
  }

  function closeCheckoutModal() {
    checkoutModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function selectPaymentMethod(method) {
    activePaymentMethod = method;
    if (method === 'duitnow') {
      pmDuitnowCard.classList.add('active');
      pmFpxCard.classList.remove('active');
      panelDuitnowDetails.classList.add('active');
      panelFpxDetails.classList.remove('active');
    } else {
      pmDuitnowCard.classList.remove('active');
      pmFpxCard.classList.add('active');
      panelDuitnowDetails.classList.remove('active');
      panelFpxDetails.classList.add('active');
    }
  }

  function updateWizardUI() {
    // 1. Update step nodes status
    wizardSteps.forEach((node, idx) => {
      const stepNum = idx + 1;
      node.classList.remove('active', 'completed');
      
      if (stepNum === checkoutStep) {
        node.classList.add('active');
      } else if (stepNum < checkoutStep) {
        node.classList.add('completed');
      }
    });

    // 2. Hide/Show panels
    panelDelivery.style.display = (checkoutStep === 1) ? 'block' : 'none';
    panelPayment.style.display = (checkoutStep === 2) ? 'block' : 'none';
    panelProcessing.style.display = 'none';
    panelSuccess.style.display = (checkoutStep === 3) ? 'block' : 'none';

    // 3. Update control buttons
    if (checkoutStep === 1) {
      btnBack.style.visibility = 'hidden';
      btnContinue.style.display = 'inline-flex';
      btnContinue.textContent = 'Continue to Payment';
      modalCloseBtn.style.display = 'flex';
    } else if (checkoutStep === 2) {
      btnBack.style.visibility = 'visible';
      btnContinue.style.display = 'inline-flex';
      btnContinue.textContent = 'Confirm & Pay Now';
      
      // Update DuitNow QR Amount value
      const totals = calculateCartTotals();
      qrAmount.textContent = `RM ${totals.total.toFixed(2)}`;
      modalCloseBtn.style.display = 'flex';
    } else {
      // Step 3 (Success) - Navigation buttons hidden
      btnBack.style.visibility = 'hidden';
      btnContinue.style.display = 'none';
      modalCloseBtn.style.display = 'flex';
    }
  }

  function handleWizardNext() {
    if (checkoutStep === 1) {
      // Validate delivery form
      if (validateDeliveryForm()) {
        checkoutStep = 2;
        updateWizardUI();
      }
    } else if (checkoutStep === 2) {
      // Proceed to Simulated Payment Execution
      executePaymentSimulation();
    }
  }

  function handleWizardBack() {
    if (checkoutStep === 2) {
      checkoutStep = 1;
      updateWizardUI();
    }
  }

  function validateDeliveryForm() {
    const fields = [
      { id: 'client-name', message: 'Please enter your name.' },
      { id: 'client-phone', message: 'Please enter your phone number.' },
      { id: 'client-email', message: 'Please enter a valid email address.' },
      { id: 'client-address', message: 'Please enter your delivery address.' },
      { id: 'delivery-date', message: 'Please select a delivery date.' },
      { id: 'delivery-region', message: 'Please select a delivery region.' }
    ];

    for (let f of fields) {
      const el = document.getElementById(f.id);
      if (!el || !el.value.trim()) {
        alert(f.message);
        if (el) el.focus();
        return false;
      }
      if (f.id === 'client-email') {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(el.value.trim())) {
          alert('Please enter a valid email format.');
          el.focus();
          return false;
        }
      }
    }
    return true;
  }

  // ===== PAYMENT SIMULATION WIZARD =====
  function executePaymentSimulation() {
    // Hide panel forms & navigation row
    panelDelivery.style.display = 'none';
    panelPayment.style.display = 'none';
    btnBack.style.visibility = 'hidden';
    btnContinue.style.display = 'none';
    modalCloseBtn.style.display = 'none'; // Lock exit during payment execution

    // Show processing panel
    panelProcessing.style.display = 'flex';
    
    // Stage 1 simulation
    processingText.textContent = 'Connecting to banking gateway...';
    
    setTimeout(() => {
      // Stage 2 simulation
      processingText.textContent = `Verifying payment with ${activePaymentMethod === 'duitnow' ? 'DuitNow Secure QR' : 'FPX Secure Net'}...`;
      
      setTimeout(() => {
        // Successful Simulation complete!
        generateReceiptRecord();
        
        // Reset and clear cart
        cart = [];
        saveCartToLocalStorage();
        renderCart();

        // Advance step & update UI
        checkoutStep = 3;
        updateWizardUI();
        renderSuccessReceipt();

      }, 1800);
    }, 1000);
  }

  // Generate metadata receipts
  function generateReceiptRecord() {
    const transactionId = 'SH-' + Math.floor(10000000 + Math.random() * 90000000);
    const dateStr = new Date().toLocaleString('en-MY', { 
      timeZone: 'Asia/Kuala Lumpur',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const clientName = document.getElementById('client-name').value.trim();
    const clientPhone = document.getElementById('client-phone').value.trim();
    const clientEmail = document.getElementById('client-email').value.trim();
    const clientAddress = document.getElementById('client-address').value.trim();
    const deliveryDate = document.getElementById('delivery-date').value;
    const deliveryRegion = document.getElementById('delivery-region').value;

    // Snapshot cart totals before clearing cart
    const totals = calculateCartTotals();
    const itemSnapshots = cart.map(item => {
      const prod = PRODUCTS.find(p => p.id === item.productId);
      return {
        name: prod ? prod.name : 'Unknown Veg',
        pkg: prod ? prod.prices[item.pkgType].unit : item.pkgType,
        qty: item.quantity,
        price: prod ? prod.prices[item.pkgType].price : 0,
        total: prod ? (prod.prices[item.pkgType].price * item.quantity) : 0
      };
    });

    orderReceiptDetails = {
      receiptId: transactionId,
      date: dateStr,
      customer: {
        name: clientName,
        phone: clientPhone,
        email: clientEmail,
        address: clientAddress,
        region: deliveryRegion,
        deliveryDate: deliveryDate
      },
      payment: {
        method: activePaymentMethod === 'duitnow' ? 'DuitNow QR Pay' : 'FPX Online Banking',
        status: 'PAID'
      },
      items: itemSnapshots,
      totals: totals
    };
  }

  function renderSuccessReceipt() {
    if (!orderReceiptDetails || !receiptSummaryContainer) return;

    const details = orderReceiptDetails;
    let itemsHTML = '';
    
    details.items.forEach(item => {
      itemsHTML += `
        <div class="receipt-item-line">
          <span>${item.qty}x ${item.name} (${item.pkg.split(' ')[0]})</span>
          <span>RM ${item.total.toFixed(2)}</span>
        </div>
      `;
    });

    receiptSummaryContainer.innerHTML = `
      <div class="receipt-title">Order Receipt confirmation</div>
      <div class="receipt-row bold">
        <span>Receipt ID:</span>
        <span>${details.receiptId}</span>
      </div>
      <div class="receipt-row">
        <span>Date:</span>
        <span>${details.date}</span>
      </div>
      <div class="receipt-row">
        <span>Paid via:</span>
        <span style="color: var(--green-600); font-weight: 600;">${details.payment.method} (${details.payment.status})</span>
      </div>
      
      <div class="receipt-items-inline">
        ${itemsHTML}
      </div>

      <div class="receipt-row">
        <span>Subtotal:</span>
        <span>RM ${details.totals.subtotal.toFixed(2)}</span>
      </div>
      <div class="receipt-row">
        <span>Delivery (${details.customer.region}):</span>
        <span>${details.totals.delivery === 0 ? 'FREE' : 'RM ' + details.totals.delivery.toFixed(2)}</span>
      </div>
      <div class="receipt-row bold" style="font-size: 0.95rem; border-top: 1px dotted var(--gray-300); padding-top: 0.5rem; margin-top: 0.5rem;">
        <span>Amount Paid:</span>
        <span style="color: var(--primary-dark); font-size: 1.05rem;">RM ${details.totals.total.toFixed(2)}</span>
      </div>

      <div style="border-top: 1px dashed var(--gray-200); margin-top: 0.75rem; padding-top: 0.75rem; font-size: 0.75rem; color: var(--gray-500);">
        <strong>Delivery details:</strong><br>
        Name: ${details.customer.name} (${details.customer.phone})<br>
        Address: ${details.customer.address}<br>
        Target Date: ${details.customer.deliveryDate}
      </div>
    `;
  }

  // ===== WHATSAPP RECEIPT MESSAGE FORMATTER =====
  function sendOrderToWhatsApp() {
    if (!orderReceiptDetails) return;

    const d = orderReceiptDetails;
    let itemsText = '';
    
    d.items.forEach((item, index) => {
      itemsText += `${index + 1}. ${item.qty}x ${item.name} (${item.pkg}) - RM ${item.total.toFixed(2)}\n`;
    });

    // Formatting receipt message with clean spacings
    const msg = `🟢 *SUNSHINE HORTICULTURES — ORDER RECEIPT* 🟢\n` +
                `---------------------------------------------\n` +
                `*Receipt ID:* ${d.receiptId}\n` +
                `*Status:* ${d.payment.status} (${d.payment.method})\n` +
                `*Date:* ${d.date}\n\n` +
                
                `*👤 CUSTOMER INFO*\n` +
                `• *Name:* ${d.customer.name}\n` +
                `• *Phone:* ${d.customer.phone}\n` +
                `• *Email:* ${d.customer.email}\n` +
                `• *Delivery Region:* ${d.customer.region}\n` +
                `• *Delivery Address:* ${d.customer.address}\n` +
                `• *Delivery Date:* ${d.customer.deliveryDate}\n\n` +
                
                `*📦 ITEMS ORDERED*\n` +
                `${itemsText}\n` +
                
                `*💵 PAYMENT BREAKDOWN*\n` +
                `• *Subtotal:* RM ${d.totals.subtotal.toFixed(2)}\n` +
                `• *Delivery Fee:* ${d.totals.delivery === 0 ? 'FREE' : 'RM ' + d.totals.delivery.toFixed(2)}\n` +
                `• *TOTAL PAID:* RM ${d.totals.total.toFixed(2)}\n` +
                `---------------------------------------------\n` +
                `Thank you for shopping with Sunshine Horticultures! Please confirm delivery logistics.`;

    const encodedText = encodeURIComponent(msg);
    const waUrl = `https://wa.me/60126320259?text=${encodedText}`;

    window.open(waUrl, '_blank');
    
    // Close modal after redirection
    closeCheckoutModal();
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
