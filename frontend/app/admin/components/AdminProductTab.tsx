'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Search, 
  X, 
  Upload,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface SizeOption {
  weight: string;
  price: number;
  priceStr: string;
  target: string;
}

interface ProductFormData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  details: string;
  image: string;
  images: string[];
  features: string[];
  cookingTime: string;
  nutrition: {
    calories: string;
    carbs: string;
    protein: string;
    fiber: string;
    fat: string;
  };
  sizes: SizeOption[];
  category: 'corn' | 'specialty';
  badge: string;
  isActive: boolean;
}

const emptyProduct: ProductFormData = {
  id: '',
  name: '',
  tagline: '',
  description: '',
  details: '',
  image: '',
  images: [],
  features: [],
  cookingTime: '',
  nutrition: {
    calories: '',
    carbs: '',
    protein: '',
    fiber: '',
    fat: ''
  },
  sizes: [{ weight: '500g', price: 30000, priceStr: '30.000đ', target: '' }],
  category: 'corn',
  badge: '',
  isActive: true
};

export function AdminProductTab() {
  const { session, profile } = useAuth();
  const isStaff = profile?.role === 'staff';
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<ProductFormData>(emptyProduct);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Temp state for lists
  const [featureInput, setFeatureInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const fetchProducts = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [session]);

  const handleOpenCreate = () => {
    setFormData(emptyProduct);
    setFormMode('create');
    setFormError(null);
    setFeatureInput('');
    setImageInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductFormData) => {
    setFormData({
      ...p,
      badge: p.badge || '',
      images: p.images || [p.image],
      features: p.features || []
    });
    setFormMode('edit');
    setFormError(null);
    setFeatureInput('');
    setImageInput('');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (p: ProductFormData) => {
    if (!session) return;
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id: p.id, isActive: !p.isActive }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, isActive: !p.isActive } : item));
      }
    } catch (err) {
      console.error('Error toggling active:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!session || !window.confirm('Bạn có chắc chắn muốn XÓA VĨNH VIỄN sản phẩm này khỏi cơ sở dữ liệu? Hành động này không thể hoàn tác.')) return;
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert(data.error || 'Xóa sản phẩm thất bại.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setFormSubmitting(true);
    setFormError(null);

    // Basic Validation
    if (!formData.id.trim() || !formData.name.trim() || !formData.image.trim()) {
      setFormError('Vui lòng điền đầy đủ Mã ID, Tên và Ảnh chính.');
      setFormSubmitting(false);
      return;
    }

    try {
      const url = '/api/admin/products';
      const method = formMode === 'create' ? 'POST' : 'PUT';
      
      const payload = {
        ...formData,
        id: formData.id.trim().toLowerCase(),
        images: formData.images.length > 0 ? formData.images : [formData.image]
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsModalOpen(false);
        fetchProducts(); // Refresh list
      } else {
        setFormError(data.error || 'Lưu sản phẩm thất bại.');
      }
    } catch (err) {
      console.error('Submit product error:', err);
      setFormError('Lỗi kết nối đến máy chủ.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Sizes array helpers
  const handleAddSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { weight: '500g', price: 30000, priceStr: '30.000đ', target: '' }]
    }));
  };

  const handleRemoveSize = (index: number) => {
    if (formData.sizes.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleSizeChange = (index: number, field: keyof SizeOption, value: any) => {
    setFormData(prev => {
      const newSizes = [...prev.sizes];
      if (field === 'price') {
        const numPrice = parseFloat(value) || 0;
        newSizes[index] = {
          ...newSizes[index],
          price: numPrice,
          priceStr: `${numPrice.toLocaleString('vi-VN')}đ`
        };
      } else {
        newSizes[index] = {
          ...newSizes[index],
          [field]: value
        };
      }
      return { ...prev, sizes: newSizes };
    });
  };

  // Features list helpers
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, featureInput.trim()]
    }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Images list helpers
  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageInput.trim()]
    }));
    setImageInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Filter list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#2D5A27]/10 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white font-sans uppercase">
            Quản lý Sản Phẩm
          </h2>
          <p className="text-xs text-brand-muted mt-1">Quản lý kho hàng, cập nhật thông tin sản phẩm và thay đổi giá bán.</p>
        </div>

        {!isStaff && (
          <button
            onClick={handleOpenCreate}
            className="w-fit flex items-center justify-center gap-2 px-5 py-3 bg-[#2D5A27] hover:bg-[#20401b] dark:bg-brand-green-light dark:hover:bg-brand-green text-white dark:text-stone-900 text-xs font-bold tracking-wider uppercase hover:shadow-xs active:scale-95 transition-all cursor-pointer rounded-none"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm mới
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex flex-col lg:flex-row items-center gap-4 justify-between shadow-xs">
        <div className="relative w-full lg:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5A5A5A]/60 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo Tên hoặc Mã ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#F9F4EC]/40 dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 text-sm text-[#1A1A1A] dark:text-stone-200 outline-none rounded-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider">Danh mục:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-[#2D5A27]/10 dark:border-white/10 bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300 rounded-none outline-none cursor-pointer"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="corn">Sản phẩm từ ngô</option>
            <option value="specialty">Đặc sản Cao Bằng</option>
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 overflow-hidden shadow-md">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-[#2D5A27] animate-spin" />
            <p className="text-xs font-black tracking-widest text-[#5A5A5A] uppercase font-mono">
              Đang tải danh sách sản phẩm...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center text-[#5A5A5A]/60 uppercase tracking-wider text-xs font-mono">
            Không tìm thấy sản phẩm nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#2D5A27]/5 dark:bg-[#2D5A27]/10 border-b border-[#2D5A27]/10 dark:border-white/10 text-[10px] font-bold tracking-wider text-[#5A5A5A] dark:text-stone-400 uppercase font-sans">
                  <th className="p-4.5">Ảnh</th>
                  <th className="p-4.5">Tên Sản Phẩm</th>
                  <th className="p-4.5">Phân Loại</th>
                  <th className="p-4.5">Đơn Giá</th>
                  <th className="p-4.5">Trạng Thái</th>
                  {!isStaff && <th className="p-4.5 text-right">Thao Tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D5A27]/5 dark:divide-white/5 text-xs">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F9F4EC]/30 dark:hover:bg-white/5 transition-colors">
                    {/* Image */}
                    <td className="p-4.5">
                      <div className="w-12 h-12 bg-white border border-[#2D5A27]/10 dark:border-white/10 flex items-center justify-center overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    </td>

                    {/* Name & ID */}
                    <td className="p-4.5">
                      <div className="font-bold text-[#1A1A1A] dark:text-stone-200">{p.name}</div>
                      <div className="text-[10px] text-brand-muted font-mono uppercase">{p.id}</div>
                    </td>

                    {/* Category */}
                    <td className="p-4.5">
                      <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
                        p.category === 'corn' 
                          ? 'bg-amber-50 dark:bg-amber-950/20 text-[#C8953A]' 
                          : 'bg-emerald-50 dark:bg-emerald-950/20 text-brand-green dark:text-brand-green-light'
                      }`}>
                        {p.category === 'corn' ? 'Từ Ngô' : 'Đặc Sản'}
                      </span>
                    </td>

                    {/* Prices */}
                    <td className="p-4.5 font-sans">
                      <div className="space-y-1">
                        {p.sizes.map((s, idx) => (
                          <div key={idx} className="text-[11px] text-stone-700 dark:text-stone-300">
                            {s.weight}: <span className="font-bold text-[#1A1A1A] dark:text-white">{s.priceStr}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4.5">
                      <button 
                        disabled={isStaff}
                        onClick={() => handleToggleActive(p)}
                        className={`flex items-center gap-1 transition-colors ${
                          isStaff ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                        } ${
                          p.isActive ? 'text-brand-green' : 'text-stone-400'
                        }`}
                      >
                        {p.isActive ? (
                          <>
                            <ToggleRight className="w-7 h-7" />
                            <span className="text-[10px] font-bold tracking-wider uppercase font-sans">Kinh Doanh</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-7 h-7" />
                            <span className="text-[10px] font-bold tracking-wider uppercase font-sans">Ngừng Bán</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    {!isStaff && (
                      <td className="p-4.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 border border-[#2D5A27]/10 dark:border-white/10 hover:border-brand-green hover:text-brand-green text-stone-600 dark:text-stone-300 transition-all cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 border border-rose-200 dark:border-rose-950/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#F9F4EC] dark:bg-[#111510] text-[#1A1A1A] dark:text-stone-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#2D5A27]/20 dark:border-white/15 shadow-2xl relative font-sans">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2D5A27]/10 dark:border-white/10 p-6">
              <h3 className="text-lg font-bold font-serif uppercase tracking-wider text-[#2D5A27] dark:text-brand-green-light">
                {formMode === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="mx-6 mt-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left side inputs */}
                <div className="space-y-4">
                  {/* ID */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Mã Sản Phẩm (ID / Handle)</label>
                    <input
                      type="text"
                      disabled={formMode === 'edit'}
                      placeholder="vd: pho-ngo-premium"
                      value={formData.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full px-4.5 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-sm font-mono lowercase"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Tên Sản Phẩm</label>
                    <input
                      type="text"
                      placeholder="vd: Phở Ngô Khô Premium"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4.5 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-sm font-bold"
                    />
                  </div>

                  {/* Tagline */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Tagline (Khẩu hiệu)</label>
                    <input
                      type="text"
                      placeholder="vd: SỨC MẠNH TỪ NGÔ BẢN ĐỊA CAO BẰNG"
                      value={formData.tagline}
                      onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full px-4.5 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Mô tả ngắn</label>
                    <textarea
                      rows={2}
                      placeholder="Mô tả tóm tắt cho card sản phẩm..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4.5 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs"
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Thông tin chi tiết (Chi tiết sản phẩm)</label>
                    <textarea
                      rows={4}
                      placeholder="Thông tin quy trình sản xuất, công dụng..."
                      value={formData.details}
                      onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                      className="w-full px-4.5 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Right side inputs */}
                <div className="space-y-4">
                  {/* Category & Badge */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Danh Mục</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs cursor-pointer"
                      >
                        <option value="corn">Sản phẩm từ ngô</option>
                        <option value="specialty">Đặc sản Cao Bằng</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Badge (Nhãn nổi bật)</label>
                      <input
                        type="text"
                        placeholder="vd: NEW, BEST SELLER"
                        value={formData.badge}
                        onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                        className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs uppercase"
                      />
                    </div>
                  </div>

                  {/* Main Image URL */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Đường dẫn Ảnh chính (Image URL)</label>
                    <input
                      type="text"
                      placeholder="vd: /images/pho-ngo-main.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-4.5 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs font-mono"
                    />
                  </div>

                  {/* Cooking time */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Thời gian nấu (Cooking Time)</label>
                    <input
                      type="text"
                      placeholder="vd: 6 - 8 phút"
                      value={formData.cookingTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: e.target.value }))}
                      className="w-full px-4.5 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs"
                    />
                  </div>

                  {/* Nutrition stats */}
                  <div className="border border-[#2D5A27]/10 dark:border-white/10 p-4 space-y-3 bg-white/20 dark:bg-stone-950/20">
                    <p className="text-[10px] font-black uppercase text-[#2D5A27] dark:text-brand-green-light tracking-widest font-mono">Thông số Dinh dưỡng (Mỗi 100g)</p>
                    <div className="grid grid-cols-5 gap-2">
                      <div>
                        <label className="block text-[8px] font-bold text-brand-muted uppercase mb-0.5">Calories</label>
                        <input
                          type="text"
                          placeholder="345 kcal"
                          value={formData.nutrition.calories}
                          onChange={(e) => setFormData(prev => ({ ...prev, nutrition: { ...prev.nutrition, calories: e.target.value } }))}
                          className="w-full px-2 py-1.5 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-[10px] text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-brand-muted uppercase mb-0.5">Carbs</label>
                        <input
                          type="text"
                          placeholder="72g"
                          value={formData.nutrition.carbs}
                          onChange={(e) => setFormData(prev => ({ ...prev, nutrition: { ...prev.nutrition, carbs: e.target.value } }))}
                          className="w-full px-2 py-1.5 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-[10px] text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-brand-muted uppercase mb-0.5">Protein</label>
                        <input
                          type="text"
                          placeholder="8.5g"
                          value={formData.nutrition.protein}
                          onChange={(e) => setFormData(prev => ({ ...prev, nutrition: { ...prev.nutrition, protein: e.target.value } }))}
                          className="w-full px-2 py-1.5 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-[10px] text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-brand-muted uppercase mb-0.5">Fiber</label>
                        <input
                          type="text"
                          placeholder="4g"
                          value={formData.nutrition.fiber}
                          onChange={(e) => setFormData(prev => ({ ...prev, nutrition: { ...prev.nutrition, fiber: e.target.value } }))}
                          className="w-full px-2 py-1.5 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-[10px] text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-brand-muted uppercase mb-0.5">Fat</label>
                        <input
                          type="text"
                          placeholder="1.2g"
                          value={formData.nutrition.fat}
                          onChange={(e) => setFormData(prev => ({ ...prev, nutrition: { ...prev.nutrition, fat: e.target.value } }))}
                          className="w-full px-2 py-1.5 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-[10px] text-center"
                        />
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Sizes and Prices configurations */}
              <div className="border border-[#2D5A27]/10 dark:border-white/10 p-5 space-y-4 bg-white/20 dark:bg-stone-950/20">
                <div className="flex items-center justify-between border-b border-[#2D5A27]/10 dark:border-white/10 pb-3">
                  <h4 className="text-[10px] font-black uppercase text-[#2D5A27] dark:text-brand-green-light tracking-widest font-mono">
                    Cấu hình Trọng lượng & Giá bán (Sizes)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 bg-[#2D5A27] text-white hover:bg-[#20401b] transition-colors rounded-none cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm size
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.sizes.map((sz, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-white dark:bg-stone-900/50 p-4 border border-[#2D5A27]/5">
                      <div>
                        <label className="block text-[8px] font-bold text-brand-muted uppercase mb-1">Trọng lượng (Weight)</label>
                        <input
                          type="text"
                          placeholder="500g, 1kg"
                          value={sz.weight}
                          onChange={(e) => handleSizeChange(idx, 'weight', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-brand-muted uppercase mb-1">Giá bán (VNĐ)</label>
                        <input
                          type="number"
                          placeholder="35000"
                          value={sz.price}
                          onChange={(e) => handleSizeChange(idx, 'price', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-brand-muted uppercase mb-1">Mục tiêu / Gợi ý</label>
                        <input
                          type="text"
                          placeholder="vd: Phù hợp 2-3 người ăn"
                          value={sz.target}
                          onChange={(e) => handleSizeChange(idx, 'target', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs"
                        />
                      </div>
                      <div className="flex justify-end sm:justify-start">
                        <button
                          type="button"
                          disabled={formData.sizes.length <= 1}
                          onClick={() => handleRemoveSize(idx)}
                          className="px-3 py-2 border border-rose-200 dark:border-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 disabled:opacity-40 transition-all rounded-none cursor-pointer text-xs"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features configurations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Features (Đặc tính) */}
                <div className="border border-[#2D5A27]/10 dark:border-white/10 p-5 space-y-3 bg-white/20 dark:bg-stone-950/20">
                  <label className="block text-[10px] font-black uppercase text-[#2D5A27] dark:text-brand-green-light tracking-widest font-mono border-b border-[#2D5A27]/10 pb-2 mb-2">Đặc tính nổi bật</label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="vd: 100% Ngô bản địa"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-[#2D5A27] text-white text-xs font-bold uppercase rounded-none cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.features.map((ft, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2D5A27]/5 border border-[#2D5A27]/10 text-[10px] font-bold">
                        {ft}
                        <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional Images (Ảnh phụ) */}
                <div className="border border-[#2D5A27]/10 dark:border-white/10 p-5 space-y-3 bg-white/20 dark:bg-stone-950/20">
                  <label className="block text-[10px] font-black uppercase text-[#2D5A27] dark:text-brand-green-light tracking-widest font-mono border-b border-[#2D5A27]/10 pb-2 mb-2">Bộ sưu tập ảnh phụ (Gallery)</label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="vd: /images/pho-ngo-premium.jpg"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-[#2D5A27] text-white text-xs font-bold uppercase rounded-none cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.images.map((img, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[9px] font-mono">
                        {img.substring(img.lastIndexOf('/') + 1)}
                        <button type="button" onClick={() => handleRemoveImage(idx)} className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-[#2D5A27]/10 dark:border-white/10 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 border border-stone-300 dark:border-stone-750 bg-white dark:bg-stone-950 text-xs font-black uppercase tracking-widest hover:bg-stone-50 transition-colors rounded-none cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-[#2D5A27] hover:bg-[#20401b] text-white text-xs font-black uppercase tracking-widest transition-colors rounded-none disabled:opacity-50 cursor-pointer"
                >
                  {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Lưu Sản Phẩm
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
