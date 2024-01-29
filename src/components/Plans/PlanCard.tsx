function Feature({ feature }: { feature: string }) {
  return (
    <li className="flex items-center gap-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-indigo-600"
        viewBox="0 0 20 20"
        fill="#DBBFFF"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span>{feature}</span>
    </li>
  );
}

export default function PlanCard({
  children,
  name,
  price,
  features,
}: {
  children: React.ReactNode;
  name: string;
  price: number;
  features: string[];
}) {
  return (
    <div className="flex w-full flex-col gap-10 rounded-xl bg-[#23223C] p-10 sm:w-2/5 lg:w-1/3">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">{name}</h2>
        <div className="flex items-end gap-1">
          <h2 className="text-4xl font-semibold">${price}</h2>
          <div className="text-sm opacity-50">/ month</div>
        </div>
      </div>
      {children}
      <ul>
        {features.map((feature) => (
          <Feature key={feature} feature={feature} />
        ))}
      </ul>
    </div>
  );
}
