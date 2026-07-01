'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { X, ShoppingBag, Trash2, ArrowRight, CheckCircle, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/src/lib/supabase';

const VIETNAM_PROVINCES = [
  "Hà Nội",
  "Thạch Thất (Hà Nội)",
  "Quốc Oai (Hà Nội)",
  "TP Hồ Chí Minh",
  "Đà Nẵng",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cần Thơ",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái"
];

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    clearCart,
  } = useCart();

  const { user, profile, session } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'payment' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER'>('COD');
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [compiledOrderText, setCompiledOrderText] = useState('');
  const [completedOrderTotal, setCompletedOrderTotal] = useState(0);

  // Shipping rates & province state variables
  const [selectedProvince, setSelectedProvince] = useState('');
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [shippingFee, setShippingFee] = useState(40000); // Default to 40k
  const [estimatedDays, setEstimatedDays] = useState('3-5 ngày');

  // Fetch shipping rates from Supabase on mount
  useEffect(() => {
    const fetchShippingRates = async () => {
      try {
        const { data, error } = await supabase
          .from('shipping_rates')
          .select('*');
        if (error) throw error;
        if (data) {
          setShippingRates(data);
        }
      } catch (err) {
        console.error('Lỗi khi lấy phí vận chuyển:', err);
        // Fallback static rates in case of query fails
        setShippingRates([
          { province_name: 'Hà Nội', shipping_fee: 20000, estimated_days: '1-2 ngày' },
          { province_name: 'Thạch Thất', shipping_fee: 0, estimated_days: 'Trong ngày' },
          { province_name: 'Quốc Oai', shipping_fee: 0, estimated_days: 'Trong ngày' },
          { province_name: 'TP Hồ Chí Minh', shipping_fee: 35000, estimated_days: '3-4 ngày' },
          { province_name: 'Đà Nẵng', shipping_fee: 35000, estimated_days: '3-4 ngày' },
          { province_name: 'Các tỉnh khác', shipping_fee: 40000, estimated_days: '3-5 ngày' }
        ]);
      }
    };
    fetchShippingRates();
  }, []);

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    if (!province) {
      setShippingFee(40000);
      setEstimatedDays('3-5 ngày');
      return;
    }
    
    // Normalize to check rates
    let searchName = province;
    if (province.includes('Thạch Thất')) {
      searchName = 'Thạch Thất';
    } else if (province.includes('Quốc Oai')) {
      searchName = 'Quốc Oai';
    } else if (province.includes('Hà Nội')) {
      searchName = 'Hà Nội';
    } else if (province.includes('TP Hồ Chí Minh')) {
      searchName = 'TP Hồ Chí Minh';
    } else if (province.includes('Đà Nẵng')) {
      searchName = 'Đà Nẵng';
    }
    
    const rate = shippingRates.find((r) => r.province_name === searchName) ||
                 shippingRates.find((r) => r.province_name === 'Các tỉnh khác') ||
                 { shipping_fee: 40000, estimated_days: '3-5 ngày' };
    setShippingFee(Number(rate.shipping_fee));
    setEstimatedDays(rate.estimated_days);
  };

  // Coupon states
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Calculate total weight of the cart
  const totalWeight = cart.reduce((total, item) => {
    const weightStr = item.selectedWeight.toLowerCase();
    let weightValue = 0;
    if (weightStr.endsWith('kg')) {
      weightValue = parseFloat(weightStr.replace('kg', ''));
    } else if (weightStr.endsWith('g')) {
      weightValue = parseFloat(weightStr.replace('g', '')) / 1000;
    }
    return total + weightValue * item.quantity;
  }, 0);

  // Check if eligible for free shipping
  const isFreeShipping = (appliedCoupon && (appliedCoupon.code.toUpperCase().includes('FREESHIP') || appliedCoupon.discountType === 'free_shipping')) ||
                         cartTotal >= 500000 ||
                         totalWeight >= 5;

  const finalShippingFee = isFreeShipping ? 0 : shippingFee;
  const totalItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const comboDiscount = totalItemCount >= 3 ? Math.round(cartTotal * 0.05) : 0;
  const grandTotal = cartTotal - comboDiscount - couponDiscount + finalShippingFee;

  // Pre-fill name if user is logged in
  useEffect(() => {
    if (user && profile) {
      setName(profile.fullName || user.user_metadata?.full_name || '');
    }
  }, [user, profile]);

  // Reset drawer state on close after animation completes
  useEffect(() => {
    if (!isCartOpen && (checkoutStep === 'success' || checkoutStep === 'payment')) {
      const timer = setTimeout(() => {
        setCheckoutStep('cart');
        setName('');
        setPhone('');
        setAddress('');
        setNote('');
        setCompiledOrderText('');
        setCompletedOrderTotal(0);
        setCouponCodeInput('');
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponError('');
        setCouponSuccess('');
        setSelectedProvince('');
        setShippingFee(40000);
        setEstimatedDays('3-5 ngày');
        setPaymentMethod('COD');
        setCreatedOrderId('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen, checkoutStep]);

  // Check if we should skip to the checkout form step directly (Buy Now flow)
  useEffect(() => {
    if (isCartOpen) {
      const skip = localStorage.getItem('skip_to_checkout_form');
      if (skip === 'true') {
        setCheckoutStep('form');
        localStorage.removeItem('skip_to_checkout_form');
      }
    }
  }, [isCartOpen]);

  // Polling for Bank Transfer payment status
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (checkoutStep === 'payment' && createdOrderId) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch('/api/orders/lookup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: createdOrderId, phone })
          });
          const data = await res.json();
          if (data.success && data.order.paymentStatus === 'paid') {
            if (intervalId) clearInterval(intervalId);
            setCheckoutStep('success');
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 4000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkoutStep, createdOrderId, phone]);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code: couponCodeInput,
          cartItems: cart.map(item => ({
            productId: item.product.id,
            selectedWeight: item.selectedWeight,
            quantity: item.quantity
          }))
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi áp dụng mã giảm giá.');
      }

      setAppliedCoupon(data.coupon);
      setCouponDiscount(data.discountAmount);
      setCouponSuccess(`Áp dụng mã ${data.coupon.code} thành công: -${data.discountAmount.toLocaleString('vi-VN')}đ`);
      setCouponError('');
    } catch (err: any) {
      console.error(err);
      setCouponError(err.message || 'Lỗi kết nối.');
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponSuccess('');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCodeInput('');
    setCouponError('');
    setCouponSuccess('');
  };

  // Recalculate coupon discount reactively if cart total changes
  useEffect(() => {
    if (appliedCoupon) {
      if (cartTotal < appliedCoupon.minOrderValue) {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponSuccess('');
        setCouponError(`Mã ${appliedCoupon.code} bị hủy do đơn hàng chưa đạt tối thiểu ${appliedCoupon.minOrderValue.toLocaleString('vi-VN')}đ.`);
      } else {
        let newDiscount = 0;
        if (appliedCoupon.discountType === 'percentage') {
          newDiscount = (cartTotal * appliedCoupon.discountValue) / 100;
          if (appliedCoupon.maxDiscountAmount && newDiscount > appliedCoupon.maxDiscountAmount) {
            newDiscount = appliedCoupon.maxDiscountAmount;
          }
        } else if (appliedCoupon.discountType === 'fixed') {
          newDiscount = appliedCoupon.discountValue;
        }
        if (newDiscount > cartTotal) {
          newDiscount = cartTotal;
        }
        setCouponDiscount(newDiscount);
        setCouponSuccess(`Đã áp dụng mã ${appliedCoupon.code}: -${newDiscount.toLocaleString('vi-VN')}đ`);
      }
    }
  }, [cartTotal, appliedCoupon]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !selectedProvince) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    const cleanPhone = phone.replace(/[\s().-]/g, '');
    if (!/^(0|84|\+84)[35789][0-9]{8}$|^(0|84|\+84)2[0-9]{9}$/.test(cleanPhone)) {
      setErrorMsg('Số điện thoại không hợp lệ (ví dụ: 0912 345 678).');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          customerNote: note || null,
          totalAmount: grandTotal,
          cartItems: cart.map(item => ({
            productId: item.product.id,
            selectedWeight: item.selectedWeight,
            quantity: item.quantity,
          })),
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          province: selectedProvince,
          paymentMethod: paymentMethod,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Lỗi khi đặt hàng.');
      }

      const orderId = resData.order.id;

      // Generate Order Text with database-saved ID
      let giftText = '';
      if (totalItemCount >= 5) {
        giftText = `🎁 QUÀ TẶNG: 1x Bún Ngô Khô Premium (500g) (Miễn phí)\n`;
      }

      const itemsText = cart
        .map(
          (item, index) =>
            `${index + 1}. ${item.product.name} (${item.selectedWeight}) x ${item.quantity} = ${(
              item.price * item.quantity
            ).toLocaleString('vi-VN')}đ`
        )
        .join('\n');

      const orderText = `ĐƠN HÀNG MỚI TỪ SOIMOC E-SHOP:
-----------------------------
MÃ ĐƠN HÀNG: ${orderId}
👤 Khách hàng: ${name}
📞 Số điện thoại: ${phone}
📍 Địa chỉ giao hàng: ${address}${selectedProvince ? `, ${selectedProvince}` : ''}
💳 Thanh toán: ${paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản Ngân hàng (QR)' : 'Thanh toán khi nhận hàng (COD)'}
💬 Ghi chú: ${note || 'Không có'}
-----------------------------
🛒 Danh sách sản phẩm:
${itemsText}
${giftText}-----------------------------
${comboDiscount > 0 ? `🎉 Ưu đãi Combo (Giảm 5%): -${comboDiscount.toLocaleString('vi-VN')}đ\n-----------------------------\n` : ''}${appliedCoupon ? `🎟️ Mã giảm giá: ${appliedCoupon.code} (-${couponDiscount.toLocaleString('vi-VN')}đ)\n-----------------------------\n` : ''}🚚 Phí vận chuyển: ${finalShippingFee === 0 ? 'Miễn phí' : `${finalShippingFee.toLocaleString('vi-VN')}đ`} (${estimatedDays})
-----------------------------
💰 Tổng thanh toán: ${grandTotal.toLocaleString('vi-VN')}đ`;

      // Copy to clipboard
      navigator.clipboard.writeText(orderText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });

      setCompiledOrderText(orderText);
      setCompletedOrderTotal(grandTotal);
      setCreatedOrderId(orderId);
      clearCart();
      
      if (paymentMethod === 'BANK_TRANSFER') {
        setCheckoutStep('payment');
      } else {
        setCheckoutStep('success');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const redirectToZalo = () => {
    // Open Zalo chat with the merchant
    window.open('https://zalo.me/0979862956', '_blank');
    setIsCartOpen(false);
    // Reset state
    setName('');
    setPhone('');
    setAddress('');
    setNote('');
    setCheckoutStep('cart');
    setCompiledOrderText('');
    setCompletedOrderTotal(0);
    setCouponCodeInput('');
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError('');
    setCouponSuccess('');
  };

  const formatPrice = (num: number) => {
    return num.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full md:max-w-md bg-zinc-950 border-l border-zinc-800 text-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-amber-500 w-5 h-5" />
                <span className="font-bold text-lg tracking-wider font-sans">
                  GIỎ HÀNG ({cartCount})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 && checkoutStep !== 'success' && checkoutStep !== 'payment' ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-20">
                  <ShoppingBag className="w-16 h-16 mb-4 text-zinc-700" />
                  <p className="text-lg font-medium text-zinc-400 mb-2">Giỏ hàng của bạn đang trống</p>
                  <p className="text-sm max-w-xs mb-8">Hãy chọn các sản phẩm bún/phở ngô sạch và dinh dưỡng để thêm vào giỏ.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider text-xs transition-colors rounded-none"
                  >
                    TIẾP TỤC MUA SẮM
                  </button>
                </div>
              ) : (
                <>
                  {checkoutStep === 'cart' && (
                    <div className="space-y-4">
                      {/* Dynamic Promotion Alert Widget */}
                      <div className="p-3 bg-brand-green/10 border border-brand-green/20 text-xs text-stone-200 space-y-1 rounded-none leading-relaxed">
                        {totalItemCount < 3 ? (
                          <p>
                            💡 Mua thêm <strong className="text-amber-500 font-extrabold">{3 - totalItemCount} sản phẩm</strong> để nhận ngay <strong className="text-amber-500 font-extrabold">GIẢM GIÁ 5%</strong> tổng đơn!
                          </p>
                        ) : totalItemCount >= 3 && totalItemCount < 5 ? (
                          <div className="space-y-1">
                            <p className="text-emerald-450 font-bold">
                              ✓ Đã áp dụng ưu đãi Combo (Giảm 5% tổng đơn)!
                            </p>
                            <p>
                              🎁 Mua thêm <strong className="text-amber-500 font-extrabold">{5 - totalItemCount} sản phẩm</strong> nữa để nhận thêm <strong className="text-amber-500 font-extrabold">1 GÓI BÚN NGÔ MIỄN PHÍ!</strong>
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-emerald-450 font-bold">
                              ✓ Đã áp dụng giảm giá Combo 5%!
                            </p>
                            <p className="text-amber-450 font-bold flex items-center gap-1">
                              🎁 Quà tặng: Bạn được tặng kèm 1 gói Bún Ngô Khô Premium (500g) miễn phí!
                            </p>
                          </div>
                        )}
                      </div>

                      {cart.map((item) => (
                        <div
                          key={`${item.product.id}-${item.selectedWeight}`}
                          className="flex gap-4 p-3 bg-zinc-900 border border-zinc-800 rounded-none relative group"
                        >
                          <div className="w-20 h-20 bg-zinc-800 relative overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-sm tracking-wide text-white font-sans uppercase">
                                {item.product.name}
                              </h4>
                              <p className="text-xs text-amber-500 font-semibold mt-1">
                                Trọng lượng: {item.selectedWeight}
                              </p>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                              {/* Quantity Counter */}
                              <div className="flex items-center border border-zinc-700 bg-zinc-950">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.selectedWeight,
                                      item.quantity - 1
                                    )
                                  }
                                  className="px-2 py-1 text-zinc-400 hover:text-white transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.selectedWeight,
                                      item.quantity + 1
                                    )
                                  }
                                  className="px-2 py-1 text-zinc-400 hover:text-white transition-colors"
                                >
                                  +
                                </button>
                              </div>

                              <span className="font-bold text-sm text-zinc-200">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                            className="absolute top-2 right-2 text-zinc-500 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {checkoutStep === 'form' && (
                    <form id="checkoutForm" onSubmit={handleCheckout} className="space-y-4">
                      <h3 className="font-bold text-md tracking-wider text-amber-500 uppercase border-b border-zinc-800 pb-2">
                        THÔNG TIN ĐẶT HÀNG
                      </h3>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                          Họ và Tên *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white rounded-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                          Số Điện Thoại *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ví dụ: 0912345678"
                          className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white rounded-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                          Tỉnh / Thành Phố *
                        </label>
                        <div className="relative">
                          <select
                            required
                            value={selectedProvince}
                            onChange={(e) => handleProvinceChange(e.target.value)}
                            className="w-full bg-[#111510] dark:bg-[#111510] border border-zinc-800 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white rounded-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23C8953A%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1rem_center] bg-no-repeat pr-10"
                          >
                            <option value="">-- Chọn Tỉnh / Thành Phố --</option>
                            {VIETNAM_PROVINCES.map((prov) => (
                              <option key={prov} value={prov} className="bg-zinc-900 text-white">
                                {prov}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                          Địa Chỉ Chi Tiết *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Số nhà, ngõ/ngách, xã/phường, quận/huyện"
                          className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white rounded-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                          Ghi Chú Đơn Hàng
                        </label>
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao"
                          className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white rounded-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                          Phương thức thanh toán *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('COD')}
                            className={`py-3 px-4 border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-none text-center ${
                              paymentMethod === 'COD'
                                ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-extrabold'
                                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                            }`}
                          >
                            💵 Ship COD
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('BANK_TRANSFER')}
                            className={`py-3 px-4 border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-none text-center ${
                              paymentMethod === 'BANK_TRANSFER'
                                ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-extrabold'
                                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                            }`}
                          >
                            🏦 Chuyển khoản QR
                          </button>
                        </div>
                      </div>

                      {errorMsg && (
                        <div className="bg-rose-950/20 border border-rose-800/40 text-rose-300 p-3 text-[11px] font-semibold leading-relaxed">
                          {errorMsg}
                        </div>
                      )}
                    </form>
                  )}

                  {checkoutStep === 'payment' && (
                    <div className="h-full flex flex-col items-center justify-center py-6 px-2 text-center">
                      <h3 className="text-lg font-bold uppercase tracking-wider text-amber-500 mb-2">
                        QUÉT MÃ QR THANH TOÁN
                      </h3>
                      <p className="text-xs text-zinc-400 mb-4">
                        Đơn hàng: <span className="font-mono text-white font-bold">{createdOrderId}</span>
                      </p>

                      {/* QR Display */}
                      <div className="relative w-56 h-56 bg-white border border-zinc-800 rounded-none p-3 mb-4 flex items-center justify-center shadow-lg">
                        <img
                          src={`https://qr.sepay.vn/img?bank=TPBank&acc=00000807385&template=compact&amount=${completedOrderTotal}&des=SOIMOC_${createdOrderId}`}
                          alt="Mã QR Chuyển khoản"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Total Amount */}
                      <div className="w-full bg-zinc-900 border border-zinc-800 py-3 px-4 mb-4 text-center">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Số tiền cần chuyển</span>
                        <p className="text-xl font-black text-amber-500">{formatPrice(completedOrderTotal)}</p>
                      </div>

                      {/* Status Indicator */}
                      <div className="w-full text-center py-3 px-4 rounded-none text-xs font-semibold mb-6 bg-zinc-900 border border-zinc-850 text-amber-400 flex items-center justify-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0"></div>
                        <span>Đang chờ chuyển khoản...</span>
                      </div>

                      {/* Manual Verification Button */}
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/orders/lookup', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ orderId: createdOrderId, phone })
                            });
                            const data = await res.json();
                            if (data.success && data.order.paymentStatus === 'paid') {
                              setCheckoutStep('success');
                            } else {
                              alert("Hệ thống chưa nhận được tiền chuyển khoản của bạn. Vui lòng đợi trong giây lát hoặc kiểm tra lại thông tin chuyển khoản.");
                            }
                          } catch (err) {
                            alert("Đã xảy ra lỗi khi kiểm tra giao dịch.");
                          }
                        }}
                        className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase tracking-widest text-xs transition-colors rounded-none mb-3 cursor-pointer"
                      >
                        Tôi đã chuyển khoản
                      </button>

                      {/* Fallback support or Zalo check */}
                      <button
                        onClick={() => setCheckoutStep('success')}
                        className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer"
                      >
                        Thanh toán sau / Hỗ trợ qua Zalo
                      </button>
                    </div>
                  )}

                  {checkoutStep === 'success' && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 px-2">
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <CheckCircle className="w-16 h-16 text-emerald-500 mb-6" />
                      </motion.div>
                      <h3 className="text-xl font-bold uppercase tracking-wider mb-2">ĐẶT HÀNG THÀNH CÔNG!</h3>
                      <p className="text-sm text-zinc-400 mb-6">
                        Thông tin đơn hàng của bạn đã được sao chép tự động vào bộ nhớ tạm (Clipboard).
                      </p>

                      <div className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-none text-left mb-6 font-mono text-xs text-zinc-300 max-h-48 overflow-y-auto space-y-1">
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-800 mb-2">
                          <span className="text-amber-500 font-bold uppercase">Nội dung đơn hàng đã lưu:</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(compiledOrderText);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            {copied ? 'Đã copy' : 'Copy lại'}
                          </button>
                        </div>
                        <p>👤 Khách hàng: {name}</p>
                        <p>📞 Điện thoại: {phone}</p>
                        <p>📍 Địa chỉ: {address}</p>
                        <p>💰 Tổng: {formatPrice(completedOrderTotal)}</p>
                      </div>

                      <p className="text-xs text-zinc-500 mb-8 leading-relaxed">
                        Hãy nhấn nút bên dưới để mở cuộc trò chuyện Zalo với Sợi Mộc và gửi tin nhắn (dán nội dung vừa copy) để xác nhận đơn nhanh nhất!
                      </p>

                      <button
                        onClick={redirectToZalo}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 rounded-none shadow-lg shadow-blue-900/30"
                      >
                        MỞ CHAT ZALO (0979.862.956)
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && checkoutStep !== 'success' && (
              <div className="p-5 border-t border-zinc-800 bg-zinc-900/50">
                {/* Coupon Code Input */}
                <div className="mb-4 pb-4 border-b border-zinc-800/60">
                  <label className="block text-[10px] font-black tracking-widest text-zinc-400 uppercase mb-1.5 font-sans">
                    Mã Giảm Giá (Coupons)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={appliedCoupon !== null}
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="Nhập mã (ví dụ: SOIMOCVIP15)"
                      className="flex-1 bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-white uppercase placeholder-zinc-700 rounded-none disabled:opacity-50 font-mono"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-extrabold text-xs uppercase tracking-wider transition-colors rounded-none cursor-pointer"
                      >
                        Hủy
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCodeInput.trim()}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-650 text-black font-black text-xs uppercase tracking-wider transition-colors rounded-none cursor-pointer"
                      >
                        {isValidatingCoupon ? 'Check...' : 'Áp dụng'}
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <p className="text-[10px] text-rose-500 font-semibold mt-1.5 flex items-center gap-1 leading-normal">
                      ⚠️ {couponError}
                    </p>
                  )}
                  {couponSuccess && (
                    <p className="text-[10px] text-emerald-450 font-bold mt-1.5 flex items-center gap-1 leading-normal">
                      ✓ {couponSuccess}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-zinc-400">Tạm tính</span>
                  <span className="text-zinc-200 font-medium">{formatPrice(cartTotal)}</span>
                </div>
                {comboDiscount > 0 && (
                  <div className="flex justify-between items-center mb-1 text-xs text-amber-500 font-bold">
                    <span>Ưu đãi Combo (Giảm 5%)</span>
                    <span>-{formatPrice(comboDiscount)}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between items-center mb-1.5 text-xs text-emerald-450 font-bold">
                    <span>Mã giảm giá ({appliedCoupon.code})</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-zinc-400">Phí vận chuyển {selectedProvince && `(${estimatedDays})`}</span>
                  <div className="relative inline-block pb-0.5">
                    <span className="text-zinc-200 font-medium">
                      {checkoutStep === 'cart' ? (
                        'Tính ở bước tiếp theo'
                      ) : !selectedProvince ? (
                        'Chọn tỉnh/thành'
                      ) : finalShippingFee === 0 ? (
                        <span className="text-emerald-450 font-bold">Miễn phí</span>
                      ) : (
                        formatPrice(finalShippingFee)
                      )}
                    </span>
                    {checkoutStep === 'form' && selectedProvince && (
                      <motion.div
                        key={`ship-${finalShippingFee}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        style={{ originX: 0 }}
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2B4C28]"
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-400 font-medium tracking-wide text-sm">Tổng cộng</span>
                  <div className="relative inline-block pb-1">
                    <span className="text-xl font-bold text-white font-sans">
                      {formatPrice(checkoutStep === 'cart' ? cartTotal - comboDiscount - couponDiscount : grandTotal)}
                    </span>
                    {checkoutStep === 'form' && selectedProvince && (
                      <motion.div
                        key={`total-${grandTotal}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        style={{ originX: 0 }}
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2B4C28]"
                      />
                    )}
                  </div>
                </div>
                <p className="text-zinc-500 text-xs mb-5 leading-normal">
                  Sợi Mộc giao hàng toàn quốc. Miễn phí vận chuyển cho đơn hàng từ 500k hoặc từ 5kg.
                </p>

                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('form')}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
                  >
                    TIẾN HÀNH ĐẶT HÀNG
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : checkoutStep === 'form' ? (
                  <div className="space-y-2">
                    <button
                      type="submit"
                      form="checkoutForm"
                      disabled={submitting}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 rounded-none disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'ĐANG TẠO ĐƠN HÀNG...' : paymentMethod === 'BANK_TRANSFER' ? 'ĐẶT HÀNG & THANH TOÁN QR' : 'XÁC NHẬN ĐẶT HÀNG (COD)'}
                      {!submitting && <ArrowRight className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="w-full py-2 bg-transparent text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none cursor-pointer text-center"
                    >
                      ← Quay lại giỏ hàng
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-none cursor-pointer"
                  >
                    QUAY LẠI GIỎ HÀNG
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
