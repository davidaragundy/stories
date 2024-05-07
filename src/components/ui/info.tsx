export const Info = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <aside className="flex flex-col">
      <div className="flex max-w-52 flex-col gap-2 rounded-3xl bg-default-100 p-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="whitespace-break-spaces break-words text-sm">
          {description}
        </p>
      </div>
    </aside>
  );
};
