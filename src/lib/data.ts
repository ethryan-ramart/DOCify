'use server'
// TODO: move types to another file and just import them
// import { formatCurrency } from './utils';
import {upsertNewDocumenToPinecone} from '@/lib/addDocument';
import { unstable_noStore as noStore } from 'next/cache';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {z} from 'zod';

// TODO: centralize this types
type Document = {
  id?: string,
  title: string,
  description: string,
  category: string,
  cover: File,
  file: File,
  username?: string,
  user_id?: string
}

const fileSchema = z.instanceof(File, { message: 'Required' })
const imageSchema = fileSchema.refine((file) => file.size === 0 || file.type.startsWith('image/'), { message: 'File must be an image' }) // Check if there is file, if it is then check if it is an image, else it is not required

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters."
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters."
  }),
  category: z.string().min(3, {
    message: "Category mus be at least 3 characters."
  }),
  cover: z.instanceof(File).refine((file) => file.size < 5000000, {
    message: 'The image cover must be less than 5MB.',
  }).refine(file => file.size > 0,  {
    message: 'Cover is required'
  }),
  file: z.instanceof(File).refine((file) => file.size < 5000000, {
    message: 'The file must be less than 5MB.'
  }).refine(file => file.size > 0,  {
    message: 'File is required'
  }),
})

export type State = {
  errors?: { 
    title?: string[];
    description?: string[];
    category?: string[];
    cover?: string[];
    file?: string[];
  };
  message?: string | null;
};

export async function createDocument(prevState: State, formData: FormData) {
  noStore();

  const validatedFields = formSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Document.'
    }
  }

  const { cover, file, ...doc } = validatedFields.data;

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Database Error: Failed to Preload File." }
  }

  //* Upload the file
  // console.log('Uploading file')

  //* Create random file name
  const rndmFileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
  const { error: fileError } = await supabase
    .storage
    .from("documents")
    .upload(`${user.id}/${rndmFileName}`, file, {
      cacheControl: "3600",
      upsert: true,
    })

  if (fileError) {
    // console.log(fileError)
    return { message: `Database Error: Failed to Upload File. ${fileError.message}` }
  }

  //* Get file URL
  const {data: fileData} = supabase
                      .storage
                      .from('documents')
                      .getPublicUrl(`${user.id}/${rndmFileName}`)


  //* Upload the cover
  // console.log('Uploading cover')
  const rndmCoverName = `${crypto.randomUUID()}.${cover.name.split('.').pop()}`;
  const { error: coverError } = await supabase
    .storage
    .from("covers")
    .upload(`${user.id}/${rndmCoverName}`, cover, {
      cacheControl: "3600",
      upsert: true,
    })
  if (coverError) {
    return { message: `Database Error: Failed to Upload Cover. ${coverError.message}` }
  }

  //* Get cover URL
  const {data: coverData} = supabase
                      .storage
                      .from('covers')
                      .getPublicUrl(`${user.id}/${rndmCoverName}`)
  
  //* Save document metadata
  const metadata = {
    title: doc.title,
    description: doc.description,
    category: doc.category,
    user_id: user.id,
    cover_url: coverData.publicUrl,
    file_url: fileData.publicUrl,
    pinecone_id: rndmFileName.split('.').shift() // Remove the file extension
  }

  // console.log('Inserting Metadata')
  const { error: metaError } = await supabase.from("documents").insert([metadata])
  if (metaError) {
    return { message: `Database Error: Failed to Insert Metadata. ${metaError.message}` }
  }

  //* Upsert the document to pinecone
  // Convert the file to a buffer
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);
  // console.log("file buffer", fileBuffer)

  // Upsert the document to Pinecone
  const documentId = rndmFileName.split('.')[0]; // Remove the file extension
  const documentUrl = fileData.publicUrl;
  // const fileType = file.name.split('.').pop() || 'application/pdf';
  const fileType = 'application/pdf';
  const namespace = documentId; // replace with your actual namespace
  await upsertNewDocumenToPinecone(documentId, fileBuffer, documentUrl, fileType, namespace);

  revalidatePath('/my-docs');
  revalidatePath('/explore');
  redirect('/my-docs');
}

