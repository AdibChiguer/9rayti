import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.token,
            })
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),
    activition: builder.mutation({
      query: ({activation_token, activation_code}) => ({
        url: "activate-user",
        method: "POST",
        body: {activation_token, activation_code},
      }),
    }),
    login: builder.mutation({
      query: ({email , password}) => ({
        url: "login",
        method: "POST",
        body: {email , password},
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),
    socialAuth: builder.mutation({
      query: ({email , name , avatar}) => ({
        url: "social-auth",
        method: "POST",
        body: {email , name , avatar},
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),
    logOut: builder.query({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(
            userLoggedOut()
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),
  }),
});


export const { useRegisterMutation, useActivitionMutation , useLoginMutation , useSocialAuthMutation , useLogOutQuery} = authApi;