'use client';

import React, { use } from 'react';
import { policies } from '../../data/policies';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

export default function PolicyDetailPage({ params }: PolicyPageProps) {
  const resolvedParams = use(params);
  const policy = policies[resolvedParams.slug];

  if (!policy) {
    notFound();
  }

  const sidebarLinks = [
    { name: 'Giới thiệu câu chuyện', path: '/about', type: 'about' },
    { name: 'Chính sách đại lý', path: '/policies/dai-ly', type: 'policy', slug: 'dai-ly' },
    { name: 'Chính sách mua hàng', path: '/policies/mua-hang', type: 'policy', slug: 'mua-hang' },
    { name: 'Chính sách bảo hành đổi trả', path: '/policies/doi-tra', type: 'policy', slug: 'doi-tra' },
    { name: 'Chính sách bảo mật thông tin', path: '/policies/bao-mat', type: 'policy', slug: 'bao-mat' },
    { name: 'Chính sách phương thức thanh toán', path: '/policies/thanh-toan', type: 'policy', slug: 'thanh-toan' },
    { name: 'Chính sách vận chuyển & Giao nhận', path: '/policies/van-chuyen', type: 'policy', slug: 'van-chuyen' },
  ];

  return (
    <div className="bg-brand-cream text-brand-charcoal min-h-[80vh] py-16 font-sans">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">
          
          {/* Left Column: Sidebar Navigation */}
          <aside className="lg:col-span-4 bg-white border border-brand-green/10 p-6 space-y-6">
            <h3 className="text-xs font-black tracking-widest text-brand-green uppercase font-mono border-b border-brand-green/5 pb-3">
              VỀ CHÚNG TÔI & CHÍNH SÁCH
            </h3>
            
            <nav className="flex flex-col gap-1">
              {sidebarLinks.map((link) => {
                const isActive = link.slug === resolvedParams.slug;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center justify-between py-2.5 px-3 text-xs font-extrabold tracking-wider transition-colors rounded-none uppercase border ${
                      isActive
                        ? 'bg-brand-green text-white border-brand-green font-extrabold'
                        : 'text-brand-muted border-transparent hover:text-brand-charcoal hover:bg-brand-cream/50'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Right Column: Main Content */}
          <main className="lg:col-span-8 space-y-10 bg-white border border-brand-green/10 p-8 md:p-12">
            
            {/* Header Block */}
            <div className="border-b border-brand-green/5 pb-6 space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-normal uppercase text-brand-charcoal leading-[1.15] font-serif">
                {policy.title}
              </h1>
              <div className="flex justify-between items-center text-[10px] text-brand-muted/70 font-mono font-semibold uppercase">
                <span>CHÍNH SÁCH MUA SẮM</span>
                <span>Cập nhật cuối: {policy.lastUpdated}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-brand-muted text-sm font-semibold italic border-l-2 border-brand-green pl-4 py-1 leading-relaxed">
              {policy.description}
            </p>

            {/* Policy Sections */}
            <div className="space-y-8 text-brand-muted text-sm leading-relaxed font-medium">
              {policy.sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-lg font-black tracking-wide text-brand-charcoal uppercase font-serif">
                    {section.title}
                  </h2>
                  <p>{section.content}</p>
                  
                  {/* Nested Sub-items */}
                  {section.items && (
                    <div className="grid grid-cols-1 gap-4 pl-4 pt-2">
                      {section.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="bg-brand-cream border-l border-brand-green p-4 space-y-1 rounded-none border border-brand-green/10"
                        >
                          <h4 className="text-xs font-black text-brand-charcoal uppercase tracking-wider">
                            ▪ {item.subtitle}
                          </h4>
                          <p className="text-xs text-brand-muted font-medium">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </main>

        </div>

      </div>
    </div>
  );
}