export async function addFavoriteDocument(bookUuid: string) {
  noStore();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const { data, error } = await supabase.rpc('add_favorite_book', { user_id: user?.id, book_uuid: bookUuid});

    if (data) return data;

    return [];
    // if (error) {
    //   return { message: "Database Error: Failed to Fetch Documents." }
    // }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Documents.');
  }

}

export async function removeFavoriteDocument(bookUuid: string) {
  noStore();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const { data, error } = await supabase.rpc('remove_favorite_book', { user_id  : user?.id ,book_uuid: bookUuid});
    
    revalidatePath('/explore');
    revalidatePath('/my-favs');
    
    if (data) return data;

    return [];
    // if (error) {
    //   return { message: "Database Error: Failed to Fetch Documents." }
    // }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Documents.');
  }

}

export async function getDocuments():Promise<DocumentType[]> {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  const supabase = createClient();
  try {
    // const { data, error } = await supabase.from('documents').select('*').eq('is_active', true);
    const { data, error } = await supabase
    .from('active_documents_with_usernames')
    .select('*');

    // console.log(data);
    
    if (data) return data;

    return [];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Documents.');
  }
}

const EXPLORE_ITEMS_PER_PAGE = 4;
export async function getFilteredDocuments(query: string, currentPage: number): Promise<DocumentType[]> {
  noStore();
  const offset = (currentPage - 1) * EXPLORE_ITEMS_PER_PAGE;
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  try {
    if (query === ''){
      // const { data, error } = await supabase.from('documents').select().eq('is_active', true).eq('user_id', user?.id).range(offset, offset + ITEMS_PER_PAGE - 1);
      const { data, error } = await supabase.from('active_documents_with_usernames').select().eq('is_active', true).range(offset, offset + EXPLORE_ITEMS_PER_PAGE - 1);
      if (error) {
        return []
      }
      return data;
    } else {
      // There is no text search in multiple columns in supabase yet, we use the DB function "docs_search"
      const { data, error } = await supabase.from('active_documents_with_usernames').select().textSearch('title', `'${query}'`).range(offset, offset + EXPLORE_ITEMS_PER_PAGE - 1);
      if (error) {
        return []
      }
      return data;
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Documents.');
  }
}

export async function fetchDocumentsPages(query: string) {
  noStore();
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let count = 1;
  try {
    if (query === ''){
      const { count: noQueryCount, error } = await supabase.from('documents').select('*', { count: 'estimated' }).eq('is_active', true);
      if (error) {
        return 1
      }
      count = Number(noQueryCount);
    } else {
      // TODO: There is no text search in multiple columns in supabase yet
      // Search by title only
      const { count: queryCount, error } = await supabase.from('documents').select('*', { count: 'estimated' }).eq('is_active', true).textSearch('docs_search', `'${query}'`);
      if (error) {
        return 1
      }
      count = Number(queryCount);
    }

    const totalPages = Math.ceil(Number(count) / EXPLORE_ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of documents.');
  }
}

export async function getUserDocuments():Promise<DocumentType[]> {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const { data, error } = await supabase.from('documents').select('*').eq('is_active', true).eq('user_id', user?.id);
    const username = await getUsername(user?.id);
    
    if (data) {
      const usernameData = data.map((doc) => {
        doc.username = username;
        return doc;
      })
      return data;
    }

    return [];
    // if (error) {
    //   return { message: "Database Error: Failed to Fetch Documents." }
    // }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Documents.');
  }
}

// TODO: centralize this types
type DocumentType = {
  id: string,
  title: string,
  description: string,
  category: string,
  cover_url: string,
  file_url: string,
  message?: string | undefined
  user_id?: string,
  pinecone_id?: string
  username?: string
}

export async function getUserProfile():Promise<userProfile[]> {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user?.id);
    
    if (data) return data;

    return [];
    // if (error) {
    //   return { message: "Database Error: Failed to Fetch Documents." }
    // }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Documents.');
  }
}
type userProfile ={
  id: string,
  username: string,
  full_name: string,
  avatar_url: string,
  favorite_books: object
}

