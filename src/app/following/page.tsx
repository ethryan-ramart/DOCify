import { getFollowers, getFollowing } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileCard from "@/components/ProfileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const following = await getFollowing(user.id);
  const followers = await getFollowers(user.id);

  return (
    <div className="flex flex-col items-center justify-center">
      <Tabs defaultValue="following" className="m-2 mt-4 w-[350px]">
        <TabsList className="w-full">
          <TabsTrigger className="w-1/2" value="following">Following</TabsTrigger>
          <TabsTrigger className="w-1/2" value="followers">Followers</TabsTrigger>
        </TabsList>
        <TabsContent value="following">
          {
            following.length > 0 ? (
              following.map((follow) => (
                <ProfileCard key={follow.id} profile={follow.profiles} user={user} />
              ))
            ) : (
              <div className="text-center">
                <h1 className="text-2xl font-bold">You are not following anyone yet.</h1>
              </div>
            )
          }
        </TabsContent>
        <TabsContent value="followers">
          {
            followers.length > 0 ? (
              followers.map((follow) => (
                <ProfileCard key={follow.id} profile={follow.profiles} user={user} />
              ))
            ) : (
              <div className="text-center">
                <h2 className="text-xl">You do not have any followers yet.</h2>
              </div>
            )
          }
        </TabsContent>
      </Tabs>
    </div>
  );
}
