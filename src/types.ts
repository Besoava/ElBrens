export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'men' | 'women' | 'new' | 'sale';
  description: string;
  sizes: string[];
  colors: string[];
  isLimited?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'تيشيرت البرنس الملكي - أسود',
    price: 850,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
    category: 'new',
    description: 'تيشيرت قطني فاخر بتصميم عصري وشعار البرنس المذهب. مريح وأنيق للمناسبات الخاصة.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['أسود'],
    isLimited: true,
    isBestSeller: true,
  },
  {
    id: '2',
    name: 'هودي ستريت وير - ذهبي',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
    category: 'men',
    description: 'هودي ثقيل الوزن بتطريز يدوي دقيق. يجمع بين الراحة والفخامة.',
    sizes: ['M', 'L', 'XL'],
    colors: ['ذهبي', 'أسود'],
    isBestSeller: true,
  },
  {
    id: '3',
    name: 'بنطال كارجو الفخامة',
    price: 950,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop',
    category: 'men',
    description: 'بنطال كارجو بتصميم عملي وجذاب. خامات عالية الجودة تدوم طويلاً.',
    sizes: ['30', '32', '34', '36'],
    colors: ['أسود', 'زيتي'],
  },
  {
    id: '4',
    name: 'جاكيت ملكي محدود الإصدار',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
    category: 'sale',
    description: 'إصدار خاص جداً من جاكيت البرنس. تم إنتاج 50 قطعة فقط حول العالم.',
    sizes: ['L', 'XL'],
    colors: ['أسود'],
    isLimited: true,
  },
  {
    id: '5',
    name: 'فستان ستريت وير نسائي',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop',
    category: 'women',
    description: 'تصميم فريد يجمع بين الأنوثة والقوة. خامات ناعمة ومريحة.',
    sizes: ['S', 'M', 'L'],
    colors: ['أسود', 'أبيض'],
  },
  {
    id: '6',
    name: 'قبعة التاج الملكي',
    price: 350,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop',
    category: 'new',
    description: 'إكسسوار لا غنى عنه لإكمال مظهرك الملكي.',
    sizes: ['One Size'],
    colors: ['أسود', 'ذهبي'],
  },
];
