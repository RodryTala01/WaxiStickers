(function () {
  const STORAGE_KEYS = {
    cart: "catalogo-cart-v1",
    favorites: "catalogo-favorites-v1",
    customer: "catalogo-customer-v1",
    orderCounter: "catalogo-order-counter-v1",
    pendingFavorites: "catalogo-pending-favorites-v1"
  };

  const STORE_CONFIG = {
    whatsappNumber: "+54 1154865284",
    whatsappLabel: "+54 11 5486-5284",
    instagramUser: "@waxistickerslanus",
    instagramUrl: "https://www.instagram.com/waxistickerslanus/",
    currency: "ARS",
    locale: "es-AR",
    catalogPageSize: 48,
    googleSheets: {
      enabled: true,
      appsScriptUrl: "https://script.google.com/macros/s/AKfycbygcdj5HBaDU0C2vmkaM0biFw9JAvhAXhhOhJ4S979Ebr0dO3a-nYRUtzh2kcoorGpD0A/exec",
      sheetNames: ["PRODUCTOS", "PRECIOS", "PROMOS", "PEDIDOS", "CONFIG"]
    }
  };

  const ROUTES = {
    inicio: {
      file: "index.html",
      title: "Waxi Stickers Lanús",
      mode: "catalog",
      eyebrow: "Catálogo",
      heading: "Catálogo de stickers",
      intro: "Buscá por categoría, abrí el producto y elegí la variante antes de agregar al carrito."
    },
    stickers: {
      file: "stickers.html",
      title: "Waxi Stickers Lanús",
      mode: "catalog",
      productType: "sticker",
      eyebrow: "Stickers",
      heading: "Catálogo de stickers",
      intro: "Todos los diseños disponibles para elegir tamaño, laminado y sumar al carrito."
    },
    personalizados: {
      file: "personalizados.html",
      title: "Waxi Stickers Lanús",
      mode: "info",
      category: "Personalizados",
      eyebrow: "Personalizados",
      heading: "Stickers personalizados, info y precios",
      intro: "Opciones para fotos, logos, packs de marca y pedidos especiales."
    },
    imanes: {
      file: "imanes.html",
      title: "Waxi Stickers Lanús",
      mode: "info",
      category: "Otros productos",
      subcategory: "Imanes",
      eyebrow: "Imanes",
      heading: "Imanes para regalos, heladeras y delivery",
      intro: "Formatos preparados para souvenirs, comercios y entregas con marca."
    },
    otros: {
      file: "otros.html",
      title: "Waxi Stickers Lanús",
      mode: "info",
      category: "Otros productos",
      eyebrow: "Extras",
      heading: "Extras para acompañar pedidos",
      intro: "Piezas simples para cerrar mejor cada entrega, regalo o venta por cantidad."
    },
    contacto: {
      file: "contacto.html",
      title: "Waxi Stickers Lanús",
      mode: "contact"
    }
  };

  const INFO_PAGE_CONTENT = {
    personalizados: {
      badge: "Personalizados",
      title: "Stickers personalizados",
      priceLabel: "Precio según diseño y cantidad",
      image: createArtwork("Tu diseño", "Personalizado", ["#ff3131", "#ff9f67", "#fff8f1", "#fdf180", "#a7edff"]),
      description: "Una opción pensada para transformar fotos, logos, dibujos o ideas puntuales en stickers listos para regalar, vender o sumar a un empaque.",
      details: [
        "Se revisa el archivo antes de producir para que el resultado salga prolijo.",
        "Podés consultar por tandas chicas, packs de marca o diseños para eventos.",
        "La imagen de esta sección se cambia manualmente desde el código cuando tengas la definitiva."
      ],
      message: "Hola, quiero consultar por stickers personalizados."
    },
    imanes: {
      badge: "Imanes",
      title: "Imanes personalizados",
      priceLabel: "Precio según tamaño y cantidad",
      image: createArtwork("Imanes", "Delivery y regalos", ["#5b0909", "#ff3131", "#fff5f2", "#a7edff", "#fdf180"]),
      description: "Imanes para heladeras, souvenirs, regalos y también para delivery de negocios que quieren dejar su marca en cada entrega.",
      details: [
        "Ideales para teléfonos, promos, recordatorios, combos y mensajes de marca.",
        "Sirven para emprendimientos gastronómicos, locales, eventos y regalos personalizados.",
        "La imagen final se puede reemplazar desde el código cuando definas el diseño."
      ],
      message: "Hola, quiero consultar por imanes personalizados."
    },
    otros: {
      badge: "Extras",
      title: "Extras para pedidos",
      priceLabel: "Precio a consultar",
      image: createArtwork("Extras", "Para entregar mejor", ["#1b1b1b", "#5b0909", "#fffaf4", "#ff3131", "#a7edff"]),
      description: "Complementos para que cada pedido se vea más completo: tarjetas, etiquetas, piezas para empaques, regalos y detalles para ventas por cantidad.",
      details: [
        "Pensado para negocios que quieren entregar con una estética más cuidada.",
        "Podés usarlo para agradecimientos, redes, instrucciones, promos o cierres de empaque.",
        "La imagen de esta ficha queda lista para cambiarla manualmente desde el código."
      ],
      message: "Hola, quiero consultar por extras para mis pedidos."
    }
  };

  function createArtwork(title, subtitle, palette) {
    const titleSafe = escapeSvg(title);
    const subtitleSafe = escapeSvg(subtitle);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${palette[0]}"/>
            <stop offset="100%" stop-color="${palette[1]}"/>
          </linearGradient>
        </defs>
        <rect width="640" height="640" rx="64" fill="${palette[2]}"/>
        <circle cx="132" cy="132" r="96" fill="${palette[3]}" opacity="0.95"/>
        <circle cx="516" cy="176" r="84" fill="${palette[4]}" opacity="0.75"/>
        <rect x="80" y="274" width="480" height="232" rx="42" fill="url(#g)"/>
        <rect x="112" y="308" width="416" height="10" rx="5" fill="rgba(255,255,255,0.58)"/>
        <circle cx="176" cy="422" r="56" fill="rgba(255,255,255,0.26)"/>
        <path d="M268 376c41-33 88-50 143-50 41 0 79 10 115 30v96c-35-19-74-28-116-28-61 0-107 16-142 49V376z" fill="rgba(255,255,255,0.24)"/>
        <text x="84" y="128" fill="#201f27" font-size="34" font-weight="700" font-family="Trebuchet MS, Segoe UI, sans-serif">${subtitleSafe}</text>
        <text x="84" y="564" fill="#ffffff" font-size="54" font-weight="800" font-family="Trebuchet MS, Segoe UI, sans-serif">${titleSafe}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  const SHEETS_SOURCE = {
    PRODUCTOS: [
      {
        id: "sticker-halo-dreams",
        nombre: "Sticker Halo Dreams",
        categoria: "Stickers",
        subcategoria: "Ilustrados",
        imagen1: createArtwork("Halo Dreams", "Calcomanía", ["#ff8466", "#ffb36f", "#fff6ef", "#ffe2bd", "#d1ecff"]),
        imagen2: createArtwork("Foto original", "Referencia", ["#2f3b52", "#6477a3", "#eff5ff", "#d5e1ff", "#f5d8ff"]),
        activo: true,
        orden: 1,
        destacado: true,
        tipoPrecio: "sticker",
        descripcion: "Pensado para cuadernos, packaging y pequeños detalles de marca con mucho color."
      },
      {
        id: "sticker-citrus-club",
        nombre: "Sticker Citrus Club",
        categoria: "Stickers",
        subcategoria: "Ilustrados",
        imagen1: createArtwork("Citrus Club", "Calcomanía", ["#ff8e60", "#ffd06e", "#fff8f0", "#ffe2aa", "#f1ffcd"]),
        imagen2: createArtwork("Arte base", "Original", ["#385447", "#5ca36b", "#eef9f1", "#d4f2da", "#fff1c9"]),
        activo: true,
        orden: 2,
        destacado: true,
        tipoPrecio: "sticker",
        descripcion: "Va muy bien en colecciones coloridas, regalos y packs que buscan verse más vivos."
      },
      {
        id: "sticker-pet-mood",
        nombre: "Sticker Pet Mood",
        categoria: "Stickers",
        subcategoria: "Mascotas",
        imagen1: createArtwork("Pet Mood", "Calcomanía", ["#7e84ff", "#7dc7ff", "#f2f5ff", "#d8e6ff", "#ffd7ea"]),
        imagen2: createArtwork("Foto de mascota", "Original", ["#222336", "#44598d", "#f0f4ff", "#d6e2ff", "#fff1db"]),
        activo: true,
        orden: 3,
        destacado: false,
        tipoPrecio: "sticker",
        descripcion: "Convierte fotos en recuerdos listos para regalar, vender o sumar a una edición especial."
      },
      {
        id: "sticker-retro-smile",
        nombre: "Sticker Retro Smile",
        categoria: "Stickers",
        subcategoria: "Clasicos",
        imagen1: createArtwork("Retro Smile", "Calcomanía", ["#f6678e", "#ff9f67", "#fff2f0", "#ffcfcb", "#fff2b8"]),
        imagen2: createArtwork("Diseño fuente", "Original", ["#252438", "#48435a", "#f5f4ff", "#ddd8ff", "#ffd7de"]),
        activo: true,
        orden: 4,
        destacado: false,
        tipoPrecio: "sticker",
        descripcion: "Una línea retro con buena presencia para tandas chicas, ferias y series temáticas."
      },
      {
        id: "custom-foto-pack",
        nombre: "Sticker personalizado con foto",
        categoria: "Personalizados",
        subcategoria: "Mascotas",
        imagen1: createArtwork("Tu foto", "Personalizado", ["#ff7d64", "#ffb067", "#fff6f2", "#ffd4c4", "#d9ecff"]),
        imagen2: createArtwork("Vista final", "Muestra", ["#21283e", "#4d5f8f", "#eef4ff", "#dae4ff", "#ffe8bf"]),
        activo: true,
        orden: 5,
        destacado: true,
        tipoPrecio: "sticker",
        descripcion: "Mandás tu foto o diseño y se adapta al formato para que salga listo dentro del pedido."
      },
      {
        id: "custom-brand-pack",
        nombre: "Mini kit de marca",
        categoria: "Personalizados",
        subcategoria: "Negocios",
        imagen1: createArtwork("Kit de marca", "Personalizado", ["#2f3f5d", "#6b82b8", "#f2f6ff", "#d8e2ff", "#ffd7cb"]),
        imagen2: createArtwork("Logo original", "Referencia", ["#404b57", "#68748a", "#f6f8fc", "#dce4f5", "#ecffd9"]),
        activo: true,
        orden: 6,
        destacado: false,
        tipoPrecio: "sticker",
        descripcion: "Pensado para logos, promociones y cierres de empaque que necesitan verse claros y prolijos."
      },
      {
        id: "iman-polaroid",
        nombre: "Imán Polaroid",
        categoria: "Otros productos",
        subcategoria: "Imanes",
        imagen1: createArtwork("Iman Polaroid", "Iman", ["#f37d75", "#ffb879", "#fff6f1", "#ffd8cb", "#dff0ff"]),
        imagen2: createArtwork("Foto adaptada", "Original", ["#2d3247", "#4f6389", "#f1f5ff", "#d9e3ff", "#fff0c9"]),
        activo: true,
        orden: 7,
        destacado: false,
        tipoPrecio: "fijo",
        descripcion: "Imán con estética Polaroid para heladeras, regalos, souvenirs y entregas de delivery con marca."
      },
      {
        id: "tarjeta-mini-thanks",
        nombre: "Tarjeta mini agradecimiento",
        categoria: "Otros productos",
        subcategoria: "Tarjetas",
        imagen1: createArtwork("Mini gracias", "Tarjeta", ["#ff7d7d", "#ffc579", "#fff8f1", "#ffe0c4", "#e1f2ff"]),
        imagen2: createArtwork("Frente y dorso", "Original", ["#213148", "#485f82", "#f0f6ff", "#d6e5ff", "#f7f0ff"]),
        activo: true,
        orden: 8,
        destacado: false,
        tipoPrecio: "fijo",
        descripcion: "Tarjeta chica para acompañar pedidos con agradecimiento, redes, descuentos o cuidados del producto."
      }
    ],
    PRECIOS: [
      { grupo: "sticker", item: "base", clave: "general", etiqueta: "Base", valor: 250, orden: 1 },
      { grupo: "sticker", item: "tamano", clave: "3x3", etiqueta: "Chico", detalle: "3 x 3 cm", valor: 0, orden: 1 },
      { grupo: "sticker", item: "tamano", clave: "5x5", etiqueta: "Mediano", detalle: "5 x 5 cm", valor: 900, orden: 2 },
      { grupo: "sticker", item: "tamano", clave: "7x7", etiqueta: "Grande", detalle: "7 x 7 cm", valor: 1800, orden: 3 },
      { grupo: "sticker", item: "laminado", clave: "no", etiqueta: "No Laminado", detalle: "Terminación estándar", valor: 0, orden: 1 },
      { grupo: "sticker", item: "laminado", clave: "si", etiqueta: "Laminado", detalle: "Protección extra", valor: 450, orden: 2 },
      { grupo: "sticker", item: "combo", clave: "3x3-no", etiqueta: "Chico sin laminado", detalle: "3 x 3 cm, no laminado", valor: 250, orden: 1 },
      { grupo: "sticker", item: "combo", clave: "3x3-si", etiqueta: "Chico laminado", detalle: "3 x 3 cm, laminado", valor: 700, orden: 2 },
      { grupo: "sticker", item: "combo", clave: "5x5-no", etiqueta: "Mediano sin laminado", detalle: "5 x 5 cm, no laminado", valor: 1150, orden: 3 },
      { grupo: "sticker", item: "combo", clave: "5x5-si", etiqueta: "Mediano laminado", detalle: "5 x 5 cm, laminado", valor: 1600, orden: 4 },
      { grupo: "sticker", item: "combo", clave: "7x7-no", etiqueta: "Grande sin laminado", detalle: "7 x 7 cm, no laminado", valor: 2050, orden: 5 },
      { grupo: "sticker", item: "combo", clave: "7x7-si", etiqueta: "Grande laminado", detalle: "7 x 7 cm, laminado", valor: 2500, orden: 6 },
      { grupo: "iman-polaroid", item: "base", clave: "unico", etiqueta: "Tamaño único", valor: 3600, orden: 1 },
      { grupo: "tarjeta-mini-thanks", item: "base", clave: "unico", etiqueta: "Paquete base", valor: 2100, orden: 1 },
      { grupo: "imanes", item: "base", clave: "unico", etiqueta: "Imanes", detalle: "Precio general de imanes", valor: 3600, orden: 10 },
      { grupo: "senaladores", item: "base", clave: "unico", etiqueta: "Señaladores", detalle: "Precio general de señaladores", valor: 0, orden: 11 },
      { grupo: "encendedores", item: "base", clave: "unico", etiqueta: "Encendedores", detalle: "Precio general de encendedores", valor: 0, orden: 12 },
      { grupo: "tarjetas", item: "base", clave: "unico", etiqueta: "Tarjetas", detalle: "Precio general de tarjetas", valor: 2100, orden: 13 },
      { grupo: "personalizados", item: "base", clave: "unico", etiqueta: "Personalizados", detalle: "Precio general de personalizados", valor: 0, orden: 14 },
      { grupo: "extras", item: "base", clave: "unico", etiqueta: "Extras", detalle: "Precio general de extras", valor: 0, orden: 15 }
    ],
    PROMOS: [
      {
        id: "promo-mediano-sin-laminar",
        titulo: "Promo mediano sin laminar",
        descripcion: "3 stickers medianos sin laminar",
        detalle: "Podés combinar diseños medianos no laminados y el total se ajusta solo en el carrito.",
        tipoProducto: "sticker",
        tamano: "5x5",
        laminado: "no",
        cantidad: 3,
        precio: 1000,
        activo: true,
        orden: 1
      }
    ],
    PEDIDOS: [],
    CONFIG: [
      { clave: "whatsappNumber", valor: "+54 1154865284" },
      { clave: "whatsappLabel", valor: "+54 11 5486-5284" },
      { clave: "instagramUser", valor: "@waxistickerslanus" },
      { clave: "instagramUrl", valor: "https://www.instagram.com/waxistickerslanus/" }
    ]
  };

  let sheetsSource = cloneSheetsSource(SHEETS_SOURCE);
  let priceIndex = buildPriceIndex(sheetsSource.PRECIOS);
  let products = buildActiveProducts(sheetsSource.PRODUCTOS);
  let promotions = buildActivePromotions(sheetsSource.PROMOS);

  ensurePageShell();

  const dom = {
    featuredProducts: document.getElementById("featuredProducts"),
    favoritesFilterButton: document.getElementById("favoritesFilterButton"),
    topbarFavoritesButton: document.getElementById("topbarFavoritesButton"),
    routeLinks: document.querySelectorAll("[data-route-link]"),
    routeButtons: document.querySelectorAll("[data-route-button]"),
    catalogSection: document.getElementById("catalogo"),
    catalogEyebrow: document.getElementById("catalogEyebrow"),
    catalogTitle: document.getElementById("catalogTitle"),
    catalogIntro: document.getElementById("catalogIntro"),
    categoryFilterBlock: document.getElementById("categoryFilterBlock"),
    categoryFilters: document.getElementById("categoryFilters"),
    subcategoryFilters: document.getElementById("subcategoryFilters"),
    stickerSearchBlock: document.getElementById("stickerSearchBlock"),
    stickerSearchInput: document.getElementById("stickerSearchInput"),
    catalogSortBlock: document.getElementById("catalogSortBlock"),
    catalogSortOptions: document.getElementById("catalogSortOptions"),
    promoStrip: document.getElementById("promoStrip"),
    catalogGrid: document.getElementById("catalogGrid"),
    infoSection: document.getElementById("infoSection"),
    infoEyebrow: document.getElementById("infoEyebrow"),
    infoTitle: document.getElementById("infoTitle"),
    infoIntro: document.getElementById("infoIntro"),
    infoGrid: document.getElementById("infoGrid"),
    trustStrip: document.getElementById("trustStrip"),
    contactSection: document.getElementById("contacto"),
    contactWhatsapp: document.getElementById("contactWhatsapp"),
    contactInstagram: document.getElementById("contactInstagram"),
    cartFab: document.getElementById("cartFab"),
    cartCount: document.getElementById("cartCount"),
    cartFabTotalLabel: document.getElementById("cartFabTotalLabel"),
    heroCartButton: document.getElementById("heroCartButton"),
    heroCartButtonSecondary: document.getElementById("heroCartButtonSecondary"),
    toast: document.getElementById("toast"),
    productOverlay: document.getElementById("productOverlay"),
    productMainImage: document.getElementById("productMainImage"),
    productThumbs: document.getElementById("productThumbs"),
    productBadges: document.getElementById("productBadges"),
    productTitle: document.getElementById("productTitle"),
    productDescription: document.getElementById("productDescription"),
    productDynamicPrice: document.getElementById("productDynamicPrice"),
    productPriceHint: document.getElementById("productPriceHint"),
    sizeSelectorGroup: document.getElementById("sizeSelectorGroup"),
    sizeSelectorHint: document.getElementById("sizeSelectorHint"),
    sizeSelectorOptions: document.getElementById("sizeSelectorOptions"),
    laminateSelectorGroup: document.getElementById("laminateSelectorGroup"),
    laminateSelectorOptions: document.getElementById("laminateSelectorOptions"),
    productFavoriteButton: document.getElementById("productFavoriteButton"),
    addToCartButton: document.getElementById("addToCartButton"),
    cartOverlay: document.getElementById("cartOverlay"),
    cartItems: document.getElementById("cartItems"),
    cartTotal: document.getElementById("cartTotal"),
    checkoutButton: document.getElementById("checkoutButton"),
    checkoutOverlay: document.getElementById("checkoutOverlay"),
    checkoutForm: document.getElementById("checkoutForm"),
    customerName: document.getElementById("customerName"),
    customerWhatsapp: document.getElementById("customerWhatsapp"),
    customerEmail: document.getElementById("customerEmail"),
    checkoutBackButton: document.getElementById("checkoutBackButton"),
    sendOrderButton: document.getElementById("sendOrderButton"),
    ticketOrderId: document.getElementById("ticketOrderId"),
    ticketDate: document.getElementById("ticketDate"),
    ticketItemsCount: document.getElementById("ticketItemsCount"),
    ticketItems: document.getElementById("ticketItems"),
    ticketTotal: document.getElementById("ticketTotal")
  };

  const initialRoute = getRouteFromHash();

  const state = {
    route: initialRoute,
    filters: {
      category: "",
      subcategory: "",
      searchTerm: "",
      sortOrder: "default",
      favoritesOnly: consumePendingFavoritesFilter(initialRoute)
    },
    favorites: new Set(loadJson(STORAGE_KEYS.favorites, [])),
    cart: loadJson(STORAGE_KEYS.cart, []),
    currentProductId: products[0] ? products[0].id : null,
    currentSelections: products[0] ? buildDefaultSelections(products[0]) : {},
    currentImageIndex: 0,
    checkoutPreviewId: peekNextOrderId(),
    visibleProductLimit: STORE_CONFIG.catalogPageSize,
    isCatalogLoading: hasSheetsEndpoint(),
    toastTimeoutId: null,
    sheetsLoaded: false,
    isSending: false
  };

  init();

  async function init() {
    hydrateCustomerDraft();
    bindEvents();
    renderContactLinks();
    renderCurrentView({ scroll: false });
    renderFeaturedProducts();
    updateCartUi();
    updateTicketSummary();
    await hydrateCatalogData();
    state.isCatalogLoading = false;
    resetVisibleProductLimit();
    syncCurrentProduct();
    renderCurrentView({ scroll: false });
    renderFeaturedProducts();
    updateProductPanel();
    updateCartUi();
    updateTicketSummary();
  }

  function bindEvents() {
    dom.routeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        navigateToRoute(button.dataset.routeButton || "inicio");
      });
    });

    window.addEventListener("hashchange", function () {
      renderCurrentView({ scroll: true });
    });

    dom.favoritesFilterButton.addEventListener("click", function () {
      toggleFavoritesView({ goToStickers: false });
    });

    if (dom.topbarFavoritesButton) {
      dom.topbarFavoritesButton.addEventListener("click", function () {
        toggleFavoritesView({ goToStickers: true });
      });
    }

    if (dom.stickerSearchInput) {
      dom.stickerSearchInput.addEventListener("input", function () {
        state.filters.searchTerm = dom.stickerSearchInput.value.trim();
        resetVisibleProductLimit();
        renderCatalog();
      });
    }

    if (dom.catalogGrid) {
      dom.catalogGrid.addEventListener("click", function (event) {
        const loadMoreButton = event.target.closest("[data-load-more-products]");
        if (!loadMoreButton) {
          return;
        }

        state.visibleProductLimit += STORE_CONFIG.catalogPageSize;
        renderCatalog();
      });
    }

    dom.cartFab.addEventListener("click", function () {
      openOverlay("cartOverlay");
    });

    dom.heroCartButton.addEventListener("click", function () {
      openOverlay("cartOverlay");
    });

    if (dom.heroCartButtonSecondary) {
      dom.heroCartButtonSecondary.addEventListener("click", function () {
        openOverlay("cartOverlay");
      });
    }

    dom.checkoutButton.addEventListener("click", function () {
      if (!state.cart.length) {
        showToast("Tu carrito está vacío.");
        return;
      }
      state.checkoutPreviewId = peekNextOrderId();
      updateTicketSummary();
      closeOverlay("cartOverlay");
      openOverlay("checkoutOverlay");
    });

    dom.checkoutBackButton.addEventListener("click", function () {
      closeOverlay("checkoutOverlay");
      openOverlay("cartOverlay");
    });

    dom.checkoutForm.addEventListener("submit", handleCheckoutSubmit);

    [dom.customerName, dom.customerWhatsapp, dom.customerEmail].forEach(function (input) {
      input.addEventListener("input", function () {
        input.classList.remove("is-invalid");
        persistCustomerDraft();
      });
    });

    dom.productFavoriteButton.addEventListener("click", function () {
      if (!state.currentProductId) {
        return;
      }
      toggleFavorite(state.currentProductId);
    });

    dom.addToCartButton.addEventListener("click", function () {
      const product = getProductById(state.currentProductId);
      if (!product) {
        return;
      }
      addCurrentProductToCart(product);
    });

    document.querySelectorAll("[data-close-overlay]").forEach(function (button) {
      button.addEventListener("click", function () {
        closeOverlay(button.dataset.closeOverlay);
      });
    });

    [dom.productOverlay, dom.cartOverlay, dom.checkoutOverlay].forEach(function (overlay) {
      overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
          closeOverlay(overlay.id);
        }
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if (dom.checkoutOverlay.classList.contains("is-open")) {
          closeOverlay("checkoutOverlay");
          return;
        }
        if (dom.productOverlay.classList.contains("is-open")) {
          closeOverlay("productOverlay");
          return;
        }
        if (dom.cartOverlay.classList.contains("is-open")) {
          closeOverlay("cartOverlay");
        }
      }
    });
  }

  function renderCurrentView(options) {
    const routeName = getRouteFromHash();
    const route = ROUTES[routeName] || ROUTES.inicio;
    const shouldScroll = options && options.scroll;
    const routeChanged = state.route !== routeName;

    state.route = routeName;
    if (routeChanged) {
      state.filters.category = "";
      state.filters.subcategory = "";
      state.filters.searchTerm = "";
      state.filters.sortOrder = "default";
      resetVisibleProductLimit();
    }

    document.title = route.title || ROUTES.inicio.title;
    updateActiveNavigation(routeName);
    updateSectionHead(route);

    dom.catalogSection.classList.toggle("is-hidden", route.mode !== "catalog");
    dom.infoSection.classList.toggle("is-hidden", route.mode !== "info");
    dom.trustStrip.classList.toggle("is-hidden", route.mode === "contact");
    document.body.classList.toggle("contact-page", route.mode === "contact");

    if (route.mode === "catalog") {
      renderFilters();
      renderPromoStrip(route);
      renderCatalog();
    } else {
      renderPromoStrip(null);
    }

    if (route.mode === "info") {
      renderInfoPage(route);
    }

    if (shouldScroll) {
      scrollToRoute(routeName);
    }
  }

  function updateSectionHead(route) {
    if (dom.catalogEyebrow) {
      dom.catalogEyebrow.textContent = route.eyebrow || "Catálogo";
    }
    if (dom.catalogTitle) {
      dom.catalogTitle.textContent = route.heading || ROUTES.inicio.heading;
    }
    if (dom.catalogIntro) {
      dom.catalogIntro.textContent = route.intro || ROUTES.inicio.intro;
    }
  }

  function renderInfoPage(route) {
    const infoContent = INFO_PAGE_CONTENT[state.route];

    dom.infoEyebrow.textContent = route.eyebrow || (infoContent && infoContent.badge) || "Productos";
    dom.infoTitle.textContent = route.heading || (infoContent && infoContent.title) || "Opciones, precios y formatos";
    dom.infoIntro.textContent = route.intro || "Consultá la opción disponible y coordinamos el pedido por WhatsApp.";

    if (infoContent) {
      dom.infoGrid.setAttribute("aria-busy", "false");
      dom.infoGrid.innerHTML = renderStaticInfoCard(infoContent);
      return;
    }

    const infoProducts = getProductsForRoute(route);

    if (state.isCatalogLoading) {
      dom.infoGrid.setAttribute("aria-busy", "true");
      dom.infoGrid.innerHTML = renderCatalogLoadingState("Cargando el catálogo...", "");
      return;
    }

    dom.infoGrid.setAttribute("aria-busy", "false");

    if (!infoProducts.length) {
      dom.infoGrid.innerHTML = `
        <article class="empty-state">
          <span class="empty-state__badge">Sin productos</span>
          <div>
            <h3>Todavía no hay productos cargados en esta sección.</h3>
            <p>Cuando agregues productos van a aparecer acá automáticamente.</p>
          </div>
        </article>
      `;
      return;
    }

    dom.infoGrid.innerHTML = infoProducts.map(function (product) {
      return `
        <article class="info-card">
          <img src="${product.imagen1}" alt="${product.nombre}" loading="lazy" decoding="async">
          <div class="info-card__body">
            <div class="product-badges">
              <span class="product-badge">${product.categoria}</span>
              <span class="product-badge">${product.subcategoria}</span>
            </div>
            <h3>${product.nombre}</h3>
            <p>${product.descripcion || "Producto disponible para consultar por WhatsApp."}</p>
            <div class="info-card__footer">
              <strong>${getStartingPriceLabel(product)}</strong>
              <button class="product-card__view" type="button" data-open-product="${product.id}">
                Ver opciones
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    dom.infoGrid.querySelectorAll("[data-open-product]").forEach(function (button) {
      button.addEventListener("click", function () {
        openProduct(button.dataset.openProduct || "");
      });
    });
  }

  function renderStaticInfoCard(content) {
    const details = content.details.map(function (detail) {
      return "<li>" + detail + "</li>";
    }).join("");

    return `
      <article class="info-card info-card--single">
        <img src="${content.image}" alt="${content.title}" loading="lazy" decoding="async">
        <div class="info-card__body">
          <div class="product-badges">
            <span class="product-badge">${content.badge}</span>
          </div>
          <h3>${content.title}</h3>
          <p>${content.description}</p>
          <ul class="info-card__list">
            ${details}
          </ul>
          <div class="info-card__footer">
            <strong>${content.priceLabel}</strong>
            <a class="product-card__view" href="${buildSimpleWhatsAppUrl(content.message)}" target="_blank" rel="noreferrer">
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function renderFeaturedProducts() {
    let featured = products.filter(function (product) {
      return product.ventas > 0;
    }).sort(function (a, b) {
      if (a.ventas !== b.ventas) {
        return b.ventas - a.ventas;
      }
      return sortProducts(a, b);
    }).slice(0, 3);

    if (!featured.length) {
      featured = products.filter(function (product) {
        return product.destacado;
      }).slice(0, 3);
    }

    if (!featured.length) {
      featured = products.slice(0, 3);
    }

    dom.featuredProducts.innerHTML = featured.map(function (product) {
      return `
        <button class="hero-product" type="button" data-open-product="${product.id}">
          <img src="${product.imagen1}" alt="${product.nombre}" loading="lazy" decoding="async">
          <span>
            <strong>${product.nombre}</strong>
            <span>${product.subcategoria} | ${getStartingPriceLabel(product)}</span>
          </span>
        </button>
      `;
    }).join("");

    dom.featuredProducts.querySelectorAll("[data-open-product]").forEach(function (button) {
      button.addEventListener("click", function () {
        openProduct(button.dataset.openProduct || "");
      });
    });
  }

  function renderPromoStrip(route) {
    if (!dom.promoStrip) {
      return;
    }

    const activePromos = getPromotionsForRoute(route);
    dom.promoStrip.classList.toggle("is-hidden", !activePromos.length);

    if (!activePromos.length) {
      dom.promoStrip.innerHTML = "";
      return;
    }

    dom.promoStrip.innerHTML = activePromos.map(function (promo) {
      return `
        <article class="promo-card">
          <span class="promo-card__eyebrow">Promo activa</span>
          <div>
            <strong>${promo.descripcion || promo.titulo}</strong>
            <p>${promo.detalle || buildPromotionDetail(promo)}</p>
          </div>
          <span class="promo-card__price">${formatCurrency(promo.precio)}</span>
        </article>
      `;
    }).join("");
  }

  function getPromotionsForRoute(route) {
    if (!route || !shouldShowStickerTools(route)) {
      return [];
    }

    return promotions.filter(function (promo) {
      return productTypeMatches(promo.tipoProducto, "sticker");
    });
  }

  function buildPromotionDetail(promo) {
    const quantity = promo.cantidad || 1;
    const sizeLabel = promo.tamano === "5x5" ? "medianos" : "de la promo";
    const laminateLabel = promo.laminado === "no" ? "sin laminar" : "laminados";
    return quantity + " stickers " + sizeLabel + " " + laminateLabel + " por " + formatCurrency(promo.precio) + ".";
  }

  function itemMatchesPromotion(item, promo) {
    if (!productTypeMatches(promo.tipoProducto, "sticker")) {
      return false;
    }

    const sizeMatch = !promo.tamano || item.tamano === promo.tamano;
    const laminateMatch = !promo.laminado || item.laminado === promo.laminado;
    return sizeMatch && laminateMatch;
  }

  function renderFilters() {
    const route = getCurrentRoute();
    const categoryLocked = Boolean(route.category);
    const filterProducts = getProductsForRoute(route);
    const categories = uniqueValues(filterProducts.map(function (product) {
      return product.categoria;
    }));
    const showStickerTools = shouldShowStickerTools(route);

    dom.categoryFilterBlock.hidden = categoryLocked;
    dom.categoryFilterBlock.classList.toggle("is-hidden", categoryLocked);
    dom.categoryFilterBlock.setAttribute("aria-hidden", String(categoryLocked));

    if (dom.stickerSearchBlock && dom.stickerSearchInput) {
      dom.stickerSearchBlock.hidden = !showStickerTools;
      dom.stickerSearchBlock.classList.toggle("is-hidden", !showStickerTools);
      dom.stickerSearchInput.value = showStickerTools ? state.filters.searchTerm : "";
    }

    if (dom.catalogSortBlock && dom.catalogSortOptions) {
      dom.catalogSortBlock.hidden = !showStickerTools;
      dom.catalogSortBlock.classList.toggle("is-hidden", !showStickerTools);
      dom.catalogSortOptions.innerHTML = showStickerTools ? [
        renderSortButton("Orden del catálogo", "default", state.filters.sortOrder === "default"),
        renderSortButton("A-Z", "az", state.filters.sortOrder === "az"),
        renderSortButton("Z-A", "za", state.filters.sortOrder === "za")
      ].join("") : "";
    }

    if (categoryLocked) {
      state.filters.category = route.category;
      dom.categoryFilters.innerHTML = "";
    } else {
      dom.categoryFilters.innerHTML = [
        renderFilterButton("Todas", "", state.filters.category === ""),
        categories.map(function (category) {
          return renderFilterButton(category, category, state.filters.category === category);
        }).join("")
      ].join("");
    }

    const subcategories = getAvailableSubcategories(categoryLocked ? route.category : state.filters.category, route);
    const lockedSubcategory = route.subcategory || "";

    if (lockedSubcategory) {
      state.filters.subcategory = lockedSubcategory;
    } else if (state.filters.subcategory && subcategories.indexOf(state.filters.subcategory) === -1) {
      state.filters.subcategory = "";
    }

    dom.subcategoryFilters.innerHTML = [
      lockedSubcategory ? "" : renderSubcategoryButton("Todas", "", state.filters.subcategory === ""),
      subcategories.map(function (subcategory) {
        return renderSubcategoryButton(subcategory, subcategory, state.filters.subcategory === subcategory);
      }).join("")
    ].join("");

    dom.favoritesFilterButton.setAttribute("aria-pressed", String(state.filters.favoritesOnly));
    dom.favoritesFilterButton.textContent = state.filters.favoritesOnly ? "Viendo guardados" : "Ver guardados";
    updateTopbarFavoritesButton();

    dom.categoryFilters.querySelectorAll("[data-category-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        setCategoryFilter(button.dataset.categoryFilter || "");
      });
    });

    dom.subcategoryFilters.querySelectorAll("[data-subcategory-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.filters.subcategory = button.dataset.subcategoryFilter || "";
        resetVisibleProductLimit();
        renderCurrentView({ scroll: false });
      });
    });

    if (dom.catalogSortOptions) {
      dom.catalogSortOptions.querySelectorAll("[data-sort-products]").forEach(function (button) {
        button.addEventListener("click", function () {
          state.filters.sortOrder = button.dataset.sortProducts || "default";
          resetVisibleProductLimit();
          renderCurrentView({ scroll: false });
        });
      });
    }
  }

  function toggleFavoritesView(options) {
    const shouldGoToStickers = options && options.goToStickers;
    state.filters.favoritesOnly = !state.filters.favoritesOnly;
    resetVisibleProductLimit();

    if (shouldGoToStickers && state.route !== "stickers") {
      rememberPendingFavoritesFilter(state.filters.favoritesOnly);
      window.location.href = ROUTES.stickers.file;
      return;
    }

    renderCurrentView({ scroll: false });
    if (state.filters.favoritesOnly) {
      showToast("Mostrando tus favoritos.");
    }
  }

  function updateTopbarFavoritesButton() {
    if (!dom.topbarFavoritesButton) {
      return;
    }

    dom.topbarFavoritesButton.setAttribute("aria-pressed", String(state.filters.favoritesOnly));
    dom.topbarFavoritesButton.textContent = "Guardados";
    dom.topbarFavoritesButton.classList.toggle("is-active", state.filters.favoritesOnly);
  }

  function renderCatalog() {
    const route = getCurrentRoute();
    dom.catalogGrid.setAttribute("aria-busy", String(state.isCatalogLoading));

    if (state.isCatalogLoading) {
      dom.catalogGrid.innerHTML = renderCatalogLoadingState("Cargando el catálogo...", "");
      return;
    }

    const visibleProducts = getVisibleProducts();

    if (!visibleProducts.length) {
      dom.catalogGrid.innerHTML = `
        <article class="empty-state">
          <span class="empty-state__badge">Sin resultados</span>
          <div>
            <h3>No encontramos productos para esa combinación.</h3>
            <p>Probá cambiando categoría, subcategoría o desactivando favoritos.</p>
          </div>
        </article>
      `;
      return;
    }

    const productsToRender = visibleProducts.slice(0, state.visibleProductLimit);

    dom.catalogGrid.innerHTML = productsToRender.map(renderProductCard).join("") +
      renderCatalogProgress(productsToRender.length, visibleProducts.length);

    bindCatalogCardEvents();
  }

  function renderProductCard(product) {
    const isFavorite = state.favorites.has(product.id);
    const priceLabel = getStartingPriceLabel(product);
    const showDescription = shouldShowProductDescription(product);
    const highlightLabel = getProductHighlightLabel(product);

    return `
      <article class="product-card">
        <div class="product-card__media">
          <img class="product-card__image" src="${product.imagen1}" alt="${product.nombre}" loading="lazy" decoding="async">
          <img class="product-card__thumbnail" src="${product.imagen2}" alt="Imagen original de ${product.nombre}" loading="lazy" decoding="async">
          <button
            class="product-card__favorite ${isFavorite ? "is-active" : ""}"
            type="button"
            data-favorite-product="${product.id}"
            aria-pressed="${isFavorite}"
          >
            ${isFavorite ? "Favorito" : "Guardar"}
          </button>
        </div>

        <div class="product-card__body">
          <div class="product-badges">
            <span class="product-badge">${product.categoria}</span>
            <span class="product-badge">${product.subcategoria}</span>
            ${highlightLabel ? '<span class="product-badge product-badge--featured">' + highlightLabel + '</span>' : ""}
          </div>

          <div>
            <h3>${product.nombre}</h3>
            ${showDescription ? "<p>" + product.descripcion + "</p>" : ""}
          </div>

          <div class="product-card__footer">
            <div class="product-card__price">
              <span>Precio desde</span>
              <strong>${priceLabel}</strong>
            </div>
            <button class="product-card__view" type="button" data-open-product="${product.id}">
              Ver producto
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function bindCatalogCardEvents() {
    dom.catalogGrid.querySelectorAll("[data-open-product]").forEach(function (button) {
      button.addEventListener("click", function () {
        openProduct(button.dataset.openProduct || "");
      });
    });

    dom.catalogGrid.querySelectorAll("[data-favorite-product]").forEach(function (button) {
      button.addEventListener("click", function () {
        const productId = button.dataset.favoriteProduct || "";
        toggleFavorite(productId);
      });
    });

  }

  function renderCatalogProgress(visibleCount, totalCount) {
    if (totalCount <= STORE_CONFIG.catalogPageSize && visibleCount >= totalCount) {
      return "";
    }

    const hasMoreProducts = visibleCount < totalCount;
    return `
      <article class="catalog-progress">
        <span>Mostrando ${visibleCount} de ${totalCount} productos</span>
        ${hasMoreProducts ? '<button class="secondary-button" type="button" data-load-more-products>Cargar más</button>' : '<strong>Ya estás viendo todo el catálogo.</strong>'}
      </article>
    `;
  }

  function renderCatalogLoadingState(title, message) {
    return `
      <article class="catalog-loading" role="status">
        <div class="catalog-loading__spinner" aria-hidden="true"></div>
        <div>
          ${title ? "<h3>" + title + "</h3>" : ""}
          ${message ? "<p>" + message + "</p>" : ""}
        </div>
        <div class="catalog-loading__skeletons" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </article>
    `;
  }

  function resetVisibleProductLimit() {
    state.visibleProductLimit = STORE_CONFIG.catalogPageSize;
  }

  function openProduct(productId) {
    const product = getProductById(productId);
    if (!product) {
      return;
    }

    state.currentProductId = product.id;
    state.currentImageIndex = 0;
    state.currentSelections = buildDefaultSelections(product);
    updateProductPanel();
    openOverlay("productOverlay");
  }

  function updateProductPanel() {
    const product = getProductById(state.currentProductId);
    if (!product) {
      return;
    }

    if (!state.currentSelections.tamano || !state.currentSelections.laminado) {
      state.currentSelections = buildDefaultSelections(product);
    }

    const galleryImages = [
      { src: product.imagen1, label: "Producto" },
      { src: product.imagen2, label: "Original" }
    ];

    dom.productMainImage.src = galleryImages[state.currentImageIndex].src;
    dom.productMainImage.alt = galleryImages[state.currentImageIndex].label + " de " + product.nombre;

    dom.productThumbs.innerHTML = galleryImages.map(function (image, index) {
      return `
        <button
          class="gallery-thumb ${index === state.currentImageIndex ? "is-active" : ""}"
          type="button"
          data-gallery-index="${index}"
        >
          <img src="${image.src}" alt="${image.label} de ${product.nombre}" loading="lazy" decoding="async">
        </button>
      `;
    }).join("");

    dom.productThumbs.querySelectorAll("[data-gallery-index]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.currentImageIndex = Number(button.dataset.galleryIndex || 0);
        updateProductPanel();
      });
    });

    dom.productBadges.innerHTML = `
      <span class="product-badge">${product.categoria}</span>
      <span class="product-badge">${product.subcategoria}</span>
      ${getProductHighlightLabel(product) ? '<span class="product-badge product-badge--featured">' + getProductHighlightLabel(product) + '</span>' : ""}
    `;
    dom.productTitle.textContent = product.nombre;
    if (shouldShowProductDescription(product)) {
      dom.productDescription.hidden = false;
      dom.productDescription.textContent = product.descripcion;
    } else {
      dom.productDescription.hidden = true;
      dom.productDescription.textContent = "";
    }

    const favoriteText = state.favorites.has(product.id) ? "Favorito guardado" : "Guardar favorito";
    dom.productFavoriteButton.textContent = favoriteText;
    dom.productFavoriteButton.classList.toggle("is-active", state.favorites.has(product.id));
    dom.productFavoriteButton.setAttribute("aria-pressed", String(state.favorites.has(product.id)));

    const priceMeta = getProductPricingMeta(product);
    const shouldShowSelectors = product.tipoPrecio === "sticker";

    dom.sizeSelectorGroup.classList.toggle("is-hidden", !shouldShowSelectors);
    dom.laminateSelectorGroup.classList.toggle("is-hidden", !shouldShowSelectors);

    if (shouldShowSelectors) {
      dom.sizeSelectorOptions.innerHTML = priceMeta.sizeOptions.map(function (option) {
        const active = state.currentSelections.tamano === option.key;
        return `
          <button
            class="selector-pill ${active ? "is-active" : ""}"
            type="button"
            data-size-option="${option.key}"
          >
            ${option.label}
            <small>${option.detail || "Medida disponible"}</small>
          </button>
        `;
      }).join("");

      dom.laminateSelectorOptions.innerHTML = priceMeta.laminateOptions.map(function (option) {
        const active = state.currentSelections.laminado === option.key;
        return `
          <button
            class="selector-pill ${active ? "is-active" : ""}"
            type="button"
            data-laminate-option="${option.key}"
          >
            ${option.label}
            <small>${option.detail || "Terminacion disponible"}</small>
          </button>
        `;
      }).join("");

      dom.sizeSelectorHint.textContent = "Tamaño elegido: " + calculateProductPrice(product, state.currentSelections).tamanoLabel;

      dom.sizeSelectorOptions.querySelectorAll("[data-size-option]").forEach(function (button) {
        button.addEventListener("click", function () {
          state.currentSelections.tamano = button.dataset.sizeOption || "";
          updateProductPanel();
        });
      });

      dom.laminateSelectorOptions.querySelectorAll("[data-laminate-option]").forEach(function (button) {
        button.addEventListener("click", function () {
          state.currentSelections.laminado = button.dataset.laminateOption || "";
          updateProductPanel();
        });
      });
    } else {
      dom.sizeSelectorOptions.innerHTML = "";
      dom.laminateSelectorOptions.innerHTML = "";
    }

    const calculated = calculateProductPrice(product, state.currentSelections);
    dom.productDynamicPrice.textContent = formatCurrency(calculated.unitPrice);
    dom.productPriceHint.textContent = product.tipoPrecio === "sticker"
      ? "Combinación actual: " + calculated.tamanoLabel + " | " + calculated.laminadoLabel
      : getStartingPriceLabel(product);
  }

  function updateCartUi() {
    saveJson(STORAGE_KEYS.cart, state.cart);

    const totalItems = state.cart.reduce(function (sum, item) {
      return sum + item.cantidad;
    }, 0);

    const cartSummary = calculateCartSummary(state.cart);

    dom.cartCount.textContent = String(totalItems);
    dom.cartFabTotalLabel.textContent = totalItems === 1 ? "1 producto" : totalItems + " productos";
    dom.cartTotal.textContent = formatCurrency(cartSummary.total);
    dom.checkoutButton.disabled = state.cart.length === 0;

    if (!state.cart.length) {
      dom.cartItems.innerHTML = `
        <article class="empty-state">
          <span class="empty-state__badge">Carrito vacío</span>
          <div>
            <h3>Todavía no agregaste productos.</h3>
            <p>Elegí un diseño, revisá las variantes y armá tu pedido paso a paso.</p>
          </div>
        </article>
      `;
    } else {
      dom.cartItems.innerHTML = state.cart.map(function (item) {
        return `
          <article class="cart-line">
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="cart-line__meta">
              <strong>${item.nombre}</strong>
              <span>${item.tamanoLabel} | ${item.laminadoLabel}</span>
              <span>${formatCurrency(item.precio)} por unidad</span>
            </div>
            <div class="cart-line__footer">
              <div class="cart-line__controls">
                <button class="quantity-button" type="button" data-cart-action="decrease" data-cart-key="${item.key}" aria-label="Quitar una unidad">-</button>
                <span class="quantity-value">${item.cantidad}</span>
                <button class="quantity-button" type="button" data-cart-action="increase" data-cart-key="${item.key}" aria-label="Agregar una unidad">+</button>
              </div>
              <div class="cart-line__meta">
                <strong>${formatCurrency(item.precio * item.cantidad)}</strong>
              </div>
              <button class="remove-button" type="button" data-cart-action="remove" data-cart-key="${item.key}" aria-label="Eliminar producto">
                x
              </button>
            </div>
          </article>
        `;
      }).join("") + renderPromotionLines(cartSummary.promos, "cart");
    }

    dom.cartItems.querySelectorAll("[data-cart-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        updateCartItem(button.dataset.cartKey || "", button.dataset.cartAction || "");
      });
    });

    updateTicketSummary();
  }

  function updateTicketSummary() {
    const totalItems = state.cart.reduce(function (sum, item) {
      return sum + item.cantidad;
    }, 0);
    const cartSummary = calculateCartSummary(state.cart);

    dom.ticketOrderId.textContent = state.checkoutPreviewId;
    dom.ticketDate.textContent = new Date().toLocaleDateString(STORE_CONFIG.locale, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    dom.ticketItemsCount.textContent = totalItems === 1 ? "1 producto" : totalItems + " productos";
    dom.ticketTotal.textContent = formatCurrency(cartSummary.total);

    if (!state.cart.length) {
      dom.ticketItems.innerHTML = `
        <article class="ticket-line">
          <strong>Sin productos</strong>
          <small>Agrega productos al carrito para preparar el comprobante.</small>
        </article>
      `;
      return;
    }

    dom.ticketItems.innerHTML = state.cart.map(function (item) {
      return `
        <article class="ticket-line">
          <strong>${item.nombre}</strong>
          <small>${item.tamanoLabel} | ${item.laminadoLabel}</small>
          <small>${item.cantidad} x ${formatCurrency(item.precio)} = ${formatCurrency(item.cantidad * item.precio)}</small>
        </article>
      `;
    }).join("") + renderPromotionLines(cartSummary.promos, "ticket");
  }

  function calculateCartSummary(cartItems) {
    const subtotal = cartItems.reduce(function (sum, item) {
      return sum + item.precio * item.cantidad;
    }, 0);
    const promos = calculateAppliedPromotions(cartItems);
    const discount = promos.reduce(function (sum, promo) {
      return sum + promo.discount;
    }, 0);

    return {
      subtotal: subtotal,
      promos: promos,
      discount: discount,
      total: Math.max(0, subtotal - discount)
    };
  }

  function calculateAppliedPromotions(cartItems) {
    return promotions.map(function (promo) {
      const matchingItems = cartItems.filter(function (item) {
        return itemMatchesPromotion(item, promo);
      });
      const eligibleQuantity = matchingItems.reduce(function (sum, item) {
        return sum + item.cantidad;
      }, 0);
      const promoSets = Math.floor(eligibleQuantity / promo.cantidad);
      const regularUnitPrice = matchingItems[0] ? matchingItems[0].precio : 0;
      const regularTotal = regularUnitPrice * promo.cantidad * promoSets;
      const promoTotal = promo.precio * promoSets;
      const discount = Math.max(0, regularTotal - promoTotal);

      if (!promoSets || !discount) {
        return null;
      }

      return {
        id: promo.id,
        title: promo.titulo,
        description: promo.descripcion || buildPromotionDetail(promo),
        sets: promoSets,
        discount: discount,
        promoTotal: promoTotal
      };
    }).filter(Boolean);
  }

  function renderPromotionLines(appliedPromos, variant) {
    if (!appliedPromos.length) {
      return "";
    }

    return appliedPromos.map(function (promo) {
      if (variant === "ticket") {
        return `
          <article class="ticket-line ticket-line--promo">
            <strong>${promo.description}</strong>
            <small>Promo aplicada${promo.sets > 1 ? " x " + promo.sets : ""}: -${formatCurrency(promo.discount)}</small>
          </article>
        `;
      }

      return `
        <article class="cart-line cart-line--promo">
          <div class="cart-line__promo-icon" aria-hidden="true">%</div>
          <div class="cart-line__meta">
            <strong>${promo.description}</strong>
            <span>Promo aplicada${promo.sets > 1 ? " x " + promo.sets : ""}</span>
          </div>
          <div class="cart-line__meta">
            <strong>-${formatCurrency(promo.discount)}</strong>
          </div>
        </article>
      `;
    }).join("");
  }

  function addCurrentProductToCart(product) {
    const pricing = calculateProductPrice(product, state.currentSelections);
    const key = buildCartKey(product.id, pricing.tamanoKey, pricing.laminadoKey);
    const existingItem = state.cart.find(function (item) {
      return item.key === key;
    });

    if (existingItem) {
      existingItem.cantidad += 1;
    } else {
      state.cart.push({
        key: key,
        productoId: product.id,
        nombre: product.nombre,
        categoria: product.categoria,
        subcategoria: product.subcategoria,
        imagen: product.imagen1,
        tamano: pricing.tamanoKey,
        tamanoLabel: pricing.tamanoLabel,
        laminado: pricing.laminadoKey,
        laminadoLabel: pricing.laminadoLabel,
        precio: pricing.unitPrice,
        cantidad: 1
      });
    }

    updateCartUi();
    closeOverlay("productOverlay");
    bumpCartFab();
    showToast("Producto agregado al carrito.");
  }

  function updateCartItem(itemKey, action) {
    const item = state.cart.find(function (entry) {
      return entry.key === itemKey;
    });

    if (!item) {
      return;
    }

    if (action === "increase") {
      item.cantidad += 1;
    }

    if (action === "decrease") {
      item.cantidad -= 1;
    }

    if (action === "remove" || item.cantidad <= 0) {
      state.cart = state.cart.filter(function (entry) {
        return entry.key !== itemKey;
      });
    }

    updateCartUi();
  }

  function toggleFavorite(productId) {
    if (!productId) {
      return;
    }

    if (state.favorites.has(productId)) {
      state.favorites.delete(productId);
      showToast("Favorito eliminado.");
    } else {
      state.favorites.add(productId);
      showToast("Producto guardado en favoritos.");
    }

    saveJson(STORAGE_KEYS.favorites, Array.from(state.favorites));
    renderCurrentView({ scroll: false });
    updateProductPanel();
  }

  async function handleCheckoutSubmit(event) {
    event.preventDefault();

    if (state.isSending) {
      return;
    }

    if (!state.cart.length) {
      showToast("Agrega productos antes de enviar.");
      closeOverlay("checkoutOverlay");
      return;
    }

    const customer = {
      nombre: dom.customerName.value.trim(),
      whatsapp: dom.customerWhatsapp.value.trim(),
      email: dom.customerEmail.value.trim()
    };

    if (!validateCustomer(customer)) {
      return;
    }

    state.isSending = true;
    dom.sendOrderButton.disabled = true;
    dom.sendOrderButton.textContent = "Preparando pedido...";

    const orderId = reserveNextOrderId();
    const order = buildOrder(orderId, customer);
    const whatsappUrl = buildWhatsAppUrl(order);
    const popup = window.open("about:blank", "_blank");

    try {
      await sendOrderToGoogleSheets(order);

      if (popup) {
        popup.location = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }

      saveJson(STORAGE_KEYS.customer, customer);
      state.cart = [];
      state.checkoutPreviewId = peekNextOrderId();
      updateCartUi();
      closeOverlay("checkoutOverlay");
      showToast("Pedido listo. Se abrió WhatsApp con el mensaje.");
    } catch (error) {
      if (popup) {
        popup.close();
      }
      rollbackOrderCounter();
      state.checkoutPreviewId = peekNextOrderId();
      showToast(error.message || "No pudimos enviar el pedido.");
    } finally {
      state.isSending = false;
      dom.sendOrderButton.disabled = false;
      dom.sendOrderButton.innerHTML = renderWhatsAppButtonLabel();
      updateTicketSummary();
    }
  }

  function validateCustomer(customer) {
    let valid = true;

    if (!customer.nombre) {
      valid = false;
      dom.customerName.classList.add("is-invalid");
    }

    if (!/\d{8,}/.test(customer.whatsapp.replace(/\s+/g, ""))) {
      valid = false;
      dom.customerWhatsapp.classList.add("is-invalid");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      valid = false;
      dom.customerEmail.classList.add("is-invalid");
    }

    if (!valid) {
      showToast("Completa nombre, WhatsApp y email para continuar.");
    }

    return valid;
  }

  function buildOrder(orderId, customer) {
    const now = new Date();
    const cartSummary = calculateCartSummary(state.cart);
    const items = state.cart.map(function (item) {
      return {
        productoId: item.productoId,
        nombre: item.nombre,
        categoria: item.categoria,
        subcategoria: item.subcategoria,
        tamano: item.tamanoLabel,
        laminado: item.laminadoLabel,
        precioUnitario: item.precio,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad
      };
    });

    return {
      id: orderId,
      fechaIso: now.toISOString(),
      fechaLegible: now.toLocaleString(STORE_CONFIG.locale, {
        dateStyle: "medium",
        timeStyle: "short"
      }),
      cliente: customer,
      productos: items,
      subtotal: cartSummary.subtotal,
      promos: cartSummary.promos,
      descuento: cartSummary.discount,
      total: cartSummary.total
    };
  }

  function buildWhatsAppUrl(order) {
    const lines = [
      "Pedido " + order.id,
      "",
      "Cliente: " + order.cliente.nombre,
      "WhatsApp: " + order.cliente.whatsapp,
      "Email: " + order.cliente.email,
      "",
      "Productos:",
      ""
    ];

    order.productos.forEach(function (item) {
      lines.push(
        item.nombre + " (" + item.tamano + " - " + item.laminado + ") x " + item.cantidad + " -> " + formatCurrency(item.subtotal)
      );
    });

    if (order.promos.length) {
      lines.push("");
      lines.push("Promos:");
      order.promos.forEach(function (promo) {
        lines.push(promo.description + " -> -" + formatCurrency(promo.discount));
      });
      lines.push("");
      lines.push("Subtotal: " + formatCurrency(order.subtotal));
    }

    lines.push("");
    lines.push("Total: " + formatCurrency(order.total));

    return "https://wa.me/" + STORE_CONFIG.whatsappNumber.replace(/\D/g, "") + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  function buildSimpleWhatsAppUrl(message) {
    return "https://wa.me/" + STORE_CONFIG.whatsappNumber.replace(/\D/g, "") + "?text=" + encodeURIComponent(message);
  }

  async function sendOrderToGoogleSheets(order) {
    const payload = buildSheetsPayload(order);

    if (!hasSheetsEndpoint()) {
      return new Promise(function (resolve) {
        window.setTimeout(function () {
          sheetsSource.PEDIDOS.push(payload);
          resolve({
            ok: true,
            simulated: true,
            payload: payload
          });
        }, 450);
      });
    }

    await postToSheets({
      action: "saveOrder",
      payload: payload
    });

    sheetsSource.PEDIDOS.push(payload);

    return { ok: true };
  }

  function buildSheetsPayload(order) {
    // Esta estructura deja el pedido listo para un Apps Script que reciba una fila por producto.
    return {
      targetSheet: "PEDIDOS",
      availableSheets: STORE_CONFIG.googleSheets.sheetNames,
      order: {
        id: order.id,
        fecha: order.fechaIso,
        cliente: order.cliente,
        subtotal: order.subtotal,
        descuento: order.descuento,
        promociones: order.promos.map(function (promo) {
          return promo.description;
        }).join(" | "),
        total: order.total
      },
      rows: order.productos.map(function (item) {
        return {
          pedidoId: order.id,
          fecha: order.fechaIso,
          cliente: order.cliente.nombre,
          whatsapp: order.cliente.whatsapp,
          email: order.cliente.email,
          productoId: item.productoId,
          producto: item.nombre,
          categoria: item.categoria,
          subcategoria: item.subcategoria,
          tamano: item.tamano,
          laminado: item.laminado,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          subtotal: item.subtotal,
          promociones: order.promos.map(function (promo) {
            return promo.description;
          }).join(" | "),
          descuentoPedido: order.descuento,
          totalPedido: order.total
        };
      })
    };
  }

  async function hydrateCatalogData() {
    if (!hasSheetsEndpoint()) {
      return;
    }

    try {
      const remoteSource = await fetchSheetsCatalog();
      sheetsSource = normalizeSheetsSource(remoteSource);
      applyRemoteConfig(sheetsSource.CONFIG);
      priceIndex = buildPriceIndex(sheetsSource.PRECIOS);
      promotions = buildActivePromotions(sheetsSource.PROMOS);
      products = buildActiveProducts(sheetsSource.PRODUCTOS);
      state.sheetsLoaded = true;
      renderContactLinks();
    } catch (error) {
      state.sheetsLoaded = false;
      showToast("No pudimos actualizar la lista. Te mostramos lo disponible.");
    } finally {
      state.isCatalogLoading = false;
    }
  }

  async function fetchSheetsCatalog() {
    const url = new URL(STORE_CONFIG.googleSheets.appsScriptUrl);
    url.searchParams.set("action", "catalog");
    const response = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("No se pudo cargar el catálogo desde Google Sheets.");
    }

    const data = await response.json();
    if (data.ok === false) {
      throw new Error(data.message || "Google Sheets no devolvió datos.");
    }
    return data.data || data;
  }

  async function postToSheets(payload) {
    const response = await fetch(STORE_CONFIG.googleSheets.appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("No se pudo registrar la información en Google Sheets.");
    }

    return response.json().catch(function () {
      return { ok: true };
    }).then(function (result) {
      if (result.ok === false) {
        throw new Error(result.message || "Google Sheets rechazó la operación.");
      }
      return result;
    });
  }

  function getVisibleProducts() {
    const route = getCurrentRoute();
    const filteredProducts = products.filter(function (product) {
      const routeMatch = productMatchesRoute(product, route);
      const categoryMatch = route.category || !state.filters.category || categoryMatches(product.categoria, state.filters.category);
      const subcategoryMatch = route.subcategory || !state.filters.subcategory || textMatches(product.subcategoria, state.filters.subcategory);
      const searchMatch = !shouldShowStickerTools(route) || productMatchesSearch(product, state.filters.searchTerm);
      const favoriteMatch = !state.filters.favoritesOnly || state.favorites.has(product.id);
      return routeMatch && categoryMatch && subcategoryMatch && searchMatch && favoriteMatch;
    });

    return sortVisibleProducts(filteredProducts);
  }

  function getAvailableSubcategories(category, route) {
    return uniqueValues(products
      .filter(function (product) {
        return productMatchesRoute(product, route || getCurrentRoute()) && (!category || categoryMatches(product.categoria, category));
      })
      .map(function (product) {
        return product.subcategoria;
      }));
  }

  function productMatchesSearch(product, searchTerm) {
    if (!searchTerm) {
      return true;
    }

    const searchableText = [
      product.nombre,
      product.categoria,
      product.subcategoria
    ].join(" ");

    return normalizeTextKey(searchableText).indexOf(normalizeTextKey(searchTerm)) !== -1;
  }

  function sortVisibleProducts(productList) {
    if (state.filters.sortOrder === "az") {
      return productList.slice().sort(function (a, b) {
        return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
      });
    }

    if (state.filters.sortOrder === "za") {
      return productList.slice().sort(function (a, b) {
        return b.nombre.localeCompare(a.nombre, "es", { sensitivity: "base" });
      });
    }

    return productList;
  }

  function setCategoryFilter(category) {
    state.filters.category = category;
    state.filters.subcategory = "";
    resetVisibleProductLimit();
    renderCurrentView({ scroll: false });
  }

  function getProductById(productId) {
    return products.find(function (product) {
      return product.id === productId;
    }) || null;
  }

  function shouldShowProductDescription(product) {
    return Boolean(product && product.tipoPrecio !== "sticker" && product.descripcion);
  }

  function getProductHighlightLabel(product) {
    if (!product) {
      return "";
    }
    if (product.ventas > 0) {
      return "Más vendido";
    }
    return product.destacado ? "Destacado" : "";
  }

  function getProductPricingMeta(product) {
    if (product.tipoPrecio === "sticker") {
      const stickerPrices = priceIndex.sticker || {};
      const stickerBase = ((stickerPrices.base || {}).general) || 0;
      return {
        basePrice: stickerBase,
        sizeOptions: (stickerPrices.tamanoList || []).map(function (entry) {
          return {
            key: entry.clave,
            label: entry.etiqueta,
            detail: entry.detalle || "",
            extra: entry.valor
          };
        }),
        laminateOptions: (stickerPrices.laminadoList || []).map(function (entry) {
          return {
            key: entry.clave,
            label: entry.etiqueta,
            detail: entry.detalle || "",
            extra: entry.valor
          };
        })
      };
    }

    const fixedBase = getFixedBasePrice(product);
    return {
      basePrice: fixedBase,
      sizeOptions: [],
      laminateOptions: []
    };
  }

  function buildDefaultSelections(product) {
    if (product.tipoPrecio === "sticker") {
      return {
        tamano: "3x3",
        laminado: "no"
      };
    }

    return {
      tamano: "unico",
      laminado: "no-aplica"
    };
  }

  function calculateProductPrice(product, selections) {
    if (product.tipoPrecio === "sticker") {
      const stickerPrices = priceIndex.sticker || {};
      const sizeOption = findOption(stickerPrices.tamanoList || [], selections.tamano, "3x3");
      const laminateOption = findOption(stickerPrices.laminadoList || [], selections.laminado, "no");
      const base = ((stickerPrices.base || {}).general) || 0;
      const comboKey = sizeOption.clave + "-" + laminateOption.clave;
      const comboPrice = (stickerPrices.combo || {})[comboKey];
      return {
        unitPrice: Number.isFinite(comboPrice) ? comboPrice : base + sizeOption.valor + laminateOption.valor,
        tamanoKey: sizeOption.clave,
        tamanoLabel: sizeOption.etiqueta,
        laminadoKey: laminateOption.clave,
        laminadoLabel: laminateOption.etiqueta
      };
    }

    return {
      unitPrice: getFixedBasePrice(product),
      tamanoKey: "unico",
      tamanoLabel: "Tamaño único",
      laminadoKey: "no-aplica",
      laminadoLabel: "No aplica"
    };
  }

  function getFixedBasePrice(product) {
    const priceGroups = [
      product.id,
      product.tipoPrecio,
      product.subcategoria,
      product.categoria
    ].map(normalizePriceGroup).filter(Boolean);

    for (let index = 0; index < priceGroups.length; index += 1) {
      const basePrices = (priceIndex[priceGroups[index]] || {}).base || {};
      if (Object.prototype.hasOwnProperty.call(basePrices, "unico")) {
        return basePrices.unico;
      }
    }

    return product.precioFijo || 0;
  }

  function getStartingPriceLabel(product) {
    const calculated = calculateProductPrice(product, buildDefaultSelections(product));
    if (!calculated.unitPrice) {
      return "Consultar precio";
    }
    return "Desde " + formatCurrency(calculated.unitPrice);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat(STORE_CONFIG.locale, {
      style: "currency",
      currency: STORE_CONFIG.currency,
      maximumFractionDigits: 0
    }).format(value);
  }

  function showToast(message) {
    window.clearTimeout(state.toastTimeoutId);
    dom.toast.textContent = message;
    dom.toast.classList.add("is-visible");
    state.toastTimeoutId = window.setTimeout(function () {
      dom.toast.classList.remove("is-visible");
    }, 2400);
  }

  function openOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (!overlay) {
      return;
    }

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (!overlay) {
      return;
    }

    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");

    const hasOpenOverlay = document.querySelector(".overlay.is-open");
    if (!hasOpenOverlay) {
      document.body.classList.remove("no-scroll");
    }
  }

  function bumpCartFab() {
    dom.cartFab.classList.remove("is-bumped");
    void dom.cartFab.offsetWidth;
    dom.cartFab.classList.add("is-bumped");
  }

  function buildCartKey(productId, tamano, laminado) {
    return [productId, tamano, laminado].join("__");
  }

  function renderFilterButton(label, value, active) {
    return `
      <button class="filter-pill ${active ? "is-active" : ""}" type="button" data-category-filter="${value}">
        ${label}
      </button>
    `;
  }

  function renderSubcategoryButton(label, value, active) {
    return `
      <button class="filter-pill ${active ? "is-active" : ""}" type="button" data-subcategory-filter="${value}">
        ${label}
      </button>
    `;
  }

  function renderSortButton(label, value, active) {
    return `
      <button class="filter-pill ${active ? "is-active" : ""}" type="button" data-sort-products="${value}" aria-pressed="${active}">
        ${label}
      </button>
    `;
  }

  function hydrateCustomerDraft() {
    const saved = loadJson(STORAGE_KEYS.customer, {});
    dom.customerName.value = saved.nombre || "";
    dom.customerWhatsapp.value = saved.whatsapp || "";
    dom.customerEmail.value = saved.email || "";
  }

  function persistCustomerDraft() {
    saveJson(STORAGE_KEYS.customer, {
      nombre: dom.customerName.value.trim(),
      whatsapp: dom.customerWhatsapp.value.trim(),
      email: dom.customerEmail.value.trim()
    });
  }

  function peekNextOrderId() {
    const nextNumber = Number(localStorage.getItem(STORAGE_KEYS.orderCounter) || "0") + 1;
    return "#S" + nextNumber;
  }

  function reserveNextOrderId() {
    const current = Number(localStorage.getItem(STORAGE_KEYS.orderCounter) || "0") + 1;
    localStorage.setItem(STORAGE_KEYS.orderCounter, String(current));
    return "#S" + current;
  }

  function rollbackOrderCounter() {
    const current = Number(localStorage.getItem(STORAGE_KEYS.orderCounter) || "0");
    if (current > 0) {
      localStorage.setItem(STORAGE_KEYS.orderCounter, String(current - 1));
    }
  }

  function scrollToCatalog() {
    const section = document.getElementById("catalogo");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function ensurePageShell() {
    if (document.getElementById("catalogo")) {
      return;
    }

    document.body.insertAdjacentHTML("afterbegin", `
      <div class="page-ambient" aria-hidden="true"></div>

      <header class="hero" id="inicio">
        <div class="brand-banner shell">
          <a href="index.html" aria-label="Ir al inicio de WAXI STICKERS LANÚS">
            <img
              src="assets/waxi-banner.png"
              alt="WAXI Stickers"
              width="3240"
              height="1350"
              fetchpriority="high"
              style="display:block;width:100%;height:100%;"
            >
          </a>
        </div>

        <div class="hero__topbar shell">
          <button class="ghost-button topbar-favorites" id="topbarFavoritesButton" type="button" aria-pressed="false">
            Guardados
          </button>

          <nav class="site-nav" aria-label="Navegación principal">
            <a href="index.html" data-route-link="inicio">Inicio</a>
            <a href="stickers.html" data-route-link="stickers">Stickers</a>
            <a href="personalizados.html" data-route-link="personalizados">Personalizados</a>
            <a href="imanes.html" data-route-link="imanes">Imanes</a>
            <a href="otros.html" data-route-link="otros">Extras</a>
            <a href="contacto.html" data-route-link="contacto">Contacto</a>
          </nav>

          <div class="topbar-actions">
            <button class="ghost-button hero__cart-shortcut" id="heroCartButton" type="button">
              Ver carrito
            </button>
          </div>
        </div>

        <div class="hero__content shell">
          <section class="hero__copy">
            <p class="eyebrow">Catálogo por WhatsApp</p>
            <h1>WAXI STICKERS LANÚS</h1>
            <p class="hero__headline">Elegí diseño, tamaño y laminado. El pedido se arma y se envía por Whatsapp.</p>
            <p class="hero__text">
              Catálogo visual, promos activas, guardados y carrito para armar tu pedido en minutos.
            </p>

            <div class="hero__actions">
              <button class="primary-button" type="button" data-route-button="stickers">
                Ver stickers
              </button>
              <button class="secondary-button" type="button" id="heroCartButtonSecondary">
                Ver carrito
              </button>
            </div>

            <div class="hero__shop-actions" aria-label="Accesos rápidos">
              <button class="hero-category hero-category--main" type="button" data-route-button="stickers">
                <span>Catálogo</span>
                <strong>Stickers</strong>
                <small>Diseños listos para elegir</small>
              </button>
              <button class="hero-category" type="button" data-route-button="personalizados">
                <span>A medida</span>
                <strong>Personalizados</strong>
                <small>Fotos, logos e ideas propias</small>
              </button>
              <button class="hero-category" type="button" data-route-button="imanes">
                <span>Negocios</span>
                <strong>Imanes</strong>
                <small>Regalos y delivery</small>
              </button>
            </div>

            <ul class="hero__stats" aria-label="Datos de compra">
              <li>
                <strong>Desde $250</strong>
                <span>Precio base sticker chico.</span>
              </li>
              <li>
                  <strong>Promo activa</strong>
                  <span>3 medianos sin laminar.</span>
              </li>
              <li>
                <strong>Por WhatsApp</strong>
                  <span>Coordinás pago y entrega.</span>
              </li>
            </ul>
          </section>

          <aside class="hero__panel" aria-labelledby="heroPanelTitle">
            <div class="hero-card">
              <div class="hero-card__header">
                <div>
                  <p class="eyebrow">Vidriera</p>
                  <h2 id="heroPanelTitle">Lo más pedido</h2>
                </div>
                <span class="hero-card__badge">Catálogo</span>
              </div>

              <div class="hero-card__list" id="featuredProducts"></div>

              <div class="hero-card__footer">
                <span>Los productos se agregan al carrito y el pedido sale listo para WhatsApp.</span>
                <strong>Sin pago online. Te respondemos por mensaje.</strong>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <main class="main-content">
        <section class="catalog-section shell" id="catalogo" aria-labelledby="catalogTitle" data-view-panel="catalog">
          <div class="section-head">
            <div>
              <p class="eyebrow" id="catalogEyebrow">Catálogo</p>
              <h2 id="catalogTitle">Catálogo de stickers</h2>
              <p class="section-head__text" id="catalogIntro">
                Buscá por categoría, abrí el producto y elegí la variante antes de agregar al carrito.
              </p>
            </div>

            <button class="ghost-button" id="favoritesFilterButton" type="button" aria-pressed="false">
              Ver guardados
            </button>
          </div>

          <div class="filter-panel">
            <div class="filter-block filter-block--wide is-hidden" id="stickerSearchBlock" hidden>
              <label class="filter-block__label" for="stickerSearchInput">Buscar sticker</label>
              <input
                class="catalog-search"
                id="stickerSearchInput"
                type="search"
                placeholder="Ej: Soda Stereo, logo, mascota..."
                autocomplete="off"
              >
            </div>

            <div class="filter-block filter-block--wide is-hidden" id="catalogSortBlock" hidden>
              <span class="filter-block__label">Ordenar</span>
              <div class="filter-pills" id="catalogSortOptions"></div>
            </div>
            <div class="filter-block" id="categoryFilterBlock">
              <span class="filter-block__label">Categoría</span>
              <div class="filter-pills" id="categoryFilters"></div>
            </div>

            <div class="filter-block">
              <span class="filter-block__label">Subcategoría</span>
              <div class="filter-pills" id="subcategoryFilters"></div>
            </div>
          </div>

          <div class="promo-strip is-hidden" id="promoStrip" aria-live="polite"></div>

          <div class="catalog-grid" id="catalogGrid" aria-live="polite"></div>
        </section>

        <section class="info-section shell is-hidden" id="infoSection" aria-labelledby="infoTitle" data-view-panel="info">
          <div class="section-head section-head--stacked">
            <div>
              <p class="eyebrow" id="infoEyebrow">Productos</p>
              <h2 id="infoTitle">Opciones, precios y formatos</h2>
              <p class="section-head__text" id="infoIntro">
                Elegí una opción para ver detalles y sumarla al carrito.
              </p>
            </div>
          </div>
          <div class="info-grid" id="infoGrid"></div>
        </section>

        <section class="trust-strip shell" id="trustStrip" aria-label="Beneficios del sistema">
          <article class="trust-card">
              <p class="eyebrow">1</p>
              <h3>Elegís productos y variantes.</h3>
            </article>
            <article class="trust-card">
              <p class="eyebrow">2</p>
              <h3>Revisás el total en el carrito.</h3>
            </article>
            <article class="trust-card">
              <p class="eyebrow">3</p>
              <h3>Enviás el pedido por WhatsApp.</h3>
            </article>
        </section>
      </main>

      <footer class="contact-section" id="contacto" aria-labelledby="contactTitle">
        <div class="shell contact-section__layout">
          <div class="contact-section__copy">
            <p class="eyebrow">Contacto</p>
            <h2 id="contactTitle">Hablemos de tu pedido</h2>
            <p>Consultas, pedidos especiales, entregas para negocios y trabajos por cantidad.</p>
          </div>
          <div class="contact-actions">
            <a class="primary-button" id="contactWhatsapp" href="#" target="_blank" rel="noreferrer">
              Whatsapp
            </a>
            <a class="secondary-button" id="contactInstagram" href="#" target="_blank" rel="noreferrer">
              <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.35A4.65 4.65 0 1 1 7.35 12 4.65 4.65 0 0 1 12 7.35Zm0 2A2.65 2.65 0 1 0 14.65 12 2.65 2.65 0 0 0 12 9.35Zm4.95-2.55a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15Z"
                ></path>
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </footer>

      <button class="cart-fab" id="cartFab" type="button" aria-label="Abrir carrito">
        <span class="cart-fab__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="20" r="1.5"></circle>
            <circle cx="18" cy="20" r="1.5"></circle>
            <path d="M3 4h2.4l2.3 10.2a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 7H7.1"></path>
          </svg>
        </span>
        <span class="cart-fab__copy">
          <strong>Carrito</strong>
          <small id="cartFabTotalLabel">0 productos</small>
        </span>
        <span class="cart-fab__count" id="cartCount">0</span>
      </button>

      <div class="toast" id="toast" role="status" aria-live="polite"></div>

      <div class="overlay" id="productOverlay" aria-hidden="true">
        <div class="modal product-modal" role="dialog" aria-modal="true" aria-labelledby="productTitle">
          <button class="modal__close" type="button" data-close-overlay="productOverlay" aria-label="Cerrar producto">
            <span aria-hidden="true">&times;</span>
          </button>

          <div class="product-modal__layout">
            <section class="gallery-panel">
              <div class="gallery-panel__hero">
                <img id="productMainImage" src="" alt="">
              </div>
              <div class="gallery-panel__thumbs" id="productThumbs"></div>
            </section>

            <section class="product-detail">
              <div class="product-detail__badges" id="productBadges"></div>
              <h3 id="productTitle">Producto</h3>
              <p class="product-detail__description" id="productDescription"></p>

              <div class="price-card">
                <span class="price-card__label">Precio de esta combinación</span>
                <strong id="productDynamicPrice">$0</strong>
                <small id="productPriceHint">Desde $0</small>
              </div>

              <div class="selector-group" id="sizeSelectorGroup">
                <div class="selector-group__head">
                  <span>Tamaño</span>
                  <small id="sizeSelectorHint">Base activa: Chico</small>
                </div>
                <div class="selector-group__options" id="sizeSelectorOptions"></div>
              </div>

              <div class="selector-group" id="laminateSelectorGroup">
                <div class="selector-group__head">
                  <span>Laminado</span>
                  <small>Acabado final del producto</small>
                </div>
                <div class="selector-group__options" id="laminateSelectorOptions"></div>
              </div>

              <div class="product-detail__actions">
                <button class="ghost-button product-detail__favorite" id="productFavoriteButton" type="button">
                  Guardar favorito
                </button>
                <button class="primary-button product-detail__add" id="addToCartButton" type="button">
                  Agregar al carrito
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div class="overlay overlay--drawer" id="cartOverlay" aria-hidden="true">
        <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
          <div class="drawer__header">
            <div>
              <p class="eyebrow">Carrito</p>
              <h2 id="cartTitle">Tu pedido</h2>
            </div>
            <button class="modal__close" type="button" data-close-overlay="cartOverlay" aria-label="Cerrar carrito">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="drawer__body" id="cartItems"></div>

          <div class="drawer__footer">
            <div class="drawer__summary">
              <span>Total</span>
              <strong id="cartTotal">$0</strong>
            </div>
            <p class="drawer__note">
              El pedido se genera sin pagos en línea y queda listo para enviar por WhatsApp.
            </p>
            <button class="primary-button drawer__checkout" id="checkoutButton" type="button">
              Confirmar datos del pedido
            </button>
          </div>
        </aside>
      </div>

      <div class="overlay" id="checkoutOverlay" aria-hidden="true">
        <div class="modal checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">
          <button class="modal__close" type="button" data-close-overlay="checkoutOverlay" aria-label="Cerrar confirmación">
            <span aria-hidden="true">&times;</span>
          </button>

          <div class="checkout-modal__layout">
            <section class="checkout-panel">
              <p class="eyebrow">Confirmación</p>
              <h2 id="checkoutTitle">Confirma tus datos antes de enviar el pedido</h2>
              <p class="checkout-panel__text">
                Terminás de confirmar los datos, se abre WhatsApp con el mensaje armado y el pedido queda listo para registrarse.
              </p>

              <form id="checkoutForm" novalidate>
                <label class="field">
                  <span>Nombre</span>
                  <input id="customerName" name="name" type="text" placeholder="Ej: Rocío Díaz" required>
                </label>

                <label class="field">
                  <span>WhatsApp</span>
                  <input
                    id="customerWhatsapp"
                    name="whatsapp"
                    type="tel"
                    inputmode="tel"
                    placeholder="Ej: 5491123456789"
                    required
                  >
                </label>

                <label class="field">
                  <span>Email</span>
                  <input id="customerEmail" name="email" type="email" placeholder="Ej: hola@marca.com" required>
                </label>

                <div class="checkout-actions">
                  <button class="ghost-button" id="checkoutBackButton" type="button">
                    Volver al carrito
                  </button>
                  <button class="primary-button" id="sendOrderButton" type="submit">
                    Whatsapp
                  </button>
                </div>
              </form>
            </section>

            <aside class="ticket" aria-labelledby="ticketTitle">
              <div class="ticket__header">
                <div>
                  <p class="eyebrow">Resumen</p>
                  <h3 id="ticketTitle">Comprobante del pedido</h3>
                </div>
                <strong class="ticket__id" id="ticketOrderId">#S1</strong>
              </div>

              <div class="ticket__meta">
                <span id="ticketDate"></span>
                <span id="ticketItemsCount">0 productos</span>
              </div>

              <div class="ticket__items" id="ticketItems"></div>

              <div class="ticket__footer">
                <span>Total</span>
                <strong id="ticketTotal">$0</strong>
              </div>
            </aside>
          </div>
        </div>
      </div>
    `);
  }

  function navigateToRoute(routeName) {
    const route = ROUTES[routeName] || ROUTES.inicio;
    if (getRouteFromPage() === routeName) {
      renderCurrentView({ scroll: false });
      return;
    }
    window.location.href = route.file;
  }

  function scrollToRoute(routeName) {
    const route = ROUTES[routeName] || ROUTES.inicio;
    const target = route.mode === "info"
      ? dom.infoSection
      : route.mode === "contact"
        ? dom.contactSection
        : routeName === "inicio"
          ? document.getElementById("inicio")
          : dom.catalogSection;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function getRouteFromHash() {
    return getRouteFromPage();
  }

  function getRouteFromPage() {
    const bodyPage = document.body.dataset.page;
    if (ROUTES[bodyPage]) {
      return bodyPage;
    }

    const fileName = window.location.pathname.split("/").pop() || "index.html";
    const matchingRoute = Object.keys(ROUTES).find(function (routeName) {
      return ROUTES[routeName].file === fileName;
    });
    if (matchingRoute) {
      return matchingRoute;
    }

    const rawHash = window.location.hash.replace("#", "");
    return ROUTES[rawHash] ? rawHash : "inicio";
  }

  function getCurrentRoute() {
    return ROUTES[state.route] || ROUTES.inicio;
  }

  function updateActiveNavigation(routeName) {
    dom.routeLinks.forEach(function (link) {
      const isActive = link.dataset.routeLink === routeName;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function getProductsForRoute(route) {
    return products.filter(function (product) {
      return productMatchesRoute(product, route);
    });
  }

  function productMatchesRoute(product, route) {
    if (!route || route.mode === "contact") {
      return true;
    }
    const productTypeMatch = !route.productType || productTypeMatches(product.tipoPrecio, route.productType);
    const categoryMatch = !route.category || categoryMatches(product.categoria, route.category);
    const subcategoryMatch = !route.subcategory || textMatches(product.subcategoria, route.subcategory);
    return productTypeMatch && categoryMatch && subcategoryMatch;
  }

  function productTypeMatches(value, expectedValue) {
    const productType = normalizeTextKey(value || "sticker");
    const expectedType = normalizeTextKey(expectedValue || "sticker");

    if (expectedType === "sticker") {
      return productType === "" || productType === "sticker" || productType === "stickers";
    }

    return productType === expectedType;
  }

  function shouldShowStickerTools(route) {
    return Boolean(route && route.file === "stickers.html");
  }

  function categoryMatches(value, expectedValue) {
    if (!expectedValue) {
      return true;
    }

    return getCategoryKey(value) === getCategoryKey(expectedValue);
  }

  function textMatches(value, expectedValue) {
    return normalizeTextKey(value) === normalizeTextKey(expectedValue);
  }

  function getCategoryKey(value) {
    const key = normalizeTextKey(value);

    if (["sticker", "stickers", "calcomania", "calcomanias"].indexOf(key) !== -1) {
      return "stickers";
    }

    if (key.indexOf("personalizado") !== -1) {
      return "personalizados";
    }

    if (key.indexOf("iman") !== -1) {
      return "imanes";
    }

    if (key.indexOf("extra") !== -1 || key.indexOf("otro") !== -1) {
      return "otros-productos";
    }

    return key;
  }

  function syncCurrentProduct() {
    if (!products.length) {
      state.currentProductId = null;
      state.currentSelections = {};
      return;
    }

    if (!getProductById(state.currentProductId)) {
      state.currentProductId = products[0].id;
      state.currentSelections = buildDefaultSelections(products[0]);
    }
  }

  function renderContactLinks() {
    const whatsappUrl = "https://wa.me/" + STORE_CONFIG.whatsappNumber.replace(/\D/g, "");
    dom.contactWhatsapp.href = whatsappUrl;
    dom.contactWhatsapp.innerHTML = renderWhatsAppButtonLabel();
    dom.contactInstagram.href = STORE_CONFIG.instagramUrl;
    dom.contactInstagram.innerHTML = renderInstagramButtonLabel();
    if (dom.sendOrderButton && !state.isSending) {
      dom.sendOrderButton.innerHTML = renderWhatsAppButtonLabel();
    }
  }

  function renderWhatsAppButtonLabel() {
    return `
      <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.04 2a9.86 9.86 0 0 0-8.52 14.82L2.2 22l5.3-1.27A9.82 9.82 0 0 0 12.04 22 10 10 0 0 0 12.04 2Zm0 18.18a8.05 8.05 0 0 1-4.1-1.12l-.29-.17-3.14.75.77-3.05-.19-.31a8.13 8.13 0 1 1 6.95 3.9Zm4.46-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z"
        ></path>
      </svg>
      <span>Whatsapp</span>
    `;
  }

  function renderInstagramButtonLabel() {
    return `
      <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.35A4.65 4.65 0 1 1 7.35 12 4.65 4.65 0 0 1 12 7.35Zm0 2A2.65 2.65 0 1 0 14.65 12 2.65 2.65 0 0 0 12 9.35Zm4.95-2.55a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15Z"
        ></path>
      </svg>
      <span>Instagram</span>
    `;
  }

  function hasSheetsEndpoint() {
    return Boolean(STORE_CONFIG.googleSheets.enabled && STORE_CONFIG.googleSheets.appsScriptUrl);
  }

  function cloneSheetsSource(source) {
    return {
      PRODUCTOS: source.PRODUCTOS.slice(),
      PRECIOS: source.PRECIOS.slice(),
      PROMOS: (source.PROMOS || []).slice(),
      PEDIDOS: source.PEDIDOS.slice(),
      CONFIG: (source.CONFIG || []).slice()
    };
  }

  function normalizeSheetsSource(source) {
    const priceRows = source.PRECIOS || source.precios || [];
    const productRows = normalizeProducts(source.PRODUCTOS || source.productos || SHEETS_SOURCE.PRODUCTOS);
    const productRowsWithSales = applySalesStats(productRows, source.VENTAS || source.ventas || []);

    return {
      PRODUCTOS: productRowsWithSales,
      PRECIOS: normalizePriceRows(priceRows.length ? priceRows : SHEETS_SOURCE.PRECIOS),
      PROMOS: normalizePromotions(source.PROMOS || source.promos || SHEETS_SOURCE.PROMOS),
      PEDIDOS: source.PEDIDOS || source.pedidos || [],
      CONFIG: source.CONFIG || source.config || SHEETS_SOURCE.CONFIG
    };
  }

  function normalizeProducts(rows) {
    return rows.map(function (row, index) {
      const image1 = normalizeImageUrl(row.imagen1 || row.Imagen1 || row.imagen_1 || "");
      const image2 = normalizeImageUrl(row.imagen2 || row.Imagen2 || row.imagen_2 || row.imagen1 || row.Imagen1 || image1);
      const tipoPrecio = String(row.tipoPrecio || row.tipo_precio || row.tipo || "sticker").trim();
      const rawCategory = String(row.categoria || row.Categoria || row.categoría || "").trim() || inferProductCategory(tipoPrecio);
      const category = normalizeProductCategoryLabel(rawCategory);

      return {
        id: String(row.id || row.ID || "").trim(),
        nombre: String(row.nombre || row.Nombre || "").trim(),
        categoria: category,
        subcategoria: String(row.subcategoria || row.Subcategoria || row.subcategoría || "").trim() || "General",
        imagen1: image1,
        imagen2: image2 || image1,
        activo: toBoolean(row.activo, true),
        orden: toNumber(row.orden, index + 1),
        destacado: toBoolean(row.destacado, false),
        tipoPrecio: tipoPrecio,
        precioFijo: toNumber(row.precioFijo || row.precio_fijo || row.precio || "", 0),
        descripcion: String(row.descripcion || row.descripción || "").trim(),
        ventas: toNumber(row.ventas || row.vendidos || row.cantidadVendida || row.totalVendido || "", 0)
      };
    }).filter(function (product) {
      return product.id && product.nombre;
    });
  }

  function inferProductCategory(tipoPrecio) {
    return getCategoryKey(tipoPrecio) === "stickers" ? "Stickers" : "Otros productos";
  }

  function normalizeProductCategoryLabel(value) {
    const categoryKey = getCategoryKey(value);

    if (categoryKey === "stickers") {
      return "Stickers";
    }

    if (categoryKey === "personalizados") {
      return "Personalizados";
    }

    if (categoryKey === "imanes" || categoryKey === "otros-productos") {
      return "Otros productos";
    }

    return value;
  }

  function normalizeImageUrl(value) {
    const imageUrl = String(value || "").trim();
    const driveFileId = extractDriveFileId(imageUrl);

    if (driveFileId) {
      return "https://drive.google.com/thumbnail?id=" + driveFileId + "&sz=w1000";
    }

    return imageUrl;
  }

  function extractDriveFileId(imageUrl) {
    if (!imageUrl || imageUrl.indexOf("drive.google.com") === -1) {
      return "";
    }

    const filePathMatch = imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (filePathMatch) {
      return filePathMatch[1];
    }

    const queryMatch = imageUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return queryMatch ? queryMatch[1] : "";
  }

  function normalizeTextKey(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function normalizePriceGroup(value) {
    return normalizeTextKey(value).replace(/\s+/g, "-");
  }

  function normalizePriceRows(rows) {
    return rows.map(function (row, index) {
      return {
        grupo: normalizePriceGroup(row.grupo || row.Grupo || ""),
        item: String(row.item || row.Item || "").trim(),
        clave: String(row.clave || row.Clave || "").trim(),
        etiqueta: String(row.etiqueta || row.Etiqueta || row.clave || "").trim(),
        detalle: String(row.detalle || row.Detalle || "").trim(),
        valor: toNumber(row.valor, 0),
        orden: toNumber(row.orden, index + 1)
      };
    }).filter(function (row) {
      return row.grupo && row.item && row.clave;
    });
  }

  function normalizePromotions(rows) {
    return rows.map(function (row, index) {
      return {
        id: String(row.id || row.ID || "").trim() || "promo-" + (index + 1),
        titulo: String(row.titulo || row.Titulo || row.título || "").trim(),
        descripcion: String(row.descripcion || row.Descripcion || row.descripción || "").trim(),
        detalle: String(row.detalle || row.Detalle || "").trim(),
        tipoProducto: String(row.tipoProducto || row.tipo_producto || row.tipo || "sticker").trim(),
        tamano: String(row.tamano || row.tamaño || row.Tamano || row.Tamaño || "").trim(),
        laminado: String(row.laminado || row.Laminado || "").trim(),
        cantidad: Math.max(1, toNumber(row.cantidad || row.Cantidad || "", 1)),
        precio: Math.max(0, toNumber(row.precio || row.Precio || row.valor || row.Valor || "", 0)),
        activo: toBoolean(row.activo, true),
        orden: toNumber(row.orden, index + 1)
      };
    }).filter(function (promo) {
      return promo.precio > 0 && promo.cantidad > 0;
    });
  }

  function applySalesStats(productRows, salesRows) {
    const salesByProduct = {};
    (salesRows || []).forEach(function (row) {
      const productId = String(row.productoId || row.producto_id || row.id || row.ID || "").trim();
      if (!productId) {
        return;
      }
      salesByProduct[productId] = toNumber(row.ventas || row.vendidos || row.cantidad || row.total || "", 0);
    });

    return productRows.map(function (product) {
      return Object.assign({}, product, {
        ventas: salesByProduct[product.id] || product.ventas || 0
      });
    });
  }

  function buildActiveProducts(rows) {
    return normalizeProducts(rows)
      .filter(function (product) {
        return product.activo;
      })
      .sort(sortProducts);
  }

  function buildActivePromotions(rows) {
    return normalizePromotions(rows)
      .filter(function (promo) {
        return promo.activo;
      })
      .sort(function (a, b) {
        return a.orden - b.orden;
      });
  }

  function applyRemoteConfig(configRows) {
    const config = {};
    (configRows || []).forEach(function (row) {
      const key = row.clave || row.key || row.nombre;
      const value = row.valor || row.value;
      if (key && value) {
        config[key] = value;
      }
    });

    if (config.whatsappNumber) {
      STORE_CONFIG.whatsappNumber = config.whatsappNumber;
    }
    if (config.whatsappLabel) {
      STORE_CONFIG.whatsappLabel = config.whatsappLabel;
    }
    if (config.instagramUser) {
      STORE_CONFIG.instagramUser = config.instagramUser;
    }
    if (config.instagramUrl) {
      STORE_CONFIG.instagramUrl = config.instagramUrl;
    }
  }

  function toBoolean(value, fallback) {
    if (typeof value === "boolean") {
      return value;
    }
    if (value === undefined || value === null || value === "") {
      return fallback;
    }
    return ["true", "si", "sí", "1", "activo", "x"].indexOf(String(value).trim().toLowerCase()) !== -1;
  }

  function toNumber(value, fallback) {
    const parsed = Number(String(value || "").replace(/\./g, "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function buildPriceIndex(rows) {
    return rows.reduce(function (accumulator, row) {
      if (!accumulator[row.grupo]) {
        accumulator[row.grupo] = {};
      }
      if (!accumulator[row.grupo][row.item]) {
        accumulator[row.grupo][row.item] = {};
      }

      accumulator[row.grupo][row.item][row.clave] = row.valor;

      const listKey = row.item + "List";
      if (!accumulator[row.grupo][listKey]) {
        accumulator[row.grupo][listKey] = [];
      }

      accumulator[row.grupo][listKey].push(row);
      accumulator[row.grupo][listKey].sort(function (a, b) {
        return a.orden - b.orden;
      });

      return accumulator;
    }, {});
  }

  function findOption(options, key, fallbackKey) {
    return options.find(function (option) {
      return option.clave === key;
    }) || options.find(function (option) {
      return option.clave === fallbackKey;
    }) || options[0] || {
      clave: fallbackKey,
      etiqueta: fallbackKey,
      valor: 0,
      orden: 1
    };
  }

  function loadJson(key, fallbackValue) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallbackValue;
    } catch (error) {
      return fallbackValue;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function consumePendingFavoritesFilter(routeName) {
    if (routeName !== "stickers") {
      return false;
    }

    try {
      const pendingValue = sessionStorage.getItem(STORAGE_KEYS.pendingFavorites);
      sessionStorage.removeItem(STORAGE_KEYS.pendingFavorites);
      return pendingValue === "1";
    } catch (error) {
      return false;
    }
  }

  function rememberPendingFavoritesFilter(value) {
    try {
      sessionStorage.setItem(STORAGE_KEYS.pendingFavorites, value ? "1" : "0");
    } catch (error) {
      return;
    }
  }

  function uniqueValues(values) {
    return Array.from(new Set(values));
  }

  function sortProducts(a, b) {
    if ((a.ventas || 0) !== (b.ventas || 0)) {
      return (b.ventas || 0) - (a.ventas || 0);
    }
    if (a.destacado !== b.destacado) {
      return Number(b.destacado) - Number(a.destacado);
    }
    return a.orden - b.orden;
  }

  function escapeSvg(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
})();
