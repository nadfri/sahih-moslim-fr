import { HadithType } from '@/types/HadithType';

export function Hadith({ hadith }: { hadith: HadithType }) {
  return (
    <div className='hadith-container'>
      <div className='hadith-header'>
        <h2>Chapitre: {hadith.chapter}</h2>
        <p className='narrator'>Narrateur: {hadith.narrator}</p>

        {hadith.sahabas && hadith.sahabas.length > 0 && (
          <div className='sahabas'>
            <p>Sahabas:</p>
            <ul>
              {hadith.sahabas.map((sahaba, index) => (
                <li key={index}>{sahaba}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className='hadith-body'>
        {hadith.text ? (
          <p className='hadith-text'>{hadith.text}</p>
        ) : (
          <p className='empty-text'>Aucun texte disponible pour ce hadith.</p>
        )}
      </div>
    </div>
  );
}
