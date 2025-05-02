import { ROUTES } from "@/app/constants/routes";
import AdCard from "../../components/AdCard";
import { getAds } from "../../lib/actions/ads.actions";
import { getLoggedInUser } from "../../lib/actions/auth.actions"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearch from "@/app/components/search/LocalSearch";
import { AdsPageFilters } from "@/app/constants/filters";
import CommonFilter from "@/app/components/filters/CommonFilter";
import DataRenderer from "@/app/components/DataRenderer";
import Pagination from "@/app/components/Pagination";
import HomeFilter from "@/app/components/filters/HomeFilter";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}


export default async function AdsPage({ searchParams }: SearchParams) {
  const user = await getLoggedInUser()
  const { page, pageSize, query, filter, sort } = await searchParams

  const { success, data, error } = await getAds({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 12,
    query: query || "",
    filter: filter || "",
    sort: sort || "",
    userId: user.id
  }, user.id);

  console.log(data)

  const { ads, isNext } = data || {};

  return (
    <>
      <div className="flex flex-col gap-4 px-8 py-8 mx-auto max-w-7xl">

        <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearch
            route={ROUTES.ADS_LIBRARY}
            imgSrc="/icons/search.svg"
            placeholder="Search ads..."
            iconPosition="left"
            otherClasses="flex-1"
          />

          <CommonFilter
            filters={AdsPageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-md:flex"
          />
        </section>

        <HomeFilter />

        {/* Ads List Section */}
        <DataRenderer
          success={success}
          error={error}
          data={ads}
          empty={{
            title: "No ads found",
            message: "No ads found",
            button: {
              text: "Button Text",
              href: "#",
            },
          }}
          render={(ads) => (
            <div className="mt-10 flex w-full gap-6 justify-between">
              <div className="container mx-auto">
                {/* Grid Container */}
                <div className="mt-10 grid w-full gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {ads.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                  {/* End of Grid Container */}
                </div>
              </div>
            </div>
          )}
        />

        {/* Pagination Section */}
        <Pagination page={page} isNext={isNext || false} containerClasses="container mx-auto mb-4" />
      
      </div>
    </>
  )
}