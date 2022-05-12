// Storage Controller
const StorageController = (function () {
  return {
    storeProduct: function (product) {
      let products;
      if (localStorage.getItem('products') === null) {
        products = [];
        products.push(product);
      } else {
        products = JSON.parse(localStorage.getItem('products'));
        products.push(product);
      }
      localStorage.setItem('products', JSON.stringify(products));
    },
    getProducts: function () {
      let products;
      if (localStorage.getItem('products') == null) {
        products = [];
      } else {
        products = JSON.parse(localStorage.getItem('products'));
      }
      return products;
    },
    updateStorage: function (product) {
      let products = JSON.parse(localStorage.getItem('products'));
      products.forEach(function (prd, index) {
        if (product.id == prd.id) {
          products.splice(index, 1, product);
        }
      });
      localStorage.setItem('products', JSON.stringify(products));
    },
    deleteProduct: function (id) {
      let products = JSON.parse(localStorage.getItem('products'));
      products.forEach(function (prd, index) {
        if (id == prd.id) {
          products.splice(index, 1);
        }
      });
      localStorage.setItem('products', JSON.stringify(products));
    },
  };
})();

// Product Controller
const ProductController = (function () {
  //private
  const Product = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };

  const data = {
    products: StorageController.getProducts(),
    selectedProduct: null,
    totalPrice: 0,
  };

  //public
  return {
    getProduct: function () {
      return data.products;
    },
    getData: function () {
      return data;
    },
    addProduct: function (name, price) {
      let id;
      if (data.products.length > 0) {
        id = data.products[data.products.length - 1].id + 1;
      } else {
        id = 0;
      }
      const newProduct = new Product(id, name, parseFloat(price));
      data.products.push(newProduct);
      return newProduct;
    },
    getTotal: function () {
      let total = 0;
      data.products.forEach(function (product) {
        total += product.price;
      });
      data.totalPrice = total;
      return data.totalPrice;
    },
    getProductById: function (id) {
      let product = null;

      data.products.forEach(function (prd) {
        if (prd.id == id) {
          product = prd;
        }
      });

      return product;
    },
    setCurrentProduct: function (product) {
      data.selectedProduct = product;
    },
    getCurrentProduct: function () {
      return data.selectedProduct;
    },
    updateProduct: function (name, price) {
      let product = null;

      data.products.forEach(function (prd) {
        if (prd.id == data.selectedProduct.id) {
          prd.name = name;
          prd.price = parseFloat(price);
          product = prd;
        }
      });

      return product;
    },
    deleteProduct: function (product) {
      console.log(product);
      data.products.forEach(function (prd, index) {
        if (prd.id == product.id) {
          data.products.splice(index, 1);
        }
      });
    },
  };
})();

// UI Controller
const UIController = (function () {
  const Selectors = {
    productList: '#item-list',
    addButton: '.addBtn',
    updateButton: '.updateBtn',
    deleteButton: '.deleteBtn',
    cancelButton: '.cancelBtn',
    productName: '#productName',
    productPrice: '#productPrice',
    productCard: '#productCard',
    totalTL: '#total-tl',
    totalDolar: '#total-dolar',
    productListItems: '#item-list tr',
  };

  return {
    createProductList: function (products) {
      let html = '';
      products.forEach((product) => {
        html += `
        <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.price} $</td>
          <td class="text-end">
            <i class="fa-solid fa-edit edit-product"></i>
          </td>
        </tr>
        `;
      });
      document.querySelector(Selectors.productList).innerHTML = html;
    },
    getSelectors: function () {
      return Selectors;
    },
    addProduct: function (product) {
      document.querySelector(Selectors.productCard).style.display = 'block';
      const item = `
      <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.price} $</td>
          <td class="text-end">
            <i class="fa-solid fa-edit edit-product"></i>
          </td>
        </tr>
      `;

      document.querySelector(Selectors.productList).innerHTML += item;
    },
    clearInputs: function () {
      document.querySelector(Selectors.productName).value = '';
      document.querySelector(Selectors.productPrice).value = '';
    },
    hideCard: function () {
      document.querySelector(Selectors.productCard).style.display = 'none';
    },
    showTotal: function (total) {
      document.querySelector(Selectors.totalDolar).textContent = total;
      document.querySelector(Selectors.totalTL).textContent = total * 15;
    },
    addProductToForm: function () {
      const selectedProduct = ProductController.getCurrentProduct();
      document.querySelector(Selectors.productName).value = selectedProduct.name;
      document.querySelector(Selectors.productPrice).value = selectedProduct.price;
    },
    addingState: function () {
      UIController.clearWarnings();
      UIController.clearInputs();
      document.querySelector(Selectors.addButton).style.display = 'inline';
      document.querySelector(Selectors.updateButton).style.display = 'none';
      document.querySelector(Selectors.deleteButton).style.display = 'none';
      document.querySelector(Selectors.cancelButton).style.display = 'none';
    },
    editState: function (tr) {
      tr.classList.add('bg-warning');
      document.querySelector(Selectors.addButton).style.display = 'none';
      document.querySelector(Selectors.updateButton).style.display = 'inline';
      document.querySelector(Selectors.deleteButton).style.display = 'inline';
      document.querySelector(Selectors.cancelButton).style.display = 'inline';
    },
    updateProduct: function (prd) {
      let updatedItem = null;

      let items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains('bg-warning')) {
          item.children[1].textContent = prd.name;
          item.children[2].textContent = prd.price + ' $';
          updatedItem = item;
        }
      });
      return updatedItem;
    },
    clearWarnings: function () {
      const items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains('bg-warning')) {
          item.classList.remove('bg-warning');
        }
      });
    },
    deleteProduct: function () {
      let items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains('bg-warning')) {
          item.remove();
        }
      });
    },
  };
})();

