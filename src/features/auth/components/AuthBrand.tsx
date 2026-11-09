import { StyleSheet, View } from 'react-native';

import carFront from '@/assets/images/login/carFront.svg';
import { AppText } from '@/components/ui/AppText';
import { loginColors as colors } from '@/theme';

import { AuthIcon } from './AuthIcon';

export function AuthBrand() {
  return (
    <View style={styles.brand}>
      <View style={styles.mark}>
        <AuthIcon source={carFront} size={21} />
      </View>
      <AppText style={styles.name}>
        Auto<AppText style={[styles.name, styles.accent]}>Care</AppText>
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  mark: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { color: colors.text, fontSize: 21, letterSpacing: -0.7 },
  accent: { color: colors.primary },
});
