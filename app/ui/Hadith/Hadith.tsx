import { HadithType } from '@/types/types';
import ReactMarkdown from 'react-markdown';

type HadithProps = {
  hadith: HadithType;
};

export function Hadith({ hadith }: HadithProps) {
  return (
    <div className='hadith-container'>
      <div className='hadith-header'>
        <h2>Chapitre: {hadith.chapter}</h2>
        <p className='narrator'>Narrateur: {hadith.narrator}</p>

        {hadith.sahabas && hadith.sahabas.length > 0 && (
          <div className='sahabas'>
            <p>Sahabas: {hadith.sahabas.join(', ')}</p>
          </div>
        )}
      </div>

      <hr />
      <ReactMarkdown>{hadith.matn}</ReactMarkdown>
    </div>
  );
}
