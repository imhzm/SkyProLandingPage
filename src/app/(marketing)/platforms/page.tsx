import { Metadata } from 'next'
import { platformPages, getPlatformIds } from '@/data/platform-pages'
import { PlatformsListContent } from '@/components/marketing/PlatformsListContent'

export const metadata: Metadata = {
  title: 'المنصات المدعومة | سيندر برو — 18+ منصة تسويق آلي',
  description: 'استكشف 18+ منصة مدعومة في سيندر برو: فيسبوك، واتساب، انستغرام، تويتر، لينكد إن، تيليجرام والمزيد. أتمت حملاتك التسويقية على كل المنصات.',
  keywords: 'منصات تسويق آلي, فيسبوك, واتساب, انستغرام, تويتر, لينكد إن, تيليجرام, تيك توك, سيندر برو',
  openGraph: {
    title: 'المنصات المدعومة | سيندر برو',
    description: '18+ منصة تسويق آلي في مكان واحد',
    url: 'https://skypro.skywaveads.com/platforms',
    siteName: 'سيندر برو — Sky Wave',
    type: 'website',
  },
}

export default function PlatformsPage() {
  const ids = getPlatformIds()
  const pages = ids.map((id) => platformPages[id])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'منصات سيندر برو المدعومة',
    description: 'جميع المنصات المدعومة في سيندر برو لأتمتة التسويق',
    numberOfItems: pages.length,
    itemListElement: pages.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `سيندر برو - ${p.arabicName}`,
      url: `https://skypro.skywaveads.com/platforms/${p.id}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlatformsListContent pages={pages} />
    </>
  )
}