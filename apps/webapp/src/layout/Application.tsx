import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import SideNav from "./SideNav";
import { Content } from "antd/es/layout/layout";

const ApplicationLayout = () => {
  return (
    <Layout>
      <SideNav />
      <Layout className="min-h-screen h-screen">
        <div className="overflow-auto h-full mx-2 my-2 md:mx-5 md:my-5">
          <Content className="bg-white py-2 px-2 md:py-5 md:px-8 box-content min-h-full">
            <Outlet />
          </Content>
        </div>
      </Layout>
    </Layout>
  );
};

export default ApplicationLayout;
