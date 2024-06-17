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
  useProfileFollowers,
  type ProfileId,
  type Profile,
  TriStateValue,
  useFollow,
  useBlockProfiles,
  useBlockedProfiles,
  useUnblockProfiles,
  useProfilesManaged,
} from "@lens-protocol/react-web";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LensProfiles } from "./LensProfiles";
import { useAccount, useDisconnect } from "wagmi";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const FormSchema = z.object({
  followPolicy: z.enum(
    [
      FollowPolicyType.ANYONE,
      FollowPolicyType.CHARGE,
      FollowPolicyType.NO_ONE,
      FollowPolicyType.UNKNOWN,
    ],
    {
      required_error: "You need to select a follow policy.",
    },
  ),
});

export function FollowSettingsManager() {
  const { execute, loading, error } = useUpdateFollowPolicy();
  const { data: session, loading: loadingSession } = useSession();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { data: profiles } = useProfilesManaged({
    for: address as string,
  });
  const { data: followers } = useProfileFollowers({
    of:
      session?.authenticated && session.type === SessionType.WithProfile
        ? session?.profile?.id
        : ("" as ProfileId),
  });
  const [selectedPolicy, setSelectedPolicy] = useState(FollowPolicyType.ANYONE);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async () => {
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
    <div className="min-h-[72 vh] p container relative mx-auto  flex flex-col space-y-4 px-0 py-2 sm:px-2 md:px-6 md:py-16 ">
      {/* coming soon layover */}
      {/* <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-xl bg-gray-900 bg-opacity-50 font-bold text-white">
        <p>Follow Policy Manger is coming soon!</p>
      </div> */}
      <Button
        onClick={() => disconnect()}
        size={"sm"}
        className="max-w-60 place-self-end"
      >
        Disconnect Wallet
      </Button>
      <Card className="border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Manage Followers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <h3 className="text-lg font-normal ">
            Manage the follow policy for your social media account, block &
            unblock profiles, and view your followers.
          </h3>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            note: if you don&apos;t see any profiles below, we did not detect
            them in your connected wallet. Please connect a different address
            and try again.
          </p>
        </CardFooter>
      </Card>
      {profiles && profiles?.length > 0 ? <LensProfiles /> : null}
      {session?.authenticated ? (
        <div className="z-0 mx-auto flex max-w-2xl flex-col gap-4 ">
          <div className=" rounded-lg bg-white p-6 shadow-lg  dark:bg-gray-900 md:p-8">
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
                    {loadingSession
                      ? "...loading"
                      : (followPolicy as FollowPolicy)?.type}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="mb-2 text-lg font-semibold">
                  Change Follow Policy
                </h2>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                  >
                    <FormField
                      defaultValue={selectedPolicy}
                      control={form.control}
                      name="followPolicy"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Change Follow Policy</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(val: string) => {
                                setSelectedPolicy(val as FollowPolicyType);
                                field.onChange(val);
                              }}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value={FollowPolicyType.ANYONE}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Anyone can follow
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value={FollowPolicyType.NO_ONE}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No one can follow
                                </FormLabel>
                              </FormItem>
                              {/* <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value={FollowPolicyType.CHARGE}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Charge to follow
                              </FormLabel>
                            </FormItem> */}
                            </RadioGroup>
                          </FormControl>
                          {selectedPolicy === FollowPolicyType.CHARGE && (
                            <div className="space-y-4">
                              <div className="flex w-full flex-col gap-4">
                                <FormItem>
                                  <FormLabel
                                    htmlFor="recipient"
                                    className="mb-1 block text-sm font-medium"
                                  >
                                    Recipient
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      id="recipient"
                                      type="text"
                                      value={recipient}
                                      onChange={(e) =>
                                        setRecipient(e.target.value)
                                      }
                                      placeholder="Enter recipient's username"
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    The recipient will receive the payment
                                  </FormDescription>
                                </FormItem>
                                <FormItem>
                                  <FormLabel
                                    htmlFor="amount"
                                    className="mb-1 block text-sm font-medium"
                                  >
                                    Amount
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      id="amount"
                                      type="number"
                                      value={amount}
                                      onChange={(e) =>
                                        setAmount(e.target.value)
                                      }
                                      placeholder="Enter amount"
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    The amount to charge for follow
                                  </FormDescription>
                                </FormItem>
                              </div>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button size={"sm"} type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
              {error && (
                <div className="text-red-500">
                  <p>Error updating follow policy: {error.message}</p>
                </div>
              )}
            </div>
          </div>
          <FollowersList followers={followers} />
          {session?.authenticated ? <BlockedProfiles /> : null}
        </div>
      ) : null}
    </div>
  );
}

function FollowersList({ followers }: { followers: Profile[] | undefined }) {
  const { execute, loading, error } = useFollow();
  const { execute: executeBlock, loading: blockLoading } = useBlockProfiles();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleFollow = async (follower: Profile) => {
    await execute({ profile: follower });
  };

  const handleBlock = async (follower: Profile) => {
    setLoadingId(follower.id);
    await executeBlock({ profiles: [follower] });
    setLoadingId(null);
  };
  if (!followers) {
    return null;
  }
  return (
    <div className="space-y-4 rounded-lg p-6 py-10 shadow-md">
      <h2 className="mb-2 text-lg font-semibold">Followers</h2>
      <div className="space-y-4">
        {followers.map((follower) => {
          const imgSrc =
            follower.metadata?.picture?.__typename === "ImageSet"
              ? follower.metadata.picture?.optimized?.uri
              : follower.metadata?.picture?.image.optimized?.uri;

          const canFollow = follower.operations.canFollow === TriStateValue.Yes;
          return (
            <div key={follower.id} className="flex items-center space-x-4">
              <div className="relative flex w-full items-center space-x-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={imgSrc} />
                  <AvatarFallback>H1</AvatarFallback>
                </Avatar>
                <p>
                  {follower.handle?.suggestedFormatted.localName ??
                    follower?.handle?.localName ??
                    ""}
                </p>
              </div>
              {canFollow ? (
                <Button
                  size={"sm"}
                  variant={"outline"}
                  disabled={loading}
                  onClick={() => handleFollow(follower)}
                >
                  Follow
                </Button>
              ) : null}
              <Button
                onClick={async () => await handleBlock(follower)}
                size={"sm"}
                disabled={loadingId === follower.id}
                variant={"destructive"}
              >
                Block
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlockedProfiles() {
  const [loadingId, setLoadingId] = useState<ProfileId | null>(null);
  const { execute: executeUnblock } = useUnblockProfiles();

  const { data: blockedProfiles } = useBlockedProfiles();
  const handleUnblock = async (profile: Profile) => {
    setLoadingId(profile.id);
    await executeUnblock({ profiles: [profile] });
    setLoadingId(null);
  };
  if (!blockedProfiles) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-lg p-6 py-10 shadow-md">
      <h2 className="mb-2 text-lg font-semibold">Blocked Profiles</h2>
      <div className="space-y-4">
        {blockedProfiles.map((profile) => {
          const imgSrc =
            profile.metadata?.picture?.__typename === "ImageSet"
              ? profile.metadata.picture?.optimized?.uri
              : profile.metadata?.picture?.image.optimized?.uri;
          return (
            <div key={profile.id} className="flex items-center space-x-4">
              <div className="relative flex w-full items-center space-x-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={imgSrc} />
                  <AvatarFallback>H1</AvatarFallback>
                </Avatar>
                <p>
                  {profile.handle?.suggestedFormatted.localName ??
                    profile?.handle?.localName ??
                    ""}
                </p>
              </div>
              <Button
                onClick={async () => await handleUnblock(profile)}
                disabled={loadingId === profile.id}
                size={"sm"}
                variant={"outline"}
              >
                Unblock
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
