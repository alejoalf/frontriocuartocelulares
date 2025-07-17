// Configuración del carrito de compras
export const CART_CONFIG = {
  // Cupones disponibles
  COUPONS: {
    'descuento10': {
      code: 'descuento10',
      discount: 10,
      type: 'percentage',
      description: '10% de descuento en toda la compra'
    },
    'envio_gratis': {
      code: 'envio_gratis',
      discount: 0,
      type: 'shipping',
      description: 'Envío gratis'
    }
  },

  // Métodos de envío
  SHIPPING_METHODS: [
    {
      id: 'standard',
      name: 'Envío estándar',
      price: 5000,
      time: '3-5 días hábiles',
      description: 'Envío regular por correo'
    },
    {
      id: 'express',
      name: 'Envío express',
      price: 12000,
      time: '1-2 días hábiles',
      description: 'Envío prioritario'
    },
    {
      id: 'pickup',
      name: 'Retiro en tienda',
      price: 0,
      time: 'Inmediato',
      description: 'Retira en nuestro local'
    }
  ],

  // Métodos de pago
  PAYMENT_METHODS: [
    {
      id: 'card',
      name: 'Tarjeta de crédito/débito',
      description: 'Paga con tu tarjeta de forma segura'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Paga con tu cuenta de PayPal'
    },
    {
      id: 'transfer',
      name: 'Transferencia bancaria',
      description: 'Transferencia directa a nuestra cuenta'
    }
  ],

  // Umbrales para envío gratis
  FREE_SHIPPING_THRESHOLD: 50000,
  REDUCED_SHIPPING_THRESHOLD: 25000,

  // Configuración de notificaciones
  NOTIFICATIONS: {
    SUCCESS_DURATION: 3000,
    ERROR_DURATION: 4000,
    WARNING_DURATION: 5000
  },

  // Configuración de stock
  STOCK: {
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 99,
    LOW_STOCK_THRESHOLD: 5
  }
};

// Funciones de utilidad para el carrito
export const cartUtils = {
  // Calcular envío basado en el subtotal
  calculateShipping: (subtotal) => {
    if (subtotal >= CART_CONFIG.FREE_SHIPPING_THRESHOLD) {
      return 0;
    } else if (subtotal >= CART_CONFIG.REDUCED_SHIPPING_THRESHOLD) {
      return 2000;
    } else {
      return 5000;
    }
  },

  // Validar cupón
  validateCoupon: (code) => {
    return CART_CONFIG.COUPONS[code.toLowerCase()] || null;
  },

  // Formatear precio
  formatPrice: (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  },

  // Calcular descuento
  calculateDiscount: (subtotal, coupon) => {
    if (!coupon) return 0;
    
    if (coupon.type === 'percentage') {
      return subtotal * (coupon.discount / 100);
    } else if (coupon.type === 'fixed') {
      return coupon.discount;
    }
    
    return 0;
  }
}; 