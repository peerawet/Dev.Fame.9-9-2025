// Cart Modal Component
class CartModal {
  constructor() {
    this.modalId = "cart-modal";
    this.isCreated = false;
  }

  // Get modal HTML template
  getTemplate() {
    return `
            <ion-modal id="${this.modalId}">
                <div class="qcart-content-wrap">
                    <ion-list class="qcart-content">
                        <div class="position-wrap">
                            <!-- top section -->
                            <div class="qcart-top-info-wrap">
                                <ion-img class="product-img" src="assets/img/place-holder0.png"></ion-img>
                                <ion-buttons class="qcart-closing-btn">
                                    <ion-button onclick="cartModal.close()">
                                        <img src="assets/icon/closing-icon.svg">
                                    </ion-button>
                                </ion-buttons>
                                <div class="qcart-info-right">
                                    <span class="qcart-title">Baam 100% My Whey</span>
                                    <p class="qcart-des">โปรตีนเสริมสร้างกล้ามเนื้อ คุณภาพสูง</p>
                                    <div class="price-d">฿1,600 <span class="price-o">฿1,800</span></div>
                                    <div class="qcart-points">
                                        <img src="assets/icon/clear-point-icon.svg"/><span class="point">500</span>
                                    </div>
                                </div>
                            </div>
                            <!-- mid and bottom section wrap -->
                            <div class="qcart-exp">EXP:31/12/2025</div>
                            <div class="qcart-mid-wrap">
                                <!-- mid section -->
                                <div class="qcart-selector-wrap">
                                    <div class="qcart-selector">
                                        <div class="qcart-heading">Size <span class="select-num">(Select 1)</span></div>
                                        <ion-buttons class="selector-btn-wrap">
                                            <ion-button class="selector-btn n-select" onclick="cartModal.selectOption(this)">Sample</ion-button>
                                            <ion-button class="selector-btn n-select" onclick="cartModal.selectOption(this)">250g</ion-button>
                                            <ion-button class="selector-btn n-select" onclick="cartModal.selectOption(this)">1lb</ion-button>
                                            <ion-button class="selector-btn n-select" onclick="cartModal.selectOption(this)">2lb</ion-button>
                                            <ion-button class="selector-btn select" onclick="cartModal.selectOption(this)">5lb</ion-button>
                                            <ion-button class="selector-btn n-select" onclick="cartModal.selectOption(this)">10lb</ion-button>
                                        </ion-buttons>
                                    </div>
                                    <div class="qcart-selector">
                                        <div class="qcart-heading">Flavor <span class="select-num">(Select 1)</span></div>
                                        <ion-buttons class="selector-btn-wrap">
                                            <ion-button class="selector-btn n-select" onclick="cartModal.selectOption(this)">Chocolate</ion-button>
                                            <ion-button class="selector-btn n-select" onclick="cartModal.selectOption(this)">Vanilla</ion-button>
                                            <ion-button class="selector-btn select" onclick="cartModal.selectOption(this)">Strawberry</ion-button>
                                            <ion-button class="selector-btn n-select" onclick="cartModal.selectOption(this)">Matcha</ion-button>
                                        </ion-buttons>
                                    </div>
                                </div>
                                <!-- bottom section -->
                                <ion-footer class="qcart-confirm-footer" >
                                    <div class="qcart-confirm" lines="none" style="padding: 10px;">
                                        <div class="qcart-qty-wrap">
                                            <p class="qty-left">Quantity</p>
                                            <div class="qty-right">
                                                <ion-button class="qcart-btn-qty" onclick="cartModal.changeQuantity(-1)">
                                                    <img src="assets/icon/subtract-icon.svg">
                                                </ion-button>
                                                <span class="quickcart-text-qty" id="modal-quantity">1</span>
                                                <ion-button class="qcart-btn-qty" onclick="cartModal.changeQuantity(1)">
                                                    <img src="assets/icon/add-icon.svg">
                                                </ion-button>
                                            </div>
                                        </div>
                                        <ion-buttons class="qcart-mix-btn-wrap">
                                            <ion-button slot="start" class="qcart-btn add" onclick="cartModal.addToCart()">Add to Cart</ion-button>
                                            <ion-button class="qcart-btn buy" onclick="cartModal.buyNow()">Buy Now</ion-button>
                                        </ion-buttons>
                                    </div>
                                </ion-footer>
                            </div>
                        </div>
                    </ion-list>
                </div>
            </ion-modal>
        `;
  }

