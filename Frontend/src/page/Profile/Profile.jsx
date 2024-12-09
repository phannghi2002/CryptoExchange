/* eslint-disable no-constant-condition */
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifiedIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AccountVarificationForm from "./AccountVarificationForm";
import { useSelector } from "react-redux";

function Profile() {
  const { auth } = useSelector((store) => store);
  const handleEnableTwoStepVerification = () => {};
  return (
    <div className="flex flex-col items-center mb-5">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="pb-9">
            <CardTitle>Your Infomation</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem]">Email :</p>
                  <p className="text-gray-500">{auth.user?.email}</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">Full Name :</p>
                  <p className="text-gray-500">{auth.user?.fullName}</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">Date of Birth :</p>
                  <p className="text-gray-500">25/12/2000</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">Nationality :</p>
                  <p className="text-gray-500">Vietnamese</p>
                </div>
              </div>

              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem]">Address :</p>
                  <p className="text-gray-500">
                    41 Ly Thai To, Ha Dong, Ha Noi
                  </p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">City:</p>
                  <p className="text-gray-500">Ha Noi</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">Postcode :</p>
                  <p className="text-gray-500">2593480</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">Country :</p>
                  <p className="text-gray-500">Vietnamese</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card className="w-full">
            <CardHeader className="pb-7">
              <div className="flex items-center gap-3">
                <CardTitle>2 Step Verification</CardTitle>

                {true ? (
                  <Badge className={"space-x-2 text-white bg-green-600"}>
                    <VerifiedIcon />
                    <span>Enabled</span>{" "}
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500">Disable</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div>
                <Dialog>
                  <DialogTrigger>
                    <Button>Enabled Two Step Verification</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Verify your account</DialogTitle>
                    </DialogHeader>

                    <AccountVarificationForm
                      handleSubmit={handleEnableTwoStepVerification}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
