import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { startOfDay, isAfter, set } from 'date-fns';
import { Form, FormField, FormItem, FormMessage } from "./ui/form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ChevronDownIcon, CloudUpload, SquareChevronDown, X } from "lucide-react"
import { Tag, TagInput } from 'emblor';
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { Cloudinary } from "@cloudinary/url-gen";
import ImageUploader from './ImageUploader';
import { CardContent } from './ui/card';
import { CloudinaryImageResponse, FoodImages } from './Types/Types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { useMutation, useQuery } from "@tanstack/react-query";
import { addFood, deleteCloudinaryImage } from '@/api/api';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import Spinner from './Spinner';
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from '@/contexts/CategoryContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';



const AddFood: React.FC = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string | undefined>(undefined);
    const [images, setImages] = useState<CloudinaryImageResponse[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const { user } = useAuth();
    const { categoriesList } = useCategories();


    const schema = yup.object({
        category: yup.string().required("Category is required.")
            .min(2, "Name must be at least 2 characters."),
        name: yup.string().required("Name is required.")
            .min(2, "Name must be at least 2 characters."),

        description: yup.string().required("Description is required.")
            .min(20, "Description must be at least 20 characters."),

        ingredients: yup.array(yup.string().required())
            .min(1, "At least one ingredient is required.").required(),

        price: yup.number().transform((value, originalValue) =>
            originalValue === "" ? undefined : value)
            .required("Price is required.")
            .positive("Price must be a positive number."),
        quantityAvailable: yup.number().transform((value, originalValue) =>
            originalValue === "" ? undefined : value).required("Quantity is required.")
            .integer().positive("Quantity must be a positive number."),

        availableDate: yup.string().required("Date/time is required.")
            .test('valid-datetime', 'Please select a valid future date and time.', function (value) {
                if (!value) return false;
                const selectedDate = new Date(value);
                const todaysDate = new Date();
                return isAfter(startOfDay(selectedDate), startOfDay(todaysDate));
            }),
        foodImages: yup.array(yup.object({
            imageUrl: yup.string().required(),
            publicId: yup.string().required(),
        })).min(1, "At least one food image is required.").required()
    });


    type formFields = yup.InferType<typeof schema>;
    type AddFoodData = formFields & { sellerId: string; categoryId: string };

    const resolver = yupResolver(schema);
    const form = useForm<formFields>({
        defaultValues: {
            name: '',
            description: '',
            ingredients: Array<string>(),
            price: undefined,
            quantityAvailable: undefined,
            availableDate: undefined,
            foodImages: Array<FoodImages>(),
        },
        resolver,
        mode: "onChange",
        // reValidateMode: "onChange",
    });

    const {
        watch,
        setValue,
        trigger,
        formState: { errors, isValid },
    } = form;

    useEffect(() => {
        if (images.length === 0) return;

        setValue(
            "foodImages",
            images.map(img => {
                return {
                    imageUrl: img.secure_url,
                    publicId: img.public_id
                };
            }),
            {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            }
        );

    }, [images, setValue]);

    const { mutateAsync: addFoodMutation, isPending: foodIsPending } = useMutation({
        mutationFn: addFood,
        onError: (err: AxiosError) => {
            if (err) {
                toast.error("Failed to add food, please try again", {
                    duration: Infinity,
                    action: {
                        label: <X />,
                        onClick: () => toast.dismiss(),
                    },
                    id: "addFood-fail-toast",
                });
            }
        },
        onSuccess: async () => {
            toast.success("Food added successfully");
        }
    });

    const onSubmit = (data: AddFoodData) => {
        if (isValid) {
            if (!user) {
                toast.error("Please sign in and try again");
                return;
            }
            data.sellerId = user.id
            data.categoryId = "08eb21eb-9a30-4145-8936-35debd67b102";
            data.postCode = "M16 0JF";
            addFoodMutation(data);
            console.log("Form submitted:", data);
        }
    };

    //   if (isLoading) return <Spinner />;

    const updateAvailableOn = (selectedDate?: Date, selectedTime?: string | undefined) => {
        if (!selectedDate || !selectedTime) {
            return undefined;
        }

        const combined = set(selectedDate, {
            hours: Number(selectedTime.split(":")[0]),
            minutes: Number(selectedTime.split(":")[1]),
            seconds: Number(selectedTime.split(":")[2]),
        });

        return combined.toISOString();
    };

    const { mutate: deleteFoodListingImageeMutation, isPending } = useMutation({
        mutationFn: deleteCloudinaryImage,
        onError: (err: AxiosError) => {
            if (err) {
                toast.error("Failed to delete image, please try again", {
                    duration: Infinity,
                    action: {
                        label: <X />,
                        onClick: () => toast.dismiss(),
                    },
                    id: "deleteImage-fail-toast",
                });
            }
        },
        onSuccess: async (_data, publicId) => {
            toast.success("Image deleted successfully");
            setImages((preImages) => {
                return preImages.filter(image => image.public_id !== publicId)
            })
        }
    });

    const inputErrorCss = (isError: boolean) => cn("shadow-md py-6 outline-none ring-0 border-[1px] border-gray-300 rounded-full focus-visible:ring-0 focus-visible:outline-none", isError && "shadow-red-200");
    const hasImageError = !!errors.foodImages;

    // if (isPending) return <Spinner />;

    return (
        <div className="my-6 max-w-[60%] mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FieldSet>
                        <FieldLegend>List Food</FieldLegend>
                        <FieldDescription>Please add the food you want to sell.</FieldDescription>
                        <FieldGroup>
                            <div className="flex gap-4">
                                <div className='grow'>
                                    {/* Category List */}
                                    <FormItem className="w-[200px]">
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <Field>
                                                    <FieldLabel htmlFor="categories">Categories *</FieldLabel>
                                                    <div className={cn("space-x-2 border-[1px] border-gray-300 p-2  rounded-full shadow-md", !!errors.category && "shadow-red-200")}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger className="focus:outline-none flex items-center justify-between w-full">
                                                                <span className="pl-2">{field.value ?? "Select an option"}</span>
                                                                <SquareChevronDown className="mr-4" />
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="mt-2">
                                                                <DropdownMenuSeparator />
                                                                {categoriesList?.map(category => (
                                                                    <DropdownMenuItem
                                                                        onClick={() => field.onChange(category.name)}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        {category.name}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <FieldError>
                                                        <FormMessage />
                                                    </FieldError>
                                                </Field>
                                            )}
                                        />
                                    </FormItem>
                                    {/* NAME */}
                                    <FormItem>
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <Field>
                                                    <FieldLabel htmlFor="name">Food Name *</FieldLabel>
                                                    <Input id="name" placeholder="Food Name" {...field} className={inputErrorCss(!!errors.name)} />
                                                    <FieldError>
                                                        <FormMessage />
                                                    </FieldError>
                                                </Field>
                                            )}
                                        />
                                    </FormItem>
                                    {/* DESCRIPTION */}
                                    <FormItem>
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <Field>
                                                    <FieldLabel htmlFor="description">Food Description *</FieldLabel>
                                                    <Input id="description" placeholder="Description" {...field} className={inputErrorCss(!!errors.description)} />
                                                    <FieldError>
                                                        <FormMessage />
                                                    </FieldError>
                                                </Field>
                                            )}
                                        />
                                    </FormItem>
                                    {/* Ingredients */}
                                    <FormItem>
                                        <FormField
                                            control={form.control}
                                            name="ingredients"
                                            render={({ field }) => (
                                                <Field>
                                                    <FieldLabel htmlFor="ingredients">Ingredients *</FieldLabel>
                                                    <TagInput
                                                        id="ingredients"
                                                        placeholder="Enter ingredients"
                                                        tags={tags}
                                                        setTags={(newTags) => {
                                                            const tagsArr = newTags as Tag[];
                                                            setTags(tagsArr);
                                                            setValue("ingredients", tagsArr.map(t => t.text));
                                                            field.onChange(tagsArr.map(t => t.text));
                                                        }}
                                                        activeTagIndex={activeTagIndex}
                                                        setActiveTagIndex={setActiveTagIndex}
                                                        styleClasses={{
                                                            input: "rounded-full py-4",
                                                            inlineTagsContainer: cn(inputErrorCss(!!errors.ingredients), "!py-3"),
                                                        }}
                                                    />
                                                    <FieldError>
                                                        <FormMessage />
                                                    </FieldError>
                                                </Field>
                                            )}
                                        />
                                    </FormItem>
                                    <div className='flex itmes-center gap-4'>
                                        {/* Food Price */}
                                        <FormItem>
                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <Field>
                                                        <FieldLabel htmlFor="price">Food Price *</FieldLabel>
                                                        <Input id="price" type="number" placeholder="Food Price" {...field} className={inputErrorCss(!!errors.price)} />
                                                        <FieldError>
                                                            <FormMessage />
                                                        </FieldError>
                                                    </Field>
                                                )}
                                            />
                                        </FormItem>
                                        {/* Food Quantity */}
                                        <FormItem>
                                            <FormField
                                                control={form.control}
                                                name="quantityAvailable"
                                                render={({ field }) => (
                                                    <Field>
                                                        <FieldLabel htmlFor="quantityAvailable">Food Quantity *</FieldLabel>
                                                        <Input id="quantityAvailable" type="number" placeholder="Food Quantity" {...field} className={inputErrorCss(!!errors.quantityAvailable)} />
                                                        <FieldError>
                                                            <FormMessage />
                                                        </FieldError>
                                                    </Field>
                                                )}
                                            />
                                        </FormItem>
                                    </div>
                                    {/* Date Available */}
                                    <FormItem>
                                        <FormField
                                            control={form.control}
                                            name="availableDate"
                                            render={({ field }) => (
                                                <Field>
                                                    <div className="flex gap-4">
                                                        <div className="flex flex-col gap-3">
                                                            <Label htmlFor="date-picker" className="px-1">Date *</Label>
                                                            <Popover open={open} onOpenChange={setOpen}>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        id="date-picker"
                                                                        className={cn(
                                                                            "w-32 justify-between font-normal",
                                                                            inputErrorCss(!!errors.availableDate)
                                                                        )}
                                                                    >
                                                                        {date ? date.toLocaleDateString() : "Select date"}
                                                                        <ChevronDownIcon />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={date}
                                                                        captionLayout="dropdown"
                                                                        onSelect={(date) => {
                                                                            setDate(date)
                                                                            setOpen(false)
                                                                            const value = updateAvailableOn(date, time);
                                                                            field.onChange(value);
                                                                        }}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <Label htmlFor="time-picker" className="px-1">Time *</Label>
                                                            <Input
                                                                className={inputErrorCss(!!errors.availableDate)}
                                                                type="time"
                                                                id="time-picker"
                                                                step="1"
                                                                value={time}
                                                                onChange={(e) => {
                                                                    const t = e.target.value;
                                                                    setTime(t);
                                                                    const value = updateAvailableOn(date, t);
                                                                    field.onChange(value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <FieldError>
                                                        <FormMessage />
                                                    </FieldError>
                                                </Field>
                                            )}
                                        />
                                    </FormItem>
                                </div>
                                <FormItem>
                                    <FormField
                                        control={form.control}
                                        name="foodImages"
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel htmlFor="foodImages">Food Images *</FieldLabel>
                                                {images.length === 0 ? (
                                                    <div className="relative">
                                                        <ImageUploader hasImageError={hasImageError} setImages={setImages} setIsUploading={setIsUploading} />
                                                        {isUploading && (
                                                            <div className="h-full w-full absolute top-0 z-50 flex justify-center bg-black/30 rounded-lg">
                                                                <Spinner fullScreen={false} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <ImageUploader addMore={true} setImages={setImages} setIsUploading={setIsUploading} />
                                                        <Carousel className="!w-80 !h-80 relative">
                                                            <CarouselContent>
                                                                {images.map((img, index) => (
                                                                    <CarouselItem key={index}>
                                                                        <CardContent className="p-0">
                                                                            <div className="group !w-80 !h-80 relative aspect-[16/9] overflow-hidden rounded-lg">
                                                                                <img
                                                                                    src={img.secure_url}
                                                                                    alt="Uploaded food image"
                                                                                    className="w-full h-full object-cover object-center"
                                                                                />
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    onClick={() => deleteFoodListingImageeMutation(img.public_id)}
                                                                                    className="absolute top-2 right-2 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 duration-700"
                                                                                >
                                                                                    <X className="w-4 h-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </CardContent>
                                                                    </CarouselItem>
                                                                ))}
                                                            </CarouselContent>

                                                            {/* Controls outside the map */}
                                                            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70" />
                                                            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70" />
                                                            {(isPending || isUploading) && (
                                                                <div className="h-full w-full absolute top-0 z-50 flex justify-center bg-black/30 rounded-lg">
                                                                    <Spinner fullScreen={false} />
                                                                </div>
                                                            )}
                                                        </Carousel>
                                                    </>
                                                )}
                                                <FieldError>
                                                    <FormMessage />
                                                </FieldError>
                                            </Field>
                                        )}
                                    />
                                </FormItem>
                            </div>
                        </FieldGroup>
                    </FieldSet>

                    <button
                        type="submit"
                        disabled={isUploading}
                        className="px-4 py-2 bg-black text-white rounded"
                    >
                        Submit
                    </button>
                </form>
            </Form>
        </div>
    )
}

export default AddFood
