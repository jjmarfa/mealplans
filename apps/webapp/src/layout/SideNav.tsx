import {
  BarsOutlined,
  CrownOutlined,
  FireOutlined,
  HomeOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Link } from "react-router-dom";
import signOutApi from "../api/signOut";

const SideNav = () => {
  const selectedPath = location.pathname.split("/")[1] || "home";
  console.log(selectedPath);

  async function handleLogout() {
    await signOutApi();
  }

  return (
    <Sider
      collapsible
      breakpoint="lg"
      className="flex flex-col justify-between h-screen"
      collapsedWidth={60}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <Link
            to="/"
            className="h-[64px] my-0 md:my-10 flex items-center justify-center text-white font-bold"
          >
            <img src="/logo-black.png" className="w-[80px] hidden md:block" />
            <img src="/logo-black.svg" className="w-[40px] block md:hidden" />
          </Link>

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[selectedPath]}
            items={[
              {
                key: "home",
                icon: <HomeOutlined />,
                label: <Link to="/">Home</Link>,
              },
              {
                key: "recipes",
                icon: <FireOutlined />,
                label: <Link to="/recipes">Recipes</Link>,
              },
              {
                key: "meal_plans",
                icon: <BarsOutlined />,
                label: <Link to="/meal_plans">Meal Plans</Link>,
              },
              {
                key: "premium",
                icon: <CrownOutlined />,
                label: <Link to="/premium">Premium</Link>,
              },
            ]}
          />
        </div>

        <div className="mx-[10px] my-[10px]">
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[selectedPath]}
            items={[
              {
                key: "logout",
                icon: <PoweroffOutlined />,
                label: "Logout",
                onClick: handleLogout,
              },
            ]}
          />
        </div>
      </div>
    </Sider>
  );
};

export default SideNav;
