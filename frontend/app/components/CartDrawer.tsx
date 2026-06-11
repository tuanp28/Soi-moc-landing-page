'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { X, ShoppingBag, Trash2, ArrowRight, CheckCircle, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [compiledOrderText, setCompiledOrderText] = useState('');
  const [completedOrderTotal, setCompletedOrderTotal] = useState(0);

  // Coupon states
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Pre-fill name if user is logged in
  useEffect(() => {
    if (user && profile) {
      setName(profile.fullName || user.user_metadata?.full_name || '');
    }
  }, [user, profile]);

  // Reset drawer state on close after animation completes
  useEffect(() => {
    if (!isCartOpen && checkoutStep === 'success') {
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
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen, checkoutStep]);

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
    if (!name || !phone || !address) return;

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
          totalAmount: cartTotal,
          cartItems: cart.map(item => ({
            productId: item.product.id,
            selectedWeight: item.selectedWeight,
            quantity: item.quantity,
          })),
          couponCode: appliedCoupon ? appliedCoupon.code : null,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Lỗi khi đặt hàng.');
      }

      const orderId = resData.order.id;

      // Generate Order Text with database-saved ID
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
📍 Địa chỉ giao hàng: ${address}
💬 Ghi chú: ${note || 'Không có'}
-----------------------------
🛒 Danh sách sản phẩm:
${itemsText}
-----------------------------
${appliedCoupon ? `🎟️ Mã giảm giá: ${appliedCoupon.code} (-${couponDiscount.toLocaleString('vi-VN')}đ)\n-----------------------------\n` : ''}💰 Tổng đơn hàng: ${(cartTotal - couponDiscount).toLocaleString('vi-VN')}đ
(Chưa bao gồm phí vận chuyển - Đồng giá ship toàn quốc 30.000đ, miễn ship từ 5kg hoặc đơn hàng trên 500k)`;

      // Copy to clipboard
      navigator.clipboard.writeText(orderText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });

      setCompiledOrderText(orderText);
      setCompletedOrderTotal(cartTotal - couponDiscount);
      clearCart();
      setCheckoutStep('success');
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
              {cart.length === 0 && checkoutStep !== 'success' ? (
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
                    <form onSubmit={handleCheckout} className="space-y-4">
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
                          Địa Chỉ Nhận Hàng *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Số nhà, ngõ/ngách, xã/phường, quận/huyện, tỉnh/thành"
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

                      {errorMsg && (
                        <div className="bg-rose-950/20 border border-rose-800/40 text-rose-300 p-3 text-[11px] font-semibold leading-relaxed">
                          {errorMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-4 py-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 rounded-none disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? 'ĐANG TẠO ĐƠN HÀNG...' : 'ĐẶT HÀNG & COPY ĐƠN HÀNG'}
                        {!submitting && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </form>
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
                {appliedCoupon && (
                  <div className="flex justify-between items-center mb-3 text-xs text-emerald-450 font-bold">
                    <span>Mã giảm giá ({appliedCoupon.code})</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-400 font-medium tracking-wide text-sm">Tổng cộng</span>
                  <span className="text-xl font-bold text-white font-sans">{formatPrice(cartTotal - couponDiscount)}</span>
                </div>
                <p className="text-zinc-500 text-xs mb-5 leading-normal">
                  Phí vận chuyển sẽ được tính khi xác nhận đơn hàng (Đồng giá 30k toàn quốc, miễn phí cho đơn hàng từ 5kg).
                </p>

                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('form')}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
                  >
                    TIẾN HÀNH ĐẶT HÀNG
                    <ArrowRight className="w-4 h-4" />
                  </button>
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
