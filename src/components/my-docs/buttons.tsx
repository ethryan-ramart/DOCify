'use client'

// import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { PlusIcon, PencilIcon, Trash, DownloadIcon, EyeIcon } from 'lucide-react';
import { checkFollow, follow, softDeleteDocument, unfollow } from '@/lib/data';
import { cn } from '@/lib/utils'
import { IconUserMinus, IconUserPlus } from '@tabler/icons-react';
// import { deleteInvoice } from '@/app/lib/actions';

export function AddDocument() {
  return (
    <Button asChild>
      <Link href="/my-docs/create">
        <span className="hidden md:block">New Document</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </Link>
    </Button>
  );
}

export function UpdateDocument({ id, ...props }: { id: string | undefined, className?: string }) {
  return (
    <Button variant='outline' size='icon' className={props.className} asChild>
      <Link href={`/my-docs/${id}/edit`}>
        <PencilIcon className="w-5" />
      </Link>
    </Button>
  );
}

export function DeleteDocument({ id, ...props }: { id: string | undefined, className?: string }) {
  if (!id) return null;

  const deleteDocumentWithId = softDeleteDocument.bind(null, id);

  return (
    <form action={deleteDocumentWithId}>
      <Button variant='destructive' size='icon' className={props.className}>
        <span className="sr-only">Delete</span>
        <Trash className="w-5" />
      </Button>
    </form>
  );
}

// function downloadDocument(publicUrl: string) {
//   const link = document.createElement('a');
//   link.href = publicUrl;
//   link.setAttribute('download', 'document.pdf'); // Set a filename for the download
//   document.body.appendChild(link); // Append the link to the body
//   link.click();
//   document.body.removeChild(link); // Remove the link after clicking
// }

export function DownloadDocument({ publicUrl, ...props }: { publicUrl: string, className?: string }) {
  return (
    <Button variant='outline' size='icon' className={props.className} asChild>
      <Link href={publicUrl} target='_blank' className={props.className}>
        <>
          <span className="sr-only">Download</span>
          <DownloadIcon className="w-5" />
        </>
      </Link>
    </Button>
  );
}

export function ViewDocument({ id, ...props }: { id: string | undefined, className?: string }) {
  return (
    <Button variant='outline' size='icon' className={props.className} asChild>
      <Link href={`/my-docs/${id}/view`}>
        <span className="sr-only">View</span>
        <EyeIcon className="w-5" />
      </Link>
    </Button>
  );
}

export function ViewExploreDocument({ id, ...props }: { id: string | undefined, className?: string }) {
  return (
    <Button variant='outline' size='icon' className={props.className} asChild>
      <Link href={`/explore/${id}/view`}>
        <span className="sr-only">View</span>
        <EyeIcon className="w-5" />
      </Link>
    </Button>
  );
}

export function FollowButton({ userId, followedId, ...props }: { className?: string, userId: string, followedId: string }) {
  const [followState, setFollowState] = useState<boolean>(false);

  useEffect(() => {
    checkFollow(userId, followedId).then((following) => setFollowState(following));
  });

  async function toggleFollow(userId: string, followedId: string) {
    const following = await checkFollow(userId, followedId);
    if (following) {
      await unfollow(userId, followedId);
      setFollowState(false);
    } else {
      await follow(userId, followedId);
      setFollowState(true);
    }
  }

  return (
    <Button variant='outline' size='icon' className={cn(props.className, 'flex items-center')} onClick={() => toggleFollow(userId, followedId)}>
      {followState ? <IconUserMinus /> : <IconUserPlus />}
    </Button>
  );
}
