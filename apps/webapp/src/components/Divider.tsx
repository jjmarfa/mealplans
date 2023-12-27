import { Divider as AntDivider, DividerProps } from "antd";

const Divider: React.FC<DividerProps> = (props) => (
  <AntDivider {...props} className="my-2 md:my-5" />
);

export default Divider;