// App Controller
const App = (function (ProductCtrl, UICtrl, StorageCtrl) {
  const UISelectors = UICtrl.getSelectors();

  //Load Event Listeners
  const loadEventListeners = function () {
    //add product event
    document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

    //edit product click
    document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

    //edit product submit
    document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit);

    //cancel button click
    document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate);

    //delete product submit
    document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);
  };

  const productAddSubmit = function (event) {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;
    if (productName !== '' && productPrice != '') {
      //add product
      const newProduct = ProductCtrl.addProduct(productName, productPrice);
      //add item to list
      UIController.addProduct(newProduct);

      //add to LS
      StorageCtrl.storeProduct(newProduct);

      //get total
      const total = ProductCtrl.getTotal();

      //show total
      UICtrl.showTotal(total);

      UIController.clearInputs();
    }

    event.preventDefault();
  };

  const productEditClick = function (event) {
    if (event.target.classList.contains('edit-product')) {
      const id = event.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

      //get selected
      const product = ProductCtrl.getProductById(id);

      //set current product
      ProductCtrl.setCurrentProduct(product);

      UICtrl.clearWarnings();

      //add product ui
      UICtrl.addProductToForm();
      UICtrl.editState(event.target.parentNode.parentNode);
    }

    event.preventDefault;
  };

  const editProductSubmit = function (event) {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== '' && productPrice != '') {
      //update product
      const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

      //update ui
      let item = UICtrl.updateProduct(updatedProduct);

      //get total
      const total = ProductCtrl.getTotal();

      //show total
      UICtrl.showTotal(total);

      //update storage
      StorageCtrl.updateStorage(updatedProduct);

      UICtrl.addingState();
    }

    event.preventDefault();
  };

  const cancelUpdate = function (event) {
    UICtrl.addingState();
    UICtrl.clearWarnings();
    event.preventDefault();
  };

  const deleteProductSubmit = function (event) {
    //get selected product
    const selectedProduct = ProductCtrl.getCurrentProduct();

    //delete product
    ProductCtrl.deleteProduct(selectedProduct);

    //delete ui
    UICtrl.deleteProduct();

    //get total
    const total = ProductCtrl.getTotal();

    //show total
    UICtrl.showTotal(total);

    //delet from storage
    StorageCtrl.deleteProduct(selectedProduct.id);

    UICtrl.addingState();

    if (total == 0) {
      UICtrl.hideCard();
    }

    event.preventDefault();
  };

  return {
    init: function () {
      console.log('starting app...');
      UICtrl.addingState();
      const products = ProductCtrl.getProduct();

      if (products.length == 0) {
        UICtrl.hideCard();
      } else {
        UICtrl.createProductList(products);
      }

      //load event listener
      loadEventListeners();
    },
  };
})(ProductController, UIController, StorageController);

App.init();
