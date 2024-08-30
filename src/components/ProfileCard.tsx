import {
  Card,
  CardTitle,
} from "@/components/ui/card"
import { FollowButton } from "./my-docs/buttons";

export default function ProfileCard({ profile, user }: { profile: any, user: any }) {
  return (
    <Card className="m-2 p-4">
      <div className="flex items-center justify-between max-w-full">
        <CardTitle className="line-clamp-1 max-w-3/4 text-xl font-light">{profile.username}</CardTitle>
        <FollowButton className="flex items-center ml-2" userId={user.id} followedId={profile.id} />
      </div>
    </Card>
  );
}