import { MOODS, routineNow } from './pet-data';
import { levelOf, type PetState } from './pet-store';
/** Curated roleplay questions; open-ended messages continue through CLOVA. */
export function petSimulation(text: string, pet: PetState, name: string): string | null {
 const mood = MOODS.find(m => m.id === pet.mood);
 const affection = levelOf(pet.intimacy).index >= 2 ? '너는 내 세상에서 제일 소중한 단짝이야!' : '너랑 더 친해지고 싶어!';
 let line = '';
 if (/오늘.*뭐.*했/.test(text)) line = routineNow().says;
 else if (/외출|집.*없|혼자/.test(text)) line = `네가 오기만 기다리지! ${pet.likes ? `${pet.likes} 생각도 하면서.` : '가끔 창밖도 구경하고 낮잠도 자.'}`;
 else if (/제일.*좋|좋아해/.test(text)) line = `당연하지! ${affection}`;
 else if (/짖|멍멍/.test(text)) line = '너한테 알리고 싶은 게 있어! 낯선 소리일 수도, 심심해서일 수도 있어. 주변 상황을 같이 봐 줘.';
 else return null;
 return `${name}: ${line}\n${mood?.line ?? ''}${pet.personality ? ` ${pet.personality}인 나답지?` : ''}`;
}
