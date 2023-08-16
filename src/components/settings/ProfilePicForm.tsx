"use client"
import { ChangeEvent, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { uploadFiles } from "@/lib/uploadthing";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import Image from "next/image";
import { BiSolidUser } from "react-icons/bi";

interface ProfilePicFormProps {
    currentPic: string | null | undefined,
}
const ProfilePicForm = ({ currentPic }: ProfilePicFormProps) => {
    const [file, setFile] = useState<FileList>();
    const [currentPreviewPic, setCurrentPreviewPic] = useState<string>(currentPic ?? "")

    const router = useRouter();

    const { mutate: submitPic, isLoading } = useMutation({
        mutationFn: async () => {
            if (file) {
                const [res] = await uploadFiles({ endpoint: "imageUploader", files: [file[0]] });
                const payload = {
                    imageUrl: res.fileUrl,
                };
                const { data } = await axios.put(`/api/profile/picture`, payload);
                return data;
            }
        },
        onError: (err) => {
            return toast({
                title: "There was an error",
                description: "Could not submit your profile picture.",
                variant: "destructive"
            })
        },
        onSuccess: () => {
            toast({
                description: "Your profile picture has been submitted."
            })
            router.refresh();
        }
    });

    const displayPic = (files: FileList) => {
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            if (typeof reader.result === "string") setCurrentPreviewPic(reader.result)
        }
        reader.onerror = () => {
            toast({
                title: "Could not display profile picture's preview",
                variant: "destructive"
            })
        }
    };

    return (
        <Card className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <CardTitle>Your profile picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row gap-2">
                <Avatar>
                    <div className='relative aspect-square h-full w-full'>
                        {(currentPreviewPic) ?
                            <Image src={currentPreviewPic} fill alt="User profile pic" className="object-cover" />
                            :
                            <AvatarFallback>
                                <BiSolidUser className="" />
                            </AvatarFallback>
                        }
                    </div>
                </Avatar>
                <Input type="file" className="bg-transparent border border-zinc-200 dark:border-zinc-800 cursor-pointer" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    e.target.files && displayPic(e.target.files)
                    setFile(e.target.files ?? undefined)
                }} />
            </CardContent>
            <CardFooter>
                <Button isLoading={isLoading} className="hover:dark:bg-zinc-200 hover:bg-zinc-800" onClick={() => submitPic()}>Submit profile picture</Button>
            </CardFooter>
        </Card>
    )
}

export default ProfilePicForm;