/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";

export default function Predict() {
  const [formData, setFormData] = useState({
    Gender: "",
    Age: 18,
    City: "",
    Working_Professional_or_Student: "",
    Profession: "",
    Work_Pressure: 1,
    Sleep_Duration: "",
    Dietary_Habits: "",
    Degree: "",
    Have_Suicidal_Thoughts: "",
    Family_History: "",
    Job_Satisfaction: 1,
    Work_Hours: 0,
    Financial_Stress: 1,
  });

  const [options, setOptions] = useState({
    Gender: [],
    City: [],
    Working_Professional_or_Student: [],
    Profession: [],
    Sleep_Duration: [],
    Dietary_Habits: [],
    Degree: [],
    Have_Suicidal_Thoughts: [],
    Family_History: [],
  });

  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/options");
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://mental-health-server-ji00.onrender.com/predict",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPrediction(response.data.result);

      toast.success("Successfully predict result");
    } catch (error) {
      console.error("Error predicting:", error);
      toast.error(
        "There is an error when predict result. Please check all the inputs again."
      );
    }
  };

  const FormSchema = z.object({
    Gender: z.string().min(1),
    Age: z.number().min(18),
    City: z.string(),
    Working_Professional_or_Student: z.string(),
    Profession: z.string().optional(),
    Work_Pressure: z.number().min(1).max(5),
    Sleep_Duration: z.string(),
    Dietary_Habits: z.string(),
    Degree: z.string(),
    Have_Suicidal_Thoughts: z.string(),
    Family_History: z.string(),
    Job_Satisfaction: z.number().min(1).max(5),
    Work_Hours: z
      .number()
      .min(0, {
        message: "Work/Study hours must be between 0 and 12",
      })
      .max(12, {
        message: "Work/Study hours must be between 0 and 12",
      }),
    Financial_Stress: z.number().min(1).max(5),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Gender: "",
      City: "",
      Working_Professional_or_Student: "",
      Profession: "",
      Sleep_Duration: "",
      Age: 18,
      Work_Pressure: 1,
      Dietary_Habits: "",
      Degree: "",
      Have_Suicidal_Thoughts: "",
      Family_History: "",
      Job_Satisfaction: 1,
      Work_Hours: 0,
      Financial_Stress: 1,
    },
  });

  return (
    <>
      <Toaster richColors />

      {/* main app */}
      <div className="lg:pl-16 lg:pr-16 sm:pl-8 sm:pr-8 pt-4 max-w-full max-h-full grid grid-cols-2">
        <div>
          <h1 className="mb-2 text-4xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-900 from-fuchsia-400">
              Depression Prediction
            </span>
          </h1>

          <div className="mt-8 space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="default"
                  type="button"
                  className="font-semibold bg-purple-600 hover:text-purple-600 hover:bg-white border hover:border-purple-600 hover:border-2"
                  size="lg"
                >
                  Predict
                </Button>
              </SheetTrigger>

              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-2xl">Your answers</SheetTitle>
                  <SheetDescription>
                    You can see your answers here. Click Save to predict.
                  </SheetDescription>
                </SheetHeader>

                <div className="grid grid-cols-2 gap-4 mt-8 mb-4 border p-2">
                  {Object.entries(formData).map(([key, value]) => (
                    <>
                      <Label
                        className="text-left leading-4 font-semibold"
                        key={key}
                      >
                        {key.split(/_|(?=[A-Z])/).join(" ")}:{" "}
                      </Label>

                      <Label
                        className="text-right leading-4
        "
                        key={key}
                      >
                        {value}
                      </Label>
                    </>
                  ))}
                </div>

                <SheetFooter>
                  <SheetClose asChild>
                    <Button
                      variant="default"
                      onClick={handleSubmit}
                      type="button"
                      className="mt-8 font-semibold bg-purple-600 hover:text-purple-600 hover:bg-white border hover:border-purple-600 hover:border-2"
                      size="lg"
                    >
                      Save
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-purple-900 font-semibold hover:text-purple-600 hover:bg-white border hover:border-purple-600 hover:border-2"
                  onClick={() => {
                    if (!prediction || prediction.trim() === "") {
                      toast.error("Please enter your input first");
                    }
                  }}
                >
                  Show Result
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Prediction Result</DialogTitle>
                  <DialogDescription>
                    You can see your prediction result here
                  </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center items-center mt-5 mb-5">
                  <div className="text-center">
                    {prediction ? (
                      <div
                        className={`w-48 h-48 flex justify-center items-center rounded-full 
  ${
    prediction === "DEPRESSION"
      ? "bg-red-500 border-4 border-red-500"
      : "bg-green-500 border-4 border-green-500"
  }`}
                      >
                        <div className="text-2xl font-bold text-white">
                          {prediction}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-lg text-gray-400">
                          Please enter your input first
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="flex flex-row gap-10">
              <div className="w-full sm:w-1/2">
                {/* Gender */}
                <FormField
                  control={form.control}
                  name="Gender"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">Gender</FormLabel>

                      <Select
                        onValueChange={(value) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            Gender: value,
                          }))
                        }
                        defaultValue={formData.Gender}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {options.Gender.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="City"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">City</FormLabel>

                      <Select
                        onValueChange={(value) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            City: value,
                          }))
                        }
                        defaultValue={formData.City}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {options.City.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Working_Professional_or_Student */}
                <FormField
                  control={form.control}
                  name="Working_Professional_or_Student"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">
                        Working Professional or Student ?
                      </FormLabel>

                      <Select
                        onValueChange={(value) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            Working_Professional_or_Student: value,
                          }))
                        }
                        defaultValue={formData.Working_Professional_or_Student}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {options.Working_Professional_or_Student.map(
                            (working) => (
                              <SelectItem key={working} value={working}>
                                {working}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Profession */}
                <FormField
                  control={form.control}
                  name="Profession"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">
                        Profession
                      </FormLabel>

                      <Select
                        onValueChange={(value) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            Profession: value,
                          }))
                        }
                        defaultValue={formData.Profession}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {options.Profession.map((profession) => (
                            <SelectItem key={profession} value={profession}>
                              {profession}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Sleep_Duration */}
                <FormField
                  control={form.control}
                  name="Sleep_Duration"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">
                        Sleep Duration
                      </FormLabel>

                      <Select
                        onValueChange={(value) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            Sleep_Duration: value,
                          }))
                        }
                        defaultValue={formData.Sleep_Duration}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {options.Sleep_Duration.map((sleep) => (
                            <SelectItem key={sleep} value={sleep}>
                              {sleep}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Age */}
                <FormField
                  control={form.control}
                  name="Age"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">Age</FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={60}
                          defaultValue={formData.Age}
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(value);
                            setFormData({ ...formData, Age: value });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Work_Pressure */}
                <FormField
                  control={form.control}
                  name="Work_Pressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Work Pressure
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          defaultValue={formData.Work_Pressure}
                          min={1}
                          max={5}
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(value);
                            setFormData({
                              ...formData,
                              Work_Pressure: value,
                            });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full sm:w-1/2">
                {/* Dietary_Habits */}
                <FormField
                  control={form.control}
                  name="Dietary_Habits"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">
                        Dietary Habits
                      </FormLabel>

                      <Select
                        onValueChange={(value) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            Dietary_Habits: value,
                          }))
                        }
                        defaultValue={formData.Dietary_Habits}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {options.Dietary_Habits.map((habits) => (
                            <SelectItem key={habits} value={habits}>
                              {habits}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Degree */}
                <FormField
                  control={form.control}
                  name="Degree"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">Degree</FormLabel>

                      <Select
                        onValueChange={(value) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            Degree: value,
                          }))
                        }
                        defaultValue={formData.Degree}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a degree" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {options.Degree.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Have_Suicidal_Thoughts */}
                <FormField
                  control={form.control}
                  name="Have_Suicidal_Thoughts"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">
                        Have suicidal thoughts ?
                      </FormLabel>

                      <Select
                        onValueChange={(value) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            Have_Suicidal_Thoughts: value,
                          }))
                        }
                        defaultValue={formData.Have_Suicidal_Thoughts}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Do you have suicial thoughts" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {options.Have_Suicidal_Thoughts.map((suicidal) => (
                            <SelectItem key={suicidal} value={suicidal}>
                              {suicidal}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Family_History */}
                <FormField
                  control={form.control}
                  name="Family_History"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">
                        Family History of Mental Illness
                      </FormLabel>

                      <Select
                        onValueChange={(value) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            Family_History: value,
                          }))
                        }
                        defaultValue={formData.Family_History}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {options.Family_History.map((family) => (
                            <SelectItem key={family} value={family}>
                              {family}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Job_Satisfaction */}
                <FormField
                  control={form.control}
                  name="Job_Satisfaction"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">
                        Job Satisfaction
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          defaultValue={formData.Job_Satisfaction}
                          min={1}
                          max={5}
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(value);
                            setFormData({
                              ...formData,
                              Job_Satisfaction: value,
                            });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Work_Hours */}
                <FormField
                  control={form.control}
                  name="Work_Hours"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="font-semibold">
                        Work/Study Hours
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          defaultValue={formData.Work_Hours}
                          min={0}
                          max={12}
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(value);
                            setFormData({ ...formData, Work_Hours: value });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Financial_Stress */}
                <FormField
                  control={form.control}
                  name="Financial_Stress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Financial Stress
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          defaultValue={formData.Financial_Stress}
                          min={1}
                          max={5}
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(value);
                            setFormData({
                              ...formData,
                              Financial_Stress: value,
                            });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
