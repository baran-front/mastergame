import { getCmsContentByName } from "@/lib/fetchs";
import Breadcrumbs from "@/components/modules/breadcrumbs"

async function TermsPage() {
  const cms = await getCmsContentByName({ name: "terms" });

  return (
    <>
      <Breadcrumbs links={[{ name: "قوانین و مقررات", href: "/terms" }]} />

      <div
        className="wrapper mt-3 lg:mt-6 cms"
        dangerouslySetInnerHTML={{ __html: cms.result?.data?.content || "" }}
      />
    </>
  )
}

export default TermsPage