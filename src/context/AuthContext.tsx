import { useState, createContext, SetStateAction, useContext } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export interface User {
  email: string;
  password: string;
}

export interface RegisterUser {
  email: string;
  password: string;
  confirm: string;
}

interface AuthContextProps {
  token: string | null;
  error: string | null;
  message: string | null;
  login: (user: User) => void;
  logout: () => void;
  register: (user: RegisterUser) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | null>(null);
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMsg] = useState<string | null>(null);

  const login = async (user: User) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          email: user.email,
          password: user.password,
        }
      );

      if (response.data.error) {
        setError(response.data.error);
        toastr.error(response.data.error);
      } else {
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken) as any;
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("useremail", decoded.email);
        localStorage.setItem("username", decoded.name);
        localStorage.setItem("userid", decoded.id);
      }
    } catch (error) {
      toastr.error("Email or password is incorrect!");
      setError("Email or password is incorrect!");
    }
  };

  const register = async (user: RegisterUser) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/register`,
      {
        email: user.email,
        password: user.password,
        confirmPassword: user.confirm,
      }
    );
    if (response.data.error) {
      toastr.error(response.data.error);
      setError(response.data.error);
    } else {
      setMsg(response.data.message);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ token, error, message, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    toastr.error("useAuth must be used within a AuthProvider");
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
