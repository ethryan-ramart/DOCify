import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import FavButton from "./FavButton";
import { DownloadDocument, ViewExploreDocument } from "./my-docs/buttons";
import { Button } from "./ui/button";
import Link from "next/link";
import { UserIcon } from "lucide-react";

// TODO: centralize this types
interface Document {
  id: string,
  title: string,
  description: string,
  category: string,
  cover_url: string,
  file_url: string
}

export function DocumentCard(
  { doc, isFav, toggleFavorite, username, userId }:
    { doc: Document, isFav: boolean, toggleFavorite: (bookUuid: string) => void, username: string | undefined, userId: string | undefined }) {

  return (
    <Card key={doc.id}>
      <CardHeader className="relative">
        <FavButton className="absolute top-3 right-3 text-2xl" isFav={isFav} bookUuid={doc.id} toggleFavorite={toggleFavorite} />
        <CardTitle className="flex justify-between line-clamp-1">
          {doc.title}
        </CardTitle>
        {
          username && userId
            ? <CardDescription><Button variant="link" asChild><Link href={`profile/${userId}`}><UserIcon className="mr-1" />{username}</Link></Button></CardDescription>
            : null
        }
      </CardHeader>
      <CardContent >
        <div className="flex flex-col justify-center items-center space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={doc.cover_url} alt={`${doc.title}-cover`} className="h-72 aspect-[4/5]" />
          {/* <p className="line-clamp-1 min-h-4">{doc.description}</p> */}
        </div>
      </CardContent>
      <CardFooter >
        <div className="flex space-x-2 w-full">
          <ViewExploreDocument id={doc.id} className="w-full" />
          <DownloadDocument publicUrl={doc.file_url} className="w-full" />
        </div>
      </CardFooter>
    </Card >
  );
}
