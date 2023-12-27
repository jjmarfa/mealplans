interface FormItemProps {
  label?: string;
  className?: string;
  children: React.ReactNode;
}

const FormItem: React.FC<FormItemProps> = ({ label, children }) => {
  return (
    <div>
      {label && <div className="pb-1">{label}</div>}
      {children}
    </div>
  );
};

export default FormItem;