export async function getUserFavDocsUuid():Promise<string[]> {
  noStore();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const { data, error } = await supabase.from('profiles').select('favorite_books').eq('id', user?.id);
    
    revalidatePath('/explore');
    revalidatePath('/my-favs');
    if (data) return data[0].favorite_books;

    return [];
  } catch (error) {
    // console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Documents.');
  }
}

export async function getUserFavDocuments():Promise<DocumentType[]> {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    // TODO: Get the favorite documents with their corresponding username
    // const { data, error } = await supabase.from('documents').select('*').eq('is_active', true).eq('user_id', user?.id);
    const { data, error } = await supabase.rpc('get_favorite_documents_by_user_id', { user_id: user?.id });
    // const { data, error } = await supabase
    // .from('favorite_books_with_usernames')
    // .select('*')
    // .eq('profile_user_id', user?.id );

    // Match document user id with usernames
    const {data: usernameData, error: usernameError} = await supabase.from('profiles').select('id, username');

    if (usernameData && !error) {
      data.map((document: Document) => {
        const username = usernameData.find(profile => profile.id === document.user_id);
        if (username) document.username = username.username;
      })
    }

    if (data) return data;

    return [];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Documents.');
  }
}

export async function getDocumentById(id:string): Promise<DocumentType> {
  noStore();
  const supabase = createClient();

  const { data, error } = await supabase.from('documents').select('*').eq('id', id).single();
  
  if (error) {
    throw new Error('Failed to fetch document.');
    // return { message: "Database Error: Failed to Fetch Document." }
  }
  const username = await getUsername(data.user_id);
  data.username = username;
  return data;
}

export async function getImageUrl(cover_url: string) {
  noStore();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return { message: "Database Error: Failed to Preload File." }
  }

  const {data} = supabase
                      .storage
                      .from('covers')
                      .getPublicUrl(`${user.id}/${cover_url}`)
  
  if (!data) {
    return { message: "Database Error: Failed to Get Image URL." }
  }

  // console.log(data)

  return data;
}

export async function softDeleteDocument(id: string) {
  noStore();
  const supabase = createClient();
  const { error } = await supabase.from('documents').update({ is_active: false }).eq('id', id);
  if (error) {
    return { message: "Database Error: Failed to Delete Document." }
  }

  revalidatePath('/explore');
  revalidatePath('/my-docs');
  redirect('/my-docs');
}

// This is the new schema for update operation
const updateFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters."
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters."
  }),
  category: z.string().min(3, {
    message: "Category mus be at least 3 characters."
  }),
  cover: z.instanceof(File).refine((file) => file.size < 5000000, {
    message: 'The image cover must be less than 5MB.',
  }).optional(),
  file: z.instanceof(File).refine((file) => file.size < 5000000, {
    message: 'The file must be less than 5MB.'
  }).optional(),
})

