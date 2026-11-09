import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { offers } from '@/lib/mock/data';
export function OffersSection() {
  return (
    <>
      {offers.map((offer) => (
        <AppCard key={offer.id}>
          <AppText variant="label" tone="primary">
            A TREAT FOR YOUR CAR · {offer.code}
          </AppText>
          <AppText variant="heading">{offer.title}</AppText>
          <AppText tone="muted">{offer.description}</AppText>
        </AppCard>
      ))}
    </>
  );
}
