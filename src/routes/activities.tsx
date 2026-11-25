import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Header, Button, Chip } from '@/components/common';
import { PetPortrait } from '@/components/PetPortrait';
import { BEHAVIORS, SOUNDS, LETTERS, FORTUNES, PLAYS, SNACKS, ROUTINES, SITUATIONS_SIM, OUTFITS, STICKERS, routineNow } from '@/lib/pet-data';
import { usePet, updatePet, reward, dailyPick, today, levelOf } from '@/lib/pet-store';
import { useSettings } from '@/lib/settings-store';

export const Route = createFileRoute('/activities')({
 head: () => ({ meta: [ { title: '함께하기 · 뭐라는 거야?' }, { name: 'description', content: '반려동물 행동과 소리, 놀이, 편지와 매일의 소소한 즐거움.' }, { property: 'og:title', content: '함께하기 · 뭐라는 거야?' }, { property: 'og:description', content: '반려동물과 함께하는 하루.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' } ] }), component: Activities,
});
const tabs = ['속마음', '일상', '도감'];
function Activities() {
 const p = usePet(); const s = useSettings(); const [tab, setTab] = useState('속마음');
 const [response, setResponse] = useState<{ says: string; note?: string } | null>(null);
 const [letter, setLetter] = useState(false); const [fortune, setFortune] = useState(false);
 const [snackRound, setSnackRound] = useState(0); const [snackChoice, setSnackChoice] = useState('');
 const [period, setPeriod] = useState(routineNow().id);
 if (!p || !s) return null;
 const speak = (says: string, sticker: string, note?: string) => { setResponse(note ? { says, note } : { says }); reward(1, sticker); };
 const snackPair = snackRound === 0 ? SNACKS.slice(0, 2) : snackRound === 1 ? [snackChoice, SNACKS[2] ?? '치즈'] : [snackChoice, SNACKS[3] ?? '사과'];
 return <div className="flex flex-1 flex-col"><Header title="함께하기" />
 <main className="page-content space-y-7 px-5 py-6">
  <div className="flex flex-wrap gap-2">{tabs.map(t => <Chip key={t} selected={t === tab} onClick={() => { setTab(t); setResponse(null); }}>{t}</Chip>)}</div>
  <div className="flex items-center gap-4"><PetPortrait compact /><div><h2 className="text-xl font-semibold">{s.name}의 하루</h2><p className="text-sm text-muted-foreground">{levelOf(p.intimacy).label} · 친밀도 {p.intimacy}</p></div></div>
  {response && <div role="status" className="border-l-4 border-primary bg-accent p-4"><p className="font-semibold">“{response.says}”</p>{response.note && <p className="mt-2 text-sm text-muted-foreground">{response.note}</p>}</div>}
  {tab === '속마음' && <>
   <section><h2 className="mb-3 text-lg font-semibold">행동 속마음</h2><div className="grid gap-2 sm:grid-cols-2">{BEHAVIORS.map(b => <Button key={b.id} variant="outline" className="h-auto justify-start whitespace-normal py-3 text-left" onClick={() => speak(b.says, 'behavior', b.note)}>{b.label}</Button>)}</div></section>
   <section><h2 className="mb-3 text-lg font-semibold">소리 속마음</h2><div className="grid gap-2 sm:grid-cols-2">{SOUNDS.map(b => <Button key={b.id} variant="outline" className="h-auto justify-start whitespace-normal py-3 text-left" onClick={() => speak(b.says, 'sound', b.note)}>{b.label}</Button>)}</div><p className="mt-3 text-xs text-muted-foreground">상황을 바탕으로 한 가능한 의미예요. 실제 녹음 분석이나 진단은 아니에요. 통증이나 갑작스러운 변화가 보이면 수의사에게 상담해 주세요.</p></section>
   <section><h2 className="mb-3 text-lg font-semibold">상황별 대화</h2><div className="flex flex-wrap gap-2">{SITUATIONS_SIM.map(b => <Chip key={b.id} onClick={() => speak(b.says, 'situation')}>{b.label}</Chip>)}</div></section>
   <section className="border-t border-border pt-5"><h2 className="text-lg font-semibold">오늘의 속마음 편지</h2><p className="mb-3 text-xs text-muted-foreground">{today()}</p>{letter || p.letterDate === today() ? <p className="leading-relaxed">{s.name}이가 너에게 💌<br />{dailyPick(LETTERS, today())}</p> : <Button onClick={() => { setLetter(true); updatePet({ letterDate: today() }); reward(1, 'letter'); }}>편지 열기</Button>}</section>
   <section className="border-t border-border pt-5"><h2 className="mb-3 text-lg font-semibold">오늘의 펫 운세</h2>{fortune ? <p>{dailyPick(FORTUNES, today(), 7)}</p> : <Button variant="secondary" onClick={() => { setFortune(true); reward(1, 'fortune'); }}>오늘의 한마디</Button>}</section>
  </>}
  {tab === '일상' && <>
   <section><h2 className="mb-3 text-lg font-semibold">오늘의 놀이</h2><div className="grid grid-cols-2 gap-2">{PLAYS.map(b => <Button key={b.id} variant="outline" onClick={() => { updatePet({ mood: 'happy' }); speak(b.says, 'play'); }}>{b.label}</Button>)}</div></section>
   <section><h2 className="mb-3 text-lg font-semibold">하루 루틴</h2><div className="flex flex-wrap gap-2">{ROUTINES.map(r => <Chip key={r.id} selected={r.id === period} onClick={() => setPeriod(r.id)}>{r.label}</Chip>)}</div><p className="mt-3">{ROUTINES.find(r => r.id === period)?.says}</p></section>
   <section className="border-t border-border pt-5"><h2 className="mb-3 text-lg font-semibold">간식 취향 토너먼트</h2>{snackRound < 3 ? <><p className="mb-3 text-sm text-muted-foreground">{snackRound + 1} / 3 · 더 좋아할 것 같은 간식은?</p><div className="flex flex-wrap gap-2">{snackPair.map(sn => <Button key={sn} variant="outline" onClick={() => { setSnackChoice(sn); setSnackRound(snackRound + 1); if (snackRound === 2) { updatePet({ snack: sn }); reward(2, 'snack'); } }}>{sn}</Button>)}</div></> : <><p>최애 간식은 {p.snack}!</p><Button variant="ghost" onClick={() => setSnackRound(0)}>다시 고르기</Button></>}<p className="mt-3 text-xs text-muted-foreground">재미로 고르는 취향이에요. 실제 급여 권장이 아니며 알레르기와 안전한 급여 여부를 따로 확인해 주세요.</p></section>
   <section className="border-t border-border pt-5"><h2 className="mb-3 text-lg font-semibold">꾸미기</h2><div className="flex flex-wrap gap-2">{OUTFITS.map(o => <Chip key={o.id} selected={p.outfit === o.id} disabled={p.intimacy < (o.min ?? 0)} onClick={() => updatePet({ outfit: o.id })}>{o.icon} {o.label}{p.intimacy < (o.min ?? 0) ? ` · 친밀도 ${o.min}` : ''}</Chip>)}</div></section>
  </>}
  {tab === '도감' && <><h2 className="text-lg font-semibold">모은 스티커 · {p.stickers.length}/{Object.keys(STICKERS).length}</h2><div className="grid grid-cols-3 gap-3">{Object.entries(STICKERS).map(([id, item]) => <div key={id} className={`rounded-lg border border-border p-3 text-center ${p.stickers.includes(id) ? 'bg-card' : 'bg-muted opacity-50'}`}><span className="text-3xl">{p.stickers.includes(id) ? item.icon : '🔒'}</span><p className="mt-2 text-xs">{item.label}</p></div>)}</div><p className="text-sm text-muted-foreground">칭호 · {levelOf(p.intimacy).label}</p></>}
 </main></div>;
}
