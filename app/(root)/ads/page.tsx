import { ROUTES } from "@/constants/routes";
import AdCard from "../../components/AdCard";
import { getAds } from "../../../lib/actions/ads.actions";
import { getLoggedInUser } from "../../../lib/actions/auth.actions";
import LocalSearch from "@/app/components/search/LocalSearch";
import DataRenderer from "@/app/components/DataRenderer";
import Pagination from "@/app/components/Pagination";
import TagFilterGroup from "@/app/components/filters/TagFilterGroup";

import { getTagsForUser } from "@/lib/actions/tags.actions";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function AdsPage({ searchParams }: SearchParams) {
  const { page, pageSize, query, filter, sort } = await searchParams;
  
  const user = await getLoggedInUser();
  const userId = user.id;
  
  const currentPage = Number(page) || 1;
  const currentPageSize = Number(pageSize) || 12;

  // Get active filter tag info if filter is present
  let activeFilterTag = null;
  if (filter) {
    const userTags = await getTagsForUser(userId);
    activeFilterTag = userTags.find(tag => tag.id === filter);
  }

  const { success, data, error } = await getAds(
    {
      page: currentPage,
      pageSize: currentPageSize,
      query: query,
      filter: filter,
      sort: sort,
      // userId: user.id,
    },
    user.id
  );

  const { ads, count } = data || {};
  
  // Calculate total pages
  const totalPages = Math.ceil((count || 0) / currentPageSize);

  // Construct search context message
  // Tell Users how many results get from the 'search term'
  const searchContext = () => {
    const parts = [];
    if (query) parts.push(`"${query}"`);
    if (activeFilterTag) parts.push(`tag "${activeFilterTag.name}"`);
    
    if (parts.length === 0) return "All ads";
    return `Results for ${parts.join(" with ")}`;
  };

  return (
    <div className="flex flex-col gap-4 px-8 py-8 mx-auto max-w-7xl">

      {/* Top Section */}
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.ADS_LIBRARY}
          imgSrc="/icons/search.svg"
          placeholder="Search ads..."
          iconPosition="left"
          otherClasses="flex-1"
        />
      </section>

      <TagFilterGroup userId={userId} />

      {/* Search Context and Result Count */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-800">
          {searchContext()}
        </h2>
        {ads && (
          <p className="text-sm text-gray-500">
            Found {count || 0} matching ads
            {currentPage > 1 && ` • Page ${currentPage}`}
          </p>
        )}
      </div>

      {/* Ads Grid */}
      <DataRenderer
        success={success}
        error={error}
        data={ads}
        empty={{
          title: "No ads found",
          message: query || filter ? 
            `Try adjusting your ${[
              query && "search terms",
              filter && "filters"
            ].filter(Boolean).join(" or ")}` :
            "No ads available yet",
        }}
        render={(ads: Ad[]) => (
          <div className="mt-10 w-full">
            <div className="container mx-auto">
              <div className="grid w-full gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr">
                {ads.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            </div>
          </div>
        )}
      />

      {/* Pagination */}
      <Pagination
        page={currentPage.toString()}
        totalPages={totalPages}
        containerClasses="container mx-auto mb-4"
      />
    </div>
  );
}