export async function updateDocument(id: string | undefined, prevState: State, formData: FormData) {
  noStore();
  const validatedFields = updateFormSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    cover: formData.get('cover'),
    file: formData.get('file')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.'
    }
  }

  const { cover, file, ...doc} = validatedFields.data;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Database Error: Failed to Preload File." }
  }

  // Upload the file
  // TODO: More optimal way to update the document?

  // Backup old file url
  const {data: fileData, error: fileError } = await supabase.from('documents').select('file_url').eq('id', id).single();
  if (fileError) {
    return { message: `Database Error: Failed to Fetch Cover URL. ${fileError.message}` }
  }

  const fileUrl = fileData.file_url;

  // Backup old cover url
  const {data: coverData, error: coverError} = await supabase.from('documents').select('cover_url').eq('id', id).single();

  if (coverError) {
    return { message: `Database Error: Failed to Fetch Cover URL. ${coverError.message}` }
  }

  const coverUrl = coverData.cover_url;

  // Update Metadata
  const metadata = {
    title: doc.title,
    description: doc.description,
    category: doc.category,
    user_id: user.id,
    cover_url: coverUrl.cover_url,
    file_url: fileUrl.file_url
  }
  
  // If there is a new file, delete the old one and upload the new one
  if (file && file?.size > 0) {
    // Remove old file
    // console.log('Deleting old file')
    const { error: deleteError } = await supabase.storage.from('documents').remove([fileUrl.file_url])

    if (deleteError) {
      return { message: `Database Error: Failed to Delete Old Cover. ${deleteError.message}` }
    }

    // Upload new file
    // console.log('Uploading new file')

    const rndmFileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
    const { error: fileError } = await supabase
      .storage
      .from("documents")
      .upload(`${user.id}/${rndmFileName}`, file, {
        cacheControl: "3600",
        upsert: true,
      })

    if (fileError) {
      return { message: `Database Error: Failed to Upload File. ${fileError.message}` }
    }

    // Get file URL
    const {data: fileData} = supabase
                        .storage
                        .from('documents')
                        .getPublicUrl(`${user.id}/${rndmFileName}`)
    metadata.file_url = fileData.publicUrl;
  }

  // If there is a new cover, delete the old one and upload the new one
  if (cover && cover?.size > 0) {
    // Remove old cover
    // console.log('Deleting old cover')
    const { error: deleteError } = await supabase.storage.from('covers').remove([coverUrl.cover_url])

    if (deleteError) {
      return { message: `Database Error: Failed to Delete Old Cover. ${deleteError.message}` }
    }

    // Upload new cover
    // console.log('Uploading new cover')

    const rndmCoverName = `${crypto.randomUUID()}.${cover.name.split('.').pop()}`;
    const { error: coverError } = await supabase
      .storage
      .from("covers")
      .upload(`${user.id}/${rndmCoverName}`, cover, {
        cacheControl: "3600",
        upsert: true,
      })
    if (coverError) {
      return { message: `Database Error: Failed to Upload Cover. ${coverError.message}` }
    }

    // Get cover URL
    const {data: coverData} = supabase
                        .storage
                        .from('covers')
                        .getPublicUrl(`${user.id}/${rndmCoverName}`)
    metadata.cover_url = coverData.publicUrl;
  }
  
  // Update Metadata
  const { error: metaError } = await supabase.from('documents').update(metadata).eq('id', id);

  if(metaError) {
    return { message: `Database Error: Failed to Update Metadata. ${metaError.message}` }
  }

  revalidatePath('/explore');
  revalidatePath('/my-docs');
  redirect('/my-docs');
}

export async function getUsername(id: string | undefined) {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').select('username').eq('id', id).single();
  if (error) {
    return `Database Error: Failed to Fetch User Email. ${error.message}`
  }
  return data.username;
}

export async function getUserEmail(id: string | undefined) {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase.from('user').select('username').eq('user_id', id).single();
  if (error) {
    return `Database Error: Failed to Fetch User Email. ${error.message}`
  }
  return data.username;
}

const ITEMS_PER_PAGE = 5;
export async function getFilteredUserDocuments(query: string, currentPage: number): Promise<DocumentType[]> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    if (query === ''){
      const { data, error } = await supabase.from('documents').select().eq('is_active', true).eq('user_id', user?.id).range(offset, offset + ITEMS_PER_PAGE - 1);
      if (error) {
        return []
      }
      return data;
    } else {
      // Search by title only
      const { data, error } = await supabase.from('documents').select().textSearch('title', `'${query}'`).eq('is_active', true).eq('user_id', user?.id);
      if (error) {
        return []
      }

      const filteredData = data.filter((doc) => doc.user_id === user?.id)
      return filteredData;
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Documents.');
  }
}

