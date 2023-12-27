import { Button, Input, Spin } from "antd";
import Divider from "../components/Divider";
import { useCallback, useEffect, useRef, useState } from "react";
import { Recipe } from "@social-recipes/core";
import getFeedRecipesApi from "../api/getFeedRecipes";
import RecipeCard from "../components/Recipe/Card";
import { HeartOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { uniq } from "lodash";

let timeout: NodeJS.Timeout;

const debounceFN = (fn: () => void, delay: number) => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    fn();
  }, delay);
};

// create a function that will check if the element is in viewport
const isInViewport = (el: HTMLDivElement) => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQ = searchParams.get("q");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [pageState, setPageState] = useState({
    data: [] as Recipe[],
    fetching: false,
    hasMore: true,
    page: 1,
  });
  const { data: recipes } = pageState;

  const handleLoadmore = useCallback(
    (p: number) => {
      setPageState((s) => ({ ...s, fetching: true, page: p }));
      debounceFN(() => {
        getFeedRecipesApi(searchQ || undefined, { page: p, limit: 12 }).then(
          (r) => {
            setPageState((s) => ({
              ...s,
              data: uniq([...s.data, ...r]),
              hasMore: r.length === 12,
              fetching: false,
            }));
          }
        );
      }, 500);
    },
    [searchQ]
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);

      debounceFN(() => {
        setSearchParams({ q: e.target.value });
      }, 500);
    },
    [setSearchParams]
  );

  useEffect(() => {
    setPageState((s) => ({
      ...s,
      data: [],
      page: 1,
      hasMore: true,
      fetching: true,
    }));

    getFeedRecipesApi(searchQ || undefined, { page: 1, limit: 12 }).then((r) =>
      setPageState((s) => ({ ...s, data: r, page: 1, fetching: false }))
    );
  }, [searchQ]);

  useEffect(() => {
    if (!bottomRef.current || pageState.fetching || !pageState.hasMore) return;

    const handleScroll = () => {
      const res = isInViewport(bottomRef.current!);
      if (res) {
        handleLoadmore(pageState.page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [
    bottomRef,
    pageState.fetching,
    pageState.page,
    handleLoadmore,
    pageState.hasMore,
  ]);

  return (
    <div>
      <Input.Search
        value={search}
        enterButton="Search"
        onChange={handleSearch}
        loading={pageState.fetching}
      />
      <Divider />
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 usm:grid-cols-2 gap-5">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            actions={
              <Button type="text" className="text-red-400">
                <HeartOutlined />
              </Button>
            }
          />
        ))}
      </div>
      <div ref={bottomRef}>{pageState.fetching && <Spin />}</div>
    </div>
  );
};

export default HomePage;
