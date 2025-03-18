// components/profile/account-settings.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { changePassword } from "@/lib/api/user";
import { toast } from "react-toastify";

export const AccountSettings = () => {
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const newPassword = watch("new_password");

  const onSubmitPasswordChange = async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    try {
      setIsLoading(true);
      await changePassword(
        data.current_password,
        data.new_password,
        data.confirm_password
      );

      toast.success("Password updated successfully!");
      setIsChangingPassword(false);
      reset();
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        "Failed to update password. Please check your current password and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Account Settings</h2>
      </div>

      <div className="p-6">
        {/* Email Preferences */}
        <div className="mb-8">
          <h3 className="font-medium mb-4">Email Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="marketing-emails"
                className="mt-1 h-4 w-4 text-black rounded focus:ring-black"
                defaultChecked
              />
              <div className="ml-3">
                <label htmlFor="marketing-emails" className="font-medium">
                  Marketing Emails
                </label>
                <p className="text-sm text-gray-500">
                  Receive emails about new products, sales, and promotions
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="order-updates"
                className="mt-1 h-4 w-4 text-black rounded focus:ring-black"
                defaultChecked
              />
              <div className="ml-3">
                <label htmlFor="order-updates" className="font-medium">
                  Order Updates
                </label>
                <p className="text-sm text-gray-500">
                  Receive emails about your orders, shipping updates, and
                  delivery notifications
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="account-updates"
                className="mt-1 h-4 w-4 text-black rounded focus:ring-black"
                defaultChecked
              />
              <div className="ml-3">
                <label htmlFor="account-updates" className="font-medium">
                  Account Updates
                </label>
                <p className="text-sm text-gray-500">
                  Receive emails about your account, security updates, and
                  policy changes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="mb-8">
          <h3 className="font-medium mb-4">Account Security</h3>

          {/* Password Change Section */}
          <div className="border rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h4 className="font-medium">Password</h4>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Change
                </button>
              )}
            </div>

            <div className="p-4">
              {isChangingPassword ? (
                <form onSubmit={handleSubmit(onSubmitPasswordChange)}>
                  {/* Current Password */}
                  <div className="mb-4">
                    <label
                      htmlFor="current_password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="current_password"
                        type={showCurrentPassword ? "text" : "password"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        {...register("current_password", {
                          required: "Current password is required",
                        })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} className="text-gray-400" />
                        ) : (
                          <Eye size={18} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.current_password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.current_password.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="mb-4">
                    <label
                      htmlFor="new_password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="new_password"
                        type={showNewPassword ? "text" : "password"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        {...register("new_password", {
                          required: "New password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message:
                              "Password must include uppercase, lowercase, number and special character",
                          },
                        })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} className="text-gray-400" />
                        ) : (
                          <Eye size={18} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.new_password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.new_password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label
                      htmlFor="confirm_password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        {...register("confirm_password", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === newPassword || "Passwords do not match",
                        })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} className="text-gray-400" />
                        ) : (
                          <Eye size={18} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirm_password.message}
                      </p>
                    )}
                  </div>

                  {/* Password Guidance */}
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="text-sm text-gray-500 font-medium mb-2">
                      Your password should:
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 pl-4 list-disc">
                      <li>Be at least 8 characters long</li>
                      <li>Include at least one uppercase letter</li>
                      <li>Include at least one lowercase letter</li>
                      <li>Include at least one number</li>
                      <li>Include at least one special character</li>
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        reset();
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center">
                  <div className="w-3/4">
                    <p className="text-sm text-gray-500">
                      Your password was last changed{" "}
                      <span className="text-gray-700">never</span>
                    </p>
                  </div>
                  <div className="w-1/4 text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Secure
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Two-factor Authentication */}
          <div className="border rounded-md overflow-hidden mt-4">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <button
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() =>
                  toast.info("This feature is not available in the demo")
                }
              >
                Setup
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center">
                <div className="w-3/4">
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="w-1/4 text-right">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    Not Enabled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div>
          <h3 className="font-medium mb-4">Delete Account</h3>
          <div className="bg-red-50 p-4 rounded-md flex items-start space-x-3">
            <AlertCircle
              size={18}
              className="text-red-500 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm text-red-800 font-medium">
                Delete your account permanently
              </p>
              <p className="text-sm text-red-600 mb-4">
                Once you delete your account, there is no going back. This
                action cannot be undone.
              </p>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={() =>
                  toast.info("Account deletion is not available in the demo")
                }
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
