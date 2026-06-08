'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { supabase } from '@/src/lib/supabase';
import { LogOut, User as UserIcon, Calendar, Mail, ShieldCheck, ShoppingBag, Eye, Award, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_note: string | null;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total_amount: number;
  created_at: string;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Parse user metadata & date details
  const fullName = user?.user_metadata?.full_name || 'Khách hàng Sợi Mộc';
  const email = user?.email || 'N/A';
  const userId = user?.id || 'N/A';
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  // Card Number simulation based on UUID hash
  const cardNumber = `SM-${userId.substring(0, 4)}-${userId.substring(9, 13)}-${userId.substring(19, 23)}`.toUpperCase();

  // Fetch past orders from Supabase
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;
      setLoadingOrders(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to fetch user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting_confirm': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipping': return 'Đang giao hàng';
      case 'completed': return 'Thành công';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'waiting_confirm': return 'bg-amber-50 text-amber-800 border-amber-250';
      case 'confirmed': return 'bg-sky-50 text-sky-850 border-sky-200';
      case 'shipping': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'completed': return 'bg-emerald-50 text-emerald-850 border-emerald-250';
      case 'cancelled': return 'bg-rose-50 text-rose-800 border-rose-250';
      default: return 'bg-neutral-50 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-[85vh] bg-[#F9F4EC] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-5 md:px-10 space-y-10">
          
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#2D5A27]/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#2D5A27]/10 border border-[#2D5A27]/20 flex items-center justify-center text-[#2D5A27]">
                <UserIcon className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] font-serif uppercase">
                  HỒ SƠ CỦA BẠN
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase font-mono">
                    TÀI KHOẢN HOẠT ĐỘNG
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 px-5 py-3 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-800 font-extrabold text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Đăng Xuất
            </button>
          </div>

          {/* Lưới 2 cột: Cột 1 (Thông tin thành viên & Thẻ), Cột 2 (Lịch sử đơn hàng) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cột Trái (5 cols): Thẻ Club & Thông tin tài khoản */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Premium Club Card */}
              <motion.div
                initial={{ rotateY: -10, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full aspect-[1.586/1] bg-gradient-to-br from-[#1a3817] via-[#2D5A27] to-[#142812] text-white p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10"
              >
                {/* Gloss sheen effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,149,58,0.25),transparent_60%)] pointer-events-none" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start z-10">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black tracking-widest text-[#C8953A] uppercase font-mono">
                      SỢI MỘC CLUB MEMBER
                    </p>
                    <h2 className="text-xl font-bold font-serif tracking-tight">Sợi Mộc</h2>
                  </div>
                  
                  {/* VIP Badge */}
                  <div className="flex items-center gap-1.5 bg-[#C8953A]/25 border border-[#C8953A]/40 px-2.5 py-1 text-[8px] font-black tracking-wider text-[#FAF6EE] uppercase font-mono">
                    <Award className="w-3.5 h-3.5 text-[#C8953A]" />
                    Bạch Kim
                  </div>
                </div>

                {/* Card Number */}
                <div className="my-auto z-10">
                  <p className="font-mono text-base md:text-lg tracking-widest text-stone-100/90 font-bold select-all">
                    {cardNumber}
                  </p>
                </div>

                <div className="flex justify-between items-end z-10">
                  <div>
                    <p className="text-[8px] text-white/50 uppercase tracking-widest font-mono">Chủ thẻ</p>
                    <p className="text-xs font-extrabold uppercase tracking-wide mt-0.5">{fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-white/50 uppercase tracking-widest font-mono">Ưu đãi hiện tại</p>
                    <p className="text-xs font-black text-[#C8953A] mt-0.5">Giảm 5% đơn hàng</p>
                  </div>
                </div>
              </motion.div>

              {/* Thông tin tài khoản */}
              <div className="bg-white border border-[#2D5A27]/10 p-6 md:p-8 shadow-xs space-y-5">
                <h3 className="text-xs font-black tracking-widest text-[#5A5A5A] uppercase font-mono border-b border-[#2D5A27]/5 pb-2">
                  Chi tiết tài khoản
                </h3>
                
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#2D5A27] shrink-0" />
                    <div>
                      <p className="text-[8px] text-[#5A5A5A]/70 uppercase tracking-wider font-bold">Email đăng nhập</p>
                      <p className="font-semibold text-[#1A1A1A] mt-0.5">{email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#2D5A27] shrink-0" />
                    <div>
                      <p className="text-[8px] text-[#5A5A5A]/70 uppercase tracking-wider font-bold">Ngày tham gia</p>
                      <p className="font-semibold text-[#1A1A1A] mt-0.5">{joinDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#2D5A27] shrink-0" />
                    <div>
                      <p className="text-[8px] text-[#5A5A5A]/70 uppercase tracking-wider font-bold">Trạng thái xác thực</p>
                      <p className="font-semibold text-emerald-800 mt-0.5">Đã xác minh tài khoản</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Cột Phải (7 cols): Lịch sử đơn hàng */}
            <div className="lg:col-span-7 bg-white border border-[#2D5A27]/10 p-6 md:p-8 shadow-xs flex flex-col justify-between">
              
              <div>
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#2D5A27]/5">
                  <ShoppingBag className="w-5 h-5 text-[#2D5A27]" />
                  <h3 className="font-extrabold text-sm uppercase tracking-widest font-mono">
                    Lịch sử đặt hàng
                  </h3>
                </div>

                {loadingOrders ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-mono font-bold tracking-widest text-[#5A5A5A] uppercase animate-pulse">
                      Đang tải lịch sử đơn...
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="text-4xl text-stone-300">📦</div>
                    <p className="text-xs text-[#5A5A5A] font-medium max-w-sm mx-auto leading-relaxed">
                      Bạn chưa thực hiện bất kỳ giao dịch mua hàng nào. Hãy khám phá danh mục để chọn sản phẩm mộc mạc tốt cho sức khỏe!
                    </p>
                    <a
                      href="/products"
                      className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#2D5A27] hover:bg-[#1f3e1b] text-white text-xs font-black tracking-widest uppercase transition-colors"
                    >
                      MUA SẮM NGAY
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 border border-stone-200 hover:border-[#2D5A27]/20 bg-[#FAF6EE]/20 hover:bg-[#FAF6EE]/40 transition-colors flex justify-between items-center gap-4 group"
                      >
                        <div className="space-y-1.5">
                          <p className="font-mono text-xs font-extrabold text-brand-charcoal">
                            #{order.id}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-stone-500 font-medium">
                              {new Date(order.created_at).toLocaleDateString('vi-VN')}
                            </span>
                            <span className={`text-[8px] font-black tracking-wider uppercase px-2 py-0.5 border font-mono ${getOrderStatusColor(order.order_status)}`}>
                              {getOrderStatusLabel(order.order_status)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[8px] text-stone-500 uppercase tracking-widest font-mono">Tổng cộng</p>
                            <p className="text-sm font-extrabold text-[#2D5A27]">
                              {order.total_amount.toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                          
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 border border-stone-200 group-hover:border-[#2D5A27] text-stone-500 group-hover:text-[#2D5A27] transition-all bg-white hover:shadow-2xs cursor-pointer"
                            title="Xem chi tiết đơn hàng"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Modal chi tiết đơn hàng */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5 backdrop-blur-xs select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#2D5A27]/10 w-full max-w-lg p-6 relative overflow-hidden shadow-2xl space-y-6"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D5A27] via-[#C8953A] to-[#2D5A27]" />
              
              <div className="flex justify-between items-start pb-2.5 border-b border-stone-200/60">
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 uppercase">
                    CHI TIẾT ĐƠN HÀNG
                  </h4>
                  <p className="font-mono text-xs font-black text-brand-green mt-0.5">
                    #{selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200 transition-all cursor-pointer font-extrabold text-xs"
                >
                  ĐÓNG
                </button>
              </div>

              <div className="space-y-4 text-xs leading-relaxed font-sans">
                {/* Thông tin nhận hàng */}
                <div className="space-y-1">
                  <p className="text-[9px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono">Thông tin nhận hàng</p>
                  <div className="p-3 bg-[#FAF6EE] space-y-1">
                    <p><span className="font-bold">Người nhận:</span> {selectedOrder.customer_name}</p>
                    <p><span className="font-bold">Điện thoại:</span> {selectedOrder.customer_phone}</p>
                    <p><span className="font-bold">Địa chỉ:</span> {selectedOrder.customer_address}</p>
                    {selectedOrder.customer_note && <p><span className="font-bold">Ghi chú:</span> {selectedOrder.customer_note}</p>}
                  </div>
                </div>

                {/* Thanh toán & Vận chuyển */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono">Phương thức thanh toán</p>
                    <p className="font-bold text-stone-800">{selectedOrder.payment_method} (COD)</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono">Trạng thái thanh toán</p>
                    <p className="font-bold text-amber-700">Chưa thanh toán</p>
                  </div>
                </div>

                {/* Tổng tiền */}
                <div className="pt-4 border-t border-stone-200/60 flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono">Tổng đơn hàng</p>
                    <p className="text-xl font-serif font-black text-brand-green mt-0.5">
                      {selectedOrder.total_amount.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  <a
                    href="https://zalo.me/0377159498"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-[#0068FF] hover:bg-[#0052cc] text-white font-extrabold text-[9px] tracking-widest uppercase flex items-center gap-1 hover:shadow-sm"
                  >
                    NHẮN HỖ TRỢ ZALO
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}
