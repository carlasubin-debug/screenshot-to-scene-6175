import { useState } from 'react';
import { usePet, updatePet } from '@/lib/pet-store';
import { updateSettings, useSettings } from '@/lib/settings-store';
import { Button } from '@/components/common';
import { toast } from 'sonner';
export function PetProfile() {
 const p = usePet(); const s = useSettings(); const [editing, setEditing] = useState(false);
 if (!p || !s) return null;
 return <section className="border-b border-border pb-6"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">반려동물 성격 프로필</h2><Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>{editing ? '닫기' : '편집'}</Button></div>
 {editing ? <form className="grid gap-3 sm:grid-cols-2" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); updateSettings({ name: String(f.get('name')).trim() }); updatePet({ age: String(f.get('age')), breed: String(f.get('breed')), likes: String(f.get('likes')), dislikes: String(f.get('dislikes')), personality: String(f.get('personality')) }); setEditing(false); toast.success('프로필을 저장했어요'); }}>
 {[{ key: 'name', label: '이름', value: s.name, max: 6 }, { key: 'age', label: '나이', value: p.age, max: 30 }, { key: 'breed', label: '견종', value: p.breed, max: 60 }, { key: 'likes', label: '좋아하는 것', value: p.likes, max: 100 }, { key: 'dislikes', label: '싫어하는 것', value: p.dislikes, max: 100 }, { key: 'personality', label: '성격', value: p.personality, max: 200 }].map(f => <label key={f.key} className="text-sm">{f.label}<input name={f.key} defaultValue={f.value} maxLength={f.max} required={f.key === 'name'} className="mt-1 h-11 w-full rounded-lg border border-input bg-card px-3" /></label>)}<Button type="submit" className="sm:col-span-2">저장</Button></form> : <dl className="grid grid-cols-2 gap-3 text-sm">{[['나이', p.age], ['견종', p.breed], ['좋아하는 것', p.likes], ['싫어하는 것', p.dislikes], ['성격', p.personality], ['최애 간식', p.snack]].map(([k,v]) => <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="mt-1 break-words">{v || '아직 등록하지 않았어요'}</dd></div>)}</dl>}
 </section>;
}
