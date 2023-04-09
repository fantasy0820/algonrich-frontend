import React, { useState, useEffect } from "react";
import { Trans } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { User, useAuth } from "context/AuthContext";

const Login = () => {
  const { token, error, login, logout } = useAuth();
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);

  const navigate = useNavigate();
  const redirectPath = "/";

  const handleLogin = () => {
    login({
      email: user.email,
      password: user.password,
    });
  };

  if (token) navigate(redirectPath, { replace: true });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, email: event.target.value });
    const emailRegex = /\S+@\S+\.\S+/;
    setIsValidEmail(emailRegex.test(event.target.value));
  };

  return (
    <>
      <div className="justify-between mx-auto w-full lg:w-[90%] py-[250px]">
        <div className="flex flex-row flex-wrap mx-[-15px] justify-center text-center">
          <div className="flex-[0_0_50%] max-w-[50%] relative w-full px-[15px]">
            <div className="bg-[#131740] px-[50px] py-[40px] mx-[80px]">
              <p className="text-[25px] mb-5 text-center text-white leading-8">
                LOGIN
              </p>
              <div className="shadow-none">
                {user.email && !isValidEmail && (
                  <p className="text-left text-red-500">Invalid email format</p>
                )}
                <input
                  type="text"
                  placeholder="User email"
                  className="block w-full h-[50px] px-[15px] py-[7px] text-base text-white bg-transparent border border-[#666] rounded-[3px] mb-5"
                  value={user.email}
                  onChange={handleEmailChange}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="block w-full h-[50px] px-[15px] py-[7px] text-base text-white bg-transparent border border-[#666] rounded-[3px] mb-5"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
                <div className="relative mt-[10px] mb-5 mx-0">
                  <div className="absolute inline-block my-0 left-5">
                    <label className="font-light tracking-normal mb-0 outline-none inline-flex items-center pl-0 text-[15px]">
                      <input
                        type="checkbox"
                        className="min-h-[25px] h-[26px] mt-0 ml-[-20px] mr-[10px]"
                      />
                      Remember me
                    </label>
                  </div>
                  <a
                    className="text-sm float-right mt-[2px] text-[#ccc] hover:text-[#3d4db5]"
                    href="#"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  className="w-full mt-[64px] px-4 py-4 items-center justify-center text-white rounded-0 border-[2px] rounded-[4px]  border-[#3d4db5] font-bold font-chakrapetch hover:text-[#3d4db5] hover:border-transparent hover:bg-white uppercase transition ease-in-ease flex flex-nowrap"
                  onClick={handleLogin}
                >
                  <Trans i18nKey="btn_login">Login</Trans>
                </button>
                <div className="mt-5 font-semibold text-[#ccc]">
                  Have an account?
                  <a
                    href="#"
                    className="text-white hover:text-[#3d4db5] ml-2 text-md"
                  >
                    Signup
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
