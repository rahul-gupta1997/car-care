import { AppImage } from './AppImage';
export function DesignIcon({
  source,
  size,
  height = size,
}: {
  source: number;
  size: number;
  height?: number;
}) {
  return (
    <AppImage source={source} contentFit="contain" transition={0} style={{ width: size, height }} />
  );
}
