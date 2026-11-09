import { AppImage } from '@/components/ui/AppImage';

export function AuthIcon({
  source,
  size = 18,
  height = size,
}: {
  source: number;
  size?: number;
  height?: number;
}) {
  return (
    <AppImage source={source} contentFit="contain" transition={0} style={{ width: size, height }} />
  );
}
