import { uploadImagesToCloudinary } from '@/utils/utils';
import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { CloudUpload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CloudinaryImageResponse } from './Types/Types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

type ImageUploaderProps = {
    setImages: React.Dispatch<React.SetStateAction<CloudinaryImageResponse[]>>;
    addMore?: boolean;
    hasImageError?: boolean;
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setImages, addMore = false, hasImageError = false, setIsUploading }) => {
    const { mutateAsync: uploadImageMutation, isPending } = useMutation({
        mutationFn: uploadImagesToCloudinary,
        onError: (err: AxiosError) => {
            if (err) {
                toast.error("Failed to upload image, please try again", {
                    duration: Infinity,
                    action: {
                        label: <X />,
                        onClick: () => toast.dismiss(),
                    },
                    id: "uploadImage-fail-toast",
                });
            }
        },
        onSuccess: async () => {
            toast.success("Image upload successfully");
        }
    });
    const onDrop = useCallback(async (images: File[]) => {
        if (!images || images.length === 0) return;

        const results = await uploadImageMutation(images);
        setImages((prev) => [...prev, ...results]);
    }, [uploadImageMutation, setImages])

    useEffect(() => {
        setIsUploading(isPending);
    }, [isPending, setIsUploading]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
        },
        multiple: true,
        maxFiles: 10,
    })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    addMore ? <Button type="button" variant='outline' className='px-4 py-2 bg-black text-white rounded'>Add More</Button> :
                        <Button className={cn("container border-[1px] border-gray-300 !h-80 !w-80 shadow-md", hasImageError && "shadow-red-200")} type="button" variant="outline"><CloudUpload className='!w-12 !h-12' /></Button>
            }
        </div>
    )
}

export default ImageUploader;
