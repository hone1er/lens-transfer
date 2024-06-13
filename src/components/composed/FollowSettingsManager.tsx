"use client";
import React, { useState } from "react";
import {
  type FollowPolicy,
  FollowPolicyType,
  SessionType,
  resolveFollowPolicy,
  useSession,
  useUpdateFollowPolicy,
  Amount,
  erc20,
  ChainType,
} from "@lens-protocol/react-web";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export function FollowSettingsManager() {
  const { execute, loading, error } = useUpdateFollowPolicy();
  const { data: session } = useSession();

  const [selectedPolicy, setSelectedPolicy] = useState(FollowPolicyType.ANYONE);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleUpdatePolicy = async () => {
    if (selectedPolicy !== FollowPolicyType.CHARGE) {
      await execute({
        followPolicy: {
          type: selectedPolicy as
            | FollowPolicyType.ANYONE
            | FollowPolicyType.NO_ONE,
        },
      });
    } else if (selectedPolicy === FollowPolicyType.CHARGE) {
      await execute({
        followPolicy: {
          type: selectedPolicy as FollowPolicyType.CHARGE,
          amount: Amount.erc20(
            erc20({
              name: "wrapped ether",
              decimals: 18,
              symbol: "WETH",
              address: "0x",
              chainType: ChainType.POLYGON,
            }),
            amount,
          ),
          recipient,
        },
      });
    }
  };

  const followPolicy =
    session?.authenticated &&
    session.type === SessionType.WithProfile &&
    resolveFollowPolicy(session?.profile);

  return (
    <div className="container relative mx-auto px-4 py-12 md:px-6 md:py-16 ">
      {/* coming soon layover */}
      <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-xl bg-gray-900 bg-opacity-50 font-bold text-white">
        <p>Follow Policy Manger is coming soon!</p>
      </div>
      <div className="z-0 mx-auto max-w-2xl ">
        <div className="rounded-lg bg-white p-6 shadow-lg blur-[2px] dark:bg-gray-900 md:p-8">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold">Manage Follow Policy</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Control who can follow your social media account.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="mb-2 text-lg font-semibold">
                Current Follow Policy
              </h2>
              <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {(followPolicy as FollowPolicy)?.type}
                </p>
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-semibold">
                Change Follow Policy
              </h2>
              <div className="space-y-4">
                <RadioGroup
                  value={selectedPolicy}
                  //   onClick={(val)setSelectedPolicy}
                  className="space-y-4"
                >
                  <div className="flex items-center">
                    <RadioGroupItem
                      id="anyone"
                      value={FollowPolicyType.ANYONE}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="anyone"
                      className="flex cursor-pointer items-center space-x-2"
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-500">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <span>Anyone can follow</span>
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem
                      id="no-one"
                      value={FollowPolicyType.NO_ONE}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="no-one"
                      className="flex cursor-pointer items-center space-x-2"
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-500">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <span>No one can follow</span>
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem
                      id="charge"
                      value={FollowPolicyType.CHARGE}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="charge"
                      className="flex cursor-pointer items-center space-x-2"
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-500">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <span>Charge to follow</span>
                    </Label>
                  </div>
                </RadioGroup>
                {selectedPolicy === FollowPolicyType.CHARGE && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="recipient"
                          className="mb-1 block text-sm font-medium"
                        >
                          Recipient
                        </Label>
                        <Input
                          id="recipient"
                          type="text"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          placeholder="Enter recipient's username"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="amount"
                          className="mb-1 block text-sm font-medium"
                        >
                          Amount
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {error && (
              <div className="text-red-500">
                <p>Error updating follow policy: {error.message}</p>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                onClick={handleUpdatePolicy}
                disabled={loading}
                className="rounded bg-primary px-4 py-2 font-medium text-white hover:bg-blue-600"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
