'use client'

import { useState, useEffect } from "react";
import { getUserFavDocsUuid } from "@/lib/data";
import { DocumentCard } from "../DocumentCard";

// TODO: centralize this types
interface Document {
  id: string,
  title: string,
  description: string,
  category: string,
  cover_url: string,
  file_url: string,
  user_id?: string,
  username?: string
}

export default function DocumentsGrid({ documents }: { documents: Document[] }) {
  const [favoriteDocs, setFavoriteDocs] = useState<string[]>([]);

  useEffect(() => {
    const fetchFavoriteDocs = async () => {
      const favorite_books = await getUserFavDocsUuid();
      setFavoriteDocs(favorite_books);
      // console.log("Favs", favoriteDocs);
    };
    fetchFavoriteDocs();
  }, []);

  if (!documents) {
    return <div>No documents found</div>
  }

  const toggleFavorite = (bookUuid: string) => {
    return setFavoriteDocs(prevFavs => {
      if (prevFavs) {
        return prevFavs.includes(bookUuid)
          ? prevFavs.filter(fav => fav !== bookUuid)
          : [...prevFavs, bookUuid]
      }
      return [];
    });
  };

  return (
    <div className="p-10">
      {/* <h1 className="text-2xl font-bold">Explore the collection of documents</h1> */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-8">
        {
          documents && documents.length > 0 ?
            documents.map((doc: Document) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                isFav={doc.id && favoriteDocs ? favoriteDocs.includes(doc.id) : false}
                toggleFavorite={toggleFavorite}
                username={doc.username || "username"}
                userId={doc.user_id}
              />
            ))
            : <div>No documents found</div>
        }
      </div>
    </div>
  );
}
