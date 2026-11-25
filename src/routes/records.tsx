import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Star, Trash2, Plus } from 'lucide-react';
import { Header, Button, Chip } from '@/components/common';
import { usePet, updatePet, reward, today } from '@/lib/pet-store';
import { CHAT_KEY } from '@/lib/interpret-session';
import type { ChatMessage } from '@/lib/types';
import { toast } from 'sonner';
export const Route = createFileRoute('/records')({ head: () => ({ meta: [ { title: '기록 · 뭐라는 거야?' }, { name: 'description', content: '반려동물 대화와 일기, 성장의 순간을 모아 보세요.' }, { property: 'og:title', content: '기록 · 뭐라는 거야?' }, { property: 'og:description', content: '반려동물과 함께한 추억.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' } ] }), component: Records });
function Records() {
 const p = usePet(); const [tab, setTab] = useState('대화'); const [messages, setMessages] = useState<ChatMessage[]>([]);
 const [starred, setStarred] = useState(false); const [memo, setMemo] = useState(''); const [date, setDate] = useState(today()); const [photo, setPhoto] = useState(''); const [milestone, setMilestone] = useState(false); const [loadingPhoto, setLoadingPhoto] = useState(false);
 useEffect(() => { try { setMessages(JSON.parse(localStorage.getItem(CHAT_KEY) ?? '[]')); } catch {} }, []);
 if (!p) return null;
 const visible = messages.filter(m => !starred || p.favorites.includes(m.id));
 return <div className="flex flex-1 flex-col"><Header title="기록" /><main className="page-content space-y-6 px-5 py-6">
 <div className="flex flex-wrap gap-2">{['대화', '일기', '성장 기록'].map(t => <Chip key={t} selected={tab === t} onClick={() => setTab(t)}>{t}</Chip>)}</div>
 {tab === '대화' ? <><Chip selected={starred} onClick={() => setStarred(!starred)}><Star className="h-4 w-4" />즐겨찾기</Chip>{visible.length === 0 && <p className="py-12 text-center text-muted-foreground">아직 모아 둔 대화가 없어요.</p>}{visible.map((m, i) => <div key={m.id}>{(i === 0 || visible[i - 1]?.createdAt?.slice(0, 10) !== m.createdAt?.slice(0, 10)) && <h2 className="mb-3 mt-6 text-sm text-muted-foreground">{m.createdAt ? new Date(m.createdAt).toLocaleDateString('ko-KR') : '이전 대화'}</h2>}<div className="flex items-start gap-3 border-b border-border py-3"><div className="min-w-0 flex-1"><p className="mb-1 text-xs text-muted-foreground">{m.role === 'user' ? '나' : '반려동물'}</p><p className="whitespace-pre-wrap break-words">{m.text}</p></div><Button variant="ghost" size="icon" aria-label="대화 즐겨찾기" aria-pressed={p.favorites.includes(m.id)} onClick={() => updatePet({ favorites: p.favorites.includes(m.id) ? p.favorites.filter(id => id !== m.id) : [...p.favorites, m.id] })}><Star className={`h-4 w-4 ${p.favorites.includes(m.id) ? 'fill-primary text-primary' : ''}`} /></Button></div></div>)}</> : <>
 <form className="space-y-3 border-b border-border pb-6" onSubmit={e => { e.preventDefault(); if (!memo.trim()) return; updatePet({ diary: [{ id: crypto.randomUUID(), date, memo: memo.trim(), milestone: tab === '성장 기록' || milestone, ...(photo ? { photo } : {}) }, ...p.diary] }); reward(1, 'diary'); setMemo(''); setPhoto(''); setMilestone(false); toast.success('추억을 저장했어요'); }}>
 <label className="block text-sm">날짜<input aria-label="기록 날짜" type="date" value={date} required onChange={e => setDate(e.target.value)} className="mt-1 block h-11 w-full rounded-lg border border-input bg-card px-3" /></label>
 <label className="block text-sm">오늘의 기억<textarea aria-label="오늘의 기억" value={memo} maxLength={1000} onChange={e => setMemo(e.target.value)} className="mt-1 block min-h-28 w-full rounded-lg border border-input bg-card p-3" required /></label>
 <label className="block text-sm">사진<input aria-label="일기 사진" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-xs" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; setLoadingPhoto(true); try { const bitmap = await createImageBitmap(file); const canvas = document.createElement('canvas'); const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height)); canvas.width = bitmap.width * scale; canvas.height = bitmap.height * scale; canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height); setPhoto(canvas.toDataURL('image/jpeg', 0.7)); bitmap.close(); } catch { toast.error('사진을 읽지 못했어요'); } finally { setLoadingPhoto(false); } }} /></label>
 {photo && <img src={photo} alt="추억 사진 미리보기" className="max-h-48 rounded-lg object-contain" />}
 {tab === '일기' && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={milestone} onChange={e => setMilestone(e.target.checked)} />성장 기록에도 남기기</label>}
 <Button type="submit" disabled={!memo.trim() || loadingPhoto}><Plus className="h-4 w-4" />기록 남기기</Button></form>
 {p.diary.filter(d => tab !== '성장 기록' || d.milestone).sort((a, b) => b.date.localeCompare(a.date)).map(d => <article key={d.id} className="border-l-2 border-primary pl-5"><div className="flex items-center justify-between gap-3"><h2 className="text-sm text-muted-foreground">{d.date}{d.milestone ? ' · 특별한 날' : ''}</h2><Button variant="ghost" size="icon" aria-label="기록 삭제" onClick={() => { if (window.confirm('이 기록을 삭제할까요?')) updatePet({ diary: p.diary.filter(item => item.id !== d.id) }); }}><Trash2 className="h-4 w-4" /></Button></div>{d.photo && <img src={d.photo} alt="반려동물 추억" className="mb-3 max-h-72 rounded-lg object-contain" />}<p className="whitespace-pre-wrap break-words">{d.memo}</p></article>)}
 {p.diary.filter(d => tab !== '성장 기록' || d.milestone).length === 0 && <p className="py-8 text-center text-muted-foreground">첫 추억을 남겨 주세요.</p>}
 </>}
 </main></div>;
}
