'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
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

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [copied, setCopied] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) return;

    // Generate Order Text
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
👤 Khách hàng: ${name}
📞 Số điện thoại: ${phone}
📍 Địa chỉ giao hàng: ${address}
💬 Ghi chú: ${note || 'Không có'}
-----------------------------
🛒 Danh sách sản phẩm:
${itemsText}
-----------------------------
💰 Tổng đơn hàng: ${cartTotal.toLocaleString('vi-VN')}đ
(Chưa bao gồm phí vận chuyển - Đồng giá ship toàn quốc 30.000đ, miễn ship từ 5kg hoặc đơn hàng trên 500k)`;

    // Copy to clipboard
    navigator.clipboard.writeText(orderText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });

    setCheckoutStep('success');
  };

  const redirectToZalo = () => {
    // Open Zalo chat with the merchant
    window.open('https://zalo.me/0979862956', '_blank');
    clearCart();
    setIsCartOpen(false);
    // Reset state
    setName('');
    setPhone('');
    setAddress('');
    setNote('');
    setCheckoutStep('cart');
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

                      <button
                        type="submit"
                        className="w-full mt-4 py-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 rounded-none"
                      >
                        ĐẶT HÀNG & COPY ĐƠN HÀNG
                        <ArrowRight className="w-4 h-4" />
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
👤 Khách hàng: ${name}
📞 Số điện thoại: ${phone}
📍 Địa chỉ giao hàng: ${address}
💬 Ghi chú: ${note || 'Không có'}
-----------------------------
🛒 Danh sách sản phẩm:
${itemsText}
-----------------------------
💰 Tổng đơn hàng: ${cartTotal.toLocaleString('vi-VN')}đ`;
                              navigator.clipboard.writeText(orderText);
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
                        <p>💰 Tổng: {formatPrice(cartTotal)}</p>
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
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-400 font-medium tracking-wide text-sm">Tạm tính</span>
                  <span className="text-xl font-bold text-white font-sans">{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-zinc-500 text-xs mb-5">
                  Phí vận chuyển sẽ được tính khi xác nhận đơn hàng (Đồng giá 30k toàn quốc, miễn phí cho đơn hàng từ 5kg).
                </p>

                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('form')}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 rounded-none"
                  >
                    TIẾN HÀNH ĐẶT HÀNG
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-none"
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
