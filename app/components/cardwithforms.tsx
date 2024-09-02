"use client"

import * as React from "react"

import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import styles from "./cardwithfroms.module.css"

import { nonceSubmission } from "@/lib/nonceSubmission"

const formSchema = z.object({
  publickey: z.string().min(2).max(100),
  privatekey: z.string().min(2).max(100),
  date: z.date({
    required_error: "A date is required."
  }),
  timeHours: z.coerce.number(),
  timeMinutes: z.coerce.number(),
  solana: z.coerce.number(),
  recieverPublickey: z.string()
})


export function CardWithForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publickey: "",
      privatekey: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // pass all the data to a server component which will have a set inteval and then execute the transactions
    console.log(values);

    console.log(values.date.getDate());
    console.log(values.date.getMonth());
    console.log(values.timeHours);

    const submission = await nonceSubmission(values);

    console.log("submission is returned");
  }

  return (
    <Card className="text-gray-200 mt-20 bg-inherit">
      <CardHeader>
        <CardTitle> Nonce Workflow </CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent>
            <FormField
              control={form.control}
              name="publickey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public Key</FormLabel>
                  <FormControl>
                    <Input className="text-zinc-950" placeholder="Public Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privatekey"
              render={({ field }) => (
                <FormItem className="mt-1">
                  <FormLabel>Private Key</FormLabel>
                  <FormControl>
                    <Input className="text-zinc-950" placeholder="Private Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="mt-1 flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        // disabled={(date) =>
                        //   date < new Date() && date != new Date()
                        // }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormDescription className="mt-1">
              Enter time in 24 hours format.
            </FormDescription>
            <div className="flex flex-row align-start justify-start flex-wrap">
              <FormField
                control={form.control}
                name="timeHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input className="text-zinc-950 w-20 mr-2" placeholder="00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input className="text-zinc-950 w-20 ml-2 mr-2" placeholder="00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="solana"
                render={({ field }) => (
                  <FormItem className={`${styles.inputSolCard}`}>
                    <FormLabel>Sols</FormLabel>
                    <FormControl>
                      <Input className={`${styles.inputSol} text-zinc-950 w-24`} placeholder="0.00.." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>



            <FormField
              control={form.control}
              name="recieverPublickey"
              render={({ field }) => (
                <FormItem className="mt-1">
                  <FormLabel>Private Key</FormLabel>
                  <FormControl>
                    <Input className="text-zinc-950 " placeholder="Reciever's public Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialog>

              <AlertDialogTrigger asChild>
                <Button className="mt-5" type="submit"> Schedule </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Your transaction is scheduled please check after the scheduled time your account balance</AlertDialogTitle>

                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </CardContent>

          {/* <CardFooter className="flex flex-row justify-between align-between text-gray-950"> */}
          {/* </CardFooter> */}
        </form>
      </Form>
    </Card >
  )
}
