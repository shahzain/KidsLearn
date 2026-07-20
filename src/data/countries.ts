import type { Category } from './types'

export const countries: Category = {
  id: 'countries',
  title: 'Countries',
  tagline: 'Flags of the world!',
  emoji: '🇵🇰',
  accent: '#14B8A6',
  cardGradient: ['#5EEAD4', '#0D9488'],
  bgGradient: ['#EFFDFB', '#CFF7F0'],
  items: [
    { id: 'pakistan', emoji: '🇵🇰', title: 'Pakistan', subtitle: 'پاکستان', speak: ['Pakistan', 'This is the flag of Pakistan.'] },
    { id: 'usa', emoji: '🇺🇸', title: 'United States', subtitle: 'USA', speak: ['United States', 'This is the flag of the United States.'] },
    { id: 'uk', emoji: '🇬🇧', title: 'United Kingdom', subtitle: 'UK', speak: ['United Kingdom', 'This is the flag of the United Kingdom.'] },
    { id: 'canada', emoji: '🇨🇦', title: 'Canada', subtitle: 'Maple leaf!', speak: ['Canada', 'This is the flag of Canada.'] },
    { id: 'saudi', emoji: '🇸🇦', title: 'Saudi Arabia', subtitle: 'السعودية', speak: ['Saudi Arabia', 'This is the flag of Saudi Arabia.'] },
    { id: 'turkey', emoji: '🇹🇷', title: 'Türkiye', subtitle: 'Turkey', speak: ['Turkey', 'This is the flag of Turkey.'] },
    { id: 'china', emoji: '🇨🇳', title: 'China', subtitle: '中国', speak: ['China', 'This is the flag of China.'] },
    { id: 'japan', emoji: '🇯🇵', title: 'Japan', subtitle: '日本', speak: ['Japan', 'This is the flag of Japan.'] },
    { id: 'india', emoji: '🇮🇳', title: 'India', subtitle: 'भारत', speak: ['India', 'This is the flag of India.'] },
    { id: 'germany', emoji: '🇩🇪', title: 'Germany', subtitle: 'Deutschland', speak: ['Germany', 'This is the flag of Germany.'] },
    { id: 'france', emoji: '🇫🇷', title: 'France', subtitle: 'Bonjour!', speak: ['France', 'This is the flag of France.'] },
    { id: 'brazil', emoji: '🇧🇷', title: 'Brazil', subtitle: 'Brasil', speak: ['Brazil', 'This is the flag of Brazil.'] },
    { id: 'australia', emoji: '🇦🇺', title: 'Australia', subtitle: 'G’day!', speak: ['Australia', 'This is the flag of Australia.'] },
    { id: 'egypt', emoji: '🇪🇬', title: 'Egypt', subtitle: 'مصر', speak: ['Egypt', 'This is the flag of Egypt.'] },
  ],
}

export default countries
