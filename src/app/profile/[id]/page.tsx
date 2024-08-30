import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getDocumentsByProfile } from "@/lib/data";
import DocumentsGrid from "@/components/explore/DocumentsGrid";
import { FollowButton } from "@/components/my-docs/buttons";

async function getProfileById(id: string) {
  const supabase = createClient()
  const { data, error, status } = await supabase
    .from('profiles')
    .select(`full_name, username, website, avatar_url`)
    .eq('id', id)
    .single()

  if (error) {
    console.log(error)
    throw error
  } else {
    return data
  }
}

async function getProfileAvatarFallback(profileName: string) {
  return profileName[0].toUpperCase() + profileName[1].toUpperCase()
}

async function downloadImage(path: string) {
  // console.log("Path:", path);
  if (!path) return null;
  const supabase = createClient();

  // Assuming 'avatars' is the bucket name and the files are set to public
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);

  if (!data) {
    console.log('Error getting public URL');
    return null; // Return null or a default image path in case of error
  }

  if (data.publicUrl !== "") return data.publicUrl; // This URL can be directly used in the <img> src
  return null;
}

export default async function ProtectedPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const id = params.id;
  const profile = await getProfileById(id);
  const documents = await getDocumentsByProfile(id);
  const avatarUrl = await downloadImage(profile.avatar_url);

  return (
    <div className="flex justify-center items-center">
      <Card className="m-10 w-full h-full">
        <CardHeader />
        <CardContent className='mt-6 flex flex-col justify-center items-center space-y-4'>
          {
            avatarUrl
              ?
              <div className="">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl} alt={`${profile.username}-profile-picture`} className="max-h-40 aspect-square outline-2 outline-foreground outline rounded-full" />
              </div>
              : (
                <Avatar className="w-48 h-48">
                  {/* <AvatarImage src={avatarUrl} /> */}
                  <AvatarFallback className="text-3xl">{getProfileAvatarFallback(profile.username)}</AvatarFallback>
                </Avatar>
              )
          }
          <CardTitle className="flex items-center">
            {profile.username}
            <FollowButton className="flex items-center ml-2" userId={user.id} followedId={id} />
          </CardTitle>
          {/* <CardDescription></CardDescription> */}
          <DocumentsGrid documents={documents} />
        </CardContent>
      </Card>
    </div>
  );
}