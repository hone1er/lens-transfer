import {
  SessionType,
  type Profile,
  type Session,
} from "@lens-protocol/react-web";
import Image from "next/image";
import LensProfileLoginButton from "./LensLogin";

export default function LensProfileCard({
  profile,
  session,
}: {
  readonly profile: Profile;
  readonly session: Session | undefined;
}): React.JSX.Element {
  const imgSrc =
    profile.metadata?.picture?.__typename === "ImageSet"
      ? profile.metadata.picture.optimized?.uri ?? ""
      : profile.metadata?.picture?.image.optimized?.uri ?? "";
  return (
    <div
      key={profile.id}
      className={`flex items-center justify-between rounded-lg bg-white p-4 shadow-md  dark:bg-gray-800 ${session?.type === SessionType.WithProfile && session?.profile?.id === profile.id ? "border border-indigo-500" : ""}`}
    >
      <div className="flex items-center">
        <div className="relative flex h-16 w-16 items-center">
          {imgSrc ? (
            <Image
              className="h-12 w-12 rounded-full"
              src={imgSrc}
              alt=""
              fill
            />
          ) : null}
        </div>{" "}
        <div className="ml-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {profile.handle?.fullHandle}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {profile.id}
          </p>
        </div>
      </div>
      <LensProfileLoginButton selectedProfileId={profile.id} />
    </div>
  );
}
