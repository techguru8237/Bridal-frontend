import React, { useEffect, useState } from "react";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import { handleLogin } from "../actions/auth";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
};

const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

Button.propTypes = {
  className: PropTypes.string,
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('isAuthenticated')) {
      navigate('/home')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    handleLogin(formData, () => {
      navigate("/home");
      setIsLoading(false)
      localStorage.setItem("isAuthenticated", "true");
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-md mx-auto p-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-white">
              The Bridal House
            </h1>
            <p className="text-gray-200">
              Please enter your details to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeClosedIcon className="h-4 w-4" />
                  ) : (
                    <EyeOpenIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-400 bg-white/10 text-blue-600"
                />
                <span className="text-sm text-gray-200">Remember me</span>
              </label>
              <a
                href="#forgot-password"
                className="text-sm text-blue-300 hover:text-blue-200"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-lg border border-white/20"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
