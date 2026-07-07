'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { 
  ShoppingBag, 
  Truck, 
  TrendingUp, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  User as UserIcon,
  CheckCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/app/components/ProtectedRoute';

interface OrderItem {
  productId: string;
  name: string;
  selectedWeight: string;
  quantity: number;
  price: number;
}

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
  items?: OrderItem[];
  created_at: string;
}

const mockOrders: Order[] = [
  {
    id: "SM-883902",
    customer_name: "Nguyễn Văn Hùng",
    customer_phone: "0982345678",
    customer_address: "12 Cầu Giấy, Láng Thượng, Đống Đa, Hà Nội",
    customer_note: "Giao giờ hành chính",
    payment_method: "COD",
    payment_status: "pending",
    order_status: "waiting_confirm",
    total_amount: 125000,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: "SM-923841",
    customer_name: "Lê Thị Lan",
    customer_phone: "0971234567",
    customer_address: "88 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    customer_note: null,
    payment_method: "COD",
    payment_status: "paid",
    order_status: "completed",
    total_amount: 260000,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: "SM-743829",
    customer_name: "Trần Thanh Sơn",
    customer_phone: "0915998877",
    customer_address: "Số 5 Ngõ 12 Đường 3/2, Quận 10, TP. Hồ Chí Minh",
    customer_note: "Gọi điện trước khi giao",
    payment_method: "COD",
    payment_status: "pending",
    order_status: "shipping",
    total_amount: 380000,
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: "SM-482019",
    customer_name: "Phạm Minh Hoàng",
    customer_phone: "0904443322",
    customer_address: "Khu đô thị Sala, Mai Chí Thọ, Quận 2, TP. Hồ Chí Minh",
    customer_note: "Giao gấp trong hôm nay",
    payment_method: "COD",
    payment_status: "pending",
    order_status: "waiting_confirm",
    total_amount: 180000,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];

function StaffDashboard() {
  const router = useRouter();
  const { user, profile, session, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [selectedOrderHistory, setSelectedOrderHistory] = useState<any[]>([]);

  useEffect(() => {
    if (selectedOrder && selectedOrder.id) {
      setSelectedOrderHistory([]);
      fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selectedOrder.id, phone: selectedOrder.customer_phone })
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order && data.order.statusHistory) {
          setSelectedOrderHistory(data.order.statusHistory);
        }
      })
      .catch((err) => console.error('Error loading order history:', err));
    } else {
      setSelectedOrderHistory([]);
    }
  }, [selectedOrder?.id]);

  const fetchOrders = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.orders && resData.orders.length > 0) {
          setOrders(resData.orders);
          setIsUsingMock(false);
        } else {
          setOrders(mockOrders);
          setIsUsingMock(true);
        }
      } else {
        throw new Error('Failed to fetch from API');
      }
    } catch (err) {
      console.warn('Backend orders query failed, displaying mock admin data:', err);
      setOrders(mockOrders);
      setIsUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const handleUpdateStatus = async (orderId: string, field: 'order_status' | 'payment_status', newStatus: string) => {
    if (!session) return;
    setActionLoadingId(orderId);
    try {
      // If it's a database order (real order SM-XXXXXX starts with SM- and length > 8)
      if (orderId.startsWith('SM-') && orderId.length > 8) {
        const response = await fetch('/api/orders', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            orderId,
            field,
            status: newStatus
          })
        });

        const resData = await response.json();
        if (!response.ok || !resData.success) {
          throw new Error(resData.error || 'Failed to update order status');
        }
      }

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, [field]: newStatus } 
            : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, [field]: newStatus } : null);
        // Refresh history log
        setTimeout(() => {
          fetch('/api/orders/lookup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, phone: selectedOrder.customer_phone })
          })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.order && data.order.statusHistory) {
              setSelectedOrderHistory(data.order.statusHistory);
            }
          });
        }, 500);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Cập nhật trạng thái thất bại: ' + (err as Error).message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalOrders = orders.filter(o => o.order_status !== 'cancelled').length;
  const newOrders = orders.filter(o => o.order_status === 'waiting_confirm').length;
  const shippingOrders = orders.filter(o => o.order_status === 'shipping').length;
  const totalRevenue = orders
    .filter(o => o.order_status === 'completed' && o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // 1. Prioritize active orders (waiting_confirm, confirmed, shipping) over completed/cancelled ones
    const isAActive = a.order_status !== 'completed' && a.order_status !== 'cancelled';
    const isBActive = b.order_status !== 'completed' && b.order_status !== 'cancelled';

    if (isAActive && !isBActive) return -1;
    if (!isAActive && isBActive) return 1;

    // Both are active or both are inactive
    if (isAActive) {
      // 2. Prioritize BANK_TRANSFER (QR code payment on web) over COD
      const isAQR = a.payment_method === 'BANK_TRANSFER';
      const isBQR = b.payment_method === 'BANK_TRANSFER';

      if (isAQR && !isBQR) return -1;
      if (!isAQR && isBQR) return 1;

      // 3. If both are QR, prioritize 'paid' status first
      if (isAQR && isBQR) {
        const isAPaid = a.payment_status === 'paid';
        const isBPaid = b.payment_status === 'paid';
        if (isAPaid && !isBPaid) return -1;
        if (!isAPaid && isBPaid) return 1;
      }
    }

    // 4. Default: Newest first
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'waiting_confirm': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipping': return 'Đang giao hàng';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getOrderStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'waiting_confirm': return 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-850';
      case 'confirmed': return 'bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-850';
      case 'shipping': return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400 border-indigo-200 dark:border-indigo-850';
      case 'completed': return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-850';
      case 'cancelled': return 'bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-850';
      default: return 'bg-zinc-50 dark:bg-zinc-950/25 text-zinc-800 dark:text-zinc-400 border-zinc-200';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chưa thanh toán';
      case 'partial_payment': return 'Thanh toán thiếu';
      case 'paid': return 'Đã thanh toán';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  return (
    <div className="bg-[#F9F4EC] dark:bg-[#111510] text-[#1A1A1A] dark:text-stone-200 min-h-[90vh] py-16 px-5 md:px-10 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Title & Refresh Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#2D5A27]/10 dark:border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-mono">
              BẢNG ĐIỀU KHIỂN NHÂN VIÊN (STAFF)
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A1A1A] dark:text-white font-serif uppercase mt-1">
              Quản lý đơn hàng
            </h1>
            {isUsingMock && (
              <span className="inline-block mt-2 text-[9px] bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 font-mono font-bold uppercase rounded-sm">
                ⚠️ Fallback Mock Data
              </span>
            )}
          </div>

          <button
            onClick={fetchOrders}
            className="w-fit flex items-center justify-center gap-2 px-5 py-3 border border-[#2D5A27]/20 hover:border-[#2D5A27] bg-white dark:bg-stone-900 text-xs font-black tracking-widest uppercase hover:shadow-xs active:scale-95 transition-all cursor-pointer rounded-none text-[#1A1A1A] dark:text-stone-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Làm mới dữ liệu
          </button>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-[9px] text-[#5A5A5A] dark:text-brand-muted uppercase tracking-widest font-black font-mono">Tổng Doanh Thu</p>
              <h3 className="text-xl md:text-2xl font-black text-[#1A1A1A] dark:text-white">
                {totalRevenue.toLocaleString('vi-VN')}đ
              </h3>
              <p className="text-[8px] text-brand-muted">Không tính đơn đã hủy</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-[9px] text-[#5A5A5A] dark:text-brand-muted uppercase tracking-widest font-black font-mono">Tổng Đơn Hàng</p>
              <h3 className="text-xl md:text-2xl font-black text-[#1A1A1A] dark:text-white">
                {totalOrders} Đơn
              </h3>
              <p className="text-[8px] text-brand-muted">Đơn hàng hoạt động</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-[9px] text-[#5A5A5A] dark:text-brand-muted uppercase tracking-widest font-black font-mono">Đơn Hàng Mới</p>
              <h3 className="text-xl md:text-2xl font-black text-amber-800 dark:text-amber-400">
                {newOrders} Đơn
              </h3>
              <p className="text-[8px] text-amber-700 dark:text-amber-400/80 animate-pulse font-semibold">● Chờ xác nhận</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 flex items-center justify-center relative">
              {newOrders > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />}
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-[9px] text-[#5A5A5A] dark:text-brand-muted uppercase tracking-widest font-black font-mono">Đang Giao Hàng</p>
              <h3 className="text-xl md:text-2xl font-black text-indigo-800 dark:text-indigo-400">
                {shippingOrders} Đơn
              </h3>
              <p className="text-[8px] text-brand-muted">Đã gửi vận chuyển</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex flex-col md:flex-row items-center gap-4 justify-between shadow-xs">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5A5A5A]/60 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên khách, SĐT, hoặc Mã đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#F9F4EC]/40 dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 text-sm text-[#1A1A1A] dark:text-stone-200 outline-none rounded-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['all', 'waiting_confirm', 'confirmed', 'shipping', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 text-[9px] font-black tracking-widest uppercase transition-all cursor-pointer border rounded-none ${
                  statusFilter === st
                    ? 'bg-[#2D5A27] border-[#2D5A27] text-white'
                    : 'bg-white dark:bg-stone-950 border-[#2D5A27]/10 dark:border-white/10 text-[#5A5A5A] dark:text-stone-400 hover:text-[#1A1A1A] dark:hover:text-white'
                }`}
              >
                {st === 'all' ? 'TẤT CẢ' : getOrderStatusText(st)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 overflow-hidden shadow-md">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-black tracking-widest text-[#5A5A5A] uppercase font-mono animate-pulse">
                Đang tải dữ liệu đơn hàng...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-24 text-center text-[#5A5A5A]/60 uppercase tracking-wider text-xs font-mono">
              Không tìm thấy đơn hàng phù hợp.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#2D5A27]/5 dark:bg-[#2D5A27]/10 border-b border-[#2D5A27]/10 dark:border-white/10 text-[9px] font-black tracking-widest text-[#5A5A5A] dark:text-stone-400 uppercase font-mono">
                    <th className="p-4.5">Mã Đơn Hàng</th>
                    <th className="p-4.5">Thời Gian</th>
                    <th className="p-4.5">Khách Hàng</th>
                    <th className="p-4.5">Tổng Tiền</th>
                    <th className="p-4.5">Thanh Toán</th>
                    <th className="p-4.5">Trạng Thái Đơn</th>
                    <th className="p-4.5 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D5A27]/5 dark:divide-white/5 text-xs">
                  {sortedOrders.map((order) => (
                    <tr 
                      key={order.id}
                      className="hover:bg-[#F9F4EC]/30 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4.5 font-mono text-[10px] font-bold text-[#2D5A27] dark:text-brand-green-light">
                        <div>#{order.id.slice(0, 8)}...</div>
                        <div className="mt-1">
                          {order.payment_method === 'BANK_TRANSFER' ? (
                            <span className="inline-block px-1.5 py-0.5 text-[8px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase rounded-sm">
                              🏦 Web QR
                            </span>
                          ) : (
                            <span className="inline-block px-1.5 py-0.5 text-[8px] font-extrabold bg-stone-500/10 text-stone-600 dark:text-stone-400 border border-stone-500/20 uppercase rounded-sm">
                              💵 Ship COD
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4.5 text-[#5A5A5A] dark:text-stone-450">
                        {new Date(order.created_at).toLocaleString('vi-VN', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      <td className="p-4.5 space-y-0.5">
                        <p className="font-extrabold text-[#1A1A1A] dark:text-stone-200">{order.customer_name}</p>
                        <p className="text-[10px] text-[#5A5A5A] dark:text-brand-muted">{order.customer_phone}</p>
                      </td>

                      <td className="p-4.5 font-extrabold text-[#1A1A1A] dark:text-white font-sans">
                        {order.total_amount.toLocaleString('vi-VN')}đ
                      </td>

                      <td className="p-4.5">
                        <select
                          disabled={actionLoadingId === order.id}
                          value={order.payment_status}
                          onChange={(e) => handleUpdateStatus(order.id, 'payment_status', e.target.value)}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs outline-none bg-white dark:bg-stone-900 border cursor-pointer ${
                            order.payment_status === 'paid' 
                              ? 'text-emerald-800 border-emerald-300 bg-emerald-50 dark:text-emerald-450 dark:border-emerald-950 dark:bg-emerald-950/20' 
                              : order.payment_status === 'partial_payment'
                              ? 'text-orange-850 border-orange-300 bg-orange-50 dark:text-orange-400 dark:border-orange-950 dark:bg-orange-950/20'
                              : 'text-amber-800 border-amber-300 bg-amber-50 dark:text-amber-450 dark:border-amber-950 dark:bg-amber-950/20'
                          }`}
                        >
                          <option value="pending">Chưa TT</option>
                          <option value="partial_payment">Thiếu tiền</option>
                          <option value="paid">Đã TT</option>
                          <option value="refunded">Hoàn tiền</option>
                        </select>
                      </td>

                      <td className="p-4.5">
                        <select
                          disabled={actionLoadingId === order.id}
                          value={order.order_status}
                          onChange={(e) => handleUpdateStatus(order.id, 'order_status', e.target.value)}
                          className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider border rounded-none bg-white dark:bg-stone-900 cursor-pointer ${getOrderStatusBadgeClass(order.order_status)}`}
                        >
                          <option value="waiting_confirm">Chờ xác nhận</option>
                          <option value="confirmed">Đã xác nhận</option>
                          <option value="shipping">Đang giao</option>
                          <option value="completed">Hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </td>

                      <td className="p-4.5 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3.5 py-2 border border-[#2D5A27]/20 hover:bg-[#2D5A27] hover:text-white transition-all text-[9px] font-black tracking-widest uppercase cursor-pointer text-[#1A1A1A] dark:text-stone-300 rounded-none dark:hover:border-brand-green"
                        >
                          CHI TIẾT
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Order Details */}
        <AnimatePresence>
          {selectedOrder && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="fixed inset-0 bg-black z-50 cursor-pointer"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.3 }}
                className="fixed inset-x-5 bottom-5 top-5 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden max-h-[85vh] rounded-none text-[#1A1A1A] dark:text-stone-200"
              >
                <div className="h-1.5 bg-[#2D5A27]" />

                <div className="p-6 border-b border-[#2D5A27]/10 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-serif uppercase text-[#1A1A1A] dark:text-white">
                      Chi Tiết Đơn Hàng
                    </h3>
                    <p className="font-mono text-[10px] text-brand-muted mt-0.5">
                      #{selectedOrder.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 hover:bg-[#F9F4EC] dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-mono border-b border-[#2D5A27]/5 dark:border-white/5 pb-1">
                      Thông Tin Giao Hàng
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-[#2D5A27]/60 dark:text-brand-green-light/60 shrink-0" />
                        <div>
                          <p className="text-[8px] text-brand-muted uppercase tracking-wider font-bold">Khách hàng</p>
                          <p className="font-extrabold mt-0.5">{selectedOrder.customer_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#2D5A27]/60 dark:text-brand-green-light/60 shrink-0" />
                        <div>
                          <p className="text-[8px] text-brand-muted uppercase tracking-wider font-bold">Số điện thoại</p>
                          <p className="font-extrabold mt-0.5">{selectedOrder.customer_phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-[#2D5A27]/60 dark:text-brand-green-light/60 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[8px] text-brand-muted uppercase tracking-wider font-bold">Địa chỉ giao hàng</p>
                          <p className="font-semibold mt-0.5 leading-relaxed">{selectedOrder.customer_address}</p>
                        </div>
                      </div>

                      {selectedOrder.customer_note && (
                        <div className="flex items-start gap-2 sm:col-span-2 bg-[#F9F4EC]/50 dark:bg-stone-900/50 p-3 border border-[#2D5A27]/5 dark:border-white/5">
                          <AlertCircle className="w-4 h-4 text-[#2D5A27]/70 dark:text-[#2d5a27]/90 shrink-0" />
                          <div>
                            <p className="text-[8px] text-[#2D5A27] dark:text-brand-green-light uppercase tracking-wider font-bold">Ghi chú đơn hàng</p>
                            <p className="font-medium mt-0.5 italic">{selectedOrder.customer_note}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-mono border-b border-[#2D5A27]/5 dark:border-white/5 pb-1">
                      Danh Sách Sản Phẩm
                    </h4>
                    <div className="divide-y divide-stone-200/50 dark:divide-white/5 text-xs">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                            <div className="space-y-0.5">
                              <p className="font-extrabold">{item.name}</p>
                              <p className="text-[10px] text-brand-muted font-mono uppercase tracking-wider">
                                Phân loại: {item.selectedWeight} | Đơn giá: {item.price.toLocaleString('vi-VN')}đ
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-mono font-bold text-brand-charcoal dark:text-stone-300">x{item.quantity}</p>
                              <p className="font-extrabold text-[#2D5A27] dark:text-brand-green-light mt-0.5">
                                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-brand-muted italic py-2">Không có thông tin chi tiết sản phẩm.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#F9F4EC]/40 dark:bg-stone-950/20 border border-[#2D5A27]/10 dark:border-white/10 p-5 space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-mono border-b border-[#2D5A27]/5 dark:border-white/5 pb-1">
                      Tổng Quan Đơn Hàng
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                      <div>
                        <p className="text-[9px] text-brand-muted uppercase">Phương thức</p>
                        <p className="font-extrabold mt-0.5 font-mono text-[10px] text-[#2D5A27] dark:text-brand-green-light">{selectedOrder.payment_method}</p>
                      </div>

                      <div>
                        <p className="text-[9px] text-brand-muted uppercase">Thanh toán</p>
                        <p className="font-extrabold mt-0.5">{getPaymentStatusText(selectedOrder.payment_status)}</p>
                      </div>

                      <div>
                        <p className="text-[9px] text-brand-muted uppercase">Thời gian</p>
                        <p className="font-extrabold mt-0.5">
                          {new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-[#2D5A27] dark:text-brand-green-light uppercase font-bold">Tổng thanh toán</p>
                        <p className="text-sm font-black text-[#2D5A27] dark:text-brand-green-light font-sans mt-0.5">
                          {selectedOrder.total_amount.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-brand-muted uppercase font-mono border-b border-[#2D5A27]/5 dark:border-white/5 pb-1">
                      Cập Nhật Trạng Thái Đơn Hàng
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[9px] font-bold text-brand-muted uppercase tracking-wider">Trạng thái xử lý</label>
                        <select
                          value={selectedOrder.order_status}
                          onChange={(e) => handleUpdateStatus(selectedOrder.id, 'order_status', e.target.value)}
                          className="w-full px-3 py-2.5 border border-[#2D5A27]/10 dark:border-white/10 outline-none focus:border-[#2D5A27] text-xs font-bold uppercase rounded-none bg-white dark:bg-stone-900 cursor-pointer"
                        >
                          <option value="waiting_confirm">Chờ xác nhận</option>
                          <option value="confirmed">Đã xác nhận</option>
                          <option value="shipping">Đang giao hàng</option>
                          <option value="completed">Đã hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <label className="text-[9px] font-bold text-brand-muted uppercase tracking-wider">Trạng thái thanh toán</label>
                        <select
                          value={selectedOrder.payment_status}
                          onChange={(e) => handleUpdateStatus(selectedOrder.id, 'payment_status', e.target.value)}
                          className="w-full px-3 py-2.5 border border-[#2D5A27]/10 dark:border-white/10 outline-none focus:border-[#2D5A27] text-xs font-bold uppercase rounded-none bg-white dark:bg-stone-900 cursor-pointer"
                        >
                          <option value="pending">Chưa thanh toán</option>
                          <option value="paid">Đã thanh toán</option>
                          <option value="refunded">Hoàn tiền</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Status History Timeline for Staff */}
                  {selectedOrderHistory && selectedOrderHistory.length > 0 && (
                    <div className="border-t border-[#2D5A27]/10 dark:border-white/10 pt-4 mt-6 space-y-3">
                      <h5 className="text-[10px] font-black tracking-widest text-brand-muted uppercase font-mono">
                        Nhật ký hành trình đơn
                      </h5>
                      <div className="relative pl-5 border-l border-[#2D5A27]/15 dark:border-white/10 space-y-4 text-[11px] font-sans">
                        {selectedOrderHistory.map((h, idx) => (
                          <div key={h.id} className="relative">
                            <div className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full border bg-white dark:bg-stone-900 ${
                              idx === selectedOrderHistory.length - 1 ? 'border-[#2D5A27] bg-[#2D5A27] animate-pulse' : 'border-stone-300'
                            }`} />
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold uppercase text-[9px] text-[#2D5A27] dark:text-brand-green-light">
                                  {h.status === 'waiting_confirm' ? 'Chờ xác nhận' :
                                   h.status === 'confirmed' ? 'Đã xác nhận' :
                                   h.status === 'shipping' ? 'Đang giao' :
                                   h.status === 'completed' ? 'Hoàn thành' :
                                   h.status === 'cancelled' ? 'Đã hủy' : h.status}
                                </span>
                                <span className="text-[8px] font-bold text-brand-muted bg-stone-100 dark:bg-stone-850 px-1 py-0.5 uppercase">
                                  {h.changedBy || 'Hệ thống'}
                                </span>
                                <span className="text-[8px] font-mono text-brand-muted ml-auto">
                                  {new Date(h.changedAt).toLocaleString('vi-VN')}
                                </span>
                              </div>
                              {h.note && <p className="text-brand-muted mt-0.5">{h.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-[#2D5A27]/10 dark:border-white/10 bg-[#F9F4EC]/20 dark:bg-stone-950/10 flex justify-end">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#2D5A27] text-white text-[10px] font-black tracking-widest uppercase cursor-pointer rounded-none border border-transparent dark:hover:border-brand-green"
                  >
                    HOÀN THÀNH XEM
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function StaffDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['staff', 'manager', 'admin']}>
      <StaffDashboard />
    </ProtectedRoute>
  );
}
