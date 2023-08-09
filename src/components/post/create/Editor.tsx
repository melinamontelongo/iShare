"use client"
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import TextareaAutosize from "react-textarea-autosize"
import { useCallback, useEffect, useRef, useState } from "react";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import "../../../styles/editor.css";

interface EditorProps {
    communityId: string,
}
export default function Editor({ communityId }: EditorProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PostCreationRequest>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            communityId,
            title: "",
            content: null,
        }
    });
    const editorRef = useRef<EditorJS>()
    const _titleRef = useRef<HTMLTextAreaElement>(null)
    //  Ref sharing with rhf
    const { ref: titleRef, ...registerRest } = register("title");

    const [isMounted, setIsMounted] = useState<boolean>(false);

    //  Defer the editor
    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default
        const Header = (await import("@editorjs/header")).default
        const Embed = (await import("@editorjs/embed")).default
        const Table = (await import("@editorjs/table")).default
        const Code = (await import("@editorjs/code")).default
        const List = (await import("@editorjs/list")).default
        const LinkTool = (await import("@editorjs/link")).default
        const InlineCode = (await import("@editorjs/inline-code")).default
        const ImageTool = (await import("@editorjs/image")).default
        //  If no editor initialized
        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: "editor",
                onReady() {
                    editorRef.current = editor;
                    console.log("editorjs ready")
                },
                placeholder: "Type here to write your post...",
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: "/api/link" //route that gets called when submitting a link
                        }
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    //  Handle upload
                                    const [res] = await uploadFiles({ endpoint: "imageUploader", files: [file] })
                                    //  Editorjs response
                                    return {
                                        success: 1,
                                        file: {
                                            url: res.fileUrl,
                                        }
                                    }
                                }
                            }
                        }
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                },
            })
        }
    }, [])

    useEffect(() => {
        setIsMounted(true)
    }, []);

    useEffect(() => {
        const initEditor = async () => {
            await initializeEditor();
            setTimeout(() => {
                // Focus the title (above fn takes focus out of it)
                _titleRef.current?.focus();
            }, 0)
        }

        if (isMounted) {
            initEditor();
            return () => {
                //  Uninitializing the editor
                editorRef.current?.destroy();
                editorRef.current = undefined;
            }
        }
    }, [isMounted, initializeEditor])

    useEffect(() => {
        if (Object.keys(errors).length) {
            for (const [_key, value] of Object.entries(errors)) {
                toast({
                    title: "Something went wrong",
                    description: (value as { message: string }).message,
                    variant: "destructive"
                });
            }
        }
    }, [errors])

    const { mutate: createPost } = useMutation({
        mutationFn: async ({ title, content, communityId }: PostCreationRequest) => {
            const payload: PostCreationRequest = {
                title,
                content,
                communityId
            }
            const { data } = await axios.post("/api/community/post/create", payload)
            return data;
        },
        onError: () => {
            return toast({
                title: "Something went wrong",
                description: "Your post was not published, please try again later",
                variant: "destructive"
            })
        },
        onSuccess: () => {
            const newPathname = pathname.split("/").slice(0, -1).join("/");
            router.push(newPathname);
            router.refresh();
            return toast({
                title: "Success!",
                description: "Your post has been published."
            })
        }
    })

    async function onSubmit(data: PostCreationRequest) {
        const blocks = await editorRef.current?.save();
        const payload: PostCreationRequest = {
            title: data.title,
            content: blocks,
            communityId,
        }
        createPost(payload)
    }

    if (!isMounted) {
        return null
    };

    return (
        <div className="sm:w-full w-screen p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 ">
            <form
                id="community-post-form"
                className="w-fit"
                onSubmit={handleSubmit(onSubmit)}>
                <div className="prose prose-zinc dark:prose-invert">
                    <TextareaAutosize
                        ref={(e) => {
                            titleRef(e)
                            //@ts-ignore
                            _titleRef.current = e
                        }}
                        {...registerRest}
                        placeholder="Title"
                        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none" />
                    { }
                    <div id="editor" className="min-h-[500px]" />
                </div>
            </form>
        </div>
    )
}