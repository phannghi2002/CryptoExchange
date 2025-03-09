/* eslint-disable no-constant-condition */
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeXIcon, VerifiedIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import AccountVarificationForm from "./AccountVarificationForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getEmailFromToken,
  toggle2FAOAuthUser,
  toggle2FAUser,
} from "@/State/Auth/Action";
import { ModalUpdateUser } from "../Modal/ModalUpdateUser";
import { ModalChangePassword } from "../Modal/ModalChangePassword";

function Profile() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const hideEmailCharacters = (email) => {
    const emailLength = email.length;

    // Nếu email không hợp lệ hoặc quá ngắn, trả về nguyên vẹn
    if (emailLength < 7) return email;

    const prefix = email.slice(0, 4); // 4 ký tự đầu
    const suffix = email.slice(emailLength - 3); // 3 ký tự cuối + domain
    const maskedLength = emailLength - 4 - 3;

    const hiddenPart = "*".repeat(maskedLength);
    return `${prefix}${hiddenPart}${suffix}`;
  };

  const [hasJwt, setHasJwt] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu có JWT trong localStorage
    const token = localStorage.getItem("jwt");
    setHasJwt(!!token);
  }, []);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);

  let twoAuth = localStorage.getItem("twoAuth") === "true";

  const [showTwoAuth, setShowTwoAuth] = useState(twoAuth);

  const toggle2FA = () => {
    const newTwoAuthStatus = !showTwoAuth;

    // Cập nhật state
    setShowTwoAuth(newTwoAuthStatus);

    // Lưu trạng thái mới vào localStorage
    localStorage.setItem("twoAuth", newTwoAuthStatus);

    hasJwt ? dispatch(toggle2FAUser()) : dispatch(toggle2FAOAuthUser());
  };
  return (
    <div className="flex flex-col items-center mb-5">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="pb-9">
            {/* <CardTitle>Your Infomation</CardTitle> */}
            <CardTitle>Thông tin của bạn</CardTitle>
          </CardHeader>

          {/* <CardContent>
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem]">First Name :</p>
                  <p className="text-gray-500">{auth.user?.firstName}</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">Dob :</p>
                  <p className="text-gray-500">{auth.user?.dob}</p>
                </div>
              </div>

              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem]">Last Name :</p>
                  <p className="text-gray-500">{auth.user?.lastName}</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">City :</p>
                  <p className="text-gray-500">{auth.user?.city}</p>
                </div>
              </div>
            </div>
         
            <div className="flex mt-4">
              <p className="w-[9rem]">Email:</p>
              <p className="text-gray-500">
                {hideEmailCharacters(`${auth.email}`)}
              </p>
            </div>
          </CardContent> */}

          <CardContent>
            <div className="grid grid-cols-2 gap-x-32 gap-y-8">
              <div className="flex">
                {/* <p className="w-[9rem]">First Name:</p> */}
                <p className="w-[9rem]">Họ:</p>

                <p className="text-gray-500">{auth.user?.firstName}</p>
              </div>

              <div className="flex">
                {/* <p className="w-[9rem]">Last Name:</p> */}
                <p className="w-[9rem]">Tên:</p>
                <p className="text-gray-500">{auth.user?.lastName}</p>
              </div>

              {/* Email row spanning 2 columns */}
              <div className="flex col-span-2">
                <p className="w-[9rem]">Email:</p>
                <p className="text-gray-500">
                  {hideEmailCharacters(`${auth.email}`)}
                </p>
              </div>

              <div className="flex">
                {/* <p className="w-[9rem]">Dob:</p> */}
                <p className="w-[9rem]">Ngày sinh: </p>

                <p className="text-gray-500">{auth.user?.dob}</p>
              </div>

              <div className="flex">
                {/* <p className="w-[9rem]">City:</p> */}
                <p className="w-[9rem]">Quốc tịch:</p>

                <p className="text-gray-500">{auth.user?.city}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button onClick={() => setOpenModalUpdate(true)}>
                Cập nhật thông tin{" "}
              </Button>
              {hasJwt && (
                <Button
                  className="ml-8"
                  onClick={() => setOpenModalChangePassword(true)}
                >
                  Thay đổi mật khẩu
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card className="w-full">
            <CardHeader className="pb-7">
              <div className="flex items-center gap-3">
                {/* <CardTitle>2 Step Verification</CardTitle> */}
                <CardTitle>Xác thực 2 yếu tố</CardTitle>

                {showTwoAuth === true ? (
                  <Badge
                    className={"space-x-2 text-white bg-green-600"}
                    onClick={() => toggle2FA()}
                  >
                    <VerifiedIcon />
                    {/* <span>Enabled</span> */}
                    <span className="text-lg">Bật</span>
                  </Badge>
                ) : (
                  <Badge
                    className="space-x-2 text-white bg-orange-600"
                    onClick={() => toggle2FA()}
                  >
                    <BadgeXIcon />
                    {/* <span>Disable</span> */}
                    <span className="text-lg">Tắt</span>
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
      <ModalUpdateUser
        isOpen={openModalUpdate}
        onClose={() => setOpenModalUpdate(false)}
      />
      <ModalChangePassword
        isOpen={openModalChangePassword}
        onClose={() => setOpenModalChangePassword(false)}
        email={auth.email}
        changeOld={true}
      />
    </div>
  );
}

export default Profile;
