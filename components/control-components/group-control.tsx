export const GroupControl = ({
  children,
  id,
  label,
}: {
  children: React.ReactNode;
  id: string;
  label: string;
}) => {
  return (
    <div className="mb-3 input-group">
      <span className="input-group-text" id={id}>
        {label}
      </span>

      {children}
    </div>
  );
};
