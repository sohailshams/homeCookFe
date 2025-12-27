import { uploadImagesToCloudinary } from '@/utils/utils';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { CloudUpload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CloudinaryImageResponse } from './Types/Types';

type ImageUploaderProps = {
    setImages: React.Dispatch<React.SetStateAction<CloudinaryImageResponse[]>>;
    addMore?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setImages, addMore = false }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (images: File[]) => {
        if (!images || images.length === 0) return;

        try {
            setError(null);
            setUploading(true);
            const results = await uploadImagesToCloudinary(images);
            setImages((prev) => [...prev, ...results]);
        } catch (error) {
            setError("One or more images failed to upload.");
        }

    }, [])

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
                        <Button className={cn("container border-[1px] border-gray-300 !h-80 !w-80 shadow-md", true && "shadow-red-200")} type="button" variant="outline"><CloudUpload className='!w-12 !h-12' /></Button>
            }
        </div>
    )
}

export default ImageUploader;