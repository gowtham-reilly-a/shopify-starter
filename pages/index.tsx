import { useState } from "react";
import type { NextPage } from "next";

import { Page, Layout, EmptyState } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <Page
      title="Hello world"
      subtitle="Thanks for everything"
      titleMetadata="This is meta data"
    >
      <TitleBar
        title="Select products"
        primaryAction={{
          content: "Select products",
          onAction() {
            setOpen(true);
          },
        }}
      />
      <ResourcePicker // Resource picker component
        resourceType="Product"
        showVariants={false}
        open={open}
        onSelection={(resources) => {
          console.log(resources);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
      <Layout>
        <Layout.Section>
          <EmptyState
            heading="Make it awesome"
            action={{
              content: "Make",
              onAction() {
                alert("Let's get started!");
              },
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Make it awesome</p>
          </EmptyState>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Home;
