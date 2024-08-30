import { Button } from "@/components/ui/button"

export default function Home() {
  
  return (
    <div className="flex w-full h-[90vh] flex-col gap-20 items-center">
      <div className="m-auto p-8">
        <h1 className="text-4xl m-auto max-w-xl">This is <strong>DOC<span className="bg-cyan-400 p-1 rounded" style={{color:'#020817'}}>ify</span></strong> where your documents comes alive!.</h1>
      </div>
    </div>
  );
}
