import "@shopify/polaris/build/esm/styles.css";
import App, { AppProps, AppContext } from "next/app";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { AppProvider } from "@shopify/polaris";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import translations from "@shopify/polaris/locales/en.json";
import { ClientApplication } from "@shopify/app-bridge";

function userLoggedInFetch(app: ClientApplication<any>) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri: RequestInfo, options: RequestInit) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
    }

    return response;
  };
}

const MyProvider = ({ Component, ...restProps }: any) => {
  const app = useAppBridge();

  const link = new HttpLink({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });

  return (
    <ApolloProvider client={client}>
      <Component {...restProps} />
    </ApolloProvider>
  );
};

interface ComposedProps extends AppProps {
  host: string;
}

const MyApp = ({ Component, pageProps, host }: ComposedProps) => {
  return (
    <AppProvider i18n={translations}>
      <Provider
        config={{
          apiKey: process.env.NEXT_PUBLIC_API_KEY || "",
          host: host,
          forceRedirect: true,
        }}
      >
        <MyProvider Component={Component} {...pageProps} />
      </Provider>
    </AppProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    host: appContext.ctx.query.host,
  };
};

export default MyApp;
