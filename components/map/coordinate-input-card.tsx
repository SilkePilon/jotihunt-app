import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LatLng } from './map-utils';

type Props = {
  coordInput: string;
  setCoordInput: (v: string) => void;
  onSubmit: () => void;
  lastCustomPoint: LatLng | null;
  selectedHuntGroup: 'Alpha' | 'Bravo' | 'Charlie' | 'Delta' | 'Echo' | 'Foxtrot' | null;
  onSelectHuntGroup: (name: 'Alpha' | 'Bravo' | 'Charlie' | 'Delta' | 'Echo' | 'Foxtrot') => void;
  copyGoogleMapsLink: () => void;
  coordOutsideNL: boolean;
};

export function CoordinateInputCard({ coordInput, setCoordInput, onSubmit, lastCustomPoint, selectedHuntGroup, onSelectHuntGroup, copyGoogleMapsLink, coordOutsideNL }: Props) {
  return (
    <div className="absolute top-4 left-4 z-20 max-w-[95vw] pointer-events-auto">
      <div className={`${coordOutsideNL ? 'border-2 border-red-500' : 'border'} bg-card rounded-xl shadow-sm p-1.5`}>
        <div className="flex flex-wrap items-center gap-1.5">
          <Input
            value={coordInput}
            onChange={(e) => setCoordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSubmit();
            }}
            placeholder="1234 5678"
            className="h-8 w-[200px] sm:w-[260px] rounded-lg"
            aria-label="Coördinaten invoer"
          />
          <Button
            variant="secondary"
            size="sm"
            className={`h-8 px-3 rounded-lg ${coordOutsideNL ? 'border-2 border-red-500' : 'border-2 border-border'}`}
            onClick={onSubmit}
          >
            Toon
          </Button>
        </div>
        {lastCustomPoint && (
          <>
            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
              {(['Alpha','Bravo','Charlie','Delta','Echo','Foxtrot'] as const).map((name) => (
                <Button
                  key={name}
                  variant="secondary"
                  size="sm"
                  className={`h-8 px-3 rounded-lg border-2 ${selectedHuntGroup === name ? 'border-border' : 'border-transparent'}`}
                  onClick={() => onSelectHuntGroup(name)}
                >
                  {name}
                </Button>
              ))}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                className={`h-8 px-3 rounded-lg ${coordOutsideNL ? 'border-2 border-red-500' : 'border-2 border-border'}`}
                onClick={copyGoogleMapsLink}
                title="Kopieer Google Maps link"
              >
                Kopieer Google Maps link
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
