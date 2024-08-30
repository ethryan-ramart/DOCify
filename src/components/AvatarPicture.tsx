import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function AvatarPicture({ _AvatarFallback, _AvatarImage }: { _AvatarFallback: string, _AvatarImage: string }) {
  return (
    <Avatar>
      <AvatarImage src={_AvatarImage} alt="Profile Image" />
      <AvatarFallback>{_AvatarFallback}</AvatarFallback>
    </Avatar>
  )
}
