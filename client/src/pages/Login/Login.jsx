import { Button, Form, Input } from "antd";
import { userLogin } from "../../services/userService";
import useNotification from "../../hooks/useNotification";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLogin, setIsAdmin }) => {
  const navigate = useNavigate();
  const openNotificationWithIcon = useNotification();
  const onFinish = async (values) => {
    try {
      const res = await userLogin(values);
      localStorage.setItem("user", JSON.stringify(res.user));
      openNotificationWithIcon("success", res.message, "");
      setIsLogin(true);
      res.user.access_level === 1 ? setIsAdmin(true) : setIsAdmin(false);
      navigate("/product");
    } catch (e) {
      openNotificationWithIcon("error", e.response.data.message, "");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        style={{ width: "100%", maxWidth: "400px" }}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