  // Create modal element
  create() {
    if (this.isCreated) return;

    document.body.insertAdjacentHTML("beforeend", this.getTemplate());

    // Initialize modal
    const modal = document.getElementById(this.modalId);
    modal.initialBreakpoint = 0.85;
    modal.breakpoints = [0, 0.85];

    this.isCreated = true;
  }

  // Show modal
  show() {
    if (!this.isCreated) {
      this.create();
    }

    const modal = document.getElementById(this.modalId);
    if (modal) {
      modal.present();
    }
  }

  // Close modal
  close() {
    const modal = document.getElementById(this.modalId);
    if (modal) {
      modal.dismiss();
    }
  }

  // Select option handler
  selectOption(button) {
    // Remove select class from siblings
    const siblings = button.parentElement.querySelectorAll(".selector-btn");
    siblings.forEach((btn) => {
      btn.classList.remove("select");
      btn.classList.add("n-select");
    });

    // Add select class to clicked button
    button.classList.remove("n-select");
    button.classList.add("select");
  }

  // Change quantity handler
  changeQuantity(change) {
    const qtyElement = document.getElementById("modal-quantity");
    let currentQty = parseInt(qtyElement.textContent);
    currentQty = Math.max(1, currentQty + change);
    qtyElement.textContent = currentQty;
  }

  // Get selected options
  getSelectedOptions() {
    const size =
      document.querySelector(
        `#${this.modalId} .qcart-selector:nth-child(1) .selector-btn.select`
      )?.textContent || "Not selected";
    const flavor =
      document.querySelector(
        `#${this.modalId} .qcart-selector:nth-child(2) .selector-btn.select`
      )?.textContent || "Not selected";
    const quantity = document.getElementById("modal-quantity").textContent;

    return { size, flavor, quantity };
  }

  // Add to cart action
  addToCart() {
    const options = this.getSelectedOptions();

    // Validate selections
    if (options.size === "Not selected" || options.flavor === "Not selected") {
      alert("กرุณาเลือก Size และ Flavor ก่อนเพิ่มลงตะกร้า");
      return;
    }

    alert(
      `เพิ่มลงตะกร้าแล้ว!\nSize: ${options.size}\nFlavor: ${options.flavor}\nQuantity: ${options.quantity}`
    );
    this.close();

    // In real app, this would call API to add item to cart
    console.log("Adding to cart:", options);
  }

  // Buy now action
  buyNow() {
    const options = this.getSelectedOptions();

    // Validate selections
    if (options.size === "Not selected" || options.flavor === "Not selected") {
      alert("กรุณาเลือก Size และ Flavor ก่อนสั่งซื้อ");
      return;
    }

    alert(
      `สั่งซื้อทันที!\nSize: ${options.size}\nFlavor: ${options.flavor}\nQuantity: ${options.quantity}\nกำลังไปหน้าชำระเงิน...`
    );
    this.close();

    // In real app, this would redirect to checkout
    console.log("Buy now:", options);
  }

  // Update product data (for dynamic content)
  updateProduct(productData) {
    if (!this.isCreated) return;

    const modal = document.getElementById(this.modalId);
    if (modal) {
      // Update product image
      const productImg = modal.querySelector(".product-img");
      if (productImg && productData.image) {
        productImg.src = productData.image;
      }

      // Update product title
      const productTitle = modal.querySelector(".qcart-title");
      if (productTitle && productData.name) {
        productTitle.textContent = productData.name;
      }

      // Update product description
      const productDesc = modal.querySelector(".qcart-des");
      if (productDesc && productData.description) {
        productDesc.textContent = productData.description;
      }

      // Update price
      const priceElement = modal.querySelector(".price-d");
      if (priceElement && productData.price) {
        priceElement.innerHTML = `฿${productData.price.current} <span class="price-o">฿${productData.price.original}</span>`;
      }

      // Update points
      const pointsElement = modal.querySelector(".point");
      if (pointsElement && productData.points) {
        pointsElement.textContent = productData.points;
      }
    }
  }
}

// Create global instance
const cartModal = new CartModal();

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = CartModal;
}
