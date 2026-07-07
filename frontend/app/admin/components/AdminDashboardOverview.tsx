'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Download, 
  TrendingUp, 
  Calendar,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface StatsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  chartData: { date: string; revenue: number; orders: number }[];
  categoryStats: { corn: number; specialty: number };
}

export function AdminDashboardOverview() {
  const { session, profile } = useAuth();
  const isStaff = profile?.role === 'staff';
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStats(data.stats);
      } else {
        setError(data.error || 'Không thể tải thống kê.');
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
      setError('Lỗi kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [session]);

  const handleExportCSV = () => {
    if (!session) return;
    const exportUrl = `/api/admin/orders/export?token=${session.access_token}`;
    window.open(exportUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-[#2D5A27] animate-spin" />
        <p className="text-xs font-black tracking-widest text-[#5A5A5A] uppercase font-mono">
          Đang tải dữ liệu báo cáo...
        </p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="py-16 text-center text-rose-600 dark:text-rose-400 font-bold">
        {error || 'Có lỗi xảy ra khi tải dữ liệu.'}
      </div>
    );
  }

  // Visual SVG chart calculation helpers
  const chartWidth = 600;
  const chartHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const isRevenueChart = !isStaff;
  const maxVal = isRevenueChart
    ? Math.max(...stats.chartData.map(d => d.revenue), 100000)
    : Math.max(...stats.chartData.map(d => d.orders), 5);
  
  // Calculate points for the line chart (smooth line)
  const linePoints = stats.chartData.map((d, index) => {
    const x = paddingX + (index / (stats.chartData.length - 1)) * (chartWidth - paddingX * 2);
    const val = isRevenueChart ? d.revenue : d.orders;
    const y = chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
    return `${x},${y}`;
  }).join(' ');

  // Calculate points for fill area (under the line)
  const fillPoints = `${paddingX},${chartHeight - paddingY} ${linePoints} ${chartWidth - paddingX},${chartHeight - paddingY}`;

  return (
    <div className="space-y-10 font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#2D5A27]/10 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white font-sans uppercase">
            {isStaff ? 'Tổng quan hoạt động & Vận đơn' : 'Tổng quan doanh thu & Báo cáo'}
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            {isStaff ? 'Theo dõi số lượng đơn đặt hàng và cơ cấu danh mục sản phẩm.' : 'Theo dõi các chỉ số kinh doanh chính và biểu đồ tăng trưởng doanh thu.'}
          </p>
        </div>

        {!isStaff && (
          <button
            onClick={handleExportCSV}
            className="w-fit flex items-center justify-center gap-2 px-5 py-3 bg-[#2D5A27] hover:bg-[#20401b] dark:bg-brand-green-light dark:hover:bg-brand-green text-white dark:text-stone-900 text-xs font-bold tracking-wider uppercase hover:shadow-xs active:scale-95 transition-all cursor-pointer rounded-none"
          >
            <Download className="w-3.5 h-3.5" />
            Xuất đơn hàng (Excel)
          </button>
        )}
      </div>

      {/* Metrics Stat Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isStaff ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
        {/* Doanh thu */}
        {!isStaff && (
          <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-[10px] text-brand-muted uppercase tracking-wider font-bold font-sans">Doanh Thu Tích Lũy</p>
              <h3 className="text-xl md:text-2xl font-bold text-brand-green dark:text-brand-green-light font-sans">
                {stats.totalRevenue.toLocaleString('vi-VN')}đ
              </h3>
              <p className="text-[8px] text-brand-muted">Đơn hàng hoàn tất/Đã thanh toán</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-brand-green dark:text-brand-green-light flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        )}

        {/* Tổng Đơn */}
        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] text-brand-muted uppercase tracking-wider font-bold font-sans">Tổng Đơn Hàng</p>
            <h3 className="text-xl md:text-2xl font-bold text-[#1A1A1A] dark:text-white font-sans">
              {stats.totalOrders} Đơn
            </h3>
            <p className="text-[8px] text-brand-muted">Mọi trạng thái đơn hàng</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Khách hàng */}
        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] text-brand-muted uppercase tracking-wider font-bold font-sans">Tổng Khách Hàng</p>
            <h3 className="text-xl md:text-2xl font-bold text-[#C8953A] dark:text-amber-400 font-sans">
              {stats.totalUsers} Người
            </h3>
            <p className="text-[8px] text-[#C8953A]">Đăng ký bằng email/Google</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/20 text-[#C8953A] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] text-brand-muted uppercase tracking-wider font-bold font-sans">Tổng Sản Phẩm</p>
            <h3 className="text-xl md:text-2xl font-bold text-indigo-800 dark:text-indigo-400 font-sans">
              {stats.totalProducts} Sợi
            </h3>
            <p className="text-[8px] text-brand-muted">Đang quản lý trên website</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SVG Revenue Line Chart */}
        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 shadow-sm rounded-none lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2D5A27]/5 dark:border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-green dark:text-brand-green-light" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal dark:text-stone-200">
                {isStaff ? 'Biểu đồ Số Lượng Đơn Hàng (30 Ngày Qua)' : 'Biểu đồ Doanh thu (30 Ngày Qua)'}
              </h4>
            </div>
            <span className="text-[9px] font-bold text-brand-muted bg-[#F9F4EC]/60 dark:bg-stone-900 px-2.5 py-1 uppercase font-sans">
              Liên tục
            </span>
          </div>

          <div className="w-full">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2D5A27" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2D5A27" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="currentColor" strokeOpacity="0.05" />
              <line x1={paddingX} y1={(chartHeight - paddingY * 2) / 2 + paddingY} x2={chartWidth - paddingX} y2={(chartHeight - paddingY * 2) / 2 + paddingY} stroke="currentColor" strokeOpacity="0.05" />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="currentColor" strokeOpacity="0.1" />

              {/* Chart Line Path */}
              <polyline
                fill="none"
                stroke="#2D5A27"
                strokeWidth="2.5"
                points={linePoints}
              />

              {/* Fill Area Under the Line */}
              <polygon
                fill="url(#chartGradient)"
                points={fillPoints}
              />

              {/* Dots on line intersections (sampling every 5 points to avoid clutter) */}
              {stats.chartData.map((d, index) => {
                if (index % 5 !== 0 && index !== stats.chartData.length - 1) return null;
                const x = paddingX + (index / (stats.chartData.length - 1)) * (chartWidth - paddingX * 2);
                const val = isRevenueChart ? d.revenue : d.orders;
                const y = chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
                return (
                  <g key={index} className="group cursor-pointer">
                    <circle cx={x} cy={y} r="5" fill="#2D5A27" className="transition-all hover:scale-150" />
                    <circle cx={x} cy={y} r="2" fill="#FFFFFF" />
                  </g>
                );
              })}

              {/* Y Axis Labels (Min / Mid / Max) */}
              <text x={paddingX - 10} y={paddingY + 4} textAnchor="end" className="text-[9px] font-sans fill-brand-muted">
                {isRevenueChart ? `${(maxVal / 1000).toFixed(0)}k` : maxVal.toFixed(0)}
              </text>
              <text x={paddingX - 10} y={(chartHeight - paddingY * 2) / 2 + paddingY + 4} textAnchor="end" className="text-[9px] font-sans fill-brand-muted">
                {isRevenueChart ? `${(maxVal / 2000).toFixed(0)}k` : (maxVal / 2).toFixed(0)}
              </text>
              <text x={paddingX - 10} y={chartHeight - paddingY + 4} textAnchor="end" className="text-[9px] font-sans fill-brand-muted">
                0
              </text>

              {/* X Axis Date Labels (Start / Mid / End) */}
              <text x={paddingX} y={chartHeight - paddingY + 18} textAnchor="middle" className="text-[9px] font-sans fill-brand-muted">
                {stats.chartData[0]?.date}
              </text>
              <text x={chartWidth / 2} y={chartHeight - paddingY + 18} textAnchor="middle" className="text-[9px] font-sans fill-brand-muted">
                {stats.chartData[Math.floor(stats.chartData.length / 2)]?.date}
              </text>
              <text x={chartWidth - paddingX} y={chartHeight - paddingY + 18} textAnchor="middle" className="text-[9px] font-sans fill-brand-muted">
                {stats.chartData[stats.chartData.length - 1]?.date}
              </text>
            </svg>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 shadow-sm rounded-none space-y-6">
          <div className="flex items-center justify-between border-b border-[#2D5A27]/5 dark:border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C8953A]" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal dark:text-stone-200">
                Cơ cấu sản phẩm
              </h4>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span className="text-brand-green">Sản phẩm từ ngô</span>
                <span className="font-mono">{stats.categoryStats.corn} loại</span>
              </div>
              <div className="w-full h-2 bg-stone-100 dark:bg-stone-900 rounded-none overflow-hidden">
                <div 
                  className="h-full bg-brand-green" 
                  style={{ width: `${(stats.categoryStats.corn / (stats.totalProducts || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span className="text-[#C8953A]">Đặc sản vùng cao</span>
                <span className="font-mono">{stats.categoryStats.specialty} loại</span>
              </div>
              <div className="w-full h-2 bg-stone-100 dark:bg-stone-900 rounded-none overflow-hidden">
                <div 
                  className="h-full bg-[#C8953A]" 
                  style={{ width: `${(stats.categoryStats.specialty / (stats.totalProducts || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-[#FAF6EE] dark:bg-stone-900 border border-[#2D5A27]/10 text-[11px] text-brand-muted leading-relaxed">
              <strong>Mẹo quản trị:</strong> {isStaff ? 'Hãy kiểm tra danh sách đơn đặt hàng thường xuyên ở trang quản trị Staff để kịp thời xử lý vận đơn cho khách.' : 'Doanh thu được ghi nhận tự động ngay khi đơn hàng chuyển sang trạng thái đã hoàn thành (`Completed`) hoặc trạng thái thanh toán là đã trả tiền (`Paid`). Hãy thường xuyên xuất báo cáo Excel để sao lưu sổ sách.'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
