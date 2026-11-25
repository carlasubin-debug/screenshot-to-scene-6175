import happy from '@/assets/pet-happy.asset.json';
import bored from '@/assets/pet-bored.asset.json';
import sleepy from '@/assets/pet-sleepy.asset.json';
import curious from '@/assets/pet-curious.asset.json';
import { usePet } from '@/lib/pet-store';
import { MOODS, OUTFITS } from '@/lib/pet-data';
export function PetPortrait({ compact = false }: { compact?: boolean }) {
 const pet = usePet(); const mood = pet?.mood ?? 'happy';
 const image = { happy, bored, sleepy, curious }[mood];
 const outfit = OUTFITS.find(o => o.id === pet?.outfit);
 return <div className={`relative mx-auto ${compact ? 'h-28 w-28' : 'h-52 w-52'}`}>
  <img src={image.url} alt={`반려동물 · ${MOODS.find(m => m.id === mood)?.label}`} className="h-full w-full rounded-lg object-contain" />
  {outfit?.icon && <span aria-label={outfit.label} className="absolute left-1/2 top-0 -translate-x-1/2 text-4xl">{outfit.icon}</span>}
 </div>;
}
