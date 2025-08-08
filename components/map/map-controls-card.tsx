import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Layers, Satellite, MapPin, LocateFixed, Compass } from 'lucide-react';

type Props = {
  baseMap: 'roadmap' | 'satellite';
  setBaseMap: (v: 'roadmap' | 'satellite') => void;
  use3D: boolean;
  setUse3D: (v: boolean) => void;
  showMarkers: boolean;
  setShowMarkers: (v: boolean) => void;
  useArchiveData: boolean;
  setUseArchiveData: (v: boolean) => void;
  onRecenter: () => void;
  onRotate: () => void;
};

export function MapControlsCard({ baseMap, setBaseMap, use3D, setUse3D, showMarkers, setShowMarkers, useArchiveData, setUseArchiveData, onRecenter, onRotate }: Props) {
  return (
    <TooltipProvider>
      <div className="bg-card border rounded-xl shadow-sm p-1.5 flex flex-wrap items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          className={`h-8 px-3 rounded-lg border-2 ${baseMap === 'roadmap' ? 'border-border' : 'border-transparent'}`}
          onClick={() => setBaseMap('roadmap')}
        >
          <Layers className="w-3.5 h-3.5 mr-1.5" />
          Roadmap
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className={`h-8 px-3 rounded-lg border-2 ${baseMap === 'satellite' ? 'border-border' : 'border-transparent'}`}
          onClick={() => setBaseMap('satellite')}
        >
          <Satellite className="w-3.5 h-3.5 mr-1.5" />
          Satellite
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className={`h-8 px-3 rounded-lg border-2 ${use3D ? 'border-border' : 'border-transparent'}`}
          onClick={() => setUse3D(!use3D)}
        >
          3D
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className={`h-8 px-3 rounded-lg border-2 ${showMarkers ? 'border-border' : 'border-transparent'}`}
          onClick={() => setShowMarkers(!showMarkers)}
        >
          <MapPin className="w-3.5 h-3.5 mr-1.5" />
          Markers
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className={`h-8 px-3 rounded-lg border-2 ${useArchiveData ? 'border-border' : 'border-transparent'}`}
          onClick={() => setUseArchiveData(!useArchiveData)}
        >
          Archief
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg" onClick={onRecenter}>
              <LocateFixed className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Center NL</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg" onClick={onRotate}>
              <Compass className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Draai</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
