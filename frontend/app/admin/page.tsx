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
  FileText,
  DollarSign
} from 'lucide-react';
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
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString() // 2 hours ago
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
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString() // 1 day ago
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
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString() // 5 hours ago
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
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 mins ago
  }
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isUsingMock, setIsUsingMock] = useState(false);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@soimoc.com';

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Redirect to login with current path as query parameter
        router.push('/login?redirect=/admin');
      }
    }
  }, [user, authLoading, router, adminEmail]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setOrders(data);
        setIsUsingMock(false);
      } else {
        // Fallback to mock data if empty
        setOrders(mockOrders);
        setIsUsingMock(true);
      }
    } catch (err) {
      console.warn('Supabase orders query failed, displaying mock admin data:', err);
      setOrders(mockOrders);
      setIsUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, field: 'order_status' | 'payment_status', newStatus: string) => {
    setActionLoadingId(orderId);
    try {
      // If it's a real UUID (Supabase ID length is typically 36)
      if (orderId.length > 15) {
        const { error } = await supabase
          .from('orders')
          .update({ [field]: newStatus })
          .eq('id', orderId);

        if (error) throw error;
      }

      // Update state locally
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, [field]: newStatus } 
            : order
        )
      );

      // Update currently focused detail modal if open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, [field]: newStatus } : null);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Cập nhật trạng thái thất bại: ' + (err as Error).message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Calculations
  const totalOrders = orders.length;
  const newOrders = orders.filter(o => o.order_status === 'waiting_confirm').length;
  const shippingOrders = orders.filter(o => o.order_status === 'shipping').length;
  const totalRevenue = orders
    .filter(o => o.order_status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  // Search & Filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
      case 'waiting_confirm': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'shipping': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'completed': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-zinc-50 text-zinc-800 border-zinc-200';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chưa thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };



  if (authLoading) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-[#F9F4EC] gap-4">
        <div className="w-10 h-10 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black tracking-widest text-[#5A5A5A] uppercase font-mono animate-pulse">
          Đang xác thực quyền truy cập...
        </p>
      </div>
    );
  }

  if (!user || user.email !== adminEmail) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-[#F9F4EC] p-5 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-800 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
          ⚠️
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] font-serif uppercase">
            Từ chối truy cập
          </h2>
          <p className="text-sm text-[#5A5A5A] max-w-md mx-auto leading-relaxed font-medium">
            Tài khoản của bạn không có quyền quản trị. Hãy liên hệ admin chính thức tại email <span className="font-extrabold text-[#2D5A27]">{adminEmail}</span>.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 border border-[#2D5A27] text-[#2D5A27] hover:bg-stone-105 text-xs font-black tracking-widest uppercase transition-colors cursor-pointer"
          >
            VỀ TRANG CHỦ
          </button>
          <button
            onClick={() => router.push('/login?redirect=/admin')}
            className="px-6 py-3 bg-[#2D5A27] hover:bg-[#1f3e1b] text-white text-xs font-black tracking-widest uppercase transition-colors cursor-pointer"
          >
            ĐĂNG NHẬP LẠI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F4EC] text-[#1A1A1A] min-h-[90vh] py-12 px-5 md:px-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Title & Refresh Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#2D5A27]/10 pb-6">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#2D5A27] uppercase font-mono">
              HỆ THỐNG QUẢN TRỊ ADMIN
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A1A1A] font-serif uppercase mt-1">
              Bảng Điều Khiển Đơn Hàng
            </h1>
            {isUsingMock && (
              <span className="inline-block mt-2 text-[9px] bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2 py-0.5 font-mono font-bold uppercase rounded-sm">
                ⚠️ Chế độ xem thử (Fallback Mock Data)
              </span>
            )}
          </div>

          <button
            onClick={fetchOrders}
            className="w-fit flex items-center justify-center gap-2 px-5 py-3 border border-[#2D5A27]/20 hover:border-[#2D5A27] bg-white text-xs font-black tracking-widest uppercase hover:shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Làm mới dữ liệu
          </button>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card: Total Revenue */}
          <div className="bg-white border border-[#2D5A27]/10 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-[9px] text-[#5A5A5A]/70 uppercase tracking-widest font-black font-mono">Tổng Doanh Thu</p>
              <h3 className="text-xl md:text-2xl font-black text-[#1A1A1A] font-sans">
                {totalRevenue.toLocaleString('vi-VN')}đ
              </h3>
              <p className="text-[8px] text-[#5A5A5A]">Không tính đơn đã hủy</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Card: Total Orders */}
          <div className="bg-white border border-[#2D5A27]/10 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-[9px] text-[#5A5A5A]/70 uppercase tracking-widest font-black font-mono">Tổng Đơn Hàng</p>
              <h3 className="text-xl md:text-2xl font-black text-[#1A1A1A] font-sans">
                {totalOrders} Đơn
              </h3>
              <p className="text-[8px] text-[#5A5A5A]">Lưu trong hệ thống</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-800 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          {/* Card: New Orders */}
          <div className="bg-white border border-[#2D5A27]/10 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-[9px] text-[#5A5A5A]/70 uppercase tracking-widest font-black font-mono font-mono">Đơn Hàng Mới</p>
              <h3 className="text-xl md:text-2xl font-black text-amber-800 font-sans">
                {newOrders} Đơn
              </h3>
              <p className="text-[8px] text-amber-700 animate-pulse font-semibold">● Đang chờ xác nhận</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center relative">
              {newOrders > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />}
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Card: Shipping */}
          <div className="bg-white border border-[#2D5A27]/10 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-[9px] text-[#5A5A5A]/70 uppercase tracking-widest font-black font-mono">Đang Giao Hàng</p>
              <h3 className="text-xl md:text-2xl font-black text-indigo-800 font-sans">
                {shippingOrders} Đơn
              </h3>
              <p className="text-[8px] text-[#5A5A5A]">Đã gửi cho đơn vị vận chuyển</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-800 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-[#2D5A27]/10 p-6 flex flex-col md:flex-row items-center gap-4 justify-between shadow-xs">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5A5A5A]/60 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên khách, SĐT, hoặc Mã đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#F9F4EC]/40 border border-[#2D5A27]/10 focus:border-[#2D5A27] text-sm text-[#1A1A1A] outline-none"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['all', 'waiting_confirm', 'confirmed', 'shipping', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 text-[9px] font-black tracking-widest uppercase transition-all cursor-pointer border ${
                  statusFilter === st
                    ? 'bg-[#2D5A27] border-[#2D5A27] text-white'
                    : 'bg-white border-[#2D5A27]/10 text-[#5A5A5A] hover:text-[#1A1A1A]'
                }`}
              >
                {st === 'all' ? 'TẤT CẢ' : getOrderStatusText(st)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="bg-white border border-[#2D5A27]/10 overflow-hidden shadow-md">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-black tracking-widest text-[#5A5A5A] uppercase font-mono animate-pulse">
                Đang tải dữ liệu đơn hàng...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-24 text-center text-[#5A5A5A] uppercase tracking-wider text-xs font-mono">
              Không tìm thấy đơn hàng phù hợp.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#2D5A27]/5 border-b border-[#2D5A27]/10 text-[9px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono">
                    <th className="p-4.5">Mã Đơn Hàng</th>
                    <th className="p-4.5">Thời Gian</th>
                    <th className="p-4.5">Khách Hàng</th>
                    <th className="p-4.5">Tổng Tiền</th>
                    <th className="p-4.5">Thanh Toán</th>
                    <th className="p-4.5">Trạng Thái Đơn</th>
                    <th className="p-4.5 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D5A27]/5 text-xs">
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id}
                      className="hover:bg-[#F9F4EC]/30 transition-colors group"
                    >
                      {/* Order ID */}
                      <td className="p-4.5 font-mono text-[10px] font-bold text-[#2D5A27]">
                        #{order.id.slice(0, 8)}...
                      </td>

                      {/* Time */}
                      <td className="p-4.5 text-[#5A5A5A]">
                        {new Date(order.created_at).toLocaleString('vi-VN', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Customer Name & Phone */}
                      <td className="p-4.5 space-y-0.5">
                        <p className="font-extrabold text-[#1A1A1A]">{order.customer_name}</p>
                        <p className="text-[10px] text-[#5A5A5A]">{order.customer_phone}</p>
                      </td>

                      {/* Total Amount */}
                      <td className="p-4.5 font-extrabold text-[#1A1A1A] font-sans">
                        {order.total_amount.toLocaleString('vi-VN')}đ
                      </td>

                      {/* Payment Status Dropdown */}
                      <td className="p-4.5">
                        <select
                          disabled={actionLoadingId === order.id}
                          value={order.payment_status}
                          onChange={(e) => handleUpdateStatus(order.id, 'payment_status', e.target.value)}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs outline-none bg-white border cursor-pointer ${
                            order.payment_status === 'paid' 
                              ? 'text-emerald-800 border-emerald-300 bg-emerald-50' 
                              : 'text-amber-800 border-amber-300 bg-amber-50'
                          }`}
                        >
                          <option value="pending">Chưa TT</option>
                          <option value="paid">Đã TT</option>
                          <option value="refunded">Hoàn tiền</option>
                        </select>
                      </td>

                      {/* Order Status Badge / Selector */}
                      <td className="p-4.5">
                        <select
                          disabled={actionLoadingId === order.id}
                          value={order.order_status}
                          onChange={(e) => handleUpdateStatus(order.id, 'order_status', e.target.value)}
                          className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider border rounded-none bg-white cursor-pointer ${getOrderStatusBadgeClass(order.order_status)}`}
                        >
                          <option value="waiting_confirm">Chờ xác nhận</option>
                          <option value="confirmed">Đã xác nhận</option>
                          <option value="shipping">Đang giao</option>
                          <option value="completed">Hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </td>

                      {/* View Details button */}
                      <td className="p-4.5 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3.5 py-2 border border-[#2D5A27]/20 hover:bg-[#2D5A27] hover:text-white transition-all text-[9px] font-black tracking-widest uppercase cursor-pointer"
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
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="fixed inset-0 bg-black z-50 cursor-pointer"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.3 }}
                className="fixed inset-x-5 bottom-5 top-5 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white border border-[#2D5A27]/10 shadow-2xl z-50 flex flex-col overflow-hidden max-h-[85vh]"
              >
                {/* Top highlight line */}
                <div className="h-1.5 bg-[#2D5A27]" />

                {/* Modal Header */}
                <div className="p-6 border-b border-[#2D5A27]/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A] font-serif uppercase">
                      Chi Tiết Đơn Hàng
                    </h3>
                    <p className="font-mono text-[10px] text-[#5A5A5A] mt-0.5">
                      #{selectedOrder.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 hover:bg-[#F9F4EC] rounded-full text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors cursor-pointer text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Customer Information Block */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-[#2D5A27] uppercase font-mono border-b border-[#2D5A27]/5 pb-1">
                      Thông Tin Giao Hàng
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-[#2D5A27]/60 shrink-0" />
                        <div>
                          <p className="text-[8px] text-[#5A5A5A] uppercase tracking-wider font-bold">Khách hàng</p>
                          <p className="font-extrabold mt-0.5">{selectedOrder.customer_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#2D5A27]/60 shrink-0" />
                        <div>
                          <p className="text-[8px] text-[#5A5A5A] uppercase tracking-wider font-bold">Số điện thoại</p>
                          <p className="font-extrabold mt-0.5">{selectedOrder.customer_phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-[#2D5A27]/60 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[8px] text-[#5A5A5A] uppercase tracking-wider font-bold">Địa chỉ giao hàng</p>
                          <p className="font-semibold mt-0.5 leading-relaxed">{selectedOrder.customer_address}</p>
                        </div>
                      </div>

                      {selectedOrder.customer_note && (
                        <div className="flex items-start gap-2 sm:col-span-2 bg-[#F9F4EC]/50 p-3 border border-[#2D5A27]/5">
                          <AlertCircle className="w-4 h-4 text-[#2D5A27]/70 shrink-0" />
                          <div>
                            <p className="text-[8px] text-[#2D5A27] uppercase tracking-wider font-bold">Ghi chú đơn hàng</p>
                            <p className="font-medium mt-0.5 italic">{selectedOrder.customer_note}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary amount & info */}
                  <div className="bg-[#F9F4EC]/40 border border-[#2D5A27]/10 p-5 space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-[#2D5A27] uppercase font-mono border-b border-[#2D5A27]/5 pb-1">
                      Tổng Quan Đơn Hàng
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                      <div>
                        <p className="text-[9px] text-[#5A5A5A] uppercase">Phương thức</p>
                        <p className="font-extrabold mt-0.5 font-mono text-[10px] text-[#2D5A27]">{selectedOrder.payment_method}</p>
                      </div>

                      <div>
                        <p className="text-[9px] text-[#5A5A5A] uppercase">Thanh toán</p>
                        <p className="font-extrabold mt-0.5 text-[#1A1A1A]">{getPaymentStatusText(selectedOrder.payment_status)}</p>
                      </div>

                      <div>
                        <p className="text-[9px] text-[#5A5A5A] uppercase">Thời gian</p>
                        <p className="font-extrabold mt-0.5 text-[#1A1A1A]">
                          {new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-[#2D5A27] uppercase font-bold">Tổng thanh toán</p>
                        <p className="text-sm font-black text-[#2D5A27] font-sans mt-0.5">
                          {selectedOrder.total_amount.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order statuses controls */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono border-b border-[#2D5A27]/5 pb-1">
                      Cập Nhật Trạng Thái Đơn Hàng
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Order Status */}
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[9px] font-bold text-[#5A5A5A] uppercase tracking-wider">Trạng thái xử lý</label>
                        <select
                          value={selectedOrder.order_status}
                          onChange={(e) => handleUpdateStatus(selectedOrder.id, 'order_status', e.target.value)}
                          className="w-full px-3 py-2.5 border border-[#2D5A27]/10 outline-none focus:border-[#2D5A27] text-xs font-bold uppercase rounded-none bg-white cursor-pointer"
                        >
                          <option value="waiting_confirm">Chờ xác nhận</option>
                          <option value="confirmed">Đã xác nhận</option>
                          <option value="shipping">Đang giao hàng</option>
                          <option value="completed">Đã hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </div>

                      {/* Payment Status */}
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[9px] font-bold text-[#5A5A5A] uppercase tracking-wider">Trạng thái thanh toán</label>
                        <select
                          value={selectedOrder.payment_status}
                          onChange={(e) => handleUpdateStatus(selectedOrder.id, 'payment_status', e.target.value)}
                          className="w-full px-3 py-2.5 border border-[#2D5A27]/10 outline-none focus:border-[#2D5A27] text-xs font-bold uppercase rounded-none bg-white cursor-pointer"
                        >
                          <option value="pending">Chưa thanh toán (Pending)</option>
                          <option value="paid">Đã thanh toán (Paid)</option>
                          <option value="refunded">Hoàn tiền (Refunded)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-[#2D5A27]/10 bg-[#F9F4EC]/20 flex justify-end">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#2D5A27] text-white text-[10px] font-black tracking-widest uppercase cursor-pointer"
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
