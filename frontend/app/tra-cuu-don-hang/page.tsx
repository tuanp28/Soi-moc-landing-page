'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  ShoppingBag, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Truck, 
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  productId: string;
  name: string;
  selectedWeight: string;
  quantity: number;
  price: number;
}

interface StatusHistory {
  id: string;
  status: string;
  changedBy: string | null;
  changedAt: string;
  note: string | null;
}

interface OrderDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote: string | null;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  statusHistory?: StatusHistory[];
}

export default function OrderLookupPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [order, setOrder] = useState<OrderDetails | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setOrder(null);
    setLoading(true);

    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Đã xảy ra lỗi khi tìm kiếm đơn hàng.');
      } else {
        setOrder(data.order);
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối đến hệ thống. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get order status step
  const getStatusStep = (status: string) => {
    switch (status) {
      case 'waiting_confirm': return 1;
      case 'confirmed':
      case 'processing': return 2;
      case 'shipping': return 3;
      case 'completed': return 4;
      default: return 0; // cancelled or other
    }
  };

  const statusStep = order ? getStatusStep(order.orderStatus) : 0;

  // Translate status to Vietnamese
  const translateOrderStatus = (status: string) => {
    switch (status) {
      case 'waiting_confirm': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'processing': return 'Đang chế biến';
      case 'shipping': return 'Đang vận chuyển';
      case 'completed': return 'Giao thành công';
      case 'cancelled': return 'Đã hủy đơn';
      default: return status;
    }
  };

  const translatePaymentStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'partial_payment': return 'Thanh toán thiếu';
      case 'paid': return 'Đã thanh toán';
      case 'failed': return 'Thất bại';
      default: return status;
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F9F4EC] dark:bg-[#111510] text-[#1A1A1A] dark:text-stone-200 py-24 px-5 md:px-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-mono">
            ORDER JOURNEY
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1A1A1A] dark:text-white font-serif uppercase">
            Tra Cứu Đơn Hàng
          </h1>
          <p className="text-xs text-[#5A5A5A] dark:text-stone-400 max-w-md mx-auto uppercase tracking-wider font-mono">
            Kiểm tra trạng thái xử lý và vận chuyển đơn hàng của bạn tại Sợi Mộc
          </p>
        </div>

        {/* Search Box */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-8 shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2D5A27] via-[#C8953A] to-[#2D5A27]" />
          
          <form onSubmit={handleLookup} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black tracking-widest text-[#5A5A5A] dark:text-brand-muted uppercase font-mono block">
                Mã đơn hàng
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: SM-123456"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 bg-[#F9F4EC]/40 dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 focus:border-[#2D5A27] dark:focus:border-brand-green focus:bg-white text-sm text-[#1A1A1A] dark:text-stone-200 outline-none rounded-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black tracking-widest text-[#5A5A5A] dark:text-brand-muted uppercase font-mono block">
                Số điện thoại mua hàng
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: 0987 654 321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#F9F4EC]/40 dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 focus:border-[#2D5A27] dark:focus:border-brand-green focus:bg-white text-sm text-[#1A1A1A] dark:text-stone-200 outline-none rounded-none transition-all"
              />
            </div>

            <div className="md:col-span-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#2D5A27] hover:bg-[#1f3e1b] text-white text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 rounded-none shadow-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    TRA CỨU
                    <Search className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Status Error Display */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 p-4 text-xs font-semibold"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-700 dark:text-rose-450 mt-0.5" />
              <div>{errorMsg}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Details Display */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* 1. Status Progress Tracker */}
              <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 md:p-8 shadow-sm">
                <h3 className="text-xs font-black tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-mono mb-8">
                  Trạng thái xử lý đơn hàng
                </h3>

                {order.orderStatus === 'cancelled' ? (
                  <div className="flex items-center gap-3 p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 text-stone-500 dark:text-stone-400 text-xs font-bold font-mono uppercase tracking-widest">
                    <AlertCircle className="w-5 h-5 text-stone-500" />
                    ĐƠN HÀNG ĐÃ BỊ HỦY
                  </div>
                ) : (
                  <div className="relative pt-4">
                    {/* Progress Line */}
                    <div className="absolute top-8 left-[10%] right-[10%] h-1 bg-stone-100 dark:bg-stone-800 -translate-y-1/2 z-0 hidden sm:block" />
                    <div 
                      className="absolute top-8 left-[10%] h-1 bg-[#2D5A27] -translate-y-1/2 z-0 transition-all duration-700 hidden sm:block" 
                      style={{ width: `${(statusStep - 1) * 26.6}%` }}
                    />

                    {/* Steps Container */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 relative z-10">
                      {[
                        { step: 1, label: 'Chờ xác nhận', icon: Clock },
                        { step: 2, label: 'Đã xác nhận', icon: CheckCircle2 },
                        { step: 3, label: 'Đang vận chuyển', icon: Truck },
                        { step: 4, label: 'Đã hoàn thành', icon: ShoppingBag }
                      ].map((item) => {
                        const Icon = item.icon;
                        const isCurrent = statusStep === item.step;
                        const isDone = statusStep >= item.step;
                        return (
                          <div key={item.step} className="flex sm:flex-col items-center gap-3 sm:gap-2.5 text-left sm:text-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              isDone 
                                ? 'bg-[#2D5A27] border-[#2D5A27] text-white shadow-xs' 
                                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-600'
                            } ${isCurrent ? 'ring-4 ring-emerald-500/20 scale-105' : ''}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <p className={`text-[10px] font-black uppercase tracking-wider font-mono ${
                                isDone ? 'text-brand-green' : 'text-stone-400 dark:text-stone-600'
                              }`}>
                                {item.label}
                              </p>
                              {isCurrent && (
                                <span className="inline-block px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-[8px] font-bold uppercase tracking-widest font-mono">
                                  Hiện tại
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Detailed Status Log Timeline */}
                {order.statusHistory && order.statusHistory.length > 0 && (
                  <div className="mt-10 border-t border-[#2D5A27]/10 dark:border-white/10 pt-8 space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-mono mb-4">
                      Nhật ký hành trình đơn hàng
                    </h4>
                    <div className="relative pl-6 border-l border-[#2D5A27]/20 dark:border-white/10 space-y-6">
                      {order.statusHistory.map((h, idx) => (
                        <div key={h.id} className="relative">
                          {/* Indicator dot */}
                          <div className={`absolute -left-[28px] top-1.5 w-3 h-3 rounded-full border-2 bg-white dark:bg-stone-900 ${
                            idx === order.statusHistory!.length - 1 ? 'border-[#2D5A27] bg-[#2D5A27] animate-pulse' : 'border-stone-300'
                          }`} />
                          <div className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                              <span className="text-xs font-bold text-brand-charcoal dark:text-white">
                                {translateOrderStatus(h.status)}
                              </span>
                              <span className="text-[9px] font-bold font-mono text-brand-muted bg-[#F9F4EC]/60 dark:bg-stone-900 px-2 py-0.5 uppercase">
                                {h.changedBy || 'Hệ thống'}
                              </span>
                              <span className="text-[9px] font-mono text-brand-muted sm:ml-auto">
                                {new Date(h.changedAt).toLocaleString('vi-VN')}
                              </span>
                            </div>
                            {h.note && (
                              <p className="text-xs text-brand-muted font-sans mt-0.5">{h.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Order Details Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Delivery Info */}
                <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 shadow-sm md:col-span-1 space-y-5">
                  <h4 className="text-xs font-black tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-mono border-b border-[#2D5A27]/5 pb-3">
                    Thông tin nhận hàng
                  </h4>

                  <ul className="space-y-4 text-xs font-sans">
                    <li className="flex gap-3">
                      <User className="w-4 h-4 text-stone-400 dark:text-stone-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-stone-400 dark:text-stone-600 text-[9px] uppercase tracking-wider font-mono">Người nhận</p>
                        <p className="font-bold text-[#1A1A1A] dark:text-stone-200">{order.customerName}</p>
                      </div>
                    </li>

                    <li className="flex gap-3">
                      <Phone className="w-4 h-4 text-stone-400 dark:text-stone-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-stone-400 dark:text-stone-600 text-[9px] uppercase tracking-wider font-mono">Số điện thoại</p>
                        <p className="font-bold font-mono text-[#1A1A1A] dark:text-stone-200">{order.customerPhone}</p>
                      </div>
                    </li>

                    <li className="flex gap-3">
                      <MapPin className="w-4 h-4 text-stone-400 dark:text-stone-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-stone-400 dark:text-stone-600 text-[9px] uppercase tracking-wider font-mono">Địa chỉ giao hàng</p>
                        <p className="font-medium text-stone-700 dark:text-stone-300 leading-relaxed">{order.customerAddress}</p>
                      </div>
                    </li>

                    <li className="flex gap-3">
                      <Calendar className="w-4 h-4 text-stone-400 dark:text-stone-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-stone-400 dark:text-stone-600 text-[9px] uppercase tracking-wider font-mono">Ngày đặt hàng</p>
                        <p className="font-medium text-stone-700 dark:text-stone-300 font-mono">
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </li>

                    {order.customerNote && (
                      <li className="pt-2 border-t border-[#2D5A27]/5">
                        <p className="font-bold text-stone-400 dark:text-stone-600 text-[9px] uppercase tracking-wider font-mono">Ghi chú</p>
                        <p className="font-medium text-stone-600 dark:text-stone-400 italic">"{order.customerNote}"</p>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Cart Items & Payment summary */}
                <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 shadow-sm md:col-span-2 space-y-6">
                  <div className="flex items-center justify-between border-b border-[#2D5A27]/5 pb-3">
                    <h4 className="text-xs font-black tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-mono">
                      Chi tiết sản phẩm
                    </h4>
                    <span className="font-mono text-[10px] font-black text-[#C8953A] border border-[#C8953A]/20 px-2 py-0.5 uppercase">
                      Mã: {order.id}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-stone-100 dark:border-white/5 pb-3">
                        <div className="space-y-1">
                          <p className="font-serif font-bold text-[#1A1A1A] dark:text-stone-200">{item.name}</p>
                          <p className="text-[10px] text-stone-400 dark:text-stone-600 font-mono">
                            Hạng cân: {item.selectedWeight} | Đơn giá: {item.price.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#1A1A1A] dark:text-stone-200 font-mono">x{item.quantity}</p>
                          <p className="font-bold text-brand-green font-mono">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Info */}
                  <div className="grid grid-cols-2 gap-4 bg-[#F9F4EC]/40 dark:bg-stone-900/40 p-4 border border-[#2D5A27]/5">
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-stone-400 dark:text-stone-600 text-[8px] uppercase tracking-wider font-mono">Thanh toán</p>
                      <p className="font-black text-brand-green uppercase text-[10px] font-mono">
                        {order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản QR' : 'Ship COD'}
                      </p>
                    </div>
                    <div className="space-y-1 text-xs text-right">
                      <p className="font-bold text-stone-400 dark:text-stone-600 text-[8px] uppercase tracking-wider font-mono">Trạng thái</p>
                      <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest font-mono ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450'
                          : order.paymentStatus === 'partial_payment'
                          ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450'
                      }`}>
                        {translatePaymentStatus(order.paymentStatus)}
                      </span>
                    </div>
                  </div>

                  {/* Total Calculations */}
                  <div className="space-y-2 pt-2 text-xs border-t border-brand-green/5">
                    <div className="flex justify-between text-stone-500 dark:text-stone-400">
                      <span>Tạm tính (hàng hóa)</span>
                      <span className="font-mono">
                        {(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-stone-500 dark:text-stone-400">
                      <span>Phí vận chuyển</span>
                      <span className="font-mono">
                        {/* Calculate shipping fee = totalAmount - subtotal */}
                        {(order.totalAmount - order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) > 0)
                          ? `${(order.totalAmount - order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)).toLocaleString('vi-VN')}đ`
                          : 'Miễn phí'
                        }
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-black text-[#1A1A1A] dark:text-white pt-2 border-t border-dashed border-stone-200 dark:border-stone-800">
                      <span className="font-serif">TỔNG THANH TOÁN</span>
                      <span className="font-mono text-[#C8953A]">
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
