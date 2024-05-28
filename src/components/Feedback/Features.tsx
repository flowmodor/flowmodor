import Feature from './Feature';

export default function Features({ features }: { features: any[] }) {
  if (!features) {
    return null;
  }

  return features.map((feature, index) => (
    <div key={feature.id} className="flex flex-col gap-6">
      <Feature feature={feature} />
      {index < features.length - 1 && <hr className="border-secondary" />}
    </div>
  ));
}
