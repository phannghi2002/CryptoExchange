import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AssetTable from "./AssetTable";
import { useDebounce } from "use-debounce";

import { MessageCircle } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  getCoinList,
  getTop50CoinList,
  getTopGainers,
  getTopLosers,
  searchCoin,
} from "@/State/Coin/Action";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "react-router-dom";

import PaginatedComponent from "./PaginatedComponent";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  // const [category, setCategory] = useState("all");

  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );

  const [inputValue, setInputValue] = useState("");
  const [isBotRealease, setIsBotRealease] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [previousSearchTerm, setPreviousSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000); // 1 second debounce

  const [currentPage, setCurrentPage] = useState(1);

  const { coin } = useSelector((store) => store);

  const dispatch = useDispatch();

  const handleBotRealease = () => setIsBotRealease(!isBotRealease);

  const handleCategory = (value) => {
    if (category === "searchCoin" && value !== "searchCoin") {
      // If switching from searchCoin to another category (e.g., all, top50, etc.)
      setPreviousSearchTerm(searchTerm); // Save the current search term before clearing
      setSearchTerm(""); // Clear search term when leaving searchCoin
    } else if (value === "searchCoin" && category !== "searchCoin") {
      // If switching to searchCoin from another category (e.g., all, top50, etc.)
      setSearchTerm(previousSearchTerm); // Restore the previous search term
    }

    // Set the new category in both state and URL
    setCategory(value); // Set the new category in state
    setSearchParams({ category: value }); // Update the category in URL query params
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      console.log(inputValue);
    }
    setInputValue("");
  };

  useEffect(() => {
    if (category === "all") {
      // Call getCoinList with pagination for "all" category
      dispatch(getCoinList(currentPage));
    } else if (category === "top50") {
      dispatch(getTop50CoinList());
    } else if (category === "topGainers") {
      dispatch(getTopGainers());
    } else if (category === "topLosers") {
      dispatch(getTopLosers());
    }
  }, [category, currentPage]);

  // useEffect(() => {
  //   // Get the category from the URL, default to "all"
  //   const newCategory = searchParams.get("category") || "all";
  //   setCategory(newCategory);

  //   // Get the page number from the URL, default to 1
  //   const pageParam = parseInt(searchParams.get("p")) || 1;
  //   setCurrentPage(pageParam);
  // }, [searchParams]);

  useEffect(() => {
    // Get the category from the URL, default to "all"
    const newCategory = searchParams.get("category") || "all";
    setCategory(newCategory);
  }, [searchParams.get("category")]);

  useEffect(() => {
    // Get the page number from the URL, default to 1
    const pageParam = parseInt(searchParams.get("p")) || 1;
    setCurrentPage(pageParam);
  }, [searchParams.get("p")]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ p: page }); // Update the URL query parameter
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(searchCoin(debouncedSearchTerm));
    }
  }, [debouncedSearchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div
      className={` flex justify-center ${
        category === "top50" ? "h-[90vh]" : "h-[77vh]"
      }`}
    >
      <div className="lg:flex px-5 w-[77%]">
        <div className="lg:border-r lg:w-[100%]">
          <div className="p-3 flex items-center gap-4">
            <Button
              onClick={() => handleCategory("all")}
              variant={category == "all" ? "default" : "outline"}
              className="rounded-full"
            >
              All
            </Button>

            <Button
              onClick={() => handleCategory("top50")}
              variant={category == "top50" ? "default" : "outline"}
              className="rounded-full"
            >
              Top 50
            </Button>

            <Button
              onClick={() => handleCategory("topGainers")}
              variant={category == "topGainers" ? "default" : "outline"}
              className="rounded-full"
            >
              Top Gainers
            </Button>

            <Button
              onClick={() => handleCategory("topLosers")}
              variant={category == "topLosers" ? "default" : "outline"}
              className="rounded-full"
            >
              Top Losers
            </Button>

            <div className="relative flex items-center w-[20%] font-semibold">
              <MagnifyingGlassIcon className="absolute left-3 text-gray-400" />
              <Input
                variant="outline"
                className="pl-10" // Add padding to make room for the icon
                onClick={() => handleCategory("searchCoin")}
                placeholder="Search"
                value={searchTerm}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <AssetTable
            coin={
              category === "all"
                ? coin.coinList
                : category === "top50"
                ? coin.top50
                : category === "topGainers"
                ? coin.topGainers
                : category === "topLosers"
                ? coin.topLosers
                : category === "searchCoin"
                ? coin.searchCoinList
                : []
            }
            category={category}
          />
          {category === "all" && (
            <div>
              <PaginatedComponent
                currentPage={currentPage}
                onPageChange={handlePageChange} // Pass handler to child component
              />
            </div>
          )}
        </div>
      </div>

      <section className="absolute bottom-20 right-5 z-40 flex flex-col justify-end items-end gap-2">
        {isBotRealease && (
          <div className="rounded-md w-[20rem] md:w-[25rem] lg:w-[25rem] h-[70vh] bg-slate-900">
            <div className="flex justify-between items-center border-b px-6 h-[12%]">
              <p>Chat Bot</p>
              <Button onClick={handleBotRealease} variant="ghost" size="icon">
                <Cross1Icon />
              </Button>
            </div>

            <div className="flex flex-col overflow-y-auto gap-5 px-5 h-[76%] py-2 scroll-container">
              <div className="self-start pb-5 w-auto">
                <div className="justify-end self-end px-5 py-2 rounded-md bg-slate-800 w-auto">
                  <p>hello</p>
                  <p>klsjfgsjglksjfgklsajgklajglajajgfkljgak</p>
                  <p>nhu biu</p>
                </div>
              </div>

              {[1, 1, 1, 1].map((item, i) => (
                <div
                  key={i}
                  className={`${i % 2 == 0 ? "self-start" : "self-end"}`}
                >
                  {i % 2 == 0 ? (
                    <div className="justify-end self-end px-5 py-2 rounded-md bg-slate-800 w-auto">
                      <p>promtwho are upi</p>
                    </div>
                  ) : (
                    <div className="justify-end self-end px-5 py-2 rounded-md bg-slate-800 w-auto">
                      <p>and hi, Raam Arora</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="h-[12%] border-t">
              <Input
                className="h-full w-full order-none outline-none"
                placeholder="Write promt"
                onChange={handleChange}
                value={inputValue}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        )}

        <div className="relative w-[10rem] cursor-pointer group">
          <Button
            className="w-full h-[3rem] gap-2 items-center"
            onClick={handleBotRealease}
          >
            <MessageCircle
              size={30}
              className="fill-[#1e293b] -rotate-90 stroke-none group-hover:fill-[#1a1a1a]"
            />
            <span className="text-2xl">Chat Bot</span>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;
