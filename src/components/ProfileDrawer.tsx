'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ReactNode } from 'react'
import { AvatarPicture } from "./AvatarPicture"
import { Separator } from "@radix-ui/react-separator"

export function ProfileDrawer({ _AuthButton, user }: { _AuthButton: ReactNode, user: any }) {
  // console.log(user)
  const svgColor = "#9ca3af";
  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className="flex cursor-pointer align-middle hover:ring-foreground ring-background md:ring-2 rounded-full p-[2px]">
          <AvatarPicture _AvatarImage={user.avatar_url} _AvatarFallback={user?.email?.substring(0, 2)} />
          <span className="ml-4 my-auto md:hidden">Profile</span>
        </span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your profile</SheetTitle>
          <div className="py-4 flex align-middle">
            <AvatarPicture _AvatarImage={user.avatar_url} _AvatarFallback={user?.email?.substring(0, 2)} />
            <span className="ml-4 my-auto">{user?.email}</span>
          </div>
          {/* <SheetDescription className="text-left">
            Customize your profile to your liking, and access all relevant information about your activity on the platform.
          </SheetDescription> */}
        </SheetHeader>

        <Separator className="w-full my-4" />

        {/* 
        <div className="mb-2 flex gap-2">
          <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#e5e7eb" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20 6V5C20 4.45 19.55 4 19 4H5C4.45 4 4 4.45 4 5V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19zM8 8h8M8 12h8M8 16h5"><animateMotion fill="freeze" calcMode="linear" dur="0.8s" path="M0 0l2-2" /></path><path stroke-dasharray="34" stroke-dashoffset="34" d="M2 6V21C2 21.55 2.45 22 3 22H18"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.8s" values="34;68" /></path></g></svg></span>
          <span className="text-gray-200 text-lg">Your statistics</span>
        </div>

        <InfoItem
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={svgColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z" /><path d="M19 16h-12a2 2 0 0 0 -2 2" /><path d="M9 8h6" /></svg>}
          label="Shared documents"
          value={7} />

        <InfoItem
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={svgColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.5 21h-6.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v6" /><path d="M3 10h18" /><path d="M10 3v18" /><path d="M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296z" /></svg>}
          label="Favorite documents"
          value={3} /> */}

        <Separator className="w-full my-4" />

        <div className="mb-2 flex gap-2">
          <span><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><defs><symbol id="lineMdCog0"><path fill="none" stroke-width="2" d="M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.6 7.4 16.8 7.61 16.99 7.83C17.46 8.4 17.85 9.05 18.11 9.77C18.2 10.03 18.28 10.31 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12"><animate fill="freeze" attributeName="d" begin="1.2s" dur="0.3s" values="M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.6 7.4 16.8 7.61 16.99 7.83C17.46 8.4 17.85 9.05 18.11 9.77C18.2 10.03 18.28 10.31 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12;M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.38 7.2 19 6.12 19.01 6.14C19.01 6.14 20.57 8.84 20.57 8.84C20.58 8.87 18.35 10.59 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12" /></path></symbol></defs><g fill="none" stroke="#e5e7eb" stroke-width="2"><g stroke-linecap="round" stroke-linejoin="round"><path stroke-dasharray="42" stroke-dashoffset="42" d="M12 5.5C15.59 5.5 18.5 8.41 18.5 12C18.5 15.59 15.59 18.5 12 18.5C8.41 18.5 5.5 15.59 5.5 12C5.5 8.41 8.41 5.5 12 5.5z" opacity="0"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.75s" values="42;0" /><set attributeName="opacity" begin="0.3s" to="1" /><set attributeName="opacity" begin="1.05s" to="0" /></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="20;0" /></path></g><g opacity="0"><use href="#lineMdCog0" /><use href="#lineMdCog0" transform="rotate(60 12 12)" /><use href="#lineMdCog0" transform="rotate(120 12 12)" /><use href="#lineMdCog0" transform="rotate(180 12 12)" /><use href="#lineMdCog0" transform="rotate(240 12 12)" /><use href="#lineMdCog0" transform="rotate(300 12 12)" /><set attributeName="opacity" begin="1.05s" to="1" /></g></g></svg></span>
          <span className="text-gray-200 text-lg">Configure</span>
        </div>

        <a href="/account" className="hover:scale-105 group"><InfoItem
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={svgColor}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="group-hover:stroke-gray-200">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            </svg>
          }
          label="Account"
          value=""
        /></a>

        <a href="/password-recovery" className="hover:scale-105 group">
          <InfoItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={svgColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:stroke-gray-200" // Cambia el color del borde en hover
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
              </svg>
            }
            label="Reset password"
            value=""
          /></a>

        <a href="/following" className="hover:scale-105 group"><InfoItem
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
          }
          label="Following/Followers"
          value=""
        /></a>

        {/*Magig book <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="#e5e7eb" d="M319.61 20.654c13.145 33.114 13.144 33.115-5.46 63.5c33.114-13.145 33.116-13.146 63.5 5.457c-13.145-33.114-13.146-33.113 5.457-63.498c-33.114 13.146-33.113 13.145-63.498-5.459zM113.024 38.021c-11.808 21.04-11.808 21.04-35.724 24.217c21.04 11.809 21.04 11.808 24.217 35.725c11.808-21.04 11.808-21.04 35.724-24.217c-21.04-11.808-21.04-11.808-24.217-35.725m76.55 56.184c-.952 50.588-.95 50.588-41.991 80.18c50.587.95 50.588.95 80.18 41.99c.95-50.588.95-50.588 41.99-80.18c-50.588-.95-50.588-.95-80.18-41.99zm191.177 55.885c-.046 24.127-.048 24.125-19.377 38.564c24.127.047 24.127.046 38.566 19.375c.047-24.126.046-24.125 19.375-38.564c-24.126-.047-24.125-.046-38.564-19.375m-184.086 83.88a96 96 0 0 0-3.492.134c-18.591 1.064-41.868 8.416-77.445 22.556L76.012 433.582c78.487-20.734 132.97-21.909 170.99-4.615V247.71c-18.076-8.813-31.79-13.399-46.707-13.737a91 91 0 0 0-3.629-.002zm122.686 11.42a209 209 0 0 0-8.514.098c-12.81.417-27.638 2.215-45.84 4.522v177.135c43.565-7.825 106.85-4.2 171.244 7.566l-39.78-177.197c-35.904-8.37-56.589-11.91-77.11-12.123zm2.289 16.95c18.889.204 36.852 2.768 53.707 5.02l4.437 16.523c-23.78-3.75-65.966-4.906-92.467-.98l-.636-17.805c11.959-2.154 23.625-2.88 34.959-2.758m-250.483 4.658L60.54 313.002h24.094l10.326-46.004H71.158zm345.881 0l39.742 177.031l2.239 9.973l22.591-.152l-40.855-186.852zm-78.857 57.82c16.993.026 33.67.791 49.146 2.223l3.524 17.174c-32.645-3.08-72.58-2.889-102.995 0l-.709-17.174c16.733-1.533 34.04-2.248 51.034-2.223m-281.793 6.18l-6.924 30.004h24.394l6.735-30.004H56.389zm274.418 27.244c4.656.021 9.487.085 14.716.203l2.555 17.498c-19.97-.471-47.115.56-59.728 1.05l-.7-17.985c16.803-.493 29.189-.828 43.157-.766m41.476.447c8.268.042 16.697.334 24.121.069l2.58 17.74c-8.653-.312-24.87-.83-32.064-.502l-2.807-17.234a257 257 0 0 1 8.17-.073m-326.97 20.309l-17.985 77.928l25.035-.17l17.455-77.758H45.313zm303.164 11.848c19.608-.01 38.66.774 56.449 2.572l2.996 20.787c-34.305-4.244-85.755-7.697-119.1-3.244l-.14-17.922c20.02-1.379 40.186-2.183 59.795-2.193m-166.606 44.05c-30.112.09-67.916 6.25-115.408 19.76l-7.22 2.053l187.759-1.27v-6.347c-16.236-9.206-37.42-14.278-65.13-14.196zm134.41 6.174c-19.63.067-37.112 1.439-51.283 4.182v10.064l177.594-1.203c-44.322-8.634-89.137-13.17-126.31-13.043zM26 475v18h460v-18z"/></svg> */}

        <SheetFooter>
          <SheetClose ></SheetClose>
          {_AuthButton}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactElement<SVGElement>, label: string, value: string | number }) {
  return (
    <div className="flex items-center space-x-2 mb-2 ml-4">
      {icon}
      <span className="font-medium text-gray-400 group-hover:text-gray-200 group-hover:underline">{label}</span>
      <span className="text-gray-400">{value}</span>
    </div>
  );
}