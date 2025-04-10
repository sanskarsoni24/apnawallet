
import React from "react";
import { Helmet } from "react-helmet";

interface PageHeadProps {
  title: string;
  description: string;
}

const PageHead: React.FC<PageHeadProps> = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default PageHead;