export async function fetchMyDocumentsPages(query: string) {
  noStore();
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let count = 1;
  try {
    if (query === ''){
      const { count: noQueryCount, error } = await supabase.from('documents').select('*', { count: 'estimated' }).eq('is_active', true).eq('user_id', user?.id);
      if (error) {
        return 1
      }
      count = Number(noQueryCount);
    } else {
      // TODO: There is no text search in multiple columns in supabase yet
      // Search by title only
      const { count: queryCount, error } = await supabase.from('documents').select('*', { count: 'estimated' }).eq('is_active', true).eq('user_id', user?.id).textSearch('my_docs_search', `'${query}'`);
      if (error) {
        return 1
      }
      count = Number(queryCount);
    }

    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of documents.');
  }
}

export async function getDocumentsByProfile(id: string): Promise<DocumentType[]> {
  noStore();
  const supabase = createClient();

  try {
    // 1. Get the user id by the profile/user id
    // const { data, error } = await supabase.from('documents').select().eq('is_active', true).eq('user_id', id);
    const { data, error } = await supabase
    .from('active_documents_with_usernames')
    .select('*').eq('is_active', true).eq('user_id', id);;
    if (error) {
      return []
    }
    const username = await getUsername(id);
    data[username] = username;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Documents.');
  }
}

//* Follow functionality
type FollowingProfile = {
  id: string,
  follower_id: string,
  followed_id: string,
  profiles: {
    id: string,
    username: string,
    avatar_url: string
  }[]
}
export async function getFollowing(currentUserId: string): Promise<FollowingProfile[]> {
  noStore();
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        id,
        follower_id,
        followed_id,
        profiles!follows_followed_id_fkey ( id, username, avatar_url )
      `)
      .eq('follower_id', currentUserId);

    if (error) {
      console.error('Error fetching following profiles:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Following Users.');
  }
}

export async function getFollowers(currentUserId: string): Promise<FollowingProfile[]> {
  noStore();
  const supabase = createClient();

  try {
    // const { data, error } = await supabase.from('follows').select('*').eq('followed_id', currentUserId);
    const { data, error } = await supabase
      .from('follows')
      .select(`
        id,
        follower_id,
        followed_id,
        profiles!follows_follower_id_fkey ( id, username, avatar_url )
      `)
      .eq('followed_id', currentUserId);
    if (error) {
      return []
    }
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Fetch Followers.');
  }
}

export async function follow(currentUserId: string, followedId: string) {
  noStore();
  const supabase = createClient();
  
  console.log("Following users")

  try {
    const { data, error } = await supabase.from('follows').insert([{ follower_id: currentUserId, followed_id: followedId }]);
    if (error) {
      return { message: "Database Error: Failed to Follow User." }
    }
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Follow User.');
  }
  
}

// Check if the current user follows the followed user
export async function checkFollow(currentUserId: string, followedId: string) {
  noStore();
  const supabase = createClient();

  try {
    const { data, error } = await supabase.from('follows').select().eq('follower_id', currentUserId).eq('followed_id', followedId);
    if (error) {
      console.log({ message: "Database Error: Failed to check if user is following." });
      return false;
    }

    if (data && data.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Database Error:', error);
    return false;
    // throw new Error('Database Error: Failed to check if user is following.');
  }
}

export async function unfollow(currentUserId: string, followedId: string) {
  noStore();
  const supabase = createClient();

  try {
    const response = await supabase.from('follows').delete().eq('follower_id', currentUserId).eq('followed_id', followedId);
    
    if (response.status === 204) {
      console.log("Unfollowing user")
      return true;
    }
    if (response.status !== 204) {
      console.log("Unfollowing user")
      return false
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to check if user is unfollow.');
  }
}
