'use client'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">سيندر برو</h3>
            <p className="text-sm leading-relaxed">
              أقوى أداة تسويق آلي لمنصات التواصل الاجتماعي. أتمت حملاتك التسويقية بسهولة واحترافية.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">المميزات</a></li>
              <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">الأسعار</a></li>
              <li><a href="#faq" className="hover:text-indigo-400 transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">تحميل التطبيق</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">مركز المساعدة</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">تواصل معنا</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">الشروط والأحكام</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-sm">
              <li>البريد: support@skywaveads.com</li>
              <li>واتساب: +20 100 123 4567</li>
              <li>القاهرة، مصر</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} سيندر برو — Sky Wave Ads. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}