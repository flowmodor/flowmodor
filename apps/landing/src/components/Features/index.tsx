import Feature from './Feature';

export default function Features({ names }: { names: string[] }) {
  return (
    <ul>
      {names.map((name) => (
        <Feature key={name} name={name} />
      ))}
    </ul>
  );
}
