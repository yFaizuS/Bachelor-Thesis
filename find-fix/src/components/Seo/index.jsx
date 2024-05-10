import Head from "next/head";
import { useRouter } from "next/router";

const SEO = ({ title, description }) => {
  const router = useRouter();
  const pageTitle = title ? `${title} | FIND FIX` : "FIND FIX";
  const pageDescription =
    description || "Deskripsi default untuk halaman FIND FIX";

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
    </Head>
  );
};

export default SEO;
