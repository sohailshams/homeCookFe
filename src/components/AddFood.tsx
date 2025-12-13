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
import { ChevronDownIcon } from "lucide-react"
import { Tag, TagInput } from 'emblor';
import { useEffect, useState } from "react";


const AddFood: React.FC = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string | undefined>(undefined);

    const schema = yup.object({
        name: yup.string().required("Name is required.")
            .min(2, "Name must be at least 2 characters."),

        description: yup.string().required("Description is required.")
            .min(20, "Description must be at least 20 characters."),

        ingredients: yup.array(yup.string().required())
            .min(1, "At least one ingredient is required").required(),

        foodPrice: yup.number().transform((value, originalValue) =>
            originalValue === "" ? undefined : value)
            .required("Price is required.")
            .positive(),
        foodQuantity: yup.number().transform((value, originalValue) =>
            originalValue === "" ? undefined : value).required("Quantity is required.")
            .integer().positive(),

        availableOn: yup.string().required("Date/time is required.")
            .test('valid-datetime', 'Please select a valid future date and time.', function (value) {
                debugger;
                if (!value) return false;
                const selectedDate = new Date(value);
                const todaysDate = new Date();
                return isAfter(startOfDay(selectedDate), startOfDay(todaysDate));
            })
    });


    type formFields = yup.InferType<typeof schema>;
    const resolver = yupResolver(schema);
    const form = useForm<formFields>({
        defaultValues: {
            name: '',
            description: '',
            ingredients: Array<string>(),
            foodPrice: undefined,
            foodQuantity: undefined,
            availableOn: undefined,
        },
        resolver,
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    const {
        register,
        watch,
        setValue,
        trigger,
        formState: { errors, isValid },
    } = form;

    const onSubmit = (data: formFields) => {
        console.log("Form submitted:", data);
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

    return (
        <div className="my-6 max-w-[90%] mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FieldSet>
                        <FieldLegend>Add Food</FieldLegend>
                        <FieldDescription>Please add the food you want to sell.</FieldDescription>
                        <FieldGroup>
                            {/* NAME */}
                            <FormItem>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel htmlFor="name">Food Name</FieldLabel>
                                            <Input id="name" placeholder="Food Name" {...field} />
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
                                            <FieldLabel htmlFor="description">Food Description</FieldLabel>
                                            <Input id="description" placeholder="Description" {...field} />
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
                                            <FieldLabel htmlFor="ingredients">Ingredients</FieldLabel>
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
                                            />
                                            <FieldError>
                                                <FormMessage />
                                            </FieldError>
                                        </Field>
                                    )}
                                />
                            </FormItem>
                            {/* Food Price */}
                            <FormItem>
                                <FormField
                                    control={form.control}
                                    name="foodPrice"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel htmlFor="foodPrice">Food Price</FieldLabel>
                                            <Input id="foodPrice" type="number" placeholder="Food Price" {...field} />
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
                                    name="foodQuantity"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel htmlFor="foodQuantity">Food Quantity</FieldLabel>
                                            <Input id="foodQuantity" type="number" placeholder="Food Quantity" {...field} />
                                            <FieldError>
                                                <FormMessage />
                                            </FieldError>
                                        </Field>
                                    )}
                                />
                            </FormItem>
                            {/* Date Available */}
                            <FormItem>
                                <FormField
                                    control={form.control}
                                    name="availableOn"
                                    render={({ field }) => (
                                        <Field>
                                            <div className="flex gap-4">
                                                <div className="flex flex-col gap-3">
                                                    <Label htmlFor="date-picker" className="px-1">
                                                        Date
                                                    </Label>
                                                    <Popover open={open} onOpenChange={setOpen}>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                id="date-picker"
                                                                className="w-32 justify-between font-normal"
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
                                                    <Label htmlFor="time-picker" className="px-1">
                                                        Time
                                                    </Label>
                                                    <Input
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
                        </FieldGroup>
                    </FieldSet>
                    <button
                        type="submit"
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
