import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validation"
import { Link, useNavigate } from "react-router-dom"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { Loader } from "@/components/shared"

const SignupForm = () => {
    const { toast } = useToast()
    // const isLoading = false;
    const navigate = useNavigate();
    const { checkAuthUser } = useUserContext();
    const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();

    const { mutateAsync: signInAccount } = useSignInAccount();


    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignupValidation>) {
        const newUser = await createUserAccount(values);

        if (!newUser) {
            return toast({
                title: "Sign up failed. Please try again",
            });
        }
        const session = await signInAccount({
            email: values.email,
            password: values.password,
        });
        if (!session) {
            return toast({
                title: "Sign in failed. Please try again",
            });
        }

        const isLoggedIn = await checkAuthUser();

        if (isLoggedIn) {
            form.reset();
            navigate('/');
        } else {
            return toast({
                title: "Sign up failed. Please try again",
            });
        }
    }
    return (

        <Form {...form}>
            <div className="flex-col sm:w-420 flex-center">
                <img src="/assets/images/logo.svg" alt="logo" />

                <h2 className="pt-5 h3-bold md:h2-bold sm:pt-12">
                    Create a new account
                </h2>
                <p className="mt-2 text-light-3 small-medium md:base-regular">
                    To use Socialio, Please enter your details
                </p>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col w-full gap-5 mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">Name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">Username</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">Email</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit"
                        className="shad-button_primary"
                    >
                        {
                            isCreatingAccount ? (
                                <div className="gap-2 flex-center">
                                    <Loader />Loading...
                                </div>
                            ) : "Sign up"
                        }
                    </Button>

                    <p className="mt-2 text-center text-small-regular text-light-1">
                        Already have an account?
                        <Link
                            to={"/sign-in"}
                            className="ml-1 text-primary-500 text-small-semibold "
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignupForm