import { Image, ImageProps } from 'expo-image';
export function AppImage({ accessibilityLabel, ...props }: ImageProps) {
  return (
    <Image
      contentFit="cover"
      cachePolicy="memory-disk"
      transition={180}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      {...props}
    />
  );
}
