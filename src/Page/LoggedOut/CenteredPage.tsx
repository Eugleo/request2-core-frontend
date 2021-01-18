export function CenteredPage({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  children,
}: {
  imageSrc: string;
  imageAlt: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="py-10 px-10 min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md w-full">
        <div className="mb-10 mx-auto max-w-sm">
          <img src={imageSrc} alt={imageAlt} className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-3xl font-black text-center mb-2">{title}</h1>
          <p className="text-sm text-center text-gray-700">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function CenteredForm({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="rounded-md ring-1 ring-black ring-opacity-5 bg-white w-full px-6 py-6">
      {children}
    </div>
  );
}
