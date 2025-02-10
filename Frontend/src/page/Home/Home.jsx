import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AssetTable from "./AssetTable";
import { useDebounce } from "use-debounce";

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
import ChatBot from "./ChatBot";
import { v4 as uuidv4 } from "uuid"; // Sử dụng thư viện uuid để tạo connectionId
import { ModalOTP } from "../Modal/ModalOTP";
import {
  getEmailFromToken,
  getUser,
  loginWithGG,
  sendEmailTwoAuth,
} from "@/State/Auth/Action";

function Home() {
  // fetch("http://localhost:8888/api/v1/identity/oauth2/success", {
  //   method: "GET",
  //   credentials: "include",
  // })
  //   .then((response) => {
  //     if (!response.ok) throw new Error("Không tìm thấy token");
  //     return response.json();
  //   })
  //   .then((data) => {
  //     if (data.token) {
  //       console.log("in ra data xem dung ko nao", data);
  //       localStorage.setItem("access_token", data.token);
  //       localStorage.setItem("twoAuth", data.twoAuth);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Lỗi khi lấy token: ", error);
  //   });
  // useEffect(() => {
  //   fetch("http://localhost:8888/api/v1/identity/oauth2/success", {
  //     method: "GET",
  //     credentials: "include",
  //   })
  //     .then((response) => {
  //       if (!response.ok) throw new Error("Không tìm thấy token");
  //       return response.json();
  //     })
  //     .then((data) => {
  //       if (data.token) {
  //         console.log("in ra data xem dung ko nao", data, data.twoAuth);
  //         localStorage.setItem("access_token", data.token);
  //         localStorage.setItem(
  //           "twoAuth",
  //           JSON.stringify(data.twoAuth === "true")
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi lấy token: ", error);
  //     });
  // }, []);

  const [currentPage, setCurrentPage] = useState(1);

  const [updatedCoins, setUpdatedCoins] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [previousSearchTerm, setPreviousSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000); // 1 second debounce

  useEffect(() => {
    let eventSource;
    const connectionId = uuidv4();

    const connectSSE = () => {
      const url = new URL("http://localhost:8888/api/v1/coin/sse/coin-price");
      url.searchParams.append("page", currentPage - 1);
      url.searchParams.append("category", category);
      if (category === "searchCoin" && searchTerm) {
        url.searchParams.append("keyword", searchTerm);
      }
      url.searchParams.append("connectionId", connectionId);

      eventSource = new EventSource(url.toString());

      eventSource.addEventListener("coins", (event) => {
        try {
          const coins = JSON.parse(event.data);
          console.log("Updated Coins:", coins);
          setUpdatedCoins(coins);
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      });

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        eventSource.close();
        connectSSE();
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [currentPage, category, searchTerm]);

  useEffect(() => {}, [updatedCoins]);

  const { coin, auth } = useSelector((store) => store);

  const dispatch = useDispatch();

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

  useEffect(() => {
    // Get the category from the URL, default to "all"
    const newCategory = searchParams.get("category") || "all";
    console.log("category ne, page ne", category, currentPage);
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

  const getUpdatedCoins = (category, updatedCoins, coin) => {
    if (!Array.isArray(updatedCoins) || updatedCoins.length === 0) {
      switch (category) {
        case "all":
          return coin.coinList || [];
        case "top50":
          return coin.top50 || [];
        case "topGainers":
          return coin.topGainers || [];
        case "topLosers":
          return coin.topLosers || [];
        case "searchCoin":
          return coin.searchCoin || [];
        default:
          return [];
      }
    }
    return updatedCoins;
  };

  useEffect(() => {
    dispatch(getEmailFromToken());
  }, []);

  const email = auth.email;

  const twoAuth = localStorage.getItem("twoAuth");
  const [showOTP, setShowOTP] = useState(twoAuth === "true");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    console.log("bị sao ý nhỉ", auth);
    if (localStorage.getItem("loginGG") === "true") {
      dispatch(loginWithGG());
      if (auth.gg) {
        fetch("http://localhost:8888/api/v1/identity/oauth2/success", {
          method: "GET",
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) throw new Error("Không tìm thấy token");
            return response.json();
          })
          .then((data) => {
            if (data.token) {
              console.log("in ra data xem dung ko nao", data);
              localStorage.setItem("access_token", data.token);

              dispatch(getUser(localStorage.getItem("access_token")));
              dispatch(getEmailFromToken());
              localStorage.setItem(
                "twoAuth",
                JSON.stringify(data.twoAuth === "true")
              );

              if (data.twoAuth === "true") setShowOTP(true);
              else setShowOTP(false);
            }
          })
          .catch((error) => {
            console.error("Lỗi khi lấy token: ", error);
          });
      }
    }
    //
  }, [auth.gg]);

  useEffect(() => {
    if (showOTP && !isAuthenticated) {
      dispatch(sendEmailTwoAuth());
      console.log("Gửi email xác thực vì chưa xác thực trước đó");
    }
  }, [showOTP]);

  return (
    <>
      {email && showOTP && !isAuthenticated ? (
        <ModalOTP
          isOpen={showOTP}
          // onClose={() => setShowOTP(false)}
          action="TWO_FACTOR_AUTH"
          email={auth.email}
          onSuccess={() => {
            setShowOTP(false);
            localStorage.setItem("isAuthenticated", "true");
          }}
        />
      ) : (
        <div
          className={` flex justify-center ${
            category === "top50" ? "h-[90vh]" : "h-[77vh]"
          }`}
        >
          <div className="lg:flex px-5 w-[40%]">
            <div className="lg:border-r lg:w-[100%] lg:border-l">
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
                coin={getUpdatedCoins(category, updatedCoins, coin)}
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

          <ChatBot />
        </div>
      )}
    </>
  );
}

export default Home;
